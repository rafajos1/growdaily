import { describe, expect, it } from "vitest";
import { needsCrisisHelp, normalizeAnswer, STARTERS, starterFor } from "./ask";
import { chapterLink, parseRef } from "./bible";

describe("parseRef", () => {
  it("normalizes real references", () => {
    expect(parseRef("John 3:16")).toEqual({ ref: "John 3:16", chapter: "John 3" });
    expect(parseRef("1 Peter 5:7")?.ref).toBe("1 Peter 5:7");
    expect(parseRef("1peter 5:7")?.ref).toBe("1 Peter 5:7");
    expect(parseRef("Luke 23:39-43")?.ref).toBe("Luke 23:39–43");
    expect(parseRef("Psalms 13")).toEqual({ ref: "Psalm 13", chapter: "Psalm 13" });
    expect(parseRef("Song of Solomon 2:4")?.ref).toBe("Song of Songs 2:4");
    expect(parseRef("Jude 24")?.ref).toBe("Jude 1:24");
  });

  it("drops references that don't exist", () => {
    expect(parseRef("Hezekiah 3:1")).toBeNull(); // not a book
    expect(parseRef("John 22:1")).toBeNull(); // John has 21 chapters
    expect(parseRef("Psalm 151")).toBeNull();
    expect(parseRef("Mark 4:10-2")).toBeNull();
    expect(parseRef("God is love")).toBeNull();
  });

  it("links to the whole chapter in the NLT", () => {
    expect(chapterLink(parseRef("1 John 1:9")!)).toBe("https://www.biblegateway.com/passage/?search=1%20John%201&version=NLT");
  });
});

describe("normalizeAnswer", () => {
  it("keeps valid passages, drops invented ones, and caps lengths", () => {
    const a = normalizeAnswer(
      {
        answer: "x".repeat(3000),
        differ: "",
        passages: [{ ref: "John 3:16", why: "Love" }, { ref: "Opinions 4:2", why: "?" }, { ref: "John 3:16", why: "dup" }, { ref: "Romans 8:28", why: "" }, { ref: "Psalm 23", why: "" }, { ref: "Micah 6:8", why: "" }],
        nextStep: "Read John.",
        followUps: ["a", "b", "c", "d"],
      },
      "Q?",
    )!;
    expect(a.answer).toHaveLength(2400);
    expect(a.passages.map((p) => p.ref)).toEqual(["John 3:16", "Romans 8:28", "Psalm 23"]);
    expect(a.followUps).toHaveLength(3);
    expect(a.source).toBe("ai");
  });

  it("rejects an empty answer", () => {
    expect(normalizeAnswer({ answer: "  " }, "Q?")).toBeNull();
    expect(normalizeAnswer(null, "Q?")).toBeNull();
  });
});

describe("starter answers", () => {
  it("all cite real passages and point to other starters", () => {
    const questions = new Set(STARTERS.map((s) => s.question));
    for (const s of STARTERS) {
      expect(s.passages.length).toBeGreaterThan(0);
      for (const p of s.passages) expect(p.ref).toBeTruthy();
      for (const f of s.followUps) expect(questions.has(f)).toBe(true);
      expect(s.answer).not.toMatch(/\btithe/i);
    }
  });

  it("matches a starter however it's typed", () => {
    expect(starterFor("is god real")?.question).toBe("Is God real?");
    expect(starterFor("Is God real?!")?.question).toBe("Is God real?");
    expect(starterFor("Is God real if I can't see him?")).toBeUndefined();
  });
});

describe("needsCrisisHelp", () => {
  it("notices signs of danger", () => {
    expect(needsCrisisHelp("Does God forgive suicide?")).toBe(true);
    expect(needsCrisisHelp("I want to die")).toBe(true);
    expect(needsCrisisHelp("sometimes I think about hurting myself")).toBe(true);
  });
  it("doesn't flag everyday questions", () => {
    expect(needsCrisisHelp("What happens when we die?")).toBe(false);
    expect(needsCrisisHelp("Why did Jesus have to die?")).toBe(false);
  });
});
