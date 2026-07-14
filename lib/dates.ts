// All dates in this app are treated as UTC calendar dates (midnight UTC).
// Never mix these with local-timezone Date getters (getFullYear/getMonth/getDate) —
// always use the getUTC* equivalents, or a week can silently shift by a day.

const DAY_MS = 24 * 60 * 60 * 1000;

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function dateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function todayUTCDateOnly(): Date {
  return dateOnly(new Date());
}

export function mondayOf(date: Date): Date {
  const d = dateOnly(date);
  const day = d.getUTCDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? 6 : day - 1;
  return new Date(d.getTime() - diffToMonday * DAY_MS);
}

export function parseWeekParam(weekParam: string | undefined): Date {
  if (weekParam) {
    const parsed = new Date(`${weekParam}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) return mondayOf(parsed);
  }
  return mondayOf(todayUTCDateOnly());
}

export function weekParamFor(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function shiftWeek(weekOf: Date, delta: number): Date {
  return new Date(weekOf.getTime() + delta * 7 * DAY_MS);
}

export function parseDayParam(dayParam: string | undefined): Date {
  if (dayParam) {
    const parsed = new Date(`${dayParam}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) return dateOnly(parsed);
  }
  return todayUTCDateOnly();
}

export function shiftDay(day: Date, delta: number): Date {
  return new Date(day.getTime() + delta * DAY_MS);
}

export function formatFullDate(date: Date): string {
  return `${formatMonthDay(date)}, ${date.getUTCFullYear()}`;
}

export function dayDate(weekOf: Date, dayOfWeek: number): Date {
  return new Date(weekOf.getTime() + dayOfWeek * DAY_MS);
}

export function formatMonthDay(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

export function formatDayNum(date: Date): string {
  return String(date.getUTCDate());
}

export function formatWeekRange(weekOf: Date): string {
  const end = dayDate(weekOf, 6);
  const sameMonth = weekOf.getUTCMonth() === end.getUTCMonth();
  const startFmt = formatMonthDay(weekOf);
  const endFmt = sameMonth
    ? `${end.getUTCDate()}, ${end.getUTCFullYear()}`
    : `${formatMonthDay(end)}, ${end.getUTCFullYear()}`;
  return `${startFmt} – ${endFmt}`;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((dateOnly(b).getTime() - dateOnly(a).getTime()) / DAY_MS);
}

export function quarterStart(date: Date): Date {
  const d = dateOnly(date);
  const q = Math.floor(d.getUTCMonth() / 3);
  return new Date(Date.UTC(d.getUTCFullYear(), q * 3, 1));
}

export function quarterEnd(qStart: Date): Date {
  return new Date(Date.UTC(qStart.getUTCFullYear(), qStart.getUTCMonth() + 3, 0));
}

export function shiftQuarter(qStart: Date, delta: number): Date {
  return new Date(Date.UTC(qStart.getUTCFullYear(), qStart.getUTCMonth() + delta * 3, 1));
}

export function parseQuarterParam(param: string | undefined): Date {
  if (param) {
    const parsed = new Date(`${param}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) return quarterStart(parsed);
  }
  return quarterStart(todayUTCDateOnly());
}

export function quarterParamFor(date: Date): string {
  return weekParamFor(date);
}

export function quarterLabel(qStart: Date): string {
  const q = Math.floor(qStart.getUTCMonth() / 3) + 1;
  return `Q${q} ${qStart.getUTCFullYear()}`;
}

// ---- Browser-local-time helpers ----
// The server (Vercel) always runs in UTC, so "today"/"this week" computed
// server-side can be a full calendar day ahead of the viewer's actual local
// day for part of the evening in any timezone behind UTC. These use the
// browser's LOCAL Date getters on purpose and must only be called client-side
// (e.g. to redirect a bare "/" URL to an explicit ?day=/&week= once mounted).

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function localDateParamNow(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function localMondayParamNow(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun ... 6 = Sat, local
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
  return `${monday.getFullYear()}-${pad2(monday.getMonth() + 1)}-${pad2(monday.getDate())}`;
}

export function localQuarterParamNow(): string {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3);
  return `${now.getFullYear()}-${pad2(q * 3 + 1)}-01`;
}
