import { describe, expect, it } from "vitest";
import { chapterUrl, FAITH_HABITS, verseFor, VERSES } from "./faith";

describe("verseFor", () => {
  it("is stable within a day and changes the next day", () => {
    expect(verseFor("2026-10-16")).toBe(verseFor("2026-10-16"));
    expect(verseFor("2026-10-17")).not.toBe(verseFor("2026-10-16"));
  });

  it("cycles through every verse before repeating", () => {
    const seen = new Set<string>();
    for (let i = 0; i < VERSES.length; i++) {
      const d = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      seen.add(verseFor(d).ref);
    }
    expect(seen.size).toBe(VERSES.length);
  });
});

describe("faith content", () => {
  it("has unique references and chapter links", () => {
    expect(new Set(VERSES.map((v) => v.ref)).size).toBe(VERSES.length);
    expect(chapterUrl(VERSES[0])).toBe("https://www.biblegateway.com/passage/?search=Psalm%2046&version=KJV");
  });

  it("keeps preset habit names within the form's 40-character limit", () => {
    for (const h of FAITH_HABITS) expect(h.name.length).toBeLessThanOrEqual(40);
  });
});
