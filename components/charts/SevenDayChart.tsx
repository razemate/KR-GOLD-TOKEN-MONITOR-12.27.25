import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label, ReferenceLine } from 'recharts';
import { TokenChartPoint } from '@/lib/types';

interface Props {
  data: TokenChartPoint[];
  color?: string;
  isLoading?: boolean;
  spotPrice?: number | null;
  rangeLabel?: string;
  seriesType?: 'price' | 'marketCap';
}

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatUsdCompact(value: number) {
  return `$${value.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })}`;
}

function formatSignedPct(value: number) {
  if (!Number.isFinite(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getRangeText(rangeLabel: string): { title: string; sentence: string } {
  const normalized = rangeLabel.trim().toUpperCase();
  switch (normalized) {
    case '24H':
      return { title: '24-Hour', sentence: '24-hour' };
    case '7D':
      return { title: '7-Day', sentence: '7-day' };
    case '1M':
      return { title: '1-Month', sentence: '1-month' };
    case '3M':
      return { title: '3-Month', sentence: '3-month' };
    case 'YTD':
      return { title: 'Year-to-Date', sentence: 'year-to-date' };
    case '1Y':
      return { title: '1-Year', sentence: '1-year' };
    default:
      return { title: rangeLabel, sentence: rangeLabel.toLowerCase() };
  }
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

function buildTicks(data: TokenChartPoint[], maxTicks = 7): number[] {
  if (data.length === 0) return [];
  if (data.length <= maxTicks) {
    return data.map(point => point.timestamp);
  }

  const step = (data.length - 1) / (maxTicks - 1);
  const ticks: number[] = [];

  for (let i = 0; i < maxTicks; i += 1) {
    const index = Math.min(Math.round(i * step), data.length - 1);
    ticks.push(data[index].timestamp);
  }

  return Array.from(new Set(ticks)).sort((a, b) => a - b);
}

function formatXAxisTick(ts: number, spanMs: number) {
  const oneDay = 24 * 60 * 60 * 1000;

  if (spanMs <= oneDay * 2) {
    return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric' });
  }
  if (spanMs <= oneDay * 14) {
    return new Date(ts).toLocaleDateString(undefined, { weekday: 'short' });
  }
  if (spanMs <= oneDay * 120) {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  if (spanMs <= oneDay * 400) {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short' });
  }

  return new Date(ts).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

const SevenDayChart: React.FC<Props> = ({
  data,
  color = '#EAB308',
  isLoading = false,
  spotPrice,
  rangeLabel = '7D',
  seriesType = 'price',
}) => {
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
      <div className="h-[17.5rem] sm:h-[21.5rem] w-full bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[17.5rem] sm:h-[21.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors duration-300">
        <p className="text-slate-700">N/A</p>
      </div>
    );
  }

  const prices = data.map(d => d.price);
  const showSpotLine = seriesType === 'price';
  const hasSpotPrice = showSpotLine && typeof spotPrice === 'number' && Number.isFinite(spotPrice);
  const min = Math.min(...prices, hasSpotPrice ? spotPrice : Infinity);
  const max = Math.max(...prices, hasSpotPrice ? spotPrice : -Infinity);
  // Add some buffer so the reference line isn't stuck at the very edge if it's the min/max
  const padding = max === min ? Math.max(Math.abs(max) * 0.01, 1) : (max - min) * 0.1;
  
  const first = prices[0];
  const last = prices[prices.length - 1];
  const changePct = first ? ((last - first) / first) * 100 : 0;
  const trend = getTrendLabel(prices);
  const rangeText = getRangeText(rangeLabel);
  const valueLabel = seriesType === 'marketCap' ? 'Market Cap' : 'Price';
  const yAxisLabel = `${valueLabel} (USD)`;
  const chartTitle = `${rangeText.title} ${valueLabel} Action`;
  const summary = `${rangeText.sentence} change ${formatSignedPct(changePct)}, range ${formatUsd(min)}-${formatUsd(max)}, trend: ${trend}.`;
  const ticks = buildTicks(data, 7);
  const spanMs = Math.max(0, data[data.length - 1].timestamp - data[0].timestamp);
  
  const textColor = isDark ? '#cbd5e1' : '#334155'; // slate-300 : slate-700
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'; // slate-800 : white
  const tooltipBorder = isDark ? '#475569' : '#94a3b8'; // slate-600 : slate-400
  const axisColor = isDark ? '#64748b' : '#94a3b8'; // slate-500 : slate-400
  const gridColor = isDark ? '#475569' : '#cbd5e1'; // slate-600 : slate-300

  return (
    <div className="h-[17.5rem] sm:h-[21.5rem] w-full bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 flex flex-col">
      <div className="flex flex-col mb-2">
        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white uppercase tracking-widest transition-colors duration-300">{chartTitle}</h3>
        <p className="text-[15px] text-slate-700 dark:text-slate-300 mt-1">{summary}</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 2, right: 8, left: 8, bottom: 28 }}>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke={gridColor}
              strokeDasharray="0"
              strokeWidth={1}
              opacity={0.85}
            />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              ticks={ticks}
              tickFormatter={(ts) => formatXAxisTick(ts, spanMs)}
              tick={{fontSize: 12, fill: textColor}}
              axisLine={{ stroke: axisColor }}
              tickLine={{ stroke: axisColor }}
              minTickGap={30}
              dy={2}
            >
              <Label value={`Time (${rangeText.title})`} position="bottom" offset={6} style={{ textAnchor: 'middle', fill: textColor, fontSize: '12px', fontWeight: 600 }} />
            </XAxis>
            <YAxis 
              domain={[min - padding, max + padding]} 
              tickCount={7}
              tickFormatter={(val: number) => seriesType === 'marketCap'
                ? formatUsdCompact(val)
                : val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              }
              width={60}
              tick={{fontSize: 12, fill: textColor}}
              axisLine={false}
              tickLine={false}
            >
               <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: textColor, fontSize: '12px', fontWeight: 600 }} />
            </YAxis>
            <Tooltip 
              formatter={(value: number) => [formatUsd(value), valueLabel]}
              labelFormatter={(label) => new Date(label).toLocaleString()}
              contentStyle={{ 
                backgroundColor: tooltipBg,
                borderRadius: '8px', 
                border: `1px solid ${tooltipBorder}`, 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: isDark ? '#f1f5f9' : '#0f172a',
                fontSize: '14px'
              }}
              itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '14px' }}
              labelStyle={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '14px' }}
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
            {hasSpotPrice && (
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
                  fontSize={12}
                  fontWeight={600}
                />
              </ReferenceLine>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showSpotLine && (
        <div className="mt-0 pt-0 pl-[60px]">
          <p className="text-[13px] text-slate-700 dark:text-slate-300 text-center">
            Red dashed line indicates the reference Spot Gold Price.
          </p>
        </div>
      )}
    </div>
  );
};

export default SevenDayChart;
