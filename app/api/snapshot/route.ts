import { NextResponse } from 'next/server';
import { fetchTopGoldTokens } from '@/lib/coingecko';
import { computeMetrics } from '@/lib/compute';
import { normalizeTokenData } from '@/lib/normalize';
import { generateSnapshotIntelligence, getFallbackGoldSpotPrice, getFallbackIntelligence } from '@/lib/gemini';
import { generateOpenRouterIntelligence } from '@/lib/openrouter';
import { getRefreshCadence } from '@/lib/schedule';
import { SnapshotResponse, TokenSnapshot, MarketIntelItem } from '@/lib/types';

// Attempt to increase timeout on Pro plan, ignored on Hobby but good practice
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const { isWeekend, refreshInterval, cacheHeader } = getRefreshCadence();
  const errors: Record<string, string> = {};

  try {
    // 1. Fetch Markets
    const rawTokens = await fetchTopGoldTokens();
    const tokens = rawTokens.map(normalizeTokenData);
    
    // Convert sparkline data to chart points
    // CoinGecko sparkline is hourly over 7 days (~168 points). Last point is "now".
    const charts: Record<string, import('@/lib/types').TokenChartPoint[]> = {};
    const now = Date.now();
    const ONE_HOUR = 3600 * 1000;
    
    tokens.forEach(token => {
      if (token.sparkline_in_7d && Array.isArray(token.sparkline_in_7d.price)) {
        const prices = token.sparkline_in_7d.price;
        const endIndex = prices.length - 1;
        charts[token.id] = prices.map((price, i) => ({
          timestamp: now - (endIndex - i) * ONE_HOUR,
          price
        }));
      } else {
        charts[token.id] = [];
      }
    });

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
        const fallback = await getFallbackGoldSpotPrice();
        spotPrice = fallback.price;
        if (spotPrice !== null) {
          spotSource = fallback.source;
        } else {
          spotSource = 'Unavailable';
          spotIssues.push("All fallbacks (Yahoo, GoldPrice API, Scrape) failed");
        }
      } catch (e) {
        console.error("Fallback sequence failed:", e);
        spotSource = 'Unavailable';
        spotIssues.push("Fallback sequence error");
      }

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
      // Check elapsed time. If we are close to Vercel's 10s timeout, skip OpenRouter
      const elapsed = Date.now() - startTime;
      const timeLeft = 9500 - elapsed; // 9.5s safety margin

      if (timeLeft > 2000) { // Only try OpenRouter if we have at least 2s left
        try {
          // Step B: OpenRouter Fallback - Blueprint Step 4
          // Uses computed metrics (which might have null peg deviation if spot price is null)
          intelligenceList = await generateOpenRouterIntelligence(tokens, metricsMap);
        } catch (orError) {
          console.error("OpenRouter also failed, using deterministic fallback.", orError);
          errors.intelligence = "AI services unavailable, using rule-based analysis.";
        }
      } else {
        console.warn(`Skipping OpenRouter fallback due to timeout risk. Elapsed: ${elapsed}ms`);
        errors.intelligence = "AI timeout, using rule-based analysis.";
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
        version: "1.1.0-proxy-fix",
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Snapshot generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate snapshot", details: message },
      { status: 500 }
    );
  }
}