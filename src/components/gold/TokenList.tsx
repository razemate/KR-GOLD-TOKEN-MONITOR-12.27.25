import { cn } from '@/lib/utils';
import type { GoldToken } from '@/types/gold';

interface TokenListProps {
  tokens: GoldToken[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lastUpdated: Date | null;
}

function TokenSkeleton() {
  return (
    <div className="h-16 w-full bg-muted/50 animate-pulse rounded" />
  );
}

export function TokenList({ tokens, selectedId, onSelect, lastUpdated }: TokenListProps) {
  const getTimeSinceUpdate = (): string => {
    if (!lastUpdated) return '';
    const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (mins < 1) return 'just now';
    return `${mins}m ago`;
  };

  return (
    <div className="bg-card border border-border rounded p-4 h-full">
      <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
        <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-wider">
          Active Index ({tokens.length})
        </span>
        <span className="text-[0.5rem] text-muted-foreground/70">
          {getTimeSinceUpdate()}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {tokens.length === 0 && (
          <>
            <TokenSkeleton />
            <TokenSkeleton />
            <TokenSkeleton />
          </>
        )}

        {tokens.map((token, index) => (
          <div
            key={token.id}
            onClick={() => onSelect(token.id)}
            className={cn(
              "p-4 cursor-pointer flex items-center justify-between transition-all duration-200 border rounded",
              selectedId === token.id
                ? "bg-secondary/50 border-primary/50"
                : "border-transparent hover:bg-secondary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-[0.625rem] font-bold text-muted-foreground w-5">
                #{index + 1}
              </span>
              <img 
                src={token.img} 
                alt={token.sym} 
                className={cn(
                  "w-7 h-7 rounded-full transition-all",
                  selectedId === token.id ? "grayscale-0" : "grayscale hover:grayscale-0"
                )} 
              />
              <div>
                <div className="text-sm font-medium text-foreground">{token.name}</div>
                <div className="text-[0.625rem] font-bold text-muted-foreground uppercase">
                  {token.sym}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-light text-foreground">
                ${token.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={cn(
                "text-[0.625rem] font-semibold",
                token.chg >= 0 ? "text-positive" : "text-negative"
              )}>
                {token.chg > 0 ? '+' : ''}{token.chg?.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
