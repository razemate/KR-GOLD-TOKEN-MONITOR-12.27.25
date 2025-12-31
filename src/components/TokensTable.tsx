'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Token } from '@/types/gold';

interface TokensTableProps {
  tokens: Token[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function TokensTable({ tokens, selectedId, onSelect, loading }: TokensTableProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null) return '---';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCompact = (value: number | null) => {
    if (value === null) return '---';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return '---';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  if (loading && tokens.length === 0) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-muted/20 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <h2 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest gold-glow">
          Active Index (Top 10)
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">Token</th>
              <th className="px-6 py-3 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest text-right">Price</th>
              <th className="px-6 py-3 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest text-right">24h %</th>
              <th className="px-6 py-3 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest text-right hidden lg:table-cell">Market Cap</th>
              <th className="px-6 py-3 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest text-right hidden xl:table-cell">Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr
                key={token.id}
                onClick={() => onSelect(token.id)}
                className={cn(
                  "group cursor-pointer transition-all duration-200 border-b border-border/50",
                  selectedId === token.id 
                    ? "bg-primary/10 border-primary/30" 
                    : "hover:bg-secondary/30"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[0.625rem] font-bold text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-none">{token.name}</span>
                      <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium">
                    {formatCurrency(token.priceUsd)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={cn(
                    "text-sm font-medium",
                    (token.change24hPct || 0) >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {formatPercent(token.change24hPct)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right hidden lg:table-cell">
                  <span className="text-sm font-medium">
                    {formatCompact(token.marketCapUsd)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right hidden xl:table-cell">
                  <span className="text-sm font-medium">
                    {formatCompact(token.volume24hUsd)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
