import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts';
import { TokenChartPoint } from '@/lib/types';

interface Props {
  data: TokenChartPoint[];
  color?: string;
  isLoading?: boolean;
}

const SevenDayChart: React.FC<Props> = ({ data, color = '#EAB308', isLoading = false }) => {
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
      <div className="h-64 sm:h-80 w-full bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="w-full h-[85%] bg-slate-50 dark:bg-slate-950/50 rounded-lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors duration-300">
        <p className="text-slate-500">Chart data unavailable</p>
      </div>
    );
  }

  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const padding = (max - min) * 0.1;

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
        <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">Short-term price action shows higher highs into week close, broadly tracking spot gold.</p>
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
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-2 pl-[60px]">
        <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center">
          Price fluctuations remain within the typical weekly range for tokenized gold.
        </p>
      </div>
    </div>
  );
};

export default SevenDayChart;
