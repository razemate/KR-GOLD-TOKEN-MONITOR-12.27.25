# Gold Token Monitor Blueprint Overview

This app uses a fixed-slot snapshot model for deterministic output and instant loads.

## Source Priority
- Token market data: CoinGecko FREE API.
- Spot gold source order:
  1. Stooq (default, authoritative).
  2. GoldPrice.org API (`https://data-asg.goldprice.org/dbXRates/USD`) fallback.
- AI analysis: Gemini (primary) with OpenRouter fallback for token commentary only.
- Gemini is not the spot-gold source.

## Refresh Model
- Vancouver timezone (`America/Vancouver`) is authoritative for slot math.
- Weekdays: 5-minute slots.
- Weekends: 15-minute slots.
- Prefetch window: exactly 2 minutes before slot boundary.
- Same snapshot is served to all users within a slot.

## Persistence and Scheduling
- Persistence is explicitly allowed and required.
- Snapshot rows are persisted in PostgreSQL (Supabase).
- Supabase cron is allowed and used:
  - minute tick (`* * * * *`)
  - code gate decides whether current minute is prefetch minute
  - idempotent upsert by slot key
- Background scheduling is explicitly allowed.

## API Contract
- `/api/prefetch` builds and stores the next slot snapshot.
- `/api/snapshot` reads current slot from DB.
- If current slot is unavailable, latest ready slot is returned with `stale=true`.

## Rollout Safety
- Feature flag: `SNAPSHOT_SOURCE=db|live`.
- Default local fallback may stay `live` until DB is configured.
- Production target is `db`.

