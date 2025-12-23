import { cn } from '@/lib/utils';
import type { GoldToken } from '@/types/gold';

interface AssetSpecsProps {
  token: GoldToken | null;
}

interface SpecRow {
  label: string;
  value: string;
  isChange?: boolean;
  changeValue?: number;
}

export function AssetSpecs({ token }: AssetSpecsProps) {
  if (!token) {
    return (
      <div className="bg-card border border-border rounded p-6">
        <div className="text-muted-foreground text-sm">Select a token...</div>
      </div>
    );
  }

  const formatNumber = (num: number | undefined, decimals = 2): string => {
    if (num === undefined || num === null) return '---';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const formatLargeNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '---';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return formatNumber(num);
  };

  const specs: SpecRow[] = [
    { label: 'Symbol', value: token.sym },
    { label: 'Market Cap', value: `$${formatLargeNumber(token.cap)}` },
    { label: '24h Volume', value: `$${formatLargeNumber(token.volume)}` },
    { label: '24h High', value: `$${formatNumber(token.high)}` },
    { label: '24h Low', value: `$${formatNumber(token.low)}` },
    {
      label: '24h Change',
      value: `${token.chg > 0 ? '+' : ''}${token.chg?.toFixed(2)}%`,
      isChange: true,
      changeValue: token.chg,
    },
  ];

  return (
    <div className="bg-card border border-border rounded p-6 h-full">
      <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase mb-4 tracking-wider">
        Asset Specs
      </h3>
      <div className="flex flex-col gap-2">
        {specs.map((spec) => (
          <div key={spec.label} className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-[0.75rem] text-muted-foreground uppercase">
              {spec.label}
            </span>
            <span className={cn(
              "text-[0.75rem] font-medium",
              spec.isChange
                ? (spec.changeValue && spec.changeValue >= 0 ? "text-positive" : "text-negative")
                : "text-foreground"
            )}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
