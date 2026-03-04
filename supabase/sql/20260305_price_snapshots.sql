-- KR GOLD TOKEN MONITOR
-- Dedicated snapshot persistence schema (separate Supabase project recommended)

create extension if not exists pgcrypto;
create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.price_snapshots (
  id uuid primary key default gen_random_uuid(),
  slot_start_vancouver text not null,
  slot_end_vancouver text not null,
  slot_type text not null check (slot_type in ('weekday_5m', 'weekend_15m')),
  coingecko_data jsonb,
  spot_gold_usd numeric,
  spot_source text not null default 'Unavailable',
  ai_analysis jsonb,
  status text not null check (status in ('ready', 'failed', 'stale')),
  generated_at timestamptz not null default now(),
  error text,
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_price_snapshots_slot_start
  on public.price_snapshots(slot_start_vancouver);

create index if not exists idx_price_snapshots_slot_start_desc
  on public.price_snapshots(slot_start_vancouver desc);

create index if not exists idx_price_snapshots_ready
  on public.price_snapshots(slot_start_vancouver desc)
  where status = 'ready';

create or replace function public.set_updated_at_price_snapshots()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_price_snapshots on public.price_snapshots;
create trigger trg_set_updated_at_price_snapshots
before update on public.price_snapshots
for each row execute function public.set_updated_at_price_snapshots();

-- Optional RLS settings for API-only writes via service role:
alter table public.price_snapshots enable row level security;

drop policy if exists price_snapshots_read_auth on public.price_snapshots;
create policy price_snapshots_read_auth
on public.price_snapshots
for select
to authenticated
using (true);

-- Optional scheduler helper (Supabase pg_cron + pg_net):
-- Replace with your deployed URL and secret.
-- select cron.schedule(
--   'kr-gold-prefetch-every-minute',
--   '* * * * *',
--   $$
--   select net.http_post(
--     url := 'https://<your-domain>/api/prefetch',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer <PREFETCH_CRON_SECRET>'
--     ),
--     body := '{}'::jsonb
--   );
--   $$
-- );

-- Optional retention (expert default: 7 days, not 1 day):
-- select cron.schedule(
--   'kr-gold-delete-old-snapshots',
--   '10 11 * * *',
--   $$
--   delete from public.price_snapshots
--   where generated_at < now() - interval '7 days';
--   $$
-- );

