/**
 * "Your day" across GrowDaily: which apps someone has finished today, stored on
 * their device, so each app can point to what's next. Spendwise keeps a copy of
 * this logic (expense-tracker/src/lib/journey.ts) because it's built separately.
 */
export const DAY_KEY = "growdaily:day";
export const DAY_EVENT = "growdaily:day-change";

/** The order a day tends to flow in: plan the morning, finish with an evening check-in. */
export const DAY_ORDER = ["planwise", "habitwise", "spendwise", "mealwise", "moodwise"] as const;
export type AppSlug = (typeof DAY_ORDER)[number];

export function localISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function readDone(today: string = localISO()): AppSlug[] {
  try {
    const raw = JSON.parse(localStorage.getItem(DAY_KEY) ?? "null") as { date?: string; done?: unknown } | null;
    if (!raw || raw.date !== today || !Array.isArray(raw.done)) return [];
    return DAY_ORDER.filter((s) => (raw.done as unknown[]).includes(s));
  } catch {
    return [];
  }
}

/** Records that an app's main thing is done today. Returns the updated list. */
export function markDone(slug: AppSlug, today: string = localISO()): AppSlug[] {
  const done = readDone(today);
  if (done.includes(slug)) return done;
  const next = DAY_ORDER.filter((s) => s === slug || done.includes(s));
  try {
    localStorage.setItem(DAY_KEY, JSON.stringify({ date: today, done: next }));
  } catch {
    /* storage unavailable: suggestions still work for this visit */
  }
  window.dispatchEvent(new CustomEvent(DAY_EVENT));
  return next;
}

/** Apps still to do today, starting with the ones that come after `current` in the day. */
export function nextApps(current: AppSlug, done: AppSlug[], limit = 2): AppSlug[] {
  const i = DAY_ORDER.indexOf(current);
  const rotated = [...DAY_ORDER.slice(i + 1), ...DAY_ORDER.slice(0, i)];
  return rotated.filter((s) => !done.includes(s)).slice(0, limit);
}
