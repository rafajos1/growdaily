import { addDays, weekday } from "./dates";
import type { Habit, HabitData } from "./types";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isScheduled(habit: Habit, date: string): boolean {
  return date >= habit.startDate && habit.days.includes(weekday(date));
}

export function isDone(data: HabitData, habitId: string, date: string): boolean {
  return data.checks[habitId]?.includes(date) ?? false;
}

export function toggleCheck(data: HabitData, habitId: string, date: string): HabitData {
  const current = data.checks[habitId] ?? [];
  const next = current.includes(date) ? current.filter((d) => d !== date) : [...current, date].sort();
  return { ...data, checks: { ...data.checks, [habitId]: next } };
}

export function describeSchedule(days: number[]): string {
  const sorted = [...days].sort();
  if (sorted.length === 7) return "Every day";
  if (sorted.join() === "1,2,3,4,5") return "Weekdays";
  if (sorted.join() === "0,6") return "Weekends";
  return sorted.map((d) => SHORT[d]).join(", ");
}

/**
 * Consecutive scheduled days completed, counting back from today. If today is
 * scheduled but not done yet, it doesn't break the streak (the day isn't over).
 */
export function currentStreak(data: HabitData, habit: Habit, today: string): number {
  let streak = 0;
  let date = today;
  if (isScheduled(habit, today) && !isDone(data, habit.id, today)) date = addDays(today, -1);
  for (let i = 0; i < 3660 && date >= habit.startDate; i++, date = addDays(date, -1)) {
    if (!isScheduled(habit, date)) continue;
    if (!isDone(data, habit.id, date)) break;
    streak++;
  }
  return streak;
}

export function bestStreak(data: HabitData, habit: Habit, today: string): number {
  let best = 0;
  let run = 0;
  for (let date = habit.startDate, i = 0; date <= today && i < 3660; date = addDays(date, 1), i++) {
    if (!isScheduled(habit, date)) continue;
    if (isDone(data, habit.id, date)) best = Math.max(best, ++run);
    else if (date !== today) run = 0;
  }
  return best;
}

export interface Rate {
  done: number;
  scheduled: number;
  /** 0..1, or null when nothing was scheduled. */
  rate: number | null;
}

/** Completion over the last `days` days ending today (today counts only if done). */
export function completionRate(data: HabitData, habit: Habit, today: string, days: number): Rate {
  let done = 0;
  let scheduled = 0;
  for (let i = 0; i < days; i++) {
    const date = addDays(today, -i);
    if (!isScheduled(habit, date)) continue;
    const ok = isDone(data, habit.id, date);
    if (date === today && !ok) continue;
    scheduled++;
    if (ok) done++;
  }
  return { done, scheduled, rate: scheduled ? done / scheduled : null };
}

/** Missed scheduled days per weekday over the last `days` days (today excluded). */
export function missesByWeekday(data: HabitData, habits: Habit[], today: string, days: number): number[] {
  const misses = new Array<number>(7).fill(0);
  for (let i = 1; i <= days; i++) {
    const date = addDays(today, -i);
    for (const h of habits) if (isScheduled(h, date) && !isDone(data, h.id, date)) misses[weekday(date)]++;
  }
  return misses;
}

/** Share of all scheduled habits completed on a date, or null if nothing was scheduled. */
export function dayScore(data: HabitData, habits: Habit[], date: string): number | null {
  const scheduled = habits.filter((h) => isScheduled(h, date));
  if (scheduled.length === 0) return null;
  return scheduled.filter((h) => isDone(data, h.id, date)).length / scheduled.length;
}

export function todayProgress(data: HabitData, habits: Habit[], today: string) {
  const due = habits.filter((h) => isScheduled(h, today));
  return { due: due.length, done: due.filter((h) => isDone(data, h.id, today)).length };
}

export interface ReviewInput {
  week: { done: number; scheduled: number };
  habits: {
    name: string;
    schedule: string;
    last7: string;
    rate30: number | null;
    currentStreak: number;
    bestStreak: number;
  }[];
  weakestDay: string | null;
}

/** Compact, anonymous summary sent to the AI for the weekly review. */
export function buildReviewInput(data: HabitData, today: string): ReviewInput {
  const habits = data.habits;
  let done = 0;
  let scheduled = 0;
  const summaries = habits.map((h) => {
    const r7 = completionRate(data, h, today, 7);
    done += r7.done;
    scheduled += r7.scheduled;
    const r30 = completionRate(data, h, today, 30);
    return {
      name: h.name,
      schedule: describeSchedule(h.days),
      last7: `${r7.done}/${r7.scheduled}`,
      rate30: r30.rate === null ? null : Math.round(r30.rate * 100),
      currentStreak: currentStreak(data, h, today),
      bestStreak: bestStreak(data, h, today),
    };
  });
  const misses = missesByWeekday(data, habits, today, 28);
  const max = Math.max(...misses);
  return { week: { done, scheduled }, habits: summaries, weakestDay: max > 0 ? DAY_NAMES[misses.indexOf(max)] : null };
}
