import { NextRequest } from 'next/server';

// In-memory cache for responses
let cachedResponse: any = null;
let lastGeneratedAtMs: number | null = null;

// Helper to determine if it's weekend in Pacific Time
const isPacificWeekend = (): boolean => {
  const now = new Date();
  // Use Intl API for accurate timezone conversion
  const ptDateStr = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const ptDate = new Date(ptDateStr);
  const day = ptDate.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Function to call Gemini API
async function callGemini(token: any, apiKey: string): Promise<{ summary: string, provider: string }> {
  const prompt = `Analyze the tokenized gold token ${token.name} (${token.symbol.toUpperCase()}) with the following data:
- Current price: $${token.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
- Market cap: $${(token.market_cap / 1e9).toFixed(2)}B USD
- 24h volume: $${(token.total_volume / 1e6).toFixed(2)}M USD
- 24h change: ${token.price_change_percentage_24h > 0 ? '+' : ''}${token.price_change_percentage_24h?.toFixed(2)}%
- Category: tokenized-gold

Provide a concise analysis of this token's performance and position in the tokenized gold market.`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI analysis temporarily unavailable.";

  return {
    summary: summary.trim(),
    provider: "gemini"
  };
}

// Function to call OpenRouter API with specified model
async function callOpenRouter(token: any, apiKey: string, model: string): Promise<{ summary: string, provider: string }> {
  const prompt = `Analyze the tokenized gold token ${token.name} (${token.symbol.toUpperCase()}) with the following data:
- Current price: $${token.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
- Market cap: $${(token.market_cap / 1e9).toFixed(2)}B USD
- 24h volume: $${(token.total_volume / 1e6).toFixed(2)}M USD
- 24h change: ${token.price_change_percentage_24h > 0 ? '+' : ''}${token.price_change_percentage_24h?.toFixed(2)}%
- Category: tokenized-gold

Provide a concise analysis of this token's performance and position in the tokenized gold market.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content || "AI analysis temporarily unavailable.";

  return {
    summary: summary.trim(),
    provider: model.includes('devstral') ? "openrouter-devstral" : "openrouter-gpt-oss"
  };
}

// Function to analyze a single token with fallback chain
async function analyzeToken(token: any): Promise<{ summary: string, generatedAt: string, provider: string }> {
  const generatedAt = new Date().toISOString();

  // Try Gemini first (primary)
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {  // Only try if key exists
      return await callGemini(token, geminiKey);
    }
  } catch (geminiError) {
    console.warn(`Gemini failed for ${token.id}:`, geminiError);
  }

  // Try OpenRouter devstral (first fallback)
  try {
    const openrouterKey = process.env.OPENROUTER_TOKENIZED_GOLD_KEY;
    if (openrouterKey) {  // Only try if key exists
      return await callOpenRouter(token, openrouterKey, "mistralai/devstral-2512:free");
    }
  } catch (devstralError) {
    console.warn(`OpenRouter devstral failed for ${token.id}:`, devstralError);
  }

  // Try OpenRouter GPT OSS (second fallback)
  try {
    const openrouterKey = process.env.OPENROUTER_TOKENIZED_GOLD_KEY;
    if (openrouterKey) {  // Only try if key exists
      return await callOpenRouter(token, openrouterKey, "openai/gpt-oss-120b:free");
    }
  } catch (gptError) {
    console.warn(`OpenRouter GPT OSS failed for ${token.id}:`, gptError);
  }

  // If all fail, return default message
  return {
    summary: "AI analysis temporarily unavailable.",
    generatedAt,
    provider: "fallback" // Indicate this is a fallback response
  };
}

export async function GET(request: NextRequest) {
  // Read environment variables STRICTLY as specified
  const coingeckoKey = process.env.COINGECKO_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_TOKENIZED_GOLD_KEY;

  // Implement strict env check - only show "API keys not configured" when keys are truly missing
  if (!coingeckoKey) {
    return new Response(JSON.stringify({
      error: "MISSING_ENV",
      missing: ["COINGECKO_API_KEY"]
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }

  // Check if both Gemini and OpenRouter keys are missing (meaning no AI analysis possible)
  if (!geminiKey && !openrouterKey) {
    return new Response(JSON.stringify({
      error: "MISSING_ENV",
      missing: ["GEMINI_API_KEY", "OPENROUTER_TOKENIZED_GOLD_KEY"]
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    // Determine refresh cadence based on Pacific time
    const isWeekend = isPacificWeekend();
    const cadenceMinutes = isWeekend ? 15 : 5;
    const nowMs = Date.now();

    // Check if we have a cached response and if it's still within the cadence window
    if (cachedResponse && lastGeneratedAtMs) {
      const timeSinceLastGeneration = (nowMs - lastGeneratedAtMs) / (1000 * 60); // in minutes

      if (timeSinceLastGeneration < cadenceMinutes) {
        // Return cached response
        return new Response(JSON.stringify(cachedResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
      }
    }

    // Fetch tokenized gold data from CoinGecko - exactly as specified
    const coingeckoUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=tokenized-gold&order=market_cap_desc&per_page=10&page=1&sparkline=false';

    const coingeckoResponse = await fetch(coingeckoUrl, {
      headers: {
        'x-cg-pro-api-key': coingeckoKey!,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!coingeckoResponse.ok) {
      throw new Error(`CoinGecko API error: ${coingeckoResponse.status} ${coingeckoResponse.statusText}`);
    }

    const tokensData = await coingeckoResponse.json();

    // Process and format token data to match expected structure - exactly 10 tokens
    const tokens = tokensData.map((t: any) => ({
      id: t.id,
      sym: (t.symbol || '').toUpperCase(),
      name: t.name,
      img: t.image,
      price: t.current_price,
      cap: t.market_cap,
      chg: t.price_change_percentage_24h,
      high: t.high_24h,
      low: t.low_24h,
      volume: t.total_volume,
      circSupply: t.circulating_supply,
      totalSupply: t.total_supply,
      ath: t.ath,
      athDate: t.ath_date,
      atl: t.atl,
      atlDate: t.atl_date,
      spark: [] // We're not fetching sparkline data per requirements
    }));

    // Generate AI analysis for each token concurrently - exactly 10 analyses
    const analysisPromises = tokens.map(token => analyzeToken(token));
    const analysesArray = await Promise.all(analysisPromises);

    // Create analyses object with token IDs as keys
    const analyses: Record<string, { summary: string, generatedAt: string, provider: string }> = {};
    tokens.forEach((token, index) => {
      analyses[token.id] = analysesArray[index];
    });

    // Create the response object
    const response = {
      tokens,
      analyses,
      generatedAt: new Date().toISOString(),
      refreshPolicy: {
        timezone: "America/Los_Angeles",
        cadenceMinutes,
        isWeekend
      }
    };

    // Update cache
    cachedResponse = response;
    lastGeneratedAtMs = nowMs;

    // Return response
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Error in gold-intel API:', error);

    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
}