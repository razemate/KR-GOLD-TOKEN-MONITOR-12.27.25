'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Token } from '@/types/gold';
import { cn } from '@/lib/utils';

interface TokenPerformanceChartProps {
  token: Token | null;
  chartData: { t: number; price: number }[] | null;
  loading?: boolean;
}

export function TokenPerformanceChart({ token, chartData, loading }: TokenPerformanceChartProps) {
  if (loading) {
    return (
      <div className="h-full w-full bg-card/40 border border-border/50 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
            Loading Performance Data
          </span>
        </div>
      </div>
    );
  }

  if (!token || !chartData || chartData.length === 0) {
    return (
      <div className="h-full w-full bg-card/40 border border-border/50 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span className="text-xs font-medium">No chart data available</span>
        </div>
      </div>
    );
  }

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltipDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const minPrice = Math.min(...chartData.map(p => p.price));
  const maxPrice = Math.max(...chartData.map(p => p.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-full w-full bg-card/40 border border-border/50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <img src={token.image} alt={token.name} className="w-8 h-8 rounded-full border-2 border-primary/20 p-0.5" />
            <h2 className="text-xl font-bold tracking-tight">{token.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight">
              ${token.priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                Live
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Performance
          </span>
        </div>
      </div>

      <div className="h-[calc(100%-100px)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="t"
              domain={['auto', 'auto']}
              tickFormatter={formatXAxis}
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              hide
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                      <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        {formatTooltipDate(payload[0].payload.t)}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}