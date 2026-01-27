
import { fetchTopGoldTokens } from '../lib/coingecko';
import { computeMetrics } from '../lib/compute';
import { normalizeTokenData } from '../lib/normalize';
import { generateSnapshotIntelligence, getFallbackGoldSpotPrice } from '../lib/gemini';
import { generateOpenRouterIntelligence } from '../lib/openrouter';

async function runFullFlow() {
  console.log("Starting Full Flow Simulation...");
  const startTime = Date.now();

  try {
    // 1. Fetch Markets
    console.log("1. Fetching Top Gold Tokens...");
    const rawTokens = await fetchTopGoldTokens();
    console.log(`   Fetched ${rawTokens.length} tokens.`);
    
    const tokens = rawTokens.map(normalizeTokenData);
    
    console.log("2. Processing Charts (from Sparkline)...");
    const charts: Record<string, any[]> = {};
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
    console.log(`   Processed charts for ${Object.keys(charts).length} tokens.`);

    // 3. Pre-compute metrics
    const promptMetricsMap = Object.fromEntries(
      tokens.map(token => [token.id, computeMetrics(token, charts[token.id] || [], null)])
    );

    // 4. Spot Price + Intelligence
    console.log("3. Fetching Spot Price & Intelligence (Gemini)...");
    let spotPrice: number | null = null;
    let geminiSucceeded = false;

    try {
      const geminiResult = await generateSnapshotIntelligence(tokens, promptMetricsMap);
      spotPrice = geminiResult.spotGoldUsd;
      geminiSucceeded = true;
      console.log(`   Gemini Success. Spot: $${spotPrice}`);
    } catch (geminiError) {
      console.error("   Gemini Failed:", geminiError);
    }

    if (!geminiSucceeded) {
      console.log("   Attempting Spot Price Fallback...");
      try {
        const fallback = await getFallbackGoldSpotPrice();
        spotPrice = fallback.price;
        console.log(`   Fallback Success. Spot: $${spotPrice} (Source: ${fallback.source})`);
      } catch (e) {
        console.error("   Fallback Failed:", e);
      }
    }

    // 5. OpenRouter (if needed)
    if (!geminiSucceeded) {
        const elapsed = Date.now() - startTime;
        console.log(`   Elapsed: ${elapsed}ms. Checking time for OpenRouter...`);
        if (elapsed < 8000) {
            console.log("   Attempting OpenRouter...");
            try {
                // Mocking metricsMap for this step since we need spotPrice for accurate metrics
                const metricsMap = Object.fromEntries(
                    tokens.map(token => [token.id, computeMetrics(token, charts[token.id] || [], spotPrice)])
                );
                await generateOpenRouterIntelligence(tokens, metricsMap);
                console.log("   OpenRouter Success.");
            } catch (e) {
                console.error("   OpenRouter Failed:", e);
            }
        } else {
            console.log("   Skipping OpenRouter due to timeout risk.");
        }
    }

    const totalTime = Date.now() - startTime;
    console.log(`\nFull Flow Complete in ${totalTime}ms`);

  } catch (error) {
    console.error("\nCRITICAL FAILURE:", error);
  }
}

runFullFlow();
