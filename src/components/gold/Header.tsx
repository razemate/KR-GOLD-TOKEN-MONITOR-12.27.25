import { cn } from '@/lib/utils';

interface HeaderProps {
  goldPrice: number | null;
  aggregateCap: number;
  lastUpdated: Date | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
      <span className="text-2xl font-light text-foreground">{value}</span>
    </div>
  );
}

export function Header({ goldPrice, aggregateCap, lastUpdated, syncStatus }: HeaderProps) {
  const formatCurrency = (value: number | null): string => {
    if (value === null || value === 0) return '---';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (value: number): string => {
    if (value === 0) return '---';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getTimeSinceUpdate = (): string => {
    if (!lastUpdated) return '';
    const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (mins < 1) return 'just now';
    return `${mins}m ago`;
  };

  return (
    <header className="mb-8 border-b border-border pb-6">
      {/* Top Bar */}
      <nav className="flex justify-between items-center py-3 mb-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            syncStatus === 'syncing' && "bg-primary animate-pulse-gold",
            syncStatus === 'synced' && "bg-positive",
            syncStatus === 'error' && "bg-negative",
            syncStatus === 'idle' && "bg-muted-foreground"
          )} />
          <span className="text-[0.625rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Live Intelligence
          </span>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground">
              {syncStatus === 'syncing' ? 'Syncing...' : getTimeSinceUpdate()}
            </span>
          )}
        </div>
      </nav>

      {/* Title and Stats */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
            <span className="text-xl text-primary">⬡</span>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-extralight text-foreground tracking-tight">
              Gold Token Monitor
            </h1>
            <p className="text-[0.625rem] font-bold text-primary uppercase tracking-[0.4em] mt-1">
              Katusa Research
            </p>
          </div>
        </div>

        <div className="flex gap-10 lg:gap-16">
          <StatBox label="Gold Spot" value={formatCurrency(goldPrice)} />
          <StatBox label="Aggregate Cap" value={formatMarketCap(aggregateCap)} />
        </div>
      </div>
    </header>
  );
}
