import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { GoldToken } from '@/types/gold';

interface MarketDistributionProps {
  tokens: GoldToken[];
}

const COLORS = [
  'hsl(43, 55%, 55%)',   // Gold primary
  'hsl(43, 45%, 45%)',   // Gold darker
  'hsl(43, 35%, 35%)',   // Gold muted
  'hsl(0, 0%, 30%)',     // Gray
  'hsl(0, 0%, 20%)',     // Dark gray
];

export function MarketDistribution({ tokens }: MarketDistributionProps) {
  const chartData = useMemo(() => {
    const totalCap = tokens.reduce((acc, t) => acc + (t.cap || 0), 0);
    return tokens.map((token) => ({
      name: token.sym,
      value: token.cap || 0,
      percentage: totalCap > 0 ? ((token.cap || 0) / totalCap * 100) : 0,
    }));
  }, [tokens]);

  if (tokens.length === 0) {
    return (
      <div className="bg-card border border-border rounded p-6">
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Loading distribution data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded p-6">
      <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase mb-4 tracking-wider">
        Market Cap Distribution
      </h3>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 6%)',
                border: '1px solid hsl(43, 55%, 55%, 0.3)',
                borderRadius: '4px',
                color: 'hsl(0, 0%, 85%)',
              }}
              formatter={(value: number, name: string) => [
                `$${(value / 1e9).toFixed(2)}B (${chartData.find(d => d.name === name)?.percentage.toFixed(1)}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[0.625rem] text-muted-foreground">
              {entry.name} ({entry.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
