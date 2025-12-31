import { NextRequest } from "next/server";
import { normalizeTokenList } from "@/lib/normalize";

export async function GET(request: NextRequest) {
  const cg = process.env.COINGECKO_API_KEY;

  try {
    const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
    url.searchParams.set('vs_currency', 'usd');
    url.searchParams.set('category', 'tokenized-gold');
    url.searchParams.set('order', 'market_cap_desc');
    url.searchParams.set('per_page', '10');
    url.searchParams.set('page', '1');
    url.searchParams.set('sparkline', 'false');
    url.searchParams.set('price_change_percentage', '24h');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    // Only add API key if present (optional per blueprint)
    if (cg) {
      headers['x-cg-demo-api-key'] = cg;
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        revalidate: 60,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json({ error: 'Failed to fetch data from CoinGecko', details: errorData }, { status: response.status });
    }

    const rawData = await response.json();
    const normalizedTokens = normalizeTokenList(rawData);

    return new Response(JSON.stringify(normalizedTokens), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
