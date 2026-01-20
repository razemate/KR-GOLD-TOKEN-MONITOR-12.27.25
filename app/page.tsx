"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import TokenList from "@/components/sidebar/TokenList";
import SevenDayChart from "@/components/charts/SevenDayChart";
import PegStabilityCard from "@/components/cards/PegStabilityCard";
import LiquidityHealthCard from "@/components/cards/LiquidityHealthCard";
import BackingScaleCard from "@/components/cards/BackingScaleCard";
import RedemptionTrustCard from "@/components/cards/RedemptionTrustCard";
import MarketIntelCard from "@/components/cards/MarketIntelCard";
import { SnapshotResponse } from "@/lib/types";

export default function Dashboard() {
  const [snapshot, setSnapshot] = useState<SnapshotResponse | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Theme toggle function
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', !isDark);
    }
  };

  // Initialize theme based on system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Fetch Snapshot Logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function fetchSnapshot() {
      try {
        if (!snapshot) setLoading(true);

        setError(null);

        const startTime = Date.now();
        const res = await fetch("/api/snapshot");
        const duration = Date.now() - startTime;
        console.log(`Snapshot fetched in ${duration}ms`);

        if (!res.ok) throw new Error("Failed to load snapshot");
        const data: SnapshotResponse = await res.json();
        setSnapshot(data);

        // Default selection
        if (!selectedTokenId && data.tokens.length > 0) {
          setSelectedTokenId(data.tokens[0].token.id);
        }

        // Schedule next fetch aligned to the clock (e.g., 12:00, 12:05, 12:10...)
        const intervalSeconds = data.meta.refreshInterval || 300;
        const intervalMs = intervalSeconds * 1000;
        const now = Date.now();
        const nextTick = Math.ceil(now / intervalMs) * intervalMs;
        let delay = nextTick - now;

        // If the delay is very short (less than 5 seconds), it might be due to 
        // minor clock drift or the fetch itself finishing right at the tick.
        // In that case, schedule for the next interval instead.
        if (delay < 5000) {
          delay += intervalMs;
        }

        timeoutId = setTimeout(fetchSnapshot, delay);
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Unknown error";
        if (!snapshot) setError(message);
        // On error, retry in 30 seconds
        timeoutId = setTimeout(fetchSnapshot, 30000);
      } finally {
        setLoading(false);
      }
    }

    fetchSnapshot();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Run once on mount, recursive setTimeout handles the rest

  // Derived State
  const tokens = useMemo(() => snapshot?.tokens || [], [snapshot]);
  const activeTokenId = selectedTokenId || tokens[0]?.token?.id;
  const selectedSnapshot = tokens.find(t => t.token.id === activeTokenId) || tokens[0];
  const chartData = selectedSnapshot?.chart || [];
  const spotSourceLabel = snapshot?.meta?.goldSpotSource || 'Source unavailable';

  const handleTokenSelect = (id: string) => {
    setSelectedTokenId(id);
    setIsMenuOpen(false);
  };

  const isLoading = loading && !snapshot;

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Top Header (Inlined) - Renders Immediately */}
      <header className="w-full bg-slate-950 border-b border-slate-800 py-4 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
            <Image
              src="/images/logo-white.png" // Blueprint §8 requires logo.svg, but using png as fallback
              alt="Katusa Research Logo"
              fill
              sizes="(max-width: 768px) 32px, 40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg lg:text-xl font-semibold text-white tracking-tight leading-tight uppercase">
              Gold Token Monitor
            </h1>
            <p className="text-[10px] lg:text-xs font-semibold text-gold-500 uppercase tracking-[0.2em] leading-none mt-1">
              Katusa Research
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          {/* Blueprint Step 5: Gold Spot Price Display */}
          <div className="hidden sm:flex flex-col items-end">
            <span
              className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider"
              title={spotSourceLabel}
            >
              Gold Spot
            </span>
            <span className="text-sm lg:text-lg font-bold text-white leading-none mt-0.5">
              {snapshot?.meta?.goldSpotUsd 
                ? `$${snapshot.meta.goldSpotUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                : 'N/A'
              }
            </span>
          </div>

          <button
            onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-300"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5 lg:w-6 lg:h-6" /> : <Moon className="w-5 h-5 lg:w-6 lg:h-6" />}
        </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar - Renders shell immediately */}
        <div className={`
          fixed lg:static top-[73px] lg:top-0 bottom-0 left-0 z-40 w-[85vw] sm:w-80 lg:w-72 xl:w-80 transform transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 lg:translate-x-0 border-r border-slate-200 dark:border-slate-800
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <TokenList
            tokens={tokens.map(t => t.token)}
            selectedId={activeTokenId}
            onSelect={handleTokenSelect}
            isLoading={isLoading}
          />
        </div>

        {/* Main Content - Renders shell immediately */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-8 bg-white dark:bg-slate-950 transition-colors duration-300">
          {error && !snapshot ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-semibold text-red-500 mb-4">Connection Error</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            </div>
          ) : (
            <>
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-6 gap-4 transition-colors duration-300">
            <div className="flex items-center">
              {isLoading || !selectedSnapshot ? (
                <>
                  <div className="w-10 h-10 lg:w-14 lg:h-14 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
                  <div className="flex flex-col justify-center ml-3 lg:ml-5">
                    <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-10 h-10 lg:w-14 lg:h-14 flex-shrink-0">
                    <img
                      src={selectedSnapshot.token.image}
                      alt={`${selectedSnapshot.token.name} Logo`}
                      className="object-contain w-full h-full rounded-full shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col justify-center ml-3 lg:ml-5">
                    <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                      {selectedSnapshot.token.name} <span className="text-slate-400 dark:text-slate-500 font-normal ml-2 text-xs lg:text-sm">({selectedSnapshot.token.symbol.toUpperCase()})</span>
                    </h1>
                  </div>
                </>
              )}
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              {isLoading || !selectedSnapshot ? (
                <div className="space-y-2">
                  <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse sm:ml-auto" />
                  <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse sm:ml-auto" />
                </div>
              ) : selectedSnapshot ? (
                <div className="flex flex-col items-start sm:items-end">
                    <div className="text-2xl lg:text-4xl font-bold tracking-tight text-black dark:text-white transition-colors duration-300">
                      ${selectedSnapshot.token.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className={`text-sm lg:text-lg font-bold ml-2 opacity-90 ${
                        selectedSnapshot.token.price_change_percentage_24h >= 0 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        ({selectedSnapshot.token.price_change_percentage_24h >= 0 ? '+' : ''}{selectedSnapshot.token.price_change_percentage_24h.toFixed(2)}% 24h)
                      </span>
                    </div>
                  <div className="text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">
                      Market Cap: <span className="text-black dark:text-white">${(selectedSnapshot.token.market_cap / 1000000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M</span>
                    </div>
                </div>
              ) : null}
            </div>
          </header>

          {/* Chart Section */}
          <section>
            <SevenDayChart data={chartData} isLoading={isLoading} />
          </section>

          {/* Five-Card Grid Section (Blueprint §18) */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <PegStabilityCard metrics={selectedSnapshot?.metrics} isLoading={isLoading || !selectedSnapshot} />
            <LiquidityHealthCard metrics={selectedSnapshot?.metrics} isLoading={isLoading || !selectedSnapshot} />
            <BackingScaleCard metrics={selectedSnapshot?.metrics} isLoading={isLoading || !selectedSnapshot} />
            <RedemptionTrustCard symbol={selectedSnapshot?.token?.symbol} isLoading={isLoading || !selectedSnapshot} />
            <div className="md:col-span-2 xl:col-span-4">
              <MarketIntelCard 
                intelligence={selectedSnapshot?.intelligence} 
                tokenName={selectedSnapshot?.token?.name}
                tokenSymbol={selectedSnapshot?.token?.symbol}
                isLoading={isLoading || !selectedSnapshot} 
              />
            </div>
          </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
