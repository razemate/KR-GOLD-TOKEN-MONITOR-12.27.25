import React from 'react';
import { TokenMarket } from '@/lib/types';
import TokenRow from './TokenRow';

interface Props {
  tokens: TokenMarket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

const TokenList: React.FC<Props> = ({ tokens, selectedId, onSelect, isLoading = false }) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto flex flex-col transition-colors duration-300 pt-6">
      <div className="flex-1">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800 rounded ml-auto" />
              </div>
            </div>
          ))
        ) : (
          tokens.map((token) => (
            <TokenRow
              key={token.id}
              token={token}
              isSelected={selectedId === token.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TokenList;
