const VANCOUVER_TZ = 'America/Vancouver';

type SlotType = 'weekday_5m' | 'weekend_15m';

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
};

function getZonedParts(date: Date, timeZone = VANCOUVER_TZ): ZonedParts {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  });

  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    weekday: get('weekday').toLowerCase(),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function slotKey(date: Date): string {
  const p = getZonedParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)} ${pad(p.hour)}:${pad(p.minute)}`;
}

function floorToMinute(date: Date): Date {
  return new Date(Math.floor(date.getTime() / 60000) * 60000);
}

export type SlotContext = {
  timezone: string;
  isWeekend: boolean;
  intervalMinutes: number;
  refreshIntervalSeconds: number;
  slotType: SlotType;
  currentSlotStartUtc: Date;
  currentSlotEndUtc: Date;
  currentSlotKey: string;
  currentSlotEndKey: string;
  nextSlotKey: string;
  nextSlotEndKey: string;
  isPrefetchMinute: boolean;
  targetPrefetchSlotKey: string;
  targetPrefetchSlotEndKey: string;
};

export function getSlotContext(now = new Date()): SlotContext {
  const zoned = getZonedParts(now);
  const isWeekend = zoned.weekday === 'sat' || zoned.weekday === 'sun';
  const intervalMinutes = isWeekend ? 15 : 5;
  const refreshIntervalSeconds = intervalMinutes * 60;
  const slotType: SlotType = isWeekend ? 'weekend_15m' : 'weekday_5m';

  const minutesPast = zoned.minute % intervalMinutes;
  const currentSlotStartUtc = floorToMinute(new Date(now.getTime() - minutesPast * 60000));
  const currentSlotEndUtc = new Date(currentSlotStartUtc.getTime() + intervalMinutes * 60000);
  const nextSlotUtc = new Date(currentSlotEndUtc.getTime());
  const nextSlotEndUtc = new Date(nextSlotUtc.getTime() + intervalMinutes * 60000);
  const prefetchUtc = new Date(nextSlotUtc.getTime() - 2 * 60000);

  const nowMinute = floorToMinute(now).getTime();
  const isPrefetchMinute = nowMinute === floorToMinute(prefetchUtc).getTime();

  return {
    timezone: VANCOUVER_TZ,
    isWeekend,
    intervalMinutes,
    refreshIntervalSeconds,
    slotType,
    currentSlotStartUtc,
    currentSlotEndUtc,
    currentSlotKey: slotKey(currentSlotStartUtc),
    currentSlotEndKey: slotKey(currentSlotEndUtc),
    nextSlotKey: slotKey(nextSlotUtc),
    nextSlotEndKey: slotKey(nextSlotEndUtc),
    isPrefetchMinute,
    targetPrefetchSlotKey: slotKey(nextSlotUtc),
    targetPrefetchSlotEndKey: slotKey(nextSlotEndUtc),
  };
}

export function isDbMode(): boolean {
  const mode = (process.env.SNAPSHOT_SOURCE || 'live').toLowerCase();
  return mode === 'db';
}
