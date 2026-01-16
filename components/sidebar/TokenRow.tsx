import React from 'react';
import { TokenMarket } from '@/lib/types';

interface Props {
  token: TokenMarket;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const TokenRow: React.FC<Props> = ({ token, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(token.id)}
      className={`w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 transition-all duration-200 hover:bg-white dark:hover:bg-slate-800/50 ${
        isSelected 
          ? 'bg-white dark:bg-slate-800 border-l-4 border-l-gold-500 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors duration-300">
          <img 
            src={token.image} 
            alt={token.name} 
            className="w-5 h-5 rounded-full"
          />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300 truncate">
            {token.symbol.toUpperCase()}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate transition-colors duration-300">
            {token.name}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
          ${token.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-xs font-bold ${token.price_change_percentage_24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors duration-300`}>
          {token.price_change_percentage_24h >= 0 ? '+' : ''}{token.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </button>
  );
};

export default TokenRow;
