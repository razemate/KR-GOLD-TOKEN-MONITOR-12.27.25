-- Re-register KR GOLD scheduler jobs (repair when jobs are missing/inactive)

do $$
declare
  prefetch_job_id bigint;
  cleanup_job_id bigint;
begin
  select jobid into prefetch_job_id
  from cron.job
  where jobname = 'kr-gold-prefetch-every-minute'
  limit 1;

  if prefetch_job_id is not null then
    perform cron.unschedule(prefetch_job_id);
  end if;

  perform cron.schedule(
    'kr-gold-prefetch-every-minute',
    '* * * * *',
    'select public.kr_gold_prefetch_tick();'
  );

  select jobid into cleanup_job_id
  from cron.job
  where jobname = 'kr-gold-cleanup-daily'
  limit 1;

  if cleanup_job_id is not null then
    perform cron.unschedule(cleanup_job_id);
  end if;

  perform cron.schedule(
    'kr-gold-cleanup-daily',
    '10 11 * * *',
    'select public.kr_gold_cleanup_old_snapshots();'
  );
end $$;
