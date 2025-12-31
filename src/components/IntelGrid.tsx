'use client';

import React, { useState, useEffect } from 'react';
import { Token } from '@/types/gold';
import { cn } from '@/lib/utils';

interface IntelGridProps {
  token: Token | null;
  loading?: boolean;
}

interface AISentinelResponse {
  sentiment: string;
  explanation: string;
  generatedAt: string;
}

// Peg efficiency calculation
const calculatePegEfficiency = (token: Token | null) => {
  if (!token) return { deviation: 0, status: 'N/A', text: 'No data' };

  // Using a standard gold price of $2650 per ounce as reference
  const SPOT_GOLD_PRICE = 2650; // USD
  const pegDeviation = ((token.priceUsd - SPOT_GOLD_PRICE) / SPOT_GOLD_PRICE) * 100;
  const pegDeviationText = pegDeviation >= 0
    ? `${pegDeviation.toFixed(2)}% Premium`
    : `${Math.abs(pegDeviation).toFixed(2)}% Discount`;
  const isPegStable = Math.abs(pegDeviation) < 1;

  return {
    deviation: pegDeviation,
    status: isPegStable ? 'STABLE' : 'UNSTABLE',
    text: pegDeviationText
  };
};

// Asset depth calculation (1 token = 1 Troy Oz, 32,150.7 oz in a tonne)
const calculateAssetDepth = (token: Token | null) => {
  if (!token || !token.circulatingSupply) return '0.00';
  return (token.circulatingSupply / 32150.7).toFixed(2);
};

// Liquidity health calculation
const calculateLiquidityHealth = (token: Token | null) => {
  if (!token || !token.marketCapUsd || !token.volume24hUsd) return { ratio: '0.00', label: 'ILLIQUID' };

  const turnoverRatio = (token.volume24hUsd / token.marketCapUsd) * 100;
  let label = 'ILLIQUID';
  if (turnoverRatio > 10) label = 'HEALTHY';
  else if (turnoverRatio > 5) label = 'MODERATE';

  return {
    ratio: turnoverRatio.toFixed(2),
    label
  };
};

// Performance & Range calculation
const calculatePerformanceRange = (token: Token | null) => {
  if (!token || token.low24h === null || token.high24h === null) {
    return { position: 0, range: 'N/A', current: token?.priceUsd || 0 };
  }

  const range = token.high24h - token.low24h;
  const position = range === 0 ? 0 : ((token.priceUsd - token.low24h) / range) * 100;

  return {
    position,
    range: `${token.low24h?.toFixed(2)} - ${token.high24h?.toFixed(2)}`,
    current: token.priceUsd
  };
};

export function IntelGrid({ token, loading }: IntelGridProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AISentinelResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch AI analysis when token changes
  useEffect(() => {
    if (token) {
      const fetchAIAnalysis = async () => {
        setAiLoading(true);
        try {
          const response = await fetch('/api/ai/sentinel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tokenData: {
                volume24hUsd: token.volume24hUsd,
                change24hPct: token.change24hPct,
                marketCapUsd: token.marketCapUsd,
                priceUsd: token.priceUsd,
                high24h: token.high24h,
                low24h: token.low24h
              },
              tokenName: token.name
            })
          });

          if (response.ok) {
            const data = await response.json();
            setAiAnalysis(data);
          } else {
            console.error('AI analysis error:', await response.json());
          }
        } catch (error) {
          console.error('Error fetching AI analysis:', error);
        } finally {
          setAiLoading(false);
        }
      };

      fetchAIAnalysis();
    } else {
      setAiAnalysis(null);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col h-[140px]"
          >
            <div className="h-4 w-1/3 bg-muted/20 rounded mb-4 animate-pulse" />
            <div className="h-6 w-full bg-muted/20 rounded mb-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-muted/20 rounded animate-pulse" />
          </div>
        ))}
        <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col md:col-span-2 h-[140px]">
          <div className="h-4 w-1/4 bg-muted/20 rounded mb-4 animate-pulse" />
          <div className="h-4 w-full bg-muted/20 rounded mb-2 animate-pulse" />
          <div className="h-4 w-5/6 bg-muted/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const pegData = calculatePegEfficiency(token);
  const assetDepth = calculateAssetDepth(token);
  const liquidityData = calculateLiquidityHealth(token);
  const performanceData = calculatePerformanceRange(token);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Row 1: Peg Efficiency & Asset Depth */}
      <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col h-[140px]">
        <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          PEG EFFICIENCY
        </h3>
        <div className="flex flex-col h-full">
          <span className={cn(
            "text-lg font-bold",
            Math.abs(pegData.deviation) < 1 ? "text-green-500" : "text-red-500"
          )}>
            {pegData.text}
          </span>
          <p className="text-xs text-muted-foreground mt-2">
            vs Spot Gold ($2650)
          </p>
        </div>
      </div>

      <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col h-[140px]">
        <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          ASSET DEPTH
        </h3>
        <div className="flex flex-col h-full">
          <span className="text-lg font-bold">
            {assetDepth} T
          </span>
          <p className="text-xs text-muted-foreground mt-2">
            Physical Gold Equivalent
          </p>
        </div>
      </div>

      {/* Row 2: Liquidity Health & Performance Range */}
      <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col h-[140px]">
        <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          LIQUIDITY HEALTH
        </h3>
        <div className="flex flex-col h-full">
          <span className="text-lg font-bold">
            {liquidityData.ratio}%
          </span>
          <p className="text-xs text-muted-foreground mt-2">
            {liquidityData.label}
          </p>
        </div>
      </div>

      <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col h-[140px]">
        <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          PERFORMANCE & RANGE
        </h3>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground">
              {performanceData.range}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${performanceData.position}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current: ${performanceData.current.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Row 3: AI Market Sentinel (Full Width) */}
      <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col md:col-span-2 h-[140px]">
        <h3 className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          AI MARKET SENTINEL
        </h3>
        <div className="flex flex-col h-full">
          {aiLoading ? (
            <div className="flex flex-col h-full justify-center items-center">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
              <span className="text-xs text-muted-foreground">Analyzing...</span>
            </div>
          ) : aiAnalysis ? (
            <>
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit",
                aiAnalysis.sentiment.toLowerCase().includes('bull') ? "bg-green-500/20 text-green-500" :
                aiAnalysis.sentiment.toLowerCase().includes('bear') ? "bg-red-500/20 text-red-500" :
                "bg-blue-500/20 text-blue-500"
              )}>
                {aiAnalysis.sentiment}
              </span>
              <p className="text-xs text-muted-foreground flex-grow">
                {aiAnalysis.explanation}
              </p>
            </>
          ) : (
            <>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-primary/10 text-primary w-fit">
                ANALYZING
              </span>
              <p className="text-xs text-muted-foreground flex-grow">
                AI analysis unavailable. Requires Gemini integration.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
  );
}