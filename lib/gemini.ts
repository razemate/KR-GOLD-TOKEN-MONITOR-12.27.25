import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { TokenMarket, MarketIntelItem, DerivedMetrics } from '@/lib/types';

const MODEL_NAME = 'gemini-2.5-flash';

// Schema for market intelligence response.
const snapshotSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          tokenId: { type: SchemaType.STRING },
          sentimentLabel: { type: SchemaType.STRING, format: "enum", enum: ['Bullish', 'Bearish', 'Neutral'] },
          confidence0to100: { type: SchemaType.NUMBER },
          headline: { type: SchemaType.STRING },
          summary: { type: SchemaType.STRING },
          evidenceBullets: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING } 
          },
          risk: { type: SchemaType.STRING },
          watch: { type: SchemaType.STRING }
        },
        required: ['tokenId', 'sentimentLabel', 'confidence0to100', 'headline', 'summary', 'evidenceBullets', 'risk', 'watch']
      }
    }
  },
  required: ['items']
};

export async function generateSnapshotIntelligence(
  tokens: TokenMarket[],
  metricsMap: Record<string, DerivedMetrics>
): Promise<{ spotGoldUsd: number | null; items: MarketIntelItem[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: `You are a Senior RWA (Real World Asset) Analyst specializing in Gold-Pegged Tokens.
PROTOCOL: Before providing the JSON output, you must "think" through the following:

Do NOT attempt to retrieve spot gold prices. A separate system provides spot pricing.
Calculate the % deviation between each token's current_price and the provided spot price (if available).

Compare the 24h volume against the market cap to verify liquidity health.

Assess if the price change (volatility) is aligned with broader gold market movements or an isolated peg-stress event.

OUTPUT REQUIREMENTS:

Return a valid JSON object matching the snapshotSchema.
spotGoldUsd must be a numeric USD price per troy ounce derived from Google Search Grounding.

Ensure the 'summary' field is professional, objective, and specifically mentions the peg status (Tight, Stressed, or Normal).

The 'confidence0to100' score must reflect the consistency between the price and the physical backing.`,
  });

  const prompt = `
    Generate market intelligence for the following 10 tokenized gold assets.
    
    CONSTRAINTS:
    1. Vary phrasing, sentence structure, and analytical emphasis per token. 
    2. Do NOT reuse sentence structure across tokens.
    3. Each token summary must emphasize at least ONE differentiator.
    4. Headline: Must be < 8 words. Active verbs. NO Emojis.
    5. CRITICAL: EACH SUMMARY MUST BE AT LEAST 4 FULL SENTENCES LONG. DO NOT WRITE SHORT SUMMARIES.
    6. Each summary MUST reference at least two token-specific metrics.
    7. Evidence: Extract exactly 3 numeric data points.
    8. Risk: Identify 1 specific invalidation condition.
    9. Watch: Provide 1 specific trigger level.
    10. Confidence: Vary score (0-100).
    11. Tone: Serious, objective, institutional.
    
    DATA CONTEXT:
    ${JSON.stringify(tokens.map(t => {
      const m = metricsMap[t.id];
      return {
        tokenId: t.id,
        name: t.name,
        symbol: t.symbol,
        price: t.current_price,
        market_cap: t.market_cap,
        volume_24h: t.total_volume,
        price_change_pct_24h: t.price_change_percentage_24h,
        high_24h: t.high_24h,
        low_24h: t.low_24h,
        liquidity_turnover_pct: m?.liquidityTurnover?.toFixed(2),
        liquidity_tier: m?.liquidityTier,
        backing_tonnes: m?.estGoldTonnes?.toFixed(2),
        backing_tier: m?.backingTier,
        volatility_pct: m?.volatility?.toFixed(2),
        range_position_pct: m?.rangePosition?.toFixed(2),
        pressure: m?.pressure,
        peg_status: m?.pegStatus,
        peg_deviation_pct: m?.pegDeviation !== null ? m?.pegDeviation?.toFixed(3) : "N/A"
      };
    }))}
  `;

  let result: any;
  let generatePromise: Promise<any>;
  let timeoutPromise: Promise<any>;

  try {
    timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Gemini request timed out")), 30000)
    );

    generatePromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: snapshotSchema,
      }
    });

    result = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    
    if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      throw new Error("Invalid or empty response from Gemini");
    }

    return {
      spotGoldUsd: null,
      items: parsed.items
    };
  } catch (error: any) {
    console.error("Gemini batch call failed:", error);
    throw error;
  }
}

/**
 * Fallback spot price fetch if Gemini grounding fails to return a valid value.
 * Approved exception to blueprint for resilience.
 */
export async function getFallbackGoldSpotPrice(): Promise<number | null> {
  try {
    const response = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      cache: "no-store"
    });
    if (!response.ok) return null;

    const data = await response.json();
    const value = Number(data?.items?.[0]?.xauPrice);

    if (Number.isFinite(value) && value > 1000 && value < 5000) {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Deterministic rule-based fallback intelligence using computed metrics.
 * Per Blueprint 15: "On failure, deterministic rule-based fallback generates identical schema using computed metrics."
 */
export function getFallbackIntelligence(token: TokenMarket, metrics: DerivedMetrics): MarketIntelItem {
  const symbol = token.symbol.toUpperCase();
  const name = token.name;
  const price = token.current_price;
  const change = token.price_change_percentage_24h;
  const volumeM = (token.total_volume / 1000000).toFixed(2);
  const capM = (token.market_cap / 1000000).toFixed(2);
  
  const isPositive = change >= 0;
  const sentimentLabel = Math.abs(change) < 0.2 ? 'Neutral' : (isPositive ? 'Bullish' : 'Bearish');
  
  // Calculate dynamic fallback confidence based on metric health
  let confidence = 94;
  if (metrics.pegStatus === 'STRESSED') confidence -= 12;
  if (metrics.pegStatus === 'UNKNOWN') confidence -= 20;
  if (metrics.liquidityTier === 'THIN') confidence -= 8;
  if (metrics.volatility > 3.0) confidence -= 5;
  if (metrics.volatility > 7.0) confidence -= 5;
  
  let summary = "";
  if (metrics.pegStatus === 'STRESSED' && metrics.pegDeviation !== null) {
    summary = `${name} exhibits peg stress with ${metrics.pegDeviation.toFixed(2)}% deviation against the gold spot price. Imbalance in secondary liquidity suggests immediate arbitrage pressure is affecting the peg. Traders should monitor for mean reversion or further decoupling in the short term.`;
  } else if (metrics.liquidityTier === 'THIN') {
    summary = `${name} liquidity turnover is thin at ${metrics.liquidityTurnover.toFixed(2)}%, indicating strictly passive holding. Low market depth increases slippage risk for institutional rebalancing during volatility. Order book checks are advised before executing large block transfers.`;
  } else {
    summary = `${name} maintains a stable peg with $${volumeM}M volume supporting its $${capM}M market cap. The asset effectively tracks spot gold prices with minimal friction in the current session. Continued stability in the ${change.toFixed(2)}% price range validates the current collateralization model.`;
  }

  return {
    tokenId: token.id,
    sentimentLabel,
    confidence0to100: confidence, // Dynamic metric-based confidence
    headline: `${name} (${symbol}) ${metrics.pegStatus} Metric Analysis`,
    summary,
    evidenceBullets: [
      `Price: $${price.toLocaleString()}`,
      `Volume: $${volumeM}M`,
      `Peg: ${metrics.pegDeviation !== null ? metrics.pegDeviation.toFixed(3) + '%' : 'N/A'}`
    ],
    risk: `A sustained peg deviation exceeding 0.75% would invalidate the current ${metrics.pegStatus.toLowerCase()} thesis.`,
    watch: `Watch for volume spike above $${(token.total_volume * 1.5 / 1000000).toFixed(2)}M at $${(price * (isPositive ? 1.02 : 0.98)).toFixed(2)}.`
  };
}
