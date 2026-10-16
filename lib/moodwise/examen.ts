import { ENCOURAGEMENTS, type Encouragement } from "../habitwise/faith";
import type { Entry } from "./types";

/** Encouragements of comfort from the shared list, offered after a low check-in. */
const COMFORT_REFS = ["Psalm 34:18", "Matthew 11:28", "1 Peter 5:7", "Isaiah 41:10", "John 14:27"];
export const COMFORT: Encouragement[] = COMFORT_REFS.map((ref) => {
  const v = ENCOURAGEMENTS.find((x) => x.ref === ref);
  if (!v) throw new Error(`Missing encouragement ${ref}`);
  return v;
});

export function comfortFor(iso: string): Encouragement {
  const [y, m, d] = iso.split("-").map(Number);
  return COMFORT[Math.floor(Date.UTC(y, m - 1, d) / 86_400_000) % COMFORT.length];
}

/** Mood 1–2 ("Awful", "Low"). */
export const isHardDay = (e: Entry) => e.mood <= 2;

/** The most recent good things someone noticed, newest first. */
export function recentGifts(entries: Entry[], limit = 8): { date: string; text: string }[] {
  return entries
    .filter((e) => e.gift)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((e) => ({ date: e.date, text: e.gift! }));
}
