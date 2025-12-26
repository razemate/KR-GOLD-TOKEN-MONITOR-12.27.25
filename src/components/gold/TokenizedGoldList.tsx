'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokenizedGoldData } from '@/hooks/useTokenizedGoldData';
import { Skeleton } from '@/components/ui/skeleton';

const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatMarketCap = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

const TokenizedGoldList = () => {
  const { tokens, loading, error } = useTokenizedGoldData();

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Tokenized Gold Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Top Tokenized Gold Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-20 ml-auto" />
                  <Skeleton className="h-3 w-24 ml-auto" />
                </div>
              </div>
            ))
          ) : tokens.length > 0 ? (
            tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-muted-foreground">{token.sym}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${formatNumber(token.price)}</div>
                  <div className="text-sm text-muted-foreground">
                    MCap: {formatMarketCap(token.cap)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No tokenized gold tokens found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenizedGoldList;