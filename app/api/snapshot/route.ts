import { NextResponse } from 'next/server';
import { buildSnapshotPayload } from '@/lib/snapshot-build';
import { getLatestReadySnapshot, getSnapshotBySlot, isSnapshotDbConfigured } from '@/lib/snapshot-db';
import { getRefreshCadence } from '@/lib/schedule';
import { getSlotContext, isDbMode } from '@/lib/slot';
import { SnapshotResponse } from '@/lib/types';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function withMeta(base: SnapshotResponse, slotStart: string, slotEnd: string, stale: boolean): SnapshotResponse {
  return {
    ...base,
    meta: {
      ...base.meta,
      slotStartVancouver: slotStart,
      slotEndVancouver: slotEnd,
      stale,
    },
  };
}

function isUsableReadySnapshot(row: {
  status: string;
  payload: SnapshotResponse | null;
  spot_gold_usd: number | null;
} | null | undefined): row is { payload: SnapshotResponse; spot_gold_usd: number } {
  return Boolean(row && row.status === 'ready' && row.payload && row.spot_gold_usd !== null);
}

export async function GET() {
  const { cacheHeader } = getRefreshCadence();
  const slot = getSlotContext();

  try {
    // Feature-flagged rollout: DB mode reads immutable slot snapshots.
    if (isDbMode()) {
      if (!isSnapshotDbConfigured()) {
        return NextResponse.json(
          { error: 'SNAPSHOT_SOURCE=db but snapshot database is not configured' },
          { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      const current = await getSnapshotBySlot(slot.currentSlotKey);
      if (isUsableReadySnapshot(current)) {
        const payload = withMeta(current.payload, current.slot_start_vancouver, current.slot_end_vancouver, false);
        return NextResponse.json(payload, { headers: { 'Cache-Control': cacheHeader } });
      }

      const latestReady = await getLatestReadySnapshot();
      if (isUsableReadySnapshot(latestReady)) {
        const payload = withMeta(
          latestReady.payload,
          latestReady.slot_start_vancouver,
          latestReady.slot_end_vancouver,
          true
        );
        return NextResponse.json(payload, { headers: { 'Cache-Control': cacheHeader } });
      }

      return NextResponse.json(
        { error: 'No ready snapshots available' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Live mode retained for migration fallback only.
    const live = await buildSnapshotPayload();
    const payload = withMeta(live, slot.currentSlotKey, slot.currentSlotEndKey, false);
    return NextResponse.json(payload, { headers: { 'Cache-Control': cacheHeader } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Snapshot API failed:', error);
    return NextResponse.json(
      { error: 'Failed to load snapshot', details: message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
