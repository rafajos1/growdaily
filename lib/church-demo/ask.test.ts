import { describe, expect, it } from "vitest";
import { checkAnswer, NOT_FOUND, systemPrompt } from "./ask";
import { LIBRARY } from "./library";

describe("church library assistant", () => {
  it("keeps citations that really appear in the document", () => {
    const a = checkAnswer(
      { found: true, answer: "Services are at 9 and 11.", crisis: false, citations: [{ docId: "about", quote: "Sunday services are at 9:00 and 11:00 am at 1200 Example Road." }] },
      "When are services?",
    );
    expect(a.found).toBe(true);
    expect(a.citations).toHaveLength(1);
    expect(a.citations[0].title).toBe("About Cedar Hill Fellowship");
  });

  it("tolerates spacing, case and curly quotes in a quote", () => {
    const a = checkAnswer({ found: true, answer: "x", crisis: false, citations: [{ docId: "sermon-silent", quote: "  feelings of God’s absence are NOT proof of God's absence. " }] }, "q");
    expect(a.citations).toHaveLength(1);
  });

  it("drops invented quotes and unknown documents, and then declines", () => {
    const a = checkAnswer(
      {
        found: true,
        answer: "We think the election matters a lot.",
        crisis: false,
        citations: [
          { docId: "beliefs", quote: "We believe Christians should vote for the best candidate." },
          { docId: "nope", quote: "Sunday services are at 9:00 and 11:00 am." },
        ],
      },
      "Who should I vote for?",
    );
    expect(a.found).toBe(false);
    expect(a.answer).toBe(NOT_FOUND);
    expect(a.citations).toEqual([]);
  });

  it("declines when the model says the library doesn't cover it", () => {
    expect(checkAnswer({ found: false, answer: "", crisis: false, citations: [] }, "q").answer).toBe(NOT_FOUND);
    expect(checkAnswer(null, "q").found).toBe(false);
  });

  it("always shows care information in a crisis", () => {
    const a = checkAnswer({ found: false, answer: "", crisis: true, citations: [] }, "I don't want to be here anymore");
    expect(a.crisis).toBe(true);
    expect(a.citations[0].docId).toBe("care");
    expect(LIBRARY.find((d) => d.id === "care")!.text).toContain(a.citations[0].quote);
  });

  it("puts every document in the system prompt", () => {
    const p = systemPrompt();
    for (const d of LIBRARY) expect(p).toContain(`id="${d.id}"`);
  });
});
