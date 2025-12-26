import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
        const { data, error: fetchError } = await supabase.functions.invoke<TokenizedGoldResponse>('coingecko-tokenized-gold');

        if (fetchError) {
          throw new Error(fetchError.message);
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