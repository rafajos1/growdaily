/**
 * Date helpers that work on local calendar dates in `YYYY-MM-DD` form.
 * Using plain strings avoids the classic `new Date("2024-01-01")` UTC
 * off-by-one-day bug in negative-offset time zones.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Parses `YYYY-MM-DD` into a local Date, or returns null if invalid. */
export function parseISODate(value: string): Date | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

export function isValidISODate(value: string): boolean {
  return parseISODate(value) !== null;
}

/** `YYYY-MM` key for grouping by month. */
export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function startOfMonthISO(date: Date = new Date()): string {
  return toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonthISO(date: Date = new Date()): string {
  return toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function daysAgoISO(days: number, from: Date = new Date()): string {
  return toISODate(new Date(from.getFullYear(), from.getMonth(), from.getDate() - days));
}

const longFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" });
const monthYearFormatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });

export function formatDate(isoDate: string): string {
  const d = parseISODate(isoDate);
  return d ? longFormatter.format(d) : isoDate;
}

export function formatMonthShort(key: string): string {
  const d = parseISODate(`${key}-01`);
  return d ? monthFormatter.format(d) : key;
}

export function formatMonthLong(key: string): string {
  const d = parseISODate(`${key}-01`);
  return d ? monthYearFormatter.format(d) : key;
}
