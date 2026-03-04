import { fetchWithRetry } from '@/lib/retry';

function parseFirstGoldLikeNumber(text: string): number | null {
  const matches = text.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?/g);
  if (!matches) return null;

  for (const raw of matches) {
    const n = Number(raw.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 1000 && n < 10000) {
      return n;
    }
  }
  return null;
}

export async function fetchStooqSpotGoldUsd(): Promise<number | null> {
  try {
    const url = 'https://stooq.com/q/l/?s=xauusd&i=1';
    const response = await fetchWithRetry(url, {
      headers: { Accept: 'text/plain' },
      cache: 'no-store',
    }, 2, 800);

    if (!response.ok) return null;
    const text = await response.text();
    return parseFirstGoldLikeNumber(text);
  } catch {
    return null;
  }
}

export async function fetchGoldPriceApiSpotUsd(): Promise<number | null> {
  try {
    const response = await fetchWithRetry('https://data-asg.goldprice.org/dbXRates/USD', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    }, 2, 800);
    if (!response.ok) return null;
    const data = await response.json();
    const value = Number(data?.items?.[0]?.xauPrice);
    return Number.isFinite(value) && value > 1000 ? value : null;
  } catch {
    return null;
  }
}

export async function resolveSpotGoldUsd(): Promise<{ price: number | null; source: string }> {
  const stooq = await fetchStooqSpotGoldUsd();
  if (stooq !== null) {
    return { price: stooq, source: 'Stooq (Primary)' };
  }

  const goldPrice = await fetchGoldPriceApiSpotUsd();
  if (goldPrice !== null) {
    return { price: goldPrice, source: 'GoldPrice.org API (Fallback)' };
  }

  return { price: null, source: 'Unavailable' };
}

