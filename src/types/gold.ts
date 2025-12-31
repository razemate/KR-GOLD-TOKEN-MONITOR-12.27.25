// types/gold.ts
// Strict domain models according to blueprint specifications

export type Token = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  priceUsd: number;
  change24hPct: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  high24h: number | null;
  low24h: number | null;
};

export type ChartPoint = {
  t: number;
  price: number;
};

// Internal types for API response handling
export interface AnalysisResult {
  summary: string | null;
  provider: string | null;
  generatedAt: string | null;
}

export interface GoldDataResponse {
  tokens: Token[];
  goldPrice: number | null;
  aggregateCap: number;
  lastUpdated: string;
  analyses: Record<string, AnalysisResult>;
  error?: string;
}
