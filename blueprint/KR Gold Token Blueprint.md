# KR Gold Token Monitor Blueprint (Updated)

## 1. Scope
- Applies only to `KR GOLD TOKEN MONITOR`.
- No dependency on WooCommerce/Ontraport systems.
- Uses a dedicated Supabase project/database for this app.

## 2. Data Sources
- Token markets/charts: CoinGecko FREE API.
- Spot gold source priority:
  1. Stooq (authoritative default).
  2. GoldPrice.org API fallback.
- AI analysis:
  - Gemini primary for narrative analysis.
  - OpenRouter fallback if Gemini fails.
- Gemini is not a spot-gold source.

## 3. Fixed Slot Model
- Timezone: `America/Vancouver`.
- Weekdays: 5-minute slots (`:00/:05/:10/...`).
- Weekends: 15-minute slots (`:00/:15/:30/:45`).
- Prefetch trigger: exactly 2 minutes before each slot boundary.
- All users receive the same snapshot within the same slot window.

## 4. Persistence (Allowed and Required)
- Persist snapshots to PostgreSQL (Supabase) table `price_snapshots`.
- Required fields:
  - `slot_start_vancouver`, `slot_end_vancouver`
  - `slot_type` (`weekday_5m` or `weekend_15m`)
  - `coingecko_data`
  - `spot_gold_usd`, `spot_source`
  - `ai_analysis`
  - `status` (`ready|failed|stale`)
  - `generated_at`, `error`, `payload`
- Required constraints:
  - Unique on `slot_start_vancouver`.
  - Index on `slot_start_vancouver desc`.
  - Optional partial index for `status='ready'`.

## 5. Background Scheduling (Explicitly Allowed)
- Supabase cron is allowed and recommended.
- Scheduler pattern:
  - Run every minute (`* * * * *`).
  - Gate in code to run only on prefetch minutes.
  - Acquire lock/idempotent upsert by slot key.

## 6. API Responsibilities
- `/api/prefetch`:
  - Generates snapshot for target upcoming slot.
  - Writes immutable slot row.
  - Records failed status on errors.
- `/api/snapshot`:
  - Reads current slot from DB only in `SNAPSHOT_SOURCE=db`.
  - If missing, serves latest ready as `stale=true`.
- Feature flag:
  - `SNAPSHOT_SOURCE=db|live`.

## 7. Client Behavior
- Client may refresh page.
- Refresh must return same data for the current slot.
- Data changes only when slot boundary changes.
- New users should load quickly from precomputed DB snapshots.

## 8. Safety and Reliability
- Idempotent writes by slot key.
- Single-writer lock for prefetch execution.
- Structured logs for slot start/end, source, latency, status.
- Optional retention cleanup cron (recommended 7 days).

## 9. Acceptance Criteria
- Weekdays update only at `:00/:05/:10...`.
- Weekends update only at `:00/:15/:30/:45`.
- Snapshot generated ~2 minutes before boundary.
- All users see identical payload inside a slot.
- Spot source in docs/code is Stooq default + GoldPrice API fallback.
- No Woo/Ontraport dependencies.

