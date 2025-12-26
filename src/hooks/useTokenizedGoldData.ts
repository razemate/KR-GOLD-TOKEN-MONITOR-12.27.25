'use client';

import { useState, useEffect } from 'react';
import { TokenizedGoldResponse } from '@/types/gold';

interface UseTokenizedGoldDataReturn {
  tokens: any[];
  loading: boolean;
  error: string | null;
}

export function useTokenizedGoldData(): UseTokenizedGoldDataReturn {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenizedGoldData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/gold-intel');

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          // Handle the new error format
          if (data.error === "MISSING_ENV") {
            const missingKeys = data.missing?.join(', ') || 'unknown';
            throw new Error(`Missing environment variables: ${missingKeys}. Please add your API keys to .env.local file.`);
          }
          throw new Error(data.error);
        }

        if (!data || !data.tokens) {
          throw new Error('No token data received');
        }

        setTokens(data.tokens);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tokenized gold data';
        console.error('Tokenized gold data fetch error:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenizedGoldData();
  }, []);

  return {
    tokens,
    loading,
    error,
  };
}