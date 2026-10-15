import { addDays, weekday } from "../habitwise/dates";
import { MOOD_LABELS, TAGS, type Entry, type Tag } from "./types";

const DAY_NAMES = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

export function moodLabel(mood: number): string {
  return MOOD_LABELS[Math.min(Math.max(Math.round(mood), 1), 5) - 1];
}

/** Adds or replaces the entry for its date, keeping entries sorted by date. */
export function upsert(entries: Entry[], entry: Entry): Entry[] {
  return [...entries.filter((e) => e.date !== entry.date), entry].sort((a, b) => a.date.localeCompare(b.date));
}

export function inRange(entries: Entry[], today: string, days: number): Entry[] {
  const from = addDays(today, -(days - 1));
  return entries.filter((e) => e.date >= from && e.date <= today);
}

/** Consecutive days with a check-in, ending today (or yesterday if today isn't done yet). */
export function streak(entries: Entry[], today: string): number {
  const dates = new Set(entries.map((e) => e.date));
  let d = dates.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (dates.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export interface TagImpact {
  tag: Tag;
  withMood: number;
  withoutMood: number;
  diff: number;
  days: number;
}

/** Average mood on days with vs. without each tag; needs 3+ days on both sides to count. */
export function tagImpact(entries: Entry[]): TagImpact[] {
  return TAGS.map((tag) => {
    const yes = entries.filter((e) => e.tags.includes(tag)).map((e) => e.mood);
    const no = entries.filter((e) => !e.tags.includes(tag)).map((e) => e.mood);
    if (yes.length < 3 || no.length < 3) return null;
    const w = avg(yes)!, wo = avg(no)!;
    return { tag, withMood: round1(w)!, withoutMood: round1(wo)!, diff: round1(w - wo)!, days: yes.length };
  })
    .filter((t): t is TagImpact => t !== null && Math.abs(t.diff) >= 0.3)
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
}

export const SLEEP_BUCKETS = [
  { label: "Under 6h", min: 0, max: 6 },
  { label: "6–7h", min: 6, max: 7 },
  { label: "7–8h", min: 7, max: 8 },
  { label: "8h+", min: 8, max: 99 },
];

export function sleepVsMood(entries: Entry[]): { label: string; mood: number | null; days: number }[] {
  return SLEEP_BUCKETS.map((b) => {
    const moods = entries.filter((e) => e.sleep !== null && e.sleep >= b.min && e.sleep < b.max).map((e) => e.mood);
    return { label: b.label, mood: round1(avg(moods)), days: moods.length };
  });
}

export function weekdayMood(entries: Entry[]): (number | null)[] {
  return Array.from({ length: 7 }, (_, d) => round1(avg(entries.filter((e) => weekday(e.date) === d).map((e) => e.mood))));
}

/**
 * True when recent check-ins suggest a hard stretch: the last 3 days all "Awful",
 * or the last 5 check-ins (within 7 days) averaging "Low" or below.
 */
export function needsSupport(entries: Entry[], today: string): boolean {
  const recent = inRange(entries, today, 7);
  const last3 = [0, 1, 2].map((i) => entries.find((e) => e.date === addDays(today, -i)));
  if (last3.every((e) => e && e.mood === 1)) return true;
  const last5 = recent.slice(-5);
  return last5.length >= 5 && avg(last5.map((e) => e.mood))! <= 1.8;
}

export interface InsightInput {
  days: number;
  averageMood: number | null;
  averageEnergy: number | null;
  averageSleep: number | null;
  tagImpact: TagImpact[];
  sleepVsMood: { label: string; mood: number | null; days: number }[];
  bestWeekday: string | null;
  worstWeekday: string | null;
  last7Mood: number | null;
  previous7Mood: number | null;
  lowStretch: boolean;
}

/** Numbers and tag names only; notes never leave the device. */
export function buildInsightInput(entries: Entry[], today: string): InsightInput {
  const last30 = inRange(entries, today, 30);
  const wd = weekdayMood(last30);
  const filled = wd.map((v, i) => ({ v, i })).filter((x) => x.v !== null) as { v: number; i: number }[];
  const best = filled.length >= 3 ? filled.reduce((a, b) => (b.v > a.v ? b : a)) : null;
  const worst = filled.length >= 3 ? filled.reduce((a, b) => (b.v < a.v ? b : a)) : null;
  const sleeps = last30.map((e) => e.sleep).filter((s): s is number => s !== null);
  return {
    days: last30.length,
    averageMood: round1(avg(last30.map((e) => e.mood))),
    averageEnergy: round1(avg(last30.map((e) => e.energy))),
    averageSleep: round1(avg(sleeps)),
    tagImpact: tagImpact(last30).slice(0, 5),
    sleepVsMood: sleepVsMood(last30),
    bestWeekday: best && worst && best.v - worst.v >= 0.5 ? DAY_NAMES[best.i] : null,
    worstWeekday: best && worst && best.v - worst.v >= 0.5 ? DAY_NAMES[worst.i] : null,
    last7Mood: round1(avg(inRange(entries, today, 7).map((e) => e.mood))),
    previous7Mood: round1(avg(inRange(entries, addDays(today, -7), 7).map((e) => e.mood))),
    lowStretch: needsSupport(entries, today),
  };
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function parseEntries(raw: string | null): Entry[] {
  if (!raw) return [];
  const list = (JSON.parse(raw) as { entries?: unknown })?.entries;
  if (!Array.isArray(list)) return [];
  const ok = (n: unknown) => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= 5;
  return list
    .filter((e): e is Entry => !!e && typeof e.date === "string" && ISO.test(e.date) && ok(e.mood) && ok(e.energy))
    .map((e) => ({
      date: e.date,
      mood: e.mood,
      energy: e.energy,
      sleep: typeof e.sleep === "number" && e.sleep >= 0 && e.sleep <= 16 ? e.sleep : null,
      tags: Array.isArray(e.tags) ? e.tags.filter((t): t is Tag => (TAGS as readonly string[]).includes(t)) : [],
      note: typeof e.note === "string" ? e.note.slice(0, 200) : "",
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
