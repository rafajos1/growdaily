import { describe, expect, it } from "vitest";
import { addDays } from "./dates";
import {
  bestStreak,
  buildReviewInput,
  completionRate,
  currentStreak,
  dayScore,
  describeSchedule,
  missesByWeekday,
  toggleCheck,
} from "./logic";
import { parseData } from "./storage";
import type { Habit, HabitData } from "./types";

// 2024-06-12 is a Wednesday.
const today = "2024-06-12";
const daily: Habit = { id: "a", name: "Read", color: "#000", days: [0, 1, 2, 3, 4, 5, 6], startDate: "2024-06-01", createdAt: "" };
const weekdaysOnly: Habit = { ...daily, id: "b", name: "Gym", days: [1, 2, 3, 4, 5] };
const data = (checks: Record<string, string[]>): HabitData => ({ habits: [daily, weekdaysOnly], checks });

describe("streaks", () => {
  it("counts back from today and keeps an unfinished today from breaking it", () => {
    const d = data({ a: ["2024-06-09", "2024-06-10", "2024-06-11"] });
    expect(currentStreak(d, daily, today)).toBe(3);
    expect(currentStreak(toggleCheck(d, "a", today), daily, today)).toBe(4);
  });

  it("skips unscheduled days", () => {
    // Fri 7th, Mon 10th, Tue 11th done; weekend not scheduled.
    const d = data({ b: ["2024-06-07", "2024-06-10", "2024-06-11"] });
    expect(currentStreak(d, weekdaysOnly, today)).toBe(3);
  });

  it("breaks on a missed scheduled day", () => {
    const d = data({ a: ["2024-06-08", "2024-06-09", "2024-06-11"] });
    expect(currentStreak(d, daily, today)).toBe(1);
    expect(bestStreak(d, daily, today)).toBe(2);
  });
});

describe("rates and patterns", () => {
  it("ignores an unfinished today and days before the habit started", () => {
    const d = data({ a: ["2024-06-10", "2024-06-11"] });
    expect(completionRate(d, daily, today, 30)).toEqual({ done: 2, scheduled: 11, rate: 2 / 11 });
  });

  it("counts misses by weekday", () => {
    const misses = missesByWeekday(data({}), [weekdaysOnly], today, 7);
    expect(misses).toEqual([0, 1, 1, 1, 1, 1, 0]); // Wed 5, Thu 6, Fri 7, Mon 10, Tue 11
  });

  it("scores a day across all scheduled habits", () => {
    expect(dayScore(data({ a: ["2024-06-10"] }), [daily, weekdaysOnly], "2024-06-10")).toBe(0.5);
    expect(dayScore(data({}), [weekdaysOnly], "2024-06-09")).toBeNull(); // Sunday
  });

  it("describes schedules in plain words", () => {
    expect(describeSchedule([0, 1, 2, 3, 4, 5, 6])).toBe("Every day");
    expect(describeSchedule([5, 1, 2, 3, 4])).toBe("Weekdays");
    expect(describeSchedule([1, 3])).toBe("Mon, Wed");
  });

  it("builds a compact review summary", () => {
    const d = data({ a: [addDays(today, -1), addDays(today, -2)] });
    const r = buildReviewInput(d, today);
    expect(r.habits[0]).toMatchObject({ name: "Read", last7: "2/6", currentStreak: 2 });
    expect(r.week.scheduled).toBeGreaterThan(0);
  });
});

describe("storage", () => {
  it("drops malformed habits and orphaned checks", () => {
    const raw = JSON.stringify({ habits: [daily, { id: 1 }], checks: { a: ["2024-06-01", "bad"], zzz: ["2024-06-01"] } });
    expect(parseData(raw)).toEqual({ habits: [daily], checks: { a: ["2024-06-01"] } });
  });
});
