# File Structure (Current Policy)

## App Routes
- `app/page.tsx`: UI shell and slot-aligned client polling.
- `app/api/snapshot/route.ts`: Read path from DB slot snapshots.
- `app/api/prefetch/route.ts`: Prefetch/generation endpoint for scheduler.
- `app/api/chart/route.ts`: Chart endpoint.

## Lib
- `lib/coingecko.ts`: CoinGecko fetchers.
- `lib/spot.ts`: Spot source resolver (Stooq primary, GoldPrice API fallback).
- `lib/gemini.ts`: AI analysis generation only.
- `lib/openrouter.ts`: AI fallback only.
- `lib/compute.ts`: Deterministic metrics.
- `lib/normalize.ts`: Data normalization.
- `lib/retry.ts`: Retry helpers.
- `lib/schedule.ts`: Cache cadence derived from Vancouver slot context.
- `lib/slot.ts`: Vancouver slot calculation and prefetch gating.
- `lib/snapshot-build.ts`: Snapshot payload builder.
- `lib/snapshot-db.ts`: Supabase snapshot persistence helpers.

## Blueprint
- `blueprint/KR Gold Token Blueprint.md`: Authoritative blueprint.
- `blueprint/README.md`: Concise architecture summary.
- `blueprint/File-Structure.md`: This file.

## SQL / DB
- `supabase/sql/20260305_price_snapshots.sql`: table, indexes, policies, cron examples.

## Notes
- Persistence and background scheduling are allowed.
- No WooCommerce/Ontraport coupling.
- Slot model:
  - Weekday: 5-minute windows.
  - Weekend: 15-minute windows.
  - Prefetch: slot minus 2 minutes.

