import { NextRequest, NextResponse } from 'next/server';
import { buildSnapshotPayload } from '@/lib/snapshot-build';
import { getSnapshotBySlot, insertSchedulerRun, isSnapshotDbConfigured, upsertSnapshot } from '@/lib/snapshot-db';
import { getSlotContext, isDbMode } from '@/lib/slot';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function getTriggerSource(req: NextRequest, force: boolean): 'cron_tick' | 'api_prefetch' | 'api_force' {
  if (force) return 'api_force';
  if ((req.headers.get('x-kr-trigger') || '').toLowerCase() === 'cron_tick') return 'cron_tick';
  return 'api_prefetch';
}

async function logRunSafe(params: {
  source: 'cron_tick' | 'api_prefetch' | 'api_force';
  status: 'started' | 'skipped' | 'success' | 'failed';
  slotStart: string | null;
  slotEnd: string | null;
  detail?: Record<string, unknown> | null;
  error?: string | null;
}) {
  try {
    await insertSchedulerRun({
      trigger_source: params.source,
      status: params.status,
      slot_start_vancouver: params.slotStart,
      slot_end_vancouver: params.slotEnd,
      detail: params.detail || null,
      error: params.error || null,
    });
  } catch (e) {
    console.error('Scheduler log write failed:', e);
  }
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.PREFETCH_CRON_SECRET;
  if (!secret) return true; // local/dev convenience
  const auth = req.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDbMode()) {
    return NextResponse.json({ ok: false, skipped: true, reason: 'SNAPSHOT_SOURCE is not db' });
  }

  if (!isSnapshotDbConfigured()) {
    return NextResponse.json({ ok: false, error: 'Snapshot DB not configured' }, { status: 500 });
  }

  const slot = getSlotContext();
  const force = req.nextUrl.searchParams.get('force') === '1';
  const source = getTriggerSource(req, force);

  await logRunSafe({
    source,
    status: 'started',
    slotStart: slot.targetPrefetchSlotKey,
    slotEnd: slot.targetPrefetchSlotEndKey,
    detail: { isPrefetchMinute: slot.isPrefetchMinute, force },
  });

  if (!slot.isPrefetchMinute && !force) {
    await logRunSafe({
      source,
      status: 'skipped',
      slotStart: slot.targetPrefetchSlotKey,
      slotEnd: slot.targetPrefetchSlotEndKey,
      detail: { reason: 'Not a prefetch minute', nowSlot: slot.currentSlotKey, nextSlot: slot.nextSlotKey },
    });
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'Not a prefetch minute',
      nowSlot: slot.currentSlotKey,
      nextSlot: slot.nextSlotKey,
    });
  }

  const targetSlot = slot.targetPrefetchSlotKey;
  const existing = await getSnapshotBySlot(targetSlot);
  if (existing?.status === 'ready' && existing.payload) {
    await logRunSafe({
      source,
      status: 'skipped',
      slotStart: slot.targetPrefetchSlotKey,
      slotEnd: slot.targetPrefetchSlotEndKey,
      detail: { reason: 'Slot already generated' },
    });
    return NextResponse.json({ ok: true, skipped: true, reason: 'Slot already generated', targetSlot });
  }

  try {
    const payload = await buildSnapshotPayload();
    if (payload.meta.goldSpotUsd === null) {
      throw new Error('Spot price unavailable from Stooq and GoldPrice fallback');
    }

    await upsertSnapshot({
      slot_start_vancouver: targetSlot,
      slot_end_vancouver: slot.targetPrefetchSlotEndKey,
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
          slotStartVancouver: targetSlot,
          slotEndVancouver: slot.targetPrefetchSlotEndKey,
          stale: false,
        },
      },
    });
    await logRunSafe({
      source,
      status: 'success',
      slotStart: slot.targetPrefetchSlotKey,
      slotEnd: slot.targetPrefetchSlotEndKey,
      detail: {
        targetSlot,
        spotSource: payload.meta.goldSpotSource || 'Unavailable',
        spotGoldUsd: payload.meta.goldSpotUsd,
        tokenCount: payload.tokens.length,
      },
    });
    return NextResponse.json({ ok: true, generated: true, targetSlot });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    await upsertSnapshot({
      slot_start_vancouver: targetSlot,
      slot_end_vancouver: slot.targetPrefetchSlotEndKey,
      slot_type: slot.slotType,
      coingecko_data: null,
      spot_gold_usd: null,
      spot_source: 'Unavailable',
      ai_analysis: null,
      status: 'failed',
      generated_at: new Date().toISOString(),
      error: message,
      payload: null,
    });
    await logRunSafe({
      source,
      status: 'failed',
      slotStart: slot.targetPrefetchSlotKey,
      slotEnd: slot.targetPrefetchSlotEndKey,
      error: message,
      detail: { targetSlot },
    });
    return NextResponse.json({ ok: false, error: message, targetSlot }, { status: 500 });
  }
}
