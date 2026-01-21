import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label, ReferenceLine } from 'recharts';
import { TokenChartPoint } from '@/lib/types';

interface Props {
  data: TokenChartPoint[];
  color?: string;
  isLoading?: boolean;
  spotPrice?: number | null;
}

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatSignedPct(value: number) {
  if (!Number.isFinite(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getTrendLabel(prices: number[]) {
  if (prices.length < 2) return 'flat';
  const window = prices.slice(-Math.min(5, prices.length));
  let ups = 0;
  let downs = 0;
  for (let i = 1; i < window.length; i += 1) {
    if (window[i] > window[i - 1]) ups += 1;
    if (window[i] < window[i - 1]) downs += 1;
  }
  if (ups > downs) return 'rising';
  if (downs > ups) return 'falling';
  return 'flat';
}

const SevenDayChart: React.FC<Props> = ({ data, color = '#EAB308', isLoading = false, spotPrice }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    // Observer for class changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 sm:h-80 w-full bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors duration-300">
        <p className="text-slate-500">N/A</p>
      </div>
    );
  }

  const prices = data.map(d => d.price);
  const min = Math.min(...prices, spotPrice || Infinity);
  const max = Math.max(...prices, spotPrice || -Infinity);
  // Add some buffer so the reference line isn't stuck at the very edge if it's the min/max
  const padding = (max - min) * 0.1;
  
  const first = prices[0];
  const last = prices[prices.length - 1];
  const changePct = first ? ((last - first) / first) * 100 : 0;
  const trend = getTrendLabel(prices);
  const summary = `7D change ${formatSignedPct(changePct)}, range ${formatUsd(min)}-${formatUsd(max)}, trend: ${trend}.`;

  // Calculate one tick per calendar day (stable + ordered)
  const seenDays = new Set<string>();
  const ticks: number[] = [];

  for (const point of data) {
    const date = new Date(point.timestamp);
    const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD

    if (!seenDays.has(dayKey)) {
      seenDays.add(dayKey);
      ticks.push(point.timestamp);
    }
  }
  
  const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'; // slate-800 : white
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const axisColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const gridColor = isDark ? '#1e293b' : '#f1f5f9'; // slate-800 : slate-100

  return (
    <div className="h-64 sm:h-80 w-full bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 flex flex-col">
      <div className="flex flex-col mb-4">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">7-Day Price Action</h3>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">{summary}</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 15, left: 15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.5} />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              ticks={ticks}
              tickFormatter={(ts) => new Date(ts).toLocaleDateString(undefined, { weekday: 'short' })}
              tick={{fontSize: 10, fill: textColor}}
              axisLine={{ stroke: axisColor }}
              tickLine={{ stroke: axisColor }}
              minTickGap={30}
              dy={10}
            >
              <Label value="Time (7 Days)" position="insideBottom" offset={-10} style={{ textAnchor: 'middle', fill: textColor, fontSize: '10px', fontWeight: 600 }} />
            </XAxis>
            <YAxis 
              domain={[min - padding, max + padding]} 
              tickFormatter={(val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              width={60}
              tick={{fontSize: 10, fill: textColor}}
              axisLine={false}
              tickLine={false}
            >
               <Label value="Price (USD)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: textColor, fontSize: '10px', fontWeight: 600 }} />
            </YAxis>
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Price']}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{ 
                backgroundColor: tooltipBg,
                borderRadius: '8px', 
                border: `1px solid ${tooltipBorder}`, 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: isDark ? '#f1f5f9' : '#0f172a'
              }}
              itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              animationDuration={1000}
            />
            {spotPrice && (
              <ReferenceLine 
                y={spotPrice} 
                stroke="#ef4444" 
                strokeDasharray="3 3"
                strokeWidth={2}
                strokeOpacity={0.8}
                isFront={true}
              >
                <Label 
                  value={`Spot: $${spotPrice.toFixed(2)}`} 
                  position="insideTopRight" 
                  fill={isDark ? '#ef4444' : '#dc2626'} 
                  fontSize={10}
                  fontWeight={600}
                />
              </ReferenceLine>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-2 pl-[60px]">
        <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center">
          Red dashed line indicates the reference Spot Gold Price.
        </p>
      </div>
    </div>
  );
};

export default SevenDayChart;