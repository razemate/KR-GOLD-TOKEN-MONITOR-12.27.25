# KR Gold Token Monitor

KR Gold Token Monitor is a snapshot-driven dashboard for tokenized gold assets.

## Architecture Summary
- CoinGecko provides token market data.
- Spot gold source priority:
  1. Stooq (default)
  2. GoldPrice.org API fallback
- AI analysis:
  - Gemini primary
  - OpenRouter fallback
- Snapshot persistence in Supabase PostgreSQL is supported and expected for production.

## Slot Model
- Timezone: `America/Vancouver`.
- Weekdays: 5-minute slots.
- Weekends: 15-minute slots.
- Prefetch runs 2 minutes before slot boundary.
- All users see the same snapshot per slot.

## Feature Flag
- `SNAPSHOT_SOURCE=live` (default local compatibility)
- `SNAPSHOT_SOURCE=db` (production target)

## Required Environment Variables
- `GEMINI_API_KEY`
- `OPENROUTER_API_KEY` (optional fallback)
- `SNAPSHOT_SOURCE` (`live` or `db`)
- `SNAPSHOT_SUPABASE_URL` (required in db mode)
- `SNAPSHOT_SUPABASE_SERVICE_ROLE_KEY` (required in db mode)
- `PREFETCH_CRON_SECRET` (recommended for `/api/prefetch`)

## Supabase SQL
Run:

`supabase/sql/20260305_price_snapshots.sql`

This creates table/indexes and includes cron examples.

## Run Locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

