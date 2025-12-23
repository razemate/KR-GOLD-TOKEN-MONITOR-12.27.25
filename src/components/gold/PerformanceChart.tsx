import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { GoldToken } from '@/types/gold';

interface PerformanceChartProps {
  token: GoldToken | null;
}

export function PerformanceChart({ token }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!token) return [];

    const spark = token.spark || [];
    const dataPoints = spark.length > 0 ? spark : [token.price];

    // Sample to ~100 points for performance
    const pts = 100;
    const step = Math.max(1, Math.ceil(dataPoints.length / pts));
    const sampledData = dataPoints.filter((_, i) => i % step === 0);

    return sampledData.map((price, i) => {
      const total = sampledData.length;
      const hr = Math.floor((total - 1 - i) * (168 / (total || 1))); // 168h = 7d
      const label = hr === 0 ? 'NOW' : hr >= 24 ? `-${Math.floor(hr / 24)}d` : `-${hr}h`;
      return {
        time: label,
        price: price,
      };
    });
  }, [token]);

  if (!token || chartData.length === 0) {
    return (
      <div className="bg-card border border-border rounded p-6">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Select a token to view performance
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const padding = (maxPrice - minPrice) * 0.1 || 10;

  return (
    <div className="bg-card border border-border rounded p-6">
      <h3 className="text-xs font-medium text-foreground uppercase mb-6 tracking-wide">
        {token.name} Performance (7D)
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(43, 55%, 55%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(43, 55%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0, 0%, 45%)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0, 0%, 45%)', fontSize: 11 }}
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 6%)',
                border: '1px solid hsl(43, 55%, 55%, 0.3)',
                borderRadius: '4px',
                color: 'hsl(0, 0%, 85%)',
              }}
              labelStyle={{ color: 'hsl(43, 55%, 55%)' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(43, 55%, 55%)"
              strokeWidth={1.5}
              fill="url(#goldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
