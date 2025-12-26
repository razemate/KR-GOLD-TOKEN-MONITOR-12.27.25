export interface GoldToken {
  id: string;
  sym: string;
  name: string;
  img: string;
  price: number;
  cap: number;
  chg: number;
  high: number;
  low: number;
  volume: number;
  circSupply: number;
  totalSupply: number;
  ath: number;
  athDate: string;
  atl: number;
  atlDate: string;
  spark: number[];
}

export interface GoldDataResponse {
  tokens: GoldToken[];
  goldPrice: number;
  aggregateCap: number;
  lastUpdated: string;
  error?: string;
}

export interface TokenizedGoldToken {
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
}

export interface TokenizedGoldResponse {
  tokens: TokenizedGoldToken[];
  lastUpdated: string;
  error?: string;
}
