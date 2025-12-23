import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GoldToken, GoldDataResponse } from '@/types/gold';

const CONFIG = {
  CACHE_KEY: 'gold_monitor_v1',
  TIMEZONE: 'America/Los_Angeles',
  WEEKDAY_INTERVAL: 300000, // 5 minutes
  WEEKEND_INTERVAL: 900000, // 15 minutes
};

interface UseGoldDataReturn {
  tokens: GoldToken[];
  goldPrice: number | null;
  aggregateCap: number;
  selectedTokenId: string | null;
  setSelectedTokenId: (id: string) => void;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

const isPacificWeekend = (): boolean => {
  const now = new Date();
  const ptDateStr = now.toLocaleString('en-US', { timeZone: CONFIG.TIMEZONE });
  const ptDate = new Date(ptDateStr);
  const day = ptDate.getDay();
  return day === 0 || day === 6;
};

export function useGoldData(): UseGoldDataReturn {
  const [tokens, setTokens] = useState<GoldToken[]>([]);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [aggregateCap, setAggregateCap] = useState<number>(0);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async () => {
    setSyncStatus('syncing');
    setError(null);

    // Try to load from cache first for fast initial paint
    try {
      const cached = localStorage.getItem(CONFIG.CACHE_KEY);
      if (cached && tokens.length === 0) {
        const data = JSON.parse(cached);
        if (data?.tokens?.length > 0) {
          setTokens(data.tokens);
          setGoldPrice(data.goldPrice);
          setAggregateCap(data.aggregateCap);
          setLastUpdated(new Date(data.lastUpdated));
          if (!selectedTokenId) {
            setSelectedTokenId(data.tokens[0]?.id);
          }
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn('Cache load failed', e);
    }

    // Fetch fresh data from edge function
    try {
      const { data, error: fetchError } = await supabase.functions.invoke<GoldDataResponse>('gold-data');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data || !data.tokens || data.tokens.length === 0) {
        throw new Error('No token data received');
      }

      setTokens(data.tokens);
      setGoldPrice(data.goldPrice);
      setAggregateCap(data.aggregateCap);
      setLastUpdated(new Date(data.lastUpdated));

      if (!selectedTokenId && data.tokens.length > 0) {
        setSelectedTokenId(data.tokens[0].id);
      }

      // Update cache
      localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(data));

      setSyncStatus('synced');
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      console.error('Data fetch error:', errorMessage);
      setError(errorMessage);
      setSyncStatus('error');
      setLoading(false);
    }
  }, [selectedTokenId, tokens.length]);

  useEffect(() => {
    // Initial load
    loadData();

    // Set up auto-refresh interval based on weekday/weekend
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      const intervalMs = isPacificWeekend() ? CONFIG.WEEKEND_INTERVAL : CONFIG.WEEKDAY_INTERVAL;
      console.log(`Auto-refresh: ${isPacificWeekend() ? 'Weekend (15min)' : 'Weekday (5min)'}`);
      
      intervalRef.current = setInterval(loadData, intervalMs);
    };

    setupInterval();

    // Check for weekday/weekend change every hour
    const weekendCheckInterval = setInterval(() => {
      setupInterval();
    }, 3600000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearInterval(weekendCheckInterval);
    };
  }, [loadData]);

  return {
    tokens,
    goldPrice,
    aggregateCap,
    selectedTokenId,
    setSelectedTokenId,
    lastUpdated,
    loading,
    error,
    syncStatus,
  };
}
