import { HABIT_COLORS, type Habit, type HabitData } from "./types";

export const STORAGE_KEY = "habitwise:v1";
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function isHabit(v: unknown): v is Habit {
  const h = v as Habit;
  return (
    !!h &&
    typeof h.id === "string" &&
    typeof h.name === "string" &&
    typeof h.color === "string" &&
    Array.isArray(h.days) &&
    h.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6) &&
    typeof h.startDate === "string" &&
    ISO.test(h.startDate)
  );
}

/** Parses stored data, dropping anything malformed instead of failing the whole load. */
export function parseData(raw: string | null): HabitData {
  if (!raw) return { habits: [], checks: {} };
  const parsed = JSON.parse(raw) as Partial<HabitData> | null;
  const habits = Array.isArray(parsed?.habits) ? parsed.habits.filter(isHabit) : [];
  const ids = new Set(habits.map((h) => h.id));
  const checks: Record<string, string[]> = {};
  for (const [id, dates] of Object.entries(parsed?.checks ?? {})) {
    if (ids.has(id) && Array.isArray(dates)) checks[id] = dates.filter((d) => typeof d === "string" && ISO.test(d));
  }
  return { habits: habits.map((h) => ({ ...h, color: h.color || HABIT_COLORS[0] })), checks };
}

export function loadData(): HabitData {
  return parseData(window.localStorage.getItem(STORAGE_KEY));
}

export function saveData(data: HabitData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
}

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
