import { describe, expect, it } from "vitest";
import type { Plan } from "./plan";
import { addQuietMoments, isQuiet, QUIET_TITLE } from "./quiet";

const plan = (blocks: [string, string, string][]): Plan => ({
  summary: "",
  top3: [],
  later: [],
  blocks: blocks.map(([start, end, title]) => ({ start, end, title, kind: "task" })),
});
const quiet = (p: Plan) => p.blocks.filter(isQuiet).map((b) => `${b.start}-${b.end}`);

describe("addQuietMoments", () => {
  it("adds morning, midday and evening moments into free time", () => {
    const p = addQuietMoments(plan([["09:00", "10:00", "Report"], ["12:00", "12:30", "Lunch"], ["16:00", "17:30", "Meetings"]]), "09:00", "17:30");
    expect(quiet(p)).toEqual(["10:00-10:10", "12:30-12:40"]);
  });

  it("puts the evening moment at the very end of the day when it's free", () => {
    const p = addQuietMoments(plan([["09:00", "10:00", "Report"]]), "09:00", "17:30");
    expect(quiet(p)).toEqual(["10:00-10:10", "12:00-12:10", "17:20-17:30"]);
  });

  it("never overlaps or moves existing blocks, and keeps the plan sorted", () => {
    const original = plan([["09:00", "11:00", "A"], ["11:30", "14:30", "B"], ["15:00", "17:30", "C"]]);
    const p = addQuietMoments(original, "09:00", "17:30");
    expect(p.blocks.filter((b) => !isQuiet(b))).toEqual(original.blocks);
    expect(quiet(p)).toEqual([]); // every window is already full
    const starts = p.blocks.map((b) => b.start);
    expect([...starts].sort()).toEqual(starts);
  });

  it("skips moments that would be in the past", () => {
    expect(quiet(addQuietMoments(plan([]), "09:00", "17:30", 13 * 60))).toEqual(["13:00-13:10", "17:20-17:30"]);
    expect(quiet(addQuietMoments(plan([]), "09:00", "17:30", 15 * 60))).toEqual(["17:20-17:30"]);
  });

  it("doesn't add them twice", () => {
    const once = addQuietMoments(plan([]), "09:00", "17:30");
    expect(addQuietMoments(once, "09:00", "17:30")).toBe(once);
    expect(once.blocks.every((b) => !isQuiet(b) || b.title === QUIET_TITLE)).toBe(true);
  });
});
