import { fetchWithRetry, delay } from './retry';
import { TokenMarket, TokenChartPoint } from '@/lib/types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
export type ChartMetric = 'price' | 'marketCap';

function getCoingeckoHeaders() {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const cg = process.env.COINGECKO_API_KEY;
  if (cg) {
    headers['x-cg-demo-api-key'] = cg;
  }
  return headers;
}

export async function fetchTopGoldTokens(): Promise<TokenMarket[]> {
  const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&category=tokenized-gold&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`;
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

function mapChartSeries(data: unknown, metric: ChartMetric): TokenChartPoint[] {
  if (!data || typeof data !== 'object') return [];
  const parsed = data as { prices?: [number, number][]; market_caps?: [number, number][] };
  const series = metric === 'marketCap' ? parsed.market_caps : parsed.prices;
  if (!Array.isArray(series)) return [];

  return series
    .filter((point): point is [number, number] => Array.isArray(point) && point.length >= 2)
    .map((point) => ({ timestamp: Number(point[0]), price: Number(point[1]) }))
    .filter((point) => Number.isFinite(point.timestamp) && Number.isFinite(point.price));
}

export async function fetchTokenChart(
  tokenId: string,
  days: string | number = 7,
  metric: ChartMetric = 'price'
): Promise<TokenChartPoint[]> {
  try {
    const daysParam = typeof days === 'number' ? String(days) : days;
    const url = `${COINGECKO_API}/coins/${encodeURIComponent(tokenId)}/market_chart?vs_currency=usd&days=${encodeURIComponent(daysParam)}`;
    const response = await fetchWithRetry(url, { headers: getCoingeckoHeaders() }, 1, 2000); 
    
    // Check for rate limit response explicitly
    if (response.status === 429) {
       console.warn(`Throttled while fetching chart for ${tokenId}`);
       return [];
    }

    const text = await response.text();
    try {
        const data = JSON.parse(text);
        return mapChartSeries(data, metric);
    } catch (parseError) {
        console.warn(`Failed to parse ${metric} chart JSON for ${tokenId}:`, text.slice(0, 100));
        return [];
    }
  } catch (e) {
    console.error(`Failed to fetch ${metric} chart for ${tokenId}:`, e);
    return [];
  }
}

export async function fetchAllCharts(
  tokens: TokenMarket[],
  days: string | number = 7,
  metric: ChartMetric = 'price'
): Promise<Record<string, TokenChartPoint[]>> {
  const charts: Record<string, TokenChartPoint[]> = {};
  const BATCH_SIZE = 2; // Reduced from 3 to 2 for stricter rate limiting on Vercel

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    
    // Fetch batch in parallel
    const results = await Promise.all(
      batch.map(async (token) => {
        const chart = await fetchTokenChart(token.id, days, metric);
        return { id: token.id, chart };
      })
    );
    
    results.forEach(({ id, chart }) => {
      charts[id] = chart;
    });

    // Increased delay between batches to respect rate limits
    if (i + BATCH_SIZE < tokens.length) {
      await delay(1200); 
    }
  }
  
  return charts;
}
