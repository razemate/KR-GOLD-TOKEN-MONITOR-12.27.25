import { cn } from '@/lib/utils';
import type { GoldToken } from '@/types/gold';

interface AnalysisData {
  summary: string;
  generatedAt: string;
  provider: string;
}

interface MarketIntelProps {
  token: GoldToken | null;
  goldPrice: number | null;
  analysis?: AnalysisData;
}

export function MarketIntel({ token, goldPrice, analysis }: MarketIntelProps) {
  // Calculate spread vs spot
  const spread = token && goldPrice ? ((token.price - goldPrice) / goldPrice) * 100 : null;

  // Generate market analysis based on token data if no AI analysis is available
  const getAnalysis = (): string => {
    if (!token) return 'Select a token to view market intelligence...';

    // If we have AI analysis, return it
    if (analysis) {
      return analysis.summary;
    }

    // Fallback to generated analysis
    const priceChange = token.chg;
    const isUp = priceChange >= 0;
    const changeAbs = Math.abs(priceChange);

    if (changeAbs > 3) {
      return isUp
        ? `${token.name} showing strong momentum with ${changeAbs.toFixed(1)}% gains. Elevated institutional interest detected in gold-backed digital assets.`
        : `${token.name} under pressure with ${changeAbs.toFixed(1)}% decline. Monitor for potential reversion to mean near support levels.`;
    } else if (changeAbs > 1) {
      return isUp
        ? `${token.name} maintaining steady upward trajectory. Current price action reflects healthy accumulation phase.`
        : `${token.name} experiencing minor retracement. Price consolidation typical during periods of market uncertainty.`
    } else {
      return `${token.name} trading within tight range. Low volatility suggests stable holder base with minimal speculative activity.`;
    }
  };

  return (
    <div className="bg-card border border-border rounded p-6 border-l-2 border-l-primary/30">
      <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase mb-4 tracking-wider">
        Market Intel
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
        {getAnalysis()}
      </p>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="text-[0.5rem] font-bold text-muted-foreground uppercase tracking-wider">
          Spread vs Spot
        </span>
        {spread !== null ? (
          <span className={cn(
            "text-xl font-light",
            spread >= 0 ? "text-positive" : "text-negative"
          )}>
            {spread > 0 ? '+' : ''}{spread.toFixed(3)}%
          </span>
        ) : (
          <span className="text-xl font-light text-muted-foreground">---</span>
        )}
      </div>
    </div>
  );
}
