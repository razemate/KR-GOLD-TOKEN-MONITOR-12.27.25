import { fetchWithRetry, delay } from './retry';
import { TokenMarket, TokenChartPoint } from '@/lib/types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

function getCoingeckoHeaders() {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const cg = process.env.COINGECKO_API_KEY;
  if (cg) {
    headers['x-cg-demo-api-key'] = cg;
  }
  return headers;
}

export async function fetchTopGoldTokens(): Promise<TokenMarket[]> {
  const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&category=tokenized-gold&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
  try {
    const response = await fetchWithRetry(url, { headers: getCoingeckoHeaders() });
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("CoinGecko markets response is not an array:", data);
      throw new Error("Invalid CoinGecko response format");
    }
    return data.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch top gold tokens:", error);
    throw error;
  }
}

export async function fetchTokenChart(tokenId: string): Promise<TokenChartPoint[]> {
  try {
    const url = `${COINGECKO_API}/coins/${tokenId}/market_chart?vs_currency=usd&days=7`;
    const response = await fetchWithRetry(url, { headers: getCoingeckoHeaders() }, 1, 2000); 
    const data = await response.json();
    if (!data.prices || !Array.isArray(data.prices)) return [];
    return data.prices.map((p: [number, number]) => ({ timestamp: p[0], price: p[1] }));
  } catch (e) {
    console.error(`Failed to fetch chart for ${tokenId}:`, e);
    return [];
  }
}

export async function fetchAllCharts(tokens: TokenMarket[]): Promise<Record<string, TokenChartPoint[]>> {
  const charts: Record<string, TokenChartPoint[]> = {};
  const BATCH_SIZE = 3; // Blueprint §7: Concurrency capped at 2–3

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    
    // Fetch batch in parallel
    const results = await Promise.all(
      batch.map(async (token) => {
        const chart = await fetchTokenChart(token.id);
        return { id: token.id, chart };
      })
    );
    
    results.forEach(({ id, chart }) => {
      charts[id] = chart;
    });

    // Minimal delay between batches to respect rate limits
    if (i + BATCH_SIZE < tokens.length) {
      await delay(1000); 
    }
  }
  
  return charts;
}
