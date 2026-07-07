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
