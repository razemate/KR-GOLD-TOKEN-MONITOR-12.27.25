import { NextResponse } from 'next/server';
import { appendFile } from 'fs/promises';
import path from 'path';
import { fetchTopGoldTokens, fetchAllCharts } from '@/lib/coingecko';
import { computeMetrics } from '@/lib/compute';
import { normalizeTokenData } from '@/lib/normalize';
import { generateSnapshotIntelligence, getFallbackGoldSpotPrice, getFallbackIntelligence } from '@/lib/gemini';
import { generateOpenRouterIntelligence } from '@/lib/openrouter';
import { getRefreshCadence } from '@/lib/schedule';
import { SnapshotResponse, TokenSnapshot, MarketIntelItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function appendSpotLog(entry: Record<string, unknown>) {
  try {
    const logPath = path.join(process.cwd(), 'spot-price-debug.log');
    const line = `${JSON.stringify(entry)}\n`;
    await appendFile(logPath, line, { encoding: 'utf8' });
  } catch (error) {
    console.error("Failed to write spot price log:", error);
  }
}

export async function GET() {
  const { isWeekend, refreshInterval, cacheHeader } = getRefreshCadence();
  const errors: Record<string, string> = {};

  try {
    // 1. Fetch Markets
    const rawTokens = await fetchTopGoldTokens();
    const tokens = rawTokens.map(normalizeTokenData);
    const charts = await fetchAllCharts(tokens);

    // 2. Pre-compute prompt metrics (non-peg fields may be UNKNOWN until spot price is available)
    const promptMetricsMap = Object.fromEntries(
      tokens.map(token => [token.id, computeMetrics(token, charts[token.id] || [], null)])
    );

    // 3. Get Spot Price + Intelligence (Gemini 2.5 Flash + Google Search Grounding)
    let spotPrice: number | null = null;
    let spotSource = 'Gemini 2.5 Flash w/ Google Search Grounding';
    let intelligenceList: MarketIntelItem[] = [];
    let geminiSucceeded = false;
    let geminiErrorMessage: string | null = null;

    try {
      // Step A: Gemini 2.5 Flash
      const geminiResult = await generateSnapshotIntelligence(tokens, promptMetricsMap);
      spotPrice = geminiResult.spotGoldUsd;
      intelligenceList = geminiResult.items;
      geminiSucceeded = true;
    } catch (geminiError) {
      geminiErrorMessage = geminiError instanceof Error ? geminiError.message : String(geminiError);
      console.warn("Gemini failed, trying OpenRouter fallback...", geminiError);
    }

    if (spotPrice === null) {
      const spotIssues: string[] = [];
      if (geminiSucceeded) {
        spotIssues.push("Gemini returned invalid spot price");
      } else if (geminiErrorMessage) {
        spotIssues.push(`Gemini failed: ${geminiErrorMessage}`);
      }

      try {
        spotPrice = await getFallbackGoldSpotPrice();
        if (spotPrice !== null) {
          spotSource = 'Fallback: goldprice.org';
        } else {
          spotSource = 'Unavailable';
          spotIssues.push("Fallback spot price unavailable");
        }
      } catch (e) {
        console.error("Fallback gold spot price failed:", e);
        spotSource = 'Unavailable';
        spotIssues.push("Fallback spot price fetch failed");
      }

      await appendSpotLog({
        timestamp: new Date().toISOString(),
        spotSource,
        spotPrice,
        geminiSucceeded,
        issues: spotIssues
      });

      if (spotPrice === null && spotIssues.length > 0) {
        errors.spotPrice = spotIssues.join(" | ");
      }
    }

    // 4. Compute Metrics - Blueprint Step 3
    // Use snapshot.meta.goldSpotUsd as the sole gold reference.
    const metricsMap = Object.fromEntries(
      tokens.map(token => [token.id, computeMetrics(token, charts[token.id] || [], spotPrice)])
    );

    // 5. Generate Intelligence (Gemini -> OpenRouter -> Fallback)
    if (!geminiSucceeded) {
      try {
        // Step B: OpenRouter Fallback - Blueprint Step 4
        // Uses computed metrics (which might have null peg deviation if spot price is null)
        intelligenceList = await generateOpenRouterIntelligence(tokens, metricsMap);
      } catch (orError) {
        console.error("OpenRouter also failed, using deterministic fallback.", orError);
        errors.intelligence = "AI services unavailable, using rule-based analysis.";
      }
    }

    const intelligenceMap = Object.fromEntries(intelligenceList.map(i => [i.tokenId, i]));

    // 5. Assemble Snapshots
    const tokenSnapshots: TokenSnapshot[] = tokens.map(token => {
      const chart = charts[token.id] || [];
      const metrics = metricsMap[token.id];
      const intelligence = intelligenceMap[token.id] || getFallbackIntelligence(token, metrics);

      return {
        token,
        chart,
        metrics,
        intelligence,
      };
    });

    const response: SnapshotResponse = {
      meta: {
        generatedAt: Date.now(),
        isWeekend,
        refreshInterval,
        goldSpotUsd: spotPrice,
        goldSpotSource: spotSource
      },
      tokens: tokenSnapshots,
      errors,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error: any) {
    console.error("Snapshot generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate snapshot", details: error.message },
      { status: 500 }
    );
  }
}
