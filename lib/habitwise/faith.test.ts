import { describe, expect, it } from "vitest";
import { ENCOURAGEMENTS, encouragementFor, FAITH_HABITS, passageUrl } from "./faith";

describe("encouragementFor", () => {
  it("is stable within a day and changes the next day", () => {
    expect(encouragementFor("2026-10-16")).toBe(encouragementFor("2026-10-16"));
    expect(encouragementFor("2026-10-17")).not.toBe(encouragementFor("2026-10-16"));
  });

  it("cycles through every encouragement before repeating", () => {
    const seen = new Set<string>();
    for (let i = 0; i < ENCOURAGEMENTS.length; i++) {
      const d = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      seen.add(encouragementFor(d).ref);
    }
    expect(seen.size).toBe(ENCOURAGEMENTS.length);
  });
});

describe("faith content", () => {
  it("names a unique source passage for each encouragement and links to it", () => {
    expect(new Set(ENCOURAGEMENTS.map((e) => e.ref)).size).toBe(ENCOURAGEMENTS.length);
    for (const e of ENCOURAGEMENTS) expect(e.ref.startsWith(e.chapter.replace(/ \d+$/, ""))).toBe(true);
    expect(passageUrl(ENCOURAGEMENTS[0])).toBe("https://www.biblegateway.com/passage/?search=Psalm%2046&version=NLT");
  });

  it("speaks in everyday words rather than quoting", () => {
    for (const e of ENCOURAGEMENTS) expect(e.text).not.toMatch(/["“”]|\b(thee|thou|thy|hath|unto)\b/i);
  });

  it("keeps preset habit names within the form's 40-character limit", () => {
    for (const h of FAITH_HABITS) expect(h.name.length).toBeLessThanOrEqual(40);
  });
});
