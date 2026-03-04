import { fetchWithRetry } from '@/lib/retry';

function toValidSpot(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.replace(/"/g, '').trim();
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n > 1000 && n < 10000 ? n : null;
}

function parseStooqCsvSpot(text: string): number | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return null;

  // Expected format:
  // Symbol,Date,Time,Open,High,Low,Close,Volume
  // XAUUSD,2026-03-04,19:12:03,5100.00,5120.43,5090.00,5120.43,0
  const header = lines[0].toLowerCase();
  if (!header.includes('symbol') || !header.includes('close')) return null;

  const record = lines[lines.length - 1].split(',');
  if (record.length < 7) return null;

  const symbol = record[0]?.replace(/"/g, '').trim().toLowerCase();
  if (symbol !== 'xauusd') return null;

  const close = toValidSpot(record[6]);
  if (close !== null) return close;

  // Fallback to open if close is temporarily missing.
  return toValidSpot(record[3]);
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
    return parseStooqCsvSpot(text);
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
