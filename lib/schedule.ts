export function getRefreshCadence() {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = day === 0 || day === 6;
  
  // Weekdays (1-5): 5 minutes (300s)
  // Weekends (0, 6): 15 minutes (900s)
  const intervalSeconds = isWeekend ? 900 : 300;

  return {
    isWeekend,
    refreshInterval: intervalSeconds,
    cacheHeader: `public, s-maxage=${intervalSeconds}, stale-while-revalidate=${isWeekend ? 120 : 60}`
  };
}

/**
 * Daily TTL check for refreshing the OpenRouter free-model list.
 * Per Blueprint §53-57.
 */
let lastModelRefresh = 0;
export function shouldRefreshModels(): boolean {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  if (now - lastModelRefresh > ONE_DAY_MS) {
    return true;
  }
  return false;
}

export function markModelsRefreshed(): void {
  lastModelRefresh = Date.now();
}
