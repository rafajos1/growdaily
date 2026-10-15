import { describe, expect, it } from "vitest";
import { basicPlan, currentBlockIndex, findTime, formatTime, normalizePlan, splitDump, toMinutes } from "./plan";

describe("time helpers", () => {
  it("parses and formats clock times", () => {
    expect(toMinutes("09:30")).toBe(570);
    expect(toMinutes("9:30")).toBeNull();
    expect(toMinutes("24:00")).toBeNull();
    expect(formatTime("13:05")).toBe("1:05 PM");
    expect(formatTime("00:15")).toBe("12:15 AM");
  });

  it("finds times written in items", () => {
    expect(findTime("Dentist at 3:30pm")).toBe(15 * 60 + 30);
    expect(findTime("standup 9am")).toBe(9 * 60);
    expect(findTime("call at 12pm")).toBe(12 * 60);
    expect(findTime("sync 14:30")).toBe(14 * 60 + 30);
    expect(findTime("read 20 pages")).toBeNull();
  });

  it("splits a messy dump into items", () => {
    expect(splitDump("- email Jo\n2) gym; pay rent\n\n• x\n  read")).toEqual(["email Jo", "gym", "pay rent", "read"]);
  });
});

describe("normalizePlan", () => {
  it("drops invalid and overlapping blocks, clamps to the day, and sorts", () => {
    const plan = normalizePlan(
      {
        summary: "  ok  ",
        top3: ["a", "b", "c", "d"],
        blocks: [
          { start: "10:00", end: "11:00", title: "B", kind: "focus" },
          { start: "08:00", end: "09:30", title: "A", kind: "task" },
          { start: "10:30", end: "11:30", title: "overlap", kind: "task" },
          { start: "nope", end: "12:00", title: "bad", kind: "task" },
          { start: "12:00", end: "11:00", title: "backwards", kind: "task" },
          { start: "16:30", end: "18:00", title: "C", kind: "weird" },
        ],
        later: [{ title: "x", reason: "y" }, { title: "", reason: "z" }],
      },
      "09:00",
      "17:00",
    );
    expect(plan.summary).toBe("ok");
    expect(plan.top3).toEqual(["a", "b", "c"]);
    expect(plan.blocks).toEqual([
      { start: "09:00", end: "09:30", title: "A", kind: "task" },
      { start: "10:00", end: "11:00", title: "B", kind: "focus" },
      { start: "16:30", end: "17:00", title: "C", kind: "task" },
    ]);
    expect(plan.later).toEqual([{ title: "x", reason: "y" }]);
  });

  it("survives garbage input", () => {
    expect(normalizePlan(null, "09:00", "17:00")).toEqual({ summary: "", top3: [], blocks: [], later: [] });
  });
});

describe("basicPlan", () => {
  it("places timed items as fixed blocks and fills the gaps", () => {
    const p = basicPlan("write report\ncall bank\ndentist at 10am", "09:00", "12:00");
    expect(p.blocks).toEqual([
      { start: "09:00", end: "10:00", title: "write report", kind: "focus" },
      { start: "10:00", end: "11:00", title: "dentist at 10am", kind: "fixed" },
      { start: "11:00", end: "11:30", title: "call bank", kind: "task" },
    ]);
    expect(p.later).toEqual([]);
  });

  it("adds breaks and moves what doesn't fit to later", () => {
    const p = basicPlan("a long one\nanother long one\nthird long one", "09:00", "11:30");
    expect(p.blocks.map((b) => b.title)).toEqual(["a long one", "another long one", "Break"]);
    expect(p.later.map((l) => l.title)).toEqual(["third long one"]);
  });

  it("starts from now when planning mid-day", () => {
    const p = basicPlan("write", "09:00", "17:00", 13 * 60 + 5);
    expect(p.blocks[0].start).toBe("13:15");
  });
});

describe("currentBlockIndex", () => {
  const plan = normalizePlan({ blocks: [{ start: "09:00", end: "10:00", title: "A", kind: "focus" }, { start: "11:00", end: "12:00", title: "B", kind: "task" }] }, "08:00", "18:00");
  it("finds the current, next, or none", () => {
    expect(currentBlockIndex(plan, 9 * 60 + 30)).toBe(0);
    expect(currentBlockIndex(plan, 10 * 60 + 30)).toBe(1);
    expect(currentBlockIndex(plan, 13 * 60)).toBe(-1);
  });
});
