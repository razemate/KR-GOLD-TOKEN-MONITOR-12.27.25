"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchTokens } from "@/lib/fetcher";
import { Token } from "@/types/gold";

export function useGoldData() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const load = useCallback(async () => {
    setSyncStatus("syncing");
    try {
      const data = await fetchTokens();
      
      // Ensure we have an array of tokens
      const tokenList = Array.isArray(data) ? data : (data.tokens || []);
      setTokens(tokenList);
      
      // Update last updated (we'll use current time since it's not in the token model anymore)
      if (tokenList.length > 0) {
        setLastUpdated(new Date().toISOString());
        if (!selectedTokenId) {
          setSelectedTokenId(tokenList[0].id);
        }
      }
      
      setSyncStatus("synced");
    } catch (error) {
      console.error("Error loading gold data:", error);
      setSyncStatus("error");
    }
  }, [selectedTokenId]);

  useEffect(() => {
    load();
    
    // Auto-refresh every 60 seconds as per blueprint
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return {
    tokens,
    selectedTokenId,
    setSelectedTokenId,
    lastUpdated,
    syncStatus,
    refresh: load
  };
}
