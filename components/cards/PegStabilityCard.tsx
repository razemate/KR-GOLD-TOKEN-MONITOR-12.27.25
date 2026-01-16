import React from 'react';
import { DerivedMetrics } from '@/lib/types';
import InfoTooltip from '@/components/ui/InfoTooltip';

interface Props {
  metrics?: DerivedMetrics;
  isLoading?: boolean;
}

const PegStabilityCard: React.FC<Props> = ({ metrics, isLoading = false }) => {
  if (isLoading || !metrics) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300 animate-pulse">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-y-4 gap-x-2 items-end">
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { pegDeviation, pegStatus } = metrics;
  
  let statusColorClass = '';
  if (pegStatus === 'TIGHT') statusColorClass = 'bg-green-500 text-white';
  else if (pegStatus === 'NORMAL') statusColorClass = 'bg-blue-500 text-white';
  else statusColorClass = 'bg-red-500 text-white';

  const devValueColor = pegDeviation === null || pegDeviation === undefined
    ? 'text-slate-400'
    : Math.abs(pegDeviation) <= 0.20 
      ? 'text-green-600 dark:text-green-400' 
      : Math.abs(pegDeviation) <= 0.75 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div className="flex-1">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase transition-colors duration-300">Peg Stability</h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            Measures how closely the token price tracks the spot gold price. Lower deviation indicates a healthier peg.
          </p>
        </div>
        
        <div className="grid grid-cols-[1fr_auto] gap-y-4 gap-x-2 items-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 pb-0.5 transition-colors duration-300">Deviation</span>
          <span className={`font-mono font-bold text-right ${devValueColor} transition-colors duration-300`}>
            {pegDeviation !== null && pegDeviation !== undefined ? `${pegDeviation > 0 ? '+' : ''}${pegDeviation.toFixed(3)}%` : 'N/A'}
          </span>
        </div>
        
        <div className="mt-2 mb-2">
           <p className="text-[10px] text-slate-400 dark:text-slate-500">Within +/-0.20% target peg range</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">STATUS</span>
          <span className={`text-xs font-bold px-2 py-1 rounded shadow-sm ${statusColorClass}`}>
            {pegStatus}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Legend: Tight &lt;= 0.20%, Normal &lt;= 0.75%, Stressed &gt; 0.75%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PegStabilityCard;
