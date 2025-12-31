'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartPoint } from '@/types/gold';
import { cn } from '@/lib/utils';

interface TokenChartProps {
  tokenId: string | null;
}

export function TokenChart({ tokenId }: TokenChartProps) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenId) return;

    const fetchChart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tokens/${tokenId}/chart?days=7`);
        if (!response.ok) throw new Error('Failed to fetch chart data');
        const points = await response.json();
        
        if (!Array.isArray(points) || points.length < 2) {
          setData([]);
        } else {
          setData(points);
        }
      } catch (err) {
        console.error(err);
        setError('Market data temporarily unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [tokenId]);

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

  if (loading) {
    return (
      <div className="h-full w-full bg-card/40 border border-border/50 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
            Loading 7-Day Performance
          </span>
        </div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="h-full w-full bg-card/40 border border-border/50 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span className="text-xs font-medium">{error || 'No chart data available for this timeline'}</span>
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...data.map(p => p.price));
  const maxPrice = Math.max(...data.map(p => p.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-full w-full bg-card/40 border border-border/50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6 gold-glow">
        <div className="flex flex-col">
          <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Institutional 7-Day Performance
          </h3>
          <span className="text-xs text-muted-foreground">Deterministic Price Index (Rolling 7D)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Active Market Signal
          </span>
        </div>
      </div>

      <div className="h-[calc(100%-60px)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
