import { TokenMarket, TokenChartPoint, DerivedMetrics } from '@/lib/types';

export function computeMetrics(token: TokenMarket, chart: TokenChartPoint[], spotPrice: number | null): DerivedMetrics {
  const price = token.current_price;
  
  // Peg Deviation - only computed if we have a real spot price
  let pegDeviation: number | null = null;
  let pegStatus: DerivedMetrics['pegStatus'] = 'UNKNOWN';
  
  if (spotPrice && spotPrice > 0) {
    pegDeviation = ((price - spotPrice) / spotPrice) * 100;
    
    // Peg Status Logic
    pegStatus = 'NORMAL';
    if (Math.abs(pegDeviation) <= 0.20) pegStatus = 'TIGHT';
    else if (Math.abs(pegDeviation) > 0.75) pegStatus = 'STRESSED';
  }

  // Liquidity Turnover
  const liquidityTurnover = (token.total_volume / token.market_cap) * 100;
  let liquidityTier: DerivedMetrics['liquidityTier'] = 'THIN';
  if (liquidityTurnover >= 15) liquidityTier = 'DEEP';
  else if (liquidityTurnover >= 5) liquidityTier = 'TRADABLE';

  // Backing Scale
  const estGoldOz = token.circulating_supply;
  const estGoldTonnes = estGoldOz / 32150.7;
  let backingTier: DerivedMetrics['backingTier'] = 'SMALL';
  if (estGoldTonnes >= 50) backingTier = 'LARGE';
  else if (estGoldTonnes >= 10) backingTier = 'MID';

  // Range Position
  const high = token.high_24h || price;
  const low = token.low_24h || price;
  const rangePosition = high === low ? 50 : Math.max(0, Math.min(100, ((price - low) / (high - low)) * 100));

  // Volatility (simple 7d calculation)
  const prices = chart.map(p => p.price);
  const volatility = prices.length > 0 
    ? (Math.max(...prices) - Math.min(...prices)) / (prices.reduce((a, b) => a + b, 0) / prices.length) * 100
    : 0;

  // Price Pressure
  let pressure: DerivedMetrics['pressure'] = 'STABLE';
  if (token.price_change_percentage_24h > 2) pressure = 'ACCUMULATION';
  else if (token.price_change_percentage_24h < -2) pressure = 'DISTRIBUTION';

  // Availability
  const availability: DerivedMetrics['availability'] = (token.current_price && chart.length > 0) ? 'OK' : 'PARTIAL';

  return {
    pegDeviation,
    pegStatus,
    liquidityTurnover,
    liquidityTier,
    estGoldOz,
    estGoldTonnes,
    backingTier,
    rangePosition,
    volatility,
    pressure,
    availability,
    circulatingSupply: token.circulating_supply
  };
}
