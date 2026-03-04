import { SnapshotResponse } from '@/lib/types';

type SnapshotRow = {
  id?: string;
  slot_start_vancouver: string;
  slot_end_vancouver: string;
  slot_type: 'weekday_5m' | 'weekend_15m';
  coingecko_data: unknown;
  spot_gold_usd: number | null;
  spot_source: string;
  ai_analysis: unknown;
  status: 'ready' | 'failed' | 'stale';
  generated_at: string;
  error: string | null;
  payload: SnapshotResponse | null;
};

function cfg() {
  const baseUrl = process.env.SNAPSHOT_SUPABASE_URL;
  const serviceKey = process.env.SNAPSHOT_SUPABASE_SERVICE_ROLE_KEY;
  return { baseUrl, serviceKey, enabled: Boolean(baseUrl && serviceKey) };
}

function headers(serviceKey: string) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };
}

export function isSnapshotDbConfigured(): boolean {
  return cfg().enabled;
}

export async function getSnapshotBySlot(slotStart: string): Promise<SnapshotRow | null> {
  const c = cfg();
  if (!c.enabled || !c.baseUrl || !c.serviceKey) return null;
  const url = `${c.baseUrl}/rest/v1/price_snapshots?slot_start_vancouver=eq.${encodeURIComponent(slotStart)}&select=*&limit=1`;
  const res = await fetch(url, { headers: headers(c.serviceKey), cache: 'no-store' });
  if (!res.ok) return null;
  const rows = (await res.json()) as SnapshotRow[];
  return rows?.[0] || null;
}

export async function getLatestReadySnapshot(): Promise<SnapshotRow | null> {
  const c = cfg();
  if (!c.enabled || !c.baseUrl || !c.serviceKey) return null;
  const url = `${c.baseUrl}/rest/v1/price_snapshots?status=eq.ready&select=*&order=slot_start_vancouver.desc&limit=1`;
  const res = await fetch(url, { headers: headers(c.serviceKey), cache: 'no-store' });
  if (!res.ok) return null;
  const rows = (await res.json()) as SnapshotRow[];
  return rows?.[0] || null;
}

export async function upsertSnapshot(row: SnapshotRow): Promise<void> {
  const c = cfg();
  if (!c.enabled || !c.baseUrl || !c.serviceKey) return;
  const url = `${c.baseUrl}/rest/v1/price_snapshots?on_conflict=slot_start_vancouver`;
  await fetch(url, {
    method: 'POST',
    headers: {
      ...headers(c.serviceKey),
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });
}

export type { SnapshotRow };

