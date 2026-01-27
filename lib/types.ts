export interface TokenMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  high_24h: number;
  low_24h: number;
  ath?: number;
  atl?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface TokenChartPoint {
  timestamp: number;
  price: number;
}

export interface MarketIntelItem {
  tokenId: string;
  sentimentLabel: 'Bullish' | 'Bearish' | 'Neutral';
  confidence0to100: number; // 0-100
  headline: string;
  summary: string;
  evidenceBullets: string[]; // Exactly 3 bullets
  risk: string;
  watch: string;
}

export interface DerivedMetrics {
  pegDeviation: number | null;
  pegStatus: 'TIGHT' | 'NORMAL' | 'STRESSED' | 'UNKNOWN';
  liquidityTurnover: number;
  liquidityTier: 'DEEP' | 'TRADABLE' | 'THIN';
  estGoldOz: number;
  estGoldTonnes: number;
  backingTier: 'LARGE' | 'MID' | 'SMALL';
  rangePosition: number;
  volatility: number;
  pressure: 'ACCUMULATION' | 'STABLE' | 'DISTRIBUTION';
  availability: 'OK' | 'PARTIAL' | 'UNAVAILABLE';
  circulatingSupply: number;
}

export interface TokenSnapshot {
  token: TokenMarket;
  chart: TokenChartPoint[];
  metrics: DerivedMetrics;
  intelligence?: MarketIntelItem;
  intelligenceError?: string;
}

export interface SnapshotMeta {
  version?: string;
  generatedAt: number;
  isWeekend: boolean;
  refreshInterval: number;
  goldSpotUsd: number | null;
  goldSpotSource?: string;
}

export interface SnapshotResponse {
  meta: SnapshotMeta;
  tokens: TokenSnapshot[];
  errors: Record<string, string>;
}
