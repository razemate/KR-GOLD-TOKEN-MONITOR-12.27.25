import { NextResponse } from 'next/server';
import { buildSnapshotPayload } from '@/lib/snapshot-build';
import { getLatestReadySnapshot, getSnapshotBySlot, insertSchedulerRun, isSnapshotDbConfigured, upsertSnapshot } from '@/lib/snapshot-db';
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

async function logAutocatchupSafe(params: {
  status: 'started' | 'success' | 'failed';
  slotStart: string;
  slotEnd: string;
  detail?: Record<string, unknown> | null;
  error?: string | null;
}) {
  try {
    await insertSchedulerRun({
      trigger_source: 'snapshot_autocatchup',
      status: params.status,
      slot_start_vancouver: params.slotStart,
      slot_end_vancouver: params.slotEnd,
      detail: params.detail || null,
      error: params.error || null,
    });
  } catch (e) {
    console.error('Autocatchup log write failed:', e);
  }
}

async function tryGenerateCurrentSlotSnapshot(slot: ReturnType<typeof getSlotContext>): Promise<void> {
  // Self-healing fallback when scheduler misses: generate the current slot on-demand.
  await logAutocatchupSafe({
    status: 'started',
    slotStart: slot.currentSlotKey,
    slotEnd: slot.currentSlotEndKey,
    detail: { reason: 'Current slot missing, trying catchup' },
  });

  const payload = await buildSnapshotPayload();
  if (payload.meta.goldSpotUsd === null) {
    await logAutocatchupSafe({
      status: 'failed',
      slotStart: slot.currentSlotKey,
      slotEnd: slot.currentSlotEndKey,
      error: 'Spot price unavailable from Stooq and GoldPrice fallback',
    });
    return;
  }

  await upsertSnapshot({
    slot_start_vancouver: slot.currentSlotKey,
    slot_end_vancouver: slot.currentSlotEndKey,
    slot_type: slot.slotType,
    coingecko_data: payload.tokens.map((t) => t.token),
    spot_gold_usd: payload.meta.goldSpotUsd,
    spot_source: payload.meta.goldSpotSource || 'Unavailable',
    ai_analysis: payload.tokens.map((t) => t.intelligence || null),
    status: 'ready',
    generated_at: new Date().toISOString(),
    error: null,
    payload: {
      ...payload,
      meta: {
        ...payload.meta,
        slotStartVancouver: slot.currentSlotKey,
        slotEndVancouver: slot.currentSlotEndKey,
        stale: false,
      },
    },
  });

  await logAutocatchupSafe({
    status: 'success',
    slotStart: slot.currentSlotKey,
    slotEnd: slot.currentSlotEndKey,
    detail: {
      spotSource: payload.meta.goldSpotSource || 'Unavailable',
      spotGoldUsd: payload.meta.goldSpotUsd,
      tokenCount: payload.tokens.length,
    },
  });
}

export async function GET() {
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
        return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
      }

      if (process.env.SNAPSHOT_AUTO_CATCHUP !== 'false') {
        try {
          await tryGenerateCurrentSlotSnapshot(slot);
          const refreshed = await getSnapshotBySlot(slot.currentSlotKey);
          if (isUsableReadySnapshot(refreshed)) {
            const payload = withMeta(
              refreshed.payload,
              refreshed.slot_start_vancouver,
              refreshed.slot_end_vancouver,
              false
            );
            return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
          }
        } catch (e) {
          console.error('Snapshot auto-catchup failed:', e);
        }
      }

      const latestReady = await getLatestReadySnapshot();
      if (isUsableReadySnapshot(latestReady)) {
        const payload = withMeta(
          latestReady.payload,
          latestReady.slot_start_vancouver,
          latestReady.slot_end_vancouver,
          true
        );
        return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
      }

      return NextResponse.json(
        { error: 'No ready snapshots available' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Live mode retained for migration fallback only.
    const live = await buildSnapshotPayload();
    const payload = withMeta(live, slot.currentSlotKey, slot.currentSlotEndKey, false);
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Snapshot API failed:', error);
    return NextResponse.json(
      { error: 'Failed to load snapshot', details: message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
