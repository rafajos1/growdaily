import { addDays } from "../habitwise/dates";
import type { Entry, Tag } from "./types";

/** Five weeks of believable check-ins: sleep and exercise lift mood, alcohol and work stress drag it. */
export function sampleEntries(today: string): Entry[] {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const entries: Entry[] = [];
  for (let i = 35; i >= 1; i--) {
    if (rand() < 0.12) continue; // a few skipped days
    const date = addDays(today, -i);
    const tags: Tag[] = [];
    if (rand() < 0.45) tags.push("exercise");
    if (rand() < 0.35) tags.push("outdoors");
    if (rand() < 0.3) tags.push("friends");
    if (rand() < 0.35) tags.push("work stress");
    if (rand() < 0.6) tags.push("caffeine");
    if (rand() < 0.2) tags.push("alcohol");
    if (rand() < 0.4) tags.push("late screens");
    const sleep = Math.round((5.5 + rand() * 3 - (tags.includes("late screens") ? 0.7 : 0)) * 2) / 2;
    let score = 3 + (sleep - 7) * 0.6;
    if (tags.includes("exercise")) score += 0.7;
    if (tags.includes("outdoors")) score += 0.4;
    if (tags.includes("friends")) score += 0.5;
    if (tags.includes("work stress")) score -= 0.9;
    if (tags.includes("alcohol")) score -= 0.6;
    score += (rand() - 0.5) * 0.8;
    const mood = Math.min(5, Math.max(1, Math.round(score)));
    const energy = Math.min(5, Math.max(1, Math.round(score + (sleep - 7) * 0.4 + (tags.includes("caffeine") ? 0.3 : 0))));
    entries.push({ date, mood, energy, sleep, tags, note: "" });
  }
  return entries;
}
