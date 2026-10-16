import { fromMinutes, toMinutes, type Block, type Plan } from "./plan";

export const QUIET_TITLE = "Quiet moment";
const LENGTH = 10;

export const isQuiet = (b: Block) => b.kind === "break" && b.title === QUIET_TITLE;

/**
 * With Faith on: adds up to three 10-minute quiet moments to a plan (morning,
 * midday and the end of the day), each in the first free slot of its window.
 * Nothing is moved or dropped; a window with no room simply gets no quiet moment.
 */
export function addQuietMoments(plan: Plan, dayStart: string, dayEnd: string, nowMinutes = 0): Plan {
  if (plan.blocks.some(isQuiet)) return plan;
  const lo = Math.max(toMinutes(dayStart) ?? 9 * 60, Math.ceil(nowMinutes / 5) * 5);
  const hi = toMinutes(dayEnd) ?? 17 * 60;
  const busy = plan.blocks.map((b) => ({ s: toMinutes(b.start)!, e: toMinutes(b.end)! }));
  const free = (s: number) => s >= lo && s + LENGTH <= hi && busy.every((b) => s + LENGTH <= b.s || s >= b.e);

  const startOfDay = toMinutes(dayStart) ?? 9 * 60;
  // Each window is searched from its first minute, the evening one from its last.
  const windows: { from: number; to: number; step: number }[] = [
    { from: startOfDay, to: startOfDay + 60, step: 5 },
    { from: 12 * 60, to: 14 * 60, step: 5 },
    { from: hi - LENGTH, to: hi - 60, step: -5 },
  ];

  const added: Block[] = [];
  for (const w of windows) {
    for (let s = w.from; w.step > 0 ? s <= w.to : s >= w.to; s += w.step) {
      if (free(s)) {
        busy.push({ s, e: s + LENGTH });
        added.push({ start: fromMinutes(s), end: fromMinutes(s + LENGTH), title: QUIET_TITLE, kind: "break" });
        break;
      }
    }
  }
  if (added.length === 0) return plan;
  return { ...plan, blocks: [...plan.blocks, ...added].sort((a, b) => a.start.localeCompare(b.start)) };
}
