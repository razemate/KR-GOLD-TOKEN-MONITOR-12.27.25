export type ChartRangeKey = '24h' | '7d' | '1m' | '3m' | 'ytd' | '1y' | 'max';

export interface ChartRangeOption {
  key: ChartRangeKey;
  label: string;
}

export const CHART_RANGES: ChartRangeOption[] = [
  { key: '24h', label: '24H' },
  { key: '7d', label: '7D' },
  { key: '1m', label: '1M' },
  { key: '3m', label: '3M' },
  { key: 'ytd', label: 'YTD' },
  { key: '1y', label: '1Y' },
];

const RANGE_LABELS: Record<ChartRangeKey, string> = {
  '24h': '24H',
  '7d': '7D',
  '1m': '1M',
  '3m': '3M',
  ytd: 'YTD',
  '1y': '1Y',
  max: 'Max',
};

export function isChartRangeKey(value: string): value is ChartRangeKey {
  return Object.prototype.hasOwnProperty.call(RANGE_LABELS, value);
}

export function getChartRangeLabel(range: ChartRangeKey): string {
  return RANGE_LABELS[range];
}

export function toCoingeckoDays(range: ChartRangeKey, now = new Date()): string {
  switch (range) {
    case '24h':
      return '1';
    case '7d':
      return '7';
    case '1m':
      return '30';
    case '3m':
      return '90';
    case 'ytd': {
      const startOfYearUtc = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const diffMs = now.getTime() - startOfYearUtc.getTime();
      const days = Math.max(1, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
      return String(days);
    }
    case '1y':
      return '365';
    case 'max':
      return 'max';
    default:
      return '7';
  }
}
