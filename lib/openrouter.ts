import { TokenMarket, MarketIntelItem, DerivedMetrics } from '@/lib/types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Blueprint Step 4: Hard-coded fallback models
const FALLBACK_MODELS = [
  'google/gemini-2.0-flash-lite-preview-02-05:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'liquid/lfm-40b:free'
];

/**
 * Executes OpenRouter inference as a fallback to Gemini.
 * Per Blueprint §4: "OpenRouter is invoked ONLY if Gemini market-intelligence generation fails."
 * "Try fallback models sequentially in the listed order."
 */
export async function generateOpenRouterIntelligence(
  tokens: TokenMarket[], 
  metricsMap: Record<string, DerivedMetrics>
): Promise<MarketIntelItem[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not configured");
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const prompt = `
    Analyze these 10 tokenized gold assets against the Spot Gold Benchmark.
    Return a JSON object with an "items" array matching this schema:
    {
      "items": [{
        "tokenId": string,
        "sentimentLabel": "Bullish" | "Bearish" | "Neutral",
        "confidence0to100": number,
        "headline": string (max 8 words, no emojis),
        "summary": string (at least 4 sentences),
        "evidenceBullets": string[] (exactly 3 bullets),
        "risk": string (1 sentence),
        "watch": string (1 trigger level)
      }]
    }

    DATA:
    ${JSON.stringify(tokens.map(t => ({
      id: t.id,
      name: t.name,
      price: t.current_price,
      peg: metricsMap[t.id]?.pegDeviation,
      status: metricsMap[t.id]?.pegStatus
    })))}
  `;

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`Attempting OpenRouter fallback with model: ${model}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout per model

      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://kr-gold-token-monitor-1.vercel.app',
            'X-Title': 'Gold Token Monitor',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          console.warn(`OpenRouter model ${model} failed with status: ${response.status}`);
          continue;
        }

        const result = await response.json();
        const contentStr = result.choices[0]?.message?.content;
        
        if (!contentStr) {
          throw new Error("Empty response content");
        }

        const content = JSON.parse(contentStr);
        if (!content.items || !Array.isArray(content.items)) {
           throw new Error("Invalid JSON structure");
        }
        
        return content.items;

      } finally {
        clearTimeout(timeoutId);
      }

    } catch (error) {
      console.error(`OpenRouter inference failed for ${model}:`, error);
      // Continue to next model
    }
  }

  // If all models fail
  throw new Error("All OpenRouter fallback models failed");
}