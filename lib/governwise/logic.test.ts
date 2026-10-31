import { describe, expect, it } from "vitest";
import { blankOrg, newTool, policyMarkdown, rateTool, readiness, registerCsv, sampleKit, summarize, type Tool } from "./logic";

const tool = (o: Partial<Tool>): Tool => ({ ...newTool("Test AI"), ...o });

describe("Governwise rules", () => {
  it("rules out personal details in personal accounts", () => {
    expect(rateTool(tool({ plan: "free", data: "personal" })).tier).toBe("not-allowed");
    expect(rateTool(tool({ plan: "paid-personal", data: "sensitive" })).tier).toBe("not-allowed");
  });

  it("limits sensitive data even on business plans", () => {
    const r = rateTool(tool({ plan: "business", data: "sensitive", trainingOff: "yes" }));
    expect(r.tier).toBe("limited");
    expect(r.conditions.join(" ")).toMatch(/data processing agreement/);
  });

  it("approves everyday work on a business plan, and public content anywhere", () => {
    expect(rateTool(tool({ plan: "business", data: "internal", trainingOff: "yes" })).tier).toBe("approved");
    expect(rateTool(tool({ plan: "free", data: "public" })).tier).toBe("approved");
  });

  it("limits internal work on personal accounts until training is off", () => {
    expect(rateTool(tool({ plan: "free", data: "internal", trainingOff: "unsure" })).tier).toBe("limited");
    expect(rateTool(tool({ plan: "free", data: "internal", trainingOff: "yes" })).tier).toBe("approved");
  });

  it("always keeps a person in charge of decisions about people and public-facing AI", () => {
    const r = rateTool(tool({ plan: "business", data: "internal", trainingOff: "yes", aboutPeople: true }));
    expect(r.tier).toBe("limited");
    expect(r.conditions.join(" ")).toMatch(/person makes the final decision/);
    expect(rateTool(tool({ plan: "business", data: "public", publicFacing: true })).tier).toBe("limited");
  });

  it("scores readiness and lists actions, strictest tools first", () => {
    const { org, tools } = sampleKit();
    const s = summarize(org, tools);
    expect(s.rated[0].rating.tier).toBe("not-allowed");
    expect(s.actions[0]).toMatch(/^Stop using ChatGPT/);
    expect(s.dataNotes.join(" ")).toMatch(/HIPAA/);
    expect(readiness(blankOrg(), []).score).toBe(0);
    expect(readiness({ ...blankOrg(), checks: { policy: "yes", owner: "yes", training: "yes", accounts: "yes", review: "yes", disclose: "yes", incidents: "yes" } }, [tool({})]).score).toBe(100);
  });

  it("writes a policy and a register people can use", () => {
    const { org, tools } = sampleKit();
    const md = policyMarkdown(org, tools, new Date("2026-11-01T12:00:00Z"));
    expect(md).toMatch(/^# Riverside Community Services AI policy/);
    expect(md).toMatch(/Next review: May 1, 2027/);
    expect(md).toMatch(/## Not allowed\n- ChatGPT \(for drafting donor thank-you letters\)/);
    expect(md).toMatch(/not legal advice/);
    const csv = registerCsv(tools).split("\n");
    expect(csv).toHaveLength(5);
    expect(csv[1]).toMatch(/^ChatGPT,drafting donor thank-you letters,/);
  });
});
