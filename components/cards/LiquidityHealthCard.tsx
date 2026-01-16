import React from 'react';
import { DerivedMetrics } from '@/lib/types';
import InfoTooltip from '@/components/ui/InfoTooltip';

interface Props {
  metrics?: DerivedMetrics;
  isLoading?: boolean;
}

const LiquidityHealthCard: React.FC<Props> = ({ metrics, isLoading = false }) => {
  if (isLoading || !metrics) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300 animate-pulse">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-y-4 gap-x-2 items-end">
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { liquidityTurnover, liquidityTier } = metrics;
  
  let colorClass = 'text-red-600 dark:text-red-400';
  if (liquidityTier === 'DEEP') colorClass = 'text-green-600 dark:text-green-400';
  else if (liquidityTier === 'TRADABLE') colorClass = 'text-blue-600 dark:text-blue-400';

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div className="flex-1">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase transition-colors duration-300">Liquidity Health</h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            Indicates the ease of buying or selling the token without causing significant price impact.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-y-4 gap-x-2 items-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 pb-0.5 transition-colors duration-300">Turnover Rate</span>
          <span className={`font-mono font-bold text-right ${colorClass} transition-colors duration-300`}>{liquidityTurnover.toFixed(2)}%</span>
        </div>

        <div className="mt-2 mb-2">
           <p className="text-[10px] text-slate-400 dark:text-slate-500">Supports efficient entry and exit at scale</p>
        </div>

         <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">TIER</span>
           <span className={`text-sm font-bold ${colorClass} transition-colors duration-300`}>
            {liquidityTier}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Legend: Deep &gt;= 15%, Tradable &gt;= 5%, Thin &lt; 5%
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiquidityHealthCard;
