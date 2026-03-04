import { fetchTopGoldTokens } from '@/lib/coingecko';
import { computeMetrics } from '@/lib/compute';
import { normalizeTokenData } from '@/lib/normalize';
import { generateSnapshotIntelligence, getFallbackIntelligence } from '@/lib/gemini';
import { generateOpenRouterIntelligence } from '@/lib/openrouter';
import { getRefreshCadence } from '@/lib/schedule';
import { resolveSpotGoldUsd } from '@/lib/spot';
import { MarketIntelItem, SnapshotResponse, TokenSnapshot } from '@/lib/types';

export async function buildSnapshotPayload(): Promise<SnapshotResponse> {
  const startTime = Date.now();
  const { isWeekend, refreshInterval } = getRefreshCadence();
  const errors: Record<string, string> = {};

  // 1. Fetch Markets
  const rawTokens = await fetchTopGoldTokens();
  const tokens = rawTokens.map(normalizeTokenData);

  // Convert sparkline data to chart points
  const charts: Record<string, import('@/lib/types').TokenChartPoint[]> = {};
  const now = Date.now();
  const oneHour = 3600 * 1000;

  tokens.forEach((token) => {
    if (token.sparkline_in_7d && Array.isArray(token.sparkline_in_7d.price)) {
      const prices = token.sparkline_in_7d.price;
      const endIndex = prices.length - 1;
      charts[token.id] = prices.map((price, i) => ({
        timestamp: now - (endIndex - i) * oneHour,
        price,
      }));
    } else {
      charts[token.id] = [];
    }
  });

  // 2. Spot price via Stooq -> GoldPrice fallback (not Gemini).
  const resolvedSpot = await resolveSpotGoldUsd();
  const spotPrice = resolvedSpot.price;
  const spotSource = resolvedSpot.source;
  if (spotPrice === null) {
    errors.spotPrice = 'Stooq and GoldPrice.org API both failed';
  }

  // 3. Metrics map for prompts and rendering.
  const metricsMap = Object.fromEntries(
    tokens.map((token) => [token.id, computeMetrics(token, charts[token.id] || [], spotPrice)])
  );

  // 4. AI generation (Gemini -> OpenRouter -> deterministic fallback).
  let intelligenceList: MarketIntelItem[] = [];
  let geminiSucceeded = false;
  try {
    intelligenceList = await generateSnapshotIntelligence(tokens, metricsMap);
    geminiSucceeded = true;
  } catch (geminiError) {
    console.warn('Gemini failed, trying OpenRouter fallback...', geminiError);
  }

  if (!geminiSucceeded) {
    const elapsed = Date.now() - startTime;
    const timeLeft = 9500 - elapsed;
    if (timeLeft > 2000) {
      try {
        intelligenceList = await generateOpenRouterIntelligence(tokens, metricsMap);
      } catch (orError) {
        console.error('OpenRouter fallback failed; using deterministic analysis.', orError);
        errors.intelligence = 'AI services unavailable, using rule-based analysis.';
      }
    } else {
      errors.intelligence = 'AI timeout, using rule-based analysis.';
    }
  }

  const intelligenceMap = Object.fromEntries(intelligenceList.map((i) => [i.tokenId, i]));
  const tokenSnapshots: TokenSnapshot[] = tokens.map((token) => {
    const chart = charts[token.id] || [];
    const metrics = metricsMap[token.id];
    const intelligence = intelligenceMap[token.id] || getFallbackIntelligence(token, metrics);
    return { token, chart, metrics, intelligence };
  });

  return {
    meta: {
      version: '2.0.0-db-slots',
      generatedAt: Date.now(),
      isWeekend,
      refreshInterval,
      goldSpotUsd: spotPrice,
      goldSpotSource: spotSource,
    },
    tokens: tokenSnapshots,
    errors,
  };
}

