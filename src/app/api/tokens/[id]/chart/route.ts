import { NextRequest } from "next/server";
import { normalizeChartPoints } from "@/lib/normalize";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cg = process.env.COINGECKO_API_KEY;

  try {
    const chartUrl = new URL(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`);
    chartUrl.searchParams.set('vs_currency', 'usd');
    chartUrl.searchParams.set('days', '7');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    // Only add API key if present (optional per blueprint)
    if (cg) {
      headers['x-cg-demo-api-key'] = cg;
    }

    const response = await fetch(chartUrl.toString(), {
      headers,
      next: {
        revalidate: 300,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json({ error: 'Failed to fetch chart data from CoinGecko', details: errorData }, { status: response.status });
    }

    const rawData = await response.json();
    const normalizedPoints = normalizeChartPoints(rawData.prices || []);

    return new Response(JSON.stringify(normalizedPoints), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=1800'
      }
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
