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
import { SnapshotResponse, TokenChartPoint } from "@/lib/types";
import { CHART_RANGES, ChartRangeKey, getChartRangeLabel } from "@/lib/chart-range";

type ChartMetric = "price" | "marketCap";

const CHART_METRICS: { key: ChartMetric; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "marketCap", label: "Market Cap" },
];

export default function Dashboard() {
  const [snapshot, setSnapshot] = useState<SnapshotResponse | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>("price");
  const [selectedRange, setSelectedRange] = useState<ChartRangeKey>('7d');
  const [rangeChartData, setRangeChartData] = useState<TokenChartPoint[] | null>(null);
  const [rangeChartLoading, setRangeChartLoading] = useState(false);
  const [rangeChartError, setRangeChartError] = useState<string | null>(null);

  // Theme toggle function
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', newIsDark);
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }
  };

  // Initialize theme based on local storage (default to light)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const shouldBeDark = storedTheme === 'dark';
      setIsDark(shouldBeDark);
      document.documentElement.classList.toggle('dark', shouldBeDark);
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
        const res = await fetch("/api/snapshot", { cache: "no-store" });
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
  const selectedRangeLabel = getChartRangeLabel(selectedRange);
  const selectedMetricLabel = selectedMetric === "price" ? "price" : "market cap";
  const shouldFetchChart = Boolean(activeTokenId) && !(selectedMetric === "price" && selectedRange === "7d");
  const isLoading = loading && !snapshot;

  useEffect(() => {
    if (!activeTokenId) {
      setRangeChartData([]);
      setRangeChartLoading(false);
      setRangeChartError(null);
      return;
    }

    if (!shouldFetchChart) {
      setRangeChartData(null);
      setRangeChartLoading(false);
      setRangeChartError(null);
      return;
    }

    const controller = new AbortController();

    async function fetchRangeChart() {
      try {
        setRangeChartLoading(true);
        setRangeChartError(null);
        setRangeChartData(null);

        const params = new URLSearchParams({
          tokenId: activeTokenId,
          range: selectedRange,
          metric: selectedMetric,
        });
        const response = await fetch(`/api/chart?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load ${selectedRangeLabel} ${selectedMetricLabel} chart`);
        }

        const payload = (await response.json()) as { data?: TokenChartPoint[] };
        setRangeChartData(Array.isArray(payload.data) ? payload.data : []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
        const message = err instanceof Error ? err.message : 'Failed to load chart';
        setRangeChartError(message);
        setRangeChartData([]);
      } finally {
        if (!controller.signal.aborted) {
          setRangeChartLoading(false);
        }
      }
    }

    fetchRangeChart();

    return () => controller.abort();
  }, [activeTokenId, selectedRange, selectedMetric, selectedRangeLabel, selectedMetricLabel, shouldFetchChart]);

  const displayedChartData = useMemo(() => {
    if (!shouldFetchChart) return chartData;
    if (rangeChartData && rangeChartData.length > 0) return rangeChartData;
    if (rangeChartError && selectedMetric === "price") return chartData;
    return rangeChartData || [];
  }, [shouldFetchChart, chartData, rangeChartData, rangeChartError, selectedMetric]);

  const chartIsLoading = isLoading || (shouldFetchChart && rangeChartLoading);

  const handleTokenSelect = (id: string) => {
    setSelectedTokenId(id);
    setIsMenuOpen(false);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Top Header (Inlined) - Renders Immediately */}
      <header className="w-full bg-slate-950 border-b border-slate-800 py-4 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -ml-2 text-slate-600 hover:text-white transition-colors"
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
              className="text-[10px] lg:text-xs font-semibold text-slate-600 uppercase tracking-wider"
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
          className="p-2 rounded-full hover:bg-slate-800 text-slate-600 hover:text-white transition-all duration-300"
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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar - Renders shell immediately */}
        <div className={`
          fixed md:static top-[73px] lg:top-0 bottom-0 left-0 z-40 w-[85vw] sm:w-80 lg:w-72 xl:w-80 transform transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 md:translate-x-0 border-r border-slate-200 dark:border-slate-800
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
              <p className="text-slate-700 dark:text-slate-300 mb-6">{error}</p>
            </div>
          ) : (
            <>
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-3 gap-4 transition-colors duration-300">
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
                      {selectedSnapshot.token.name} <span className="text-slate-600 dark:text-slate-300 font-normal ml-2 text-xs lg:text-sm">({selectedSnapshot.token.symbol.toUpperCase()})</span>
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
                  <div className="text-sm lg:text-base font-medium text-slate-700 dark:text-slate-300 mt-1 transition-colors duration-300">
                      Market Cap: <span className="text-black dark:text-white">${(selectedSnapshot.token.market_cap / 1000000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M</span>
                    </div>
                </div>
              ) : null}
            </div>
          </header>

          {/* Chart Section */}
          <section>
            <div className="-mt-4 lg:-mt-6 mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-200/90 dark:border-slate-700 dark:bg-slate-800 p-1">
                {CHART_METRICS.map((metric) => {
                  const isActive = selectedMetric === metric.key;
                  return (
                    <button
                      key={metric.key}
                      type="button"
                      onClick={() => {
                        setSelectedMetric(metric.key);
                        setSelectedRange("7d");
                      }}
                      className={`px-3.5 py-1 rounded-full border text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-gold-500 border-amber-300/90 text-slate-950 shadow-sm"
                          : "border-transparent text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      aria-pressed={isActive}
                    >
                      {metric.label}
                    </button>
                  );
                })}
              </div>

              <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-300 bg-slate-200/90 dark:border-slate-700 dark:bg-slate-800 p-1">
                {CHART_RANGES.map((range) => {
                  const isActive = selectedRange === range.key;
                  return (
                    <button
                      key={range.key}
                      type="button"
                      onClick={() => setSelectedRange(range.key)}
                      className={`px-3.5 py-1 rounded-full border text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gold-500 border-amber-300/90 text-slate-950 shadow-sm'
                          : 'border-transparent text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      aria-pressed={isActive}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {rangeChartError && shouldFetchChart && (
              <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">
                {selectedMetric === "price"
                  ? `Unable to load ${selectedRangeLabel} price chart data. Showing 7D fallback.`
                  : `Unable to load ${selectedRangeLabel} market cap chart data.`}
              </p>
            )}

            <SevenDayChart 
              data={displayedChartData} 
              isLoading={chartIsLoading} 
              spotPrice={selectedMetric === "price" ? snapshot?.meta?.goldSpotUsd : null}
              rangeLabel={selectedRangeLabel}
              seriesType={selectedMetric}
            />
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
