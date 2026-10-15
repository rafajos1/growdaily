import { describe, expect, it } from "vitest";
import { buildInsightInput, needsSupport, parseEntries, sleepVsMood, streak, tagImpact, upsert } from "./logic";
import { sampleEntries } from "./sample";
import type { Entry, Tag } from "./types";

const e = (date: string, mood: number, tags: Tag[] = [], sleep: number | null = 7): Entry => ({ date, mood, energy: 3, sleep, tags, note: "secret" });
const today = "2024-06-12";

describe("entries", () => {
  it("keeps one entry per day, sorted", () => {
    const list = upsert(upsert([e("2024-06-11", 3)], e("2024-06-10", 4)), e("2024-06-11", 5));
    expect(list.map((x) => [x.date, x.mood])).toEqual([["2024-06-10", 4], ["2024-06-11", 5]]);
  });

  it("counts a streak that hasn't been broken by an unfinished today", () => {
    const list = [e("2024-06-09", 3), e("2024-06-10", 3), e("2024-06-11", 3)];
    expect(streak(list, today)).toBe(3);
    expect(streak([...list, e(today, 4)], today)).toBe(4);
    expect(streak([e("2024-06-08", 3)], today)).toBe(0);
  });

  it("drops malformed stored entries", () => {
    const raw = JSON.stringify({ entries: [e("2024-06-01", 3, ["exercise", "bogus" as Tag]), { date: "x", mood: 3, energy: 3 }, { date: "2024-06-02", mood: 9, energy: 3 }] });
    const parsed = parseEntries(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].tags).toEqual(["exercise"]);
  });
});

describe("patterns", () => {
  const list = [
    e("2024-06-01", 4, ["exercise"]), e("2024-06-02", 5, ["exercise"]), e("2024-06-03", 4, ["exercise"]),
    e("2024-06-04", 2), e("2024-06-05", 3), e("2024-06-06", 2),
  ];

  it("measures how tags relate to mood", () => {
    expect(tagImpact(list)[0]).toMatchObject({ tag: "exercise", withMood: 4.3, withoutMood: 2.3, diff: 2, days: 3 });
    expect(tagImpact(list.slice(0, 4))).toEqual([]); // not enough days without the tag
  });

  it("groups sleep into buckets", () => {
    const s = sleepVsMood([e("2024-06-01", 2, [], 5), e("2024-06-02", 4, [], 7.5), e("2024-06-03", 5, [], 7), e("2024-06-04", 3, [], null)]);
    expect(s.map((b) => b.mood)).toEqual([2, null, 4.5, null]);
  });
});

describe("support check", () => {
  it("flags three awful days in a row", () => {
    expect(needsSupport([e("2024-06-10", 1), e("2024-06-11", 1), e(today, 1)], today)).toBe(true);
    expect(needsSupport([e("2024-06-10", 1), e("2024-06-11", 2), e(today, 1)], today)).toBe(false);
  });

  it("flags a low week", () => {
    const low = ["06", "07", "08", "10", "11"].map((d, i) => e(`2024-06-${d}`, i % 2 ? 2 : 1));
    expect(needsSupport(low, today)).toBe(true);
  });
});

describe("insight input", () => {
  it("summarizes numbers and never includes notes", () => {
    const input = buildInsightInput(sampleEntries(today), today);
    expect(input.days).toBeGreaterThan(20);
    expect(JSON.stringify(input)).not.toContain("secret");
    expect(input.tagImpact.find((t) => t.tag === "work stress")?.diff).toBeLessThan(0);
    expect(input.tagImpact.find((t) => t.tag === "exercise")?.diff).toBeGreaterThan(0);
  });
});
