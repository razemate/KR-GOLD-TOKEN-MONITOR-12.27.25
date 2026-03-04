-- Scheduler health logs for KR GOLD TOKEN MONITOR

create table if not exists public.snapshot_scheduler_runs (
  id bigserial primary key,
  trigger_source text not null check (trigger_source in ('cron_tick', 'api_prefetch', 'api_force', 'snapshot_autocatchup')),
  status text not null check (status in ('started', 'skipped', 'success', 'failed')),
  slot_start_vancouver text,
  slot_end_vancouver text,
  detail jsonb,
  error text,
  triggered_at timestamptz not null default now()
);

create index if not exists idx_snapshot_scheduler_runs_triggered_at_desc
  on public.snapshot_scheduler_runs (triggered_at desc);

create index if not exists idx_snapshot_scheduler_runs_status_triggered_at
  on public.snapshot_scheduler_runs (status, triggered_at desc);

alter table public.snapshot_scheduler_runs enable row level security;

drop policy if exists snapshot_scheduler_runs_service_all on public.snapshot_scheduler_runs;
create policy snapshot_scheduler_runs_service_all
on public.snapshot_scheduler_runs
for all
to service_role
using (true)
with check (true);

drop policy if exists snapshot_scheduler_runs_read_auth on public.snapshot_scheduler_runs;
create policy snapshot_scheduler_runs_read_auth
on public.snapshot_scheduler_runs
for select
to authenticated
using (true);

-- Ensure cron tick includes an explicit trigger header for observability.
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
      'Authorization', 'Bearer ' || cfg.bearer_token,
      'X-KR-Trigger', 'cron_tick'
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
