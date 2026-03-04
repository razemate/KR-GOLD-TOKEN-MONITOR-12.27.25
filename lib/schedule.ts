import { getSlotContext } from '@/lib/slot';

export function getRefreshCadence() {
  const slot = getSlotContext();
  const intervalSeconds = slot.refreshIntervalSeconds;

  return {
    isWeekend: slot.isWeekend,
    refreshInterval: intervalSeconds,
    cacheHeader: `public, s-maxage=${intervalSeconds}, stale-while-revalidate=${slot.isWeekend ? 120 : 60}`,
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
