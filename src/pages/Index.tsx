import { useMemo } from 'react';
import { useGoldData } from '@/hooks/useGoldData';
import {
  Header,
  TokenList,
  PerformanceChart,
  MarketIntel,
  AssetSpecs,
  MarketDistribution,
  TokenizedGoldList,
} from '@/components/gold';

const Index = () => {
  const {
    tokens,
    goldPrice,
    aggregateCap,
    selectedTokenId,
    setSelectedTokenId,
    lastUpdated,
    error,
    syncStatus,
  } = useGoldData();

  const selectedToken = useMemo(
    () => tokens.find((t) => t.id === selectedTokenId) || null,
    [tokens, selectedTokenId]
  );

  if (error && tokens.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-destructive/50 p-6 rounded">
          <h2 className="text-xl font-bold text-destructive mb-2">Connection Error</h2>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <p className="text-xs text-muted-foreground uppercase">Data will refresh automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <Header goldPrice={goldPrice} aggregateCap={aggregateCap} lastUpdated={lastUpdated} syncStatus={syncStatus} />
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <aside className="lg:col-span-4 xl:col-span-3">
            <TokenList tokens={tokens} selectedId={selectedTokenId} onSelect={setSelectedTokenId} lastUpdated={lastUpdated} />
          </aside>
          <section className="lg:col-span-8 xl:col-span-6 flex flex-col gap-6">
            <PerformanceChart token={selectedToken} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MarketIntel token={selectedToken} goldPrice={goldPrice} />
              <AssetSpecs token={selectedToken} />
            </div>
            <TokenizedGoldList />
          </section>
          <aside className="lg:col-span-12 xl:col-span-3">
            <MarketDistribution tokens={tokens} />
          </aside>
        </main>
        <footer className="mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-between gap-8">
          <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest max-w-2xl">
            Institutional data via CoinGecko. Not financial advice.
          </p>
          <div className="flex gap-8 text-[0.625rem] text-muted-foreground font-bold uppercase">
            <span>Auto-Refresh: 5min</span>
            <span>Tier: L1</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
