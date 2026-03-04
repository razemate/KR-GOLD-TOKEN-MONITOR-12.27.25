-- Debug helper to inspect pg_net HTTP responses for scheduler calls.

create or replace function public.kr_gold_latest_http_responses(limit_rows integer default 30)
returns table (
  request_id bigint,
  status_code integer,
  error_msg text,
  content text,
  created timestamptz
)
language sql
security definer
set search_path = public, net
as $$
  select r.id as request_id, resp.status_code, resp.error_msg, resp.content, resp.created
  from public.snapshot_cron_ticks r
  join net._http_response resp on resp.id = r.request_id
  where r.request_id is not null
  order by resp.created desc
  limit greatest(limit_rows, 1);
$$;
