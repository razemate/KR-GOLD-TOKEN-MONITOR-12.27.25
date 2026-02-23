import { NextRequest, NextResponse } from 'next/server';
import { fetchTokenChart, ChartMetric } from '@/lib/coingecko';
import { isChartRangeKey, toCoingeckoDays } from '@/lib/chart-range';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

function parseMetric(value: string): ChartMetric | null {
  const normalized = value.toLowerCase();
  if (normalized === 'price') return 'price';
  if (normalized === 'marketcap' || normalized === 'market_cap') return 'marketCap';
  return null;
}

export async function GET(request: NextRequest) {
  const tokenId = request.nextUrl.searchParams.get('tokenId')?.trim();
  const rangeParam = request.nextUrl.searchParams.get('range')?.trim().toLowerCase() || '7d';
  const metricParam = request.nextUrl.searchParams.get('metric')?.trim() || 'price';

  if (!tokenId) {
    return NextResponse.json(
      { error: 'Missing required query parameter: tokenId' },
      { status: 400 }
    );
  }

  if (!isChartRangeKey(rangeParam)) {
    return NextResponse.json(
      { error: `Invalid range value: ${rangeParam}` },
      { status: 400 }
    );
  }

  const metric = parseMetric(metricParam);
  if (!metric) {
    return NextResponse.json(
      { error: `Invalid metric value: ${metricParam}` },
      { status: 400 }
    );
  }

  try {
    const days = toCoingeckoDays(rangeParam);
    const data = await fetchTokenChart(tokenId, days, metric);

    return NextResponse.json(
      { tokenId, range: rangeParam, metric, data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chart fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data', details: message },
      { status: 500 }
    );
  }
}
