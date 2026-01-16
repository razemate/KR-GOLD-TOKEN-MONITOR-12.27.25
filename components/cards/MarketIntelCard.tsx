import React from 'react';
import { MarketIntelItem } from '@/lib/types';
import InfoTooltip from '@/components/ui/InfoTooltip';

interface Props {
  intelligence?: MarketIntelItem;
  tokenName?: string;
  tokenSymbol?: string;
  isLoading?: boolean;
}

const MarketIntelCard: React.FC<Props> = ({ intelligence, tokenName, tokenSymbol, isLoading = false }) => {
  if (isLoading || !intelligence) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-800 animate-pulse transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4 space-y-4">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-4" />
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2" />
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="space-y-3">
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
          </div>
          <div className="md:w-1/4 flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="h-12 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const sentimentColor = intelligence.sentimentLabel === 'Bullish' ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20' 
    : intelligence.sentimentLabel === 'Bearish' ? 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20' 
    : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50';

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-0 rounded-lg shadow-md flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Main Content (Left) */}
      <div className="md:w-3/4 p-4 sm:p-6 flex flex-col gap-4 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-1 flex items-center justify-between transition-colors duration-300">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">Market Intelligence</h3>
            {tokenName && (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider -mt-0.5">
                {tokenName} ({tokenSymbol?.toUpperCase()}) Diagnostic
              </p>
            )}
          </div>
          <InfoTooltip content="AI-generated institutional analysis synthesizing real-time market data, peg stability, and liquidity metrics." />
        </div>
        
        <div>
          <h3 className="text-gold-500 font-semibold text-lg leading-tight mb-1">{intelligence.headline}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
            {intelligence.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
           <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 transition-colors duration-300">
             <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-2 transition-colors duration-300">Evidence</h4>
             <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 transition-colors duration-300">
               {intelligence.evidenceBullets.map((e, i) => (
                 <li key={i}>{e}</li>
               ))}
             </ul>
           </div>
           
           <div className="flex flex-col gap-3">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <h4 className="text-xs font-semibold text-red-500 uppercase mb-1">Risk / Invalidation</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">{intelligence.risk}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <h4 className="text-xs font-semibold text-gold-500 uppercase mb-1">Watch Trigger</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">{intelligence.watch}</p>
              </div>
           </div>
        </div>
        
        <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[14px] text-slate-400 dark:text-slate-600 italic">
            Disclaimer: This dashboard is provided for informational and reference purposes only and does not constitute investment advice, an offer, or a solicitation. Katusa Research makes no representations or warranties regarding accuracy or completeness and accepts no responsibility for decisions made based on this information.
          </p>
        </div>
      </div>

      {/* Confidence Score Strip (Right) */}
      <div className="md:w-1/4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center transition-colors duration-300 rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
        <div className="text-center w-full">
          <div className={`inline-block px-4 py-1.5 rounded-full border text-sm font-bold ${sentimentColor} transition-colors duration-300`}>
            {intelligence.sentimentLabel}
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-slate-900 dark:text-white block transition-colors duration-300">{intelligence.confidence0to100}%</span>
            <div className="flex items-center justify-center mt-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Confidence Score</p>
              <InfoTooltip 
                content="AI's certainty level in this assessment based on the depth and quality of available market data." 
                position="right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelCard;
