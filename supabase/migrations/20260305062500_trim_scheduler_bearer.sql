-- Fix scheduler bearer token auth drift caused by whitespace/newline.

update public.snapshot_scheduler_config
set bearer_token = btrim(bearer_token),
    updated_at = now()
where enabled = true;

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
      'Authorization', 'Bearer ' || btrim(cfg.bearer_token),
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
