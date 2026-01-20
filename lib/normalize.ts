import { TokenMarket, TokenChartPoint } from '@/lib/types';

interface RawTokenData {
  id?: string;
  symbol?: string;
  name?: string;
  image?: string;
  current_price?: number;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  total_volume?: number;
  circulating_supply?: number;
  high_24h?: number;
  low_24h?: number;
  ath?: number;
  atl?: number;
  [key: string]: unknown;
}

export function normalizeTokenData(token: RawTokenData): TokenMarket {
  return {
    id: token.id || '',
    symbol: token.symbol || '',
    name: token.name || '',
    image: token.image || '',
    current_price: token.current_price || 0,
    market_cap_rank: token.market_cap_rank || 0,
    price_change_percentage_24h: token.price_change_percentage_24h || 0,
    market_cap: token.market_cap || 0,
    total_volume: token.total_volume || 0,
    circulating_supply: token.circulating_supply || 0,
    high_24h: token.high_24h || 0,
    low_24h: token.low_24h || 0,
    ath: token.ath || 0,
    atl: token.atl || 0,
  };
}

export function sanitizeChartData(points: unknown[]): TokenChartPoint[] {
  if (!Array.isArray(points)) return [];
  return points
    .filter(p => p && Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number')
    .map(p => ({
      timestamp: p[0],
      price: p[1]
    }));
}
