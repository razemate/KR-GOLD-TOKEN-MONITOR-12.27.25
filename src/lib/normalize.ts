// lib/normalize.ts
// Functions to normalize API responses according to the blueprint

import { Token, ChartPoint } from '@/types/gold';

export function normalizeToken(rawToken: any): Token {
  // Validate and normalize token data according to blueprint specifications
  return {
    id: rawToken.id || '',
    symbol: (rawToken.symbol || '').toUpperCase(),
    name: rawToken.name || '',
    image: rawToken.image || '',
    priceUsd: typeof rawToken.current_price === 'number' ? rawToken.current_price : (typeof rawToken.priceUsd === 'number' ? rawToken.priceUsd : 0),
    change24hPct: typeof rawToken.price_change_percentage_24h === 'number' ? rawToken.price_change_percentage_24h : (typeof rawToken.change24hPct === 'number' ? rawToken.change24hPct : null),
    marketCapUsd: typeof rawToken.market_cap === 'number' ? rawToken.market_cap : (typeof rawToken.marketCapUsd === 'number' ? rawToken.marketCapUsd : null),
    volume24hUsd: typeof rawToken.total_volume === 'number' ? rawToken.total_volume : (typeof rawToken.volume24hUsd === 'number' ? rawToken.volume24hUsd : null),
    circulatingSupply: typeof rawToken.circulating_supply === 'number' ? rawToken.circulating_supply : (typeof rawToken.circulatingSupply === 'number' ? rawToken.circulatingSupply : null),
    totalSupply: typeof rawToken.total_supply === 'number' ? rawToken.total_supply : (typeof rawToken.totalSupply === 'number' ? rawToken.totalSupply : null),
    high24h: typeof rawToken.high_24h === 'number' ? rawToken.high_24h : (typeof rawToken.high24h === 'number' ? rawToken.high24h : null),
    low24h: typeof rawToken.low_24h === 'number' ? rawToken.low_24h : (typeof rawToken.low24h === 'number' ? rawToken.low24h : null)
  };
}

export function normalizeChartPoint(rawPoint: any): ChartPoint {
  // Validate and normalize chart point data according to blueprint specifications
  // CoinGecko returns [timestamp, price]
  if (Array.isArray(rawPoint) && rawPoint.length >= 2) {
    return {
      t: typeof rawPoint[0] === 'number' ? rawPoint[0] : 0,
      price: typeof rawPoint[1] === 'number' ? rawPoint[1] : 0
    };
  }
  return {
    t: typeof rawPoint.t === 'number' ? rawPoint.t : 0,
    price: typeof rawPoint.price === 'number' ? rawPoint.price : 0
  };
}

export function normalizeTokenList(rawTokens: any[]): Token[] {
  if (!Array.isArray(rawTokens)) return [];
  return rawTokens.map(token => normalizeToken(token));
}

export function normalizeChartPoints(rawPoints: any[]): ChartPoint[] {
  if (!Array.isArray(rawPoints)) return [];
  return rawPoints.map(point => normalizeChartPoint(point));
}
