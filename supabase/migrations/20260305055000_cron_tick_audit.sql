-- Cron tick audit for debugging scheduler reliability.

create table if not exists public.snapshot_cron_ticks (
  id bigserial primary key,
  status text not null check (status in ('started', 'skipped_no_config', 'scheduled_http', 'lock_not_acquired', 'failed')),
  request_id bigint,
  detail jsonb,
  error text,
  triggered_at timestamptz not null default now()
);

create index if not exists idx_snapshot_cron_ticks_triggered_at_desc
  on public.snapshot_cron_ticks (triggered_at desc);

alter table public.snapshot_cron_ticks enable row level security;

drop policy if exists snapshot_cron_ticks_service_all on public.snapshot_cron_ticks;
create policy snapshot_cron_ticks_service_all
on public.snapshot_cron_ticks
for all
to service_role
using (true)
with check (true);

drop policy if exists snapshot_cron_ticks_read_auth on public.snapshot_cron_ticks;
create policy snapshot_cron_ticks_read_auth
on public.snapshot_cron_ticks
for select
to authenticated
using (true);

create or replace function public.kr_gold_prefetch_tick()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  cfg record;
  lock_taken boolean;
  req_id bigint;
begin
  lock_taken := pg_try_advisory_lock(hashtextextended('kr_gold_prefetch_tick', 0));
  if not lock_taken then
    insert into public.snapshot_cron_ticks(status, detail)
    values ('lock_not_acquired', jsonb_build_object('reason', 'advisory lock busy'));
    return;
  end if;

  insert into public.snapshot_cron_ticks(status, detail)
  values ('started', jsonb_build_object('source', 'pg_cron'));

  select endpoint_url, bearer_token
    into cfg
  from public.snapshot_scheduler_config
  where enabled = true
  order by updated_at desc
  limit 1;

  if cfg.endpoint_url is null then
    insert into public.snapshot_cron_ticks(status, detail)
    values ('skipped_no_config', jsonb_build_object('reason', 'no enabled scheduler config row'));
    perform pg_advisory_unlock(hashtextextended('kr_gold_prefetch_tick', 0));
    return;
  end if;

  select net.http_post(
    url := cfg.endpoint_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cfg.bearer_token,
      'X-KR-Trigger', 'cron_tick'
    ),
    body := '{}'::jsonb
  ) into req_id;

  insert into public.snapshot_cron_ticks(status, request_id, detail)
  values ('scheduled_http', req_id, jsonb_build_object('endpoint_url', cfg.endpoint_url));

  perform pg_advisory_unlock(hashtextextended('kr_gold_prefetch_tick', 0));
exception
  when others then
    insert into public.snapshot_cron_ticks(status, error, detail)
    values ('failed', sqlerrm, jsonb_build_object('stage', 'kr_gold_prefetch_tick'));
    perform pg_advisory_unlock(hashtextextended('kr_gold_prefetch_tick', 0));
    raise;
end;
$$;
