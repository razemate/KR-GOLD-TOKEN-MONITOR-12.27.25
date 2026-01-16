import React from 'react';
import { DerivedMetrics } from '@/lib/types';
import InfoTooltip from '@/components/ui/InfoTooltip';

interface Props {
  metrics?: DerivedMetrics;
  isLoading?: boolean;
}

const BackingScaleCard: React.FC<Props> = ({ metrics, isLoading = false }) => {
  if (isLoading || !metrics) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300 animate-pulse">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-y-4 gap-x-2 items-end">
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { estGoldOz, estGoldTonnes, backingTier } = metrics;
  
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div className="flex-1">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase transition-colors duration-300">Backing & Supply</h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            Represents the total physical gold backing and circulating supply. Higher tonnage implies greater scale.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-y-2 gap-x-2 items-end">
          <span className="text-xs text-slate-500 dark:text-slate-400 pb-0.5 transition-colors duration-300">Est. Physical Ounces</span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-right transition-colors duration-300">
            {estGoldOz.toLocaleString(undefined, { maximumFractionDigits: 0 })} oz
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 pb-0.5 transition-colors duration-300">Circulating Supply</span>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-right transition-colors duration-300">
            {metrics.circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        
        <div className="mt-2 mb-2">
           <p className="text-[10px] text-slate-400 dark:text-slate-500">Physical backing comparable to mid-size gold funds</p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">TONNAGE ({backingTier})</span>
          <span className="text-sm font-bold text-gold-500">
            ≈ {estGoldTonnes.toFixed(2)} Tonnes
          </span>
        </div>
      </div>
    </div>
  );
};

export default BackingScaleCard;
