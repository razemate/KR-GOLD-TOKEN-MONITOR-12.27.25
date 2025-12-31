'use client';

import React from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { TokensTable } from '@/components/TokensTable';
import { TokenPerformanceChart } from '@/components/TokenPerformanceChart';
import { IntelGrid } from '@/components/IntelGrid';
import { useGoldData } from '@/hooks/useGoldData';
import { fetchTokenChart } from '@/lib/fetcher';
import { ChartPoint } from '@/types/gold';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const {
    tokens,
    selectedTokenId,
    setSelectedTokenId,
    lastUpdated,
    syncStatus,
    refresh
  } = useGoldData();

  const [chartData, setChartData] = useState<ChartPoint[] | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  const selectedToken = tokens.find(t => t.id === selectedTokenId) || null;

  // Fetch chart data when selected token changes
  useEffect(() => {
    if (selectedTokenId) {
      const loadChartData = async () => {
        setChartLoading(true);
        try {
          const data = await fetchTokenChart(selectedTokenId);
          setChartData(data);
        } catch (error) {
          console.error('Error fetching chart data:', error);
          setChartData(null);
        } finally {
          setChartLoading(false);
        }
      };

      loadChartData();
    } else {
      setChartData(null);
    }
  }, [selectedTokenId]);

  return (
    <DashboardShell
      lastUpdated={lastUpdated}
      syncStatus={syncStatus}
      onRefresh={refresh}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Top 10 Tokenized Gold tokens */}
        <div className="w-80 border-r border-border flex flex-col overflow-hidden">
          <TokensTable
            tokens={tokens}
            selectedId={selectedTokenId}
            onSelect={setSelectedTokenId}
            loading={syncStatus === 'syncing' && tokens.length === 0}
          />
        </div>

        {/* Right Main Panel: Chart + 5 intelligence containers */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-card/10">
          <div className="p-6 space-y-6">
            {/* Primary Chart (Top) */}
            <section className="h-[400px]">
              <TokenPerformanceChart
                token={selectedToken}
                chartData={chartData || []}
                loading={chartLoading}
              />
            </section>

            {/* Intelligence Grid (5 Containers in 2-2-1 layout) */}
            <section className="min-h-[460px]">
              <IntelGrid
                token={selectedToken}
                loading={syncStatus === 'syncing' && !selectedToken}
              />
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
