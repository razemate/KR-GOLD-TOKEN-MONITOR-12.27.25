-- KR GOLD TOKEN MONITOR - DB snapshot pipeline
-- Project ref: evmqgciirckbkvvyehxt

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

alter table public.price_snapshots enable row level security;

drop policy if exists price_snapshots_read_auth on public.price_snapshots;
create policy price_snapshots_read_auth
on public.price_snapshots
for select
to authenticated
using (true);

drop policy if exists price_snapshots_service_all on public.price_snapshots;
create policy price_snapshots_service_all
on public.price_snapshots
for all
to service_role
using (true)
with check (true);

-- Stores endpoint/token used by cron tick to invoke /api/prefetch.
create table if not exists public.snapshot_scheduler_config (
  id bigserial primary key,
  endpoint_url text not null,
  bearer_token text not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Keep only one active row.
create unique index if not exists uq_snapshot_scheduler_singleton
  on public.snapshot_scheduler_config ((enabled))
  where enabled = true;

create or replace function public.touch_snapshot_scheduler_config()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_snapshot_scheduler_config on public.snapshot_scheduler_config;
create trigger trg_touch_snapshot_scheduler_config
before update on public.snapshot_scheduler_config
for each row execute function public.touch_snapshot_scheduler_config();

-- Minute tick called by pg_cron.
create or replace function public.kr_gold_prefetch_tick()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  cfg record;
  lock_taken boolean;
begin
  lock_taken := pg_try_advisory_lock(hashtextextended('kr_gold_prefetch_tick', 0));
  if not lock_taken then
    return;
  end if;

  select endpoint_url, bearer_token
    into cfg
  from public.snapshot_scheduler_config
  where enabled = true
  order by updated_at desc
  limit 1;

  if cfg.endpoint_url is null then
    perform pg_advisory_unlock(hashtextextended('kr_gold_prefetch_tick', 0));
    return;
  end if;

  perform net.http_post(
    url := cfg.endpoint_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cfg.bearer_token
    ),
    body := '{}'::jsonb
  );

  perform pg_advisory_unlock(hashtextextended('kr_gold_prefetch_tick', 0));
exception
  when others then
    perform pg_advisory_unlock(hashtextextended('kr_gold_prefetch_tick', 0));
    raise;
end;
$$;

-- Daily cleanup (expert default retention = 7 days).
create or replace function public.kr_gold_cleanup_old_snapshots()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.price_snapshots
  where generated_at < now() - interval '7 days';
$$;

-- Register/refresh cron jobs.
do $$
declare
  prefetch_job_id bigint;
  cleanup_job_id bigint;
begin
  select jobid into prefetch_job_id from cron.job where jobname = 'kr-gold-prefetch-every-minute' limit 1;
  if prefetch_job_id is not null then
    perform cron.unschedule(prefetch_job_id);
  end if;
  perform cron.schedule('kr-gold-prefetch-every-minute', '* * * * *', 'select public.kr_gold_prefetch_tick();');

  select jobid into cleanup_job_id from cron.job where jobname = 'kr-gold-cleanup-daily' limit 1;
  if cleanup_job_id is not null then
    perform cron.unschedule(cleanup_job_id);
  end if;
  -- 11:10 UTC ~ 03:10 Vancouver during PST (adjusted by DST automatically in your slot logic, not here).
  perform cron.schedule('kr-gold-cleanup-daily', '10 11 * * *', 'select public.kr_gold_cleanup_old_snapshots();');
end $$;
