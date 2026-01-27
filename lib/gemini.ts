import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { TokenMarket, MarketIntelItem, DerivedMetrics } from '@/lib/types';

const MODEL_NAME = 'gemini-2.5-flash';

// Schema for market intelligence response.
const snapshotSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    spotGoldUsd: { type: SchemaType.NUMBER },
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
  required: ['spotGoldUsd', 'items']
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

Retrieve the current spot gold price (USD/oz) using Google Search Grounding.
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

  type GenerateContentResult = Awaited<ReturnType<typeof model.generateContent>>;
  let result: GenerateContentResult;
  let generatePromise: Promise<GenerateContentResult>;
  let timeoutPromise: Promise<GenerateContentResult>;

  try {
    timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Gemini request timed out")), 4500)
    );

    // Prompt engineering for JSON response since Grounding tools often conflict with responseMimeType: 'application/json'
    const promptWithJsonInstruction = `${prompt}

    CRITICAL INSTRUCTION: You must return the result as a valid JSON object strictly adhering to the schema defined above. Do not include markdown code blocks (like \`\`\`json). Just the raw JSON string.`;

    generatePromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptWithJsonInstruction }] }],
      tools: [{ googleSearch: {} }],
      // Remove responseMimeType: "application/json" to avoid 400 Bad Request with Tools
    });

    result = await Promise.race([generatePromise, timeoutPromise]);
    let responseText = result.response.text();
    
    // Clean up potential markdown code blocks if the model ignores the instruction
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(responseText);
    const spotGoldUsd = Number(parsed.spotGoldUsd);
    const validSpotGoldUsd =
      Number.isFinite(spotGoldUsd) && spotGoldUsd > 1000
        ? spotGoldUsd
        : null;
    
    if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      throw new Error("Invalid or empty response from Gemini");
    }

    return {
      spotGoldUsd: validSpotGoldUsd,
      items: parsed.items
    };
  } catch (error: unknown) {
    console.error("Gemini batch call failed:", error);
    throw error;
  }
}

import yahooFinance from 'yahoo-finance2';
import * as cheerio from 'cheerio';

// ... (existing imports)

/**
 * Fetch gold price from Yahoo Finance using yahoo-finance2 library.
 * Symbol: GC=F (Gold Futures)
 */
export async function fetchYahooGoldPrice(): Promise<number | null> {
  const symbols = ['GC=F', 'XAUUSD=X', 'XAU=X'];
  
  for (const symbol of symbols) {
    try {
      // @ts-ignore: yahoo-finance2 export quirk
      const yf = new yahooFinance({ suppressNotices: ['yahooSurvey'] });
      const quote = await yf.quote(symbol);
      const price = quote.regularMarketPrice;
      if (typeof price === 'number' && price > 1000) {
        return price;
      }
    } catch (error) {
      console.warn(`Yahoo Finance fetch failed for ${symbol}:`, error instanceof Error ? error.message : String(error));
    }
  }
  return null;
}

/**
 * Scrape gold price from goldprice.org using Cheerio.
 * User-requested scraping fallback.
 */
export async function scrapeGoldPriceOrg(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch("https://goldprice.org/spot-gold.html", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Selectors based on goldprice.org structure (as of Jan 2026)
    // The price is usually in a div with id="gold_price" or similar
    // We try multiple common selectors
    let priceText = $('#gold_price').text().trim();
    if (!priceText) {
       priceText = $('.price-card .price').first().text().trim();
    }
    
    // Clean string: "$2,034.50" -> "2034.50"
    const cleanPrice = priceText.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);

    if (Number.isFinite(price) && price > 1000) {
      return price;
    }
    return null;
  } catch (error) {
    console.error("GoldPrice.org scrape failed:", error);
    return null;
  }
}

/**
 * Fallback spot price fetch if Gemini grounding fails.
 * Order: Yahoo Finance -> GoldPrice.org API -> GoldPrice.org Scrape
 */
export async function getFallbackGoldSpotPrice(): Promise<{ price: number | null; source: string }> {
  // 1. Try Yahoo Finance (Preferred Fallback)
  const yahooPrice = await fetchYahooGoldPrice();
  if (yahooPrice) {
    return { price: yahooPrice, source: 'Fallback: Yahoo Finance (GC=F)' };
  }

  // 2. Try GoldPrice.org API (Existing)
  try {
    const response = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      cache: "no-store",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    if (response.ok) {
      const data = await response.json();
      const value = Number(data?.items?.[0]?.xauPrice);
      if (Number.isFinite(value) && value > 1000) {
        return { price: value, source: 'Fallback: goldprice.org API' };
      }
    }
  } catch (e) {
    console.error("GoldPrice API failed:", e);
  }

  // 3. Try GoldPrice.org Scraper (Last Resort)
  const scrapePrice = await scrapeGoldPriceOrg();
  if (scrapePrice) {
    return { price: scrapePrice, source: 'Fallback: goldprice.org Scrape' };
  }

  return { price: null, source: 'Unavailable' };
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

