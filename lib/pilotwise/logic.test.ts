import { describe, expect, it } from "vitest";
import { backlogCsv, gaps, gateStatus, planMarkdown, readinessScore, topGaps, totalWeeks, verdict } from "./logic";
import { sampleData } from "./sample";
import { parseData } from "./storage";
import { cleanPlan, templatePlan } from "./template";
import type { Inputs } from "./types";

const inputs: Inputs = { useCase: "Summarize sales calls", orgSize: "11–50 people", industry: "", builder: "Not sure yet", data: "", weeks: 10 };
let n = 0;
const id = () => `t${n++}`;

describe("readiness", () => {
  it("scores 1–5 areas as 0–100", () => {
    const plan = templatePlan(inputs, id);
    expect(readinessScore(plan)).toBe(50); // all 3s
    plan.readiness.forEach((r) => (r.score = 5));
    expect(readinessScore(plan)).toBe(100);
    plan.readiness.forEach((r) => (r.score = 1));
    expect(readinessScore(plan)).toBe(0);
  });

  it("only calls it ready when no area is weak", () => {
    expect(verdict(75, 3).label).toBe("Ready to pilot");
    expect(verdict(75, 2).label).toBe("Fix the gaps first");
    expect(verdict(30, 1).label).toBe("Not ready yet");
  });

  it("lists the weakest areas first", () => {
    const plan = sampleData("2026-10-22").pilots[0].plan;
    expect(gaps(plan).map((g) => g.area)).toEqual(["governance", "measurement"]);
  });

  it("picks up to three things to fix first, with an action for each", () => {
    const sample = sampleData("2026-10-22").pilots[0].plan;
    const top = topGaps(sample);
    expect(top.map((g) => g.area)).toEqual(["governance", "measurement", "data"]);
    expect(top[1].action).toMatch(/test set/);
    const template = templatePlan(inputs, id); // all 3s, no gap text: falls back to the area hint
    expect(topGaps(template)).toHaveLength(3);
    expect(topGaps(template)[0].action).toBe("A specific job, an owner, and a number that should move.");
    template.readiness.forEach((r) => (r.score = 4));
    expect(topGaps(template)).toEqual([]);
  });
});

describe("the gate", () => {
  it("is go only when every criterion is met, and no-go when any is missed", () => {
    const plan = templatePlan(inputs, id);
    expect(gateStatus(plan).decision).toBe("pending");
    plan.exitCriteria.forEach((c) => (c.status = "met"));
    expect(gateStatus(plan)).toMatchObject({ decision: "go", met: plan.exitCriteria.length });
    plan.exitCriteria[0].status = "missed";
    expect(gateStatus(plan).decision).toBe("no-go");
  });
});

describe("the template", () => {
  it("fits the pilot into the weeks asked for, then a scale phase", () => {
    const plan = templatePlan(inputs, id);
    expect(plan.phases.slice(0, 3).reduce((s, p) => s + p.weeks, 0)).toBe(10);
    expect(totalWeeks(plan)).toBe(14);
    expect(plan.exitCriteria.length).toBe(5);
  });
});

describe("cleaning AI drafts", () => {
  it("clamps numbers, drops junk and fills thin drafts from the template", () => {
    const plan = cleanPlan({ title: "x".repeat(200), readiness: [{ area: "data", score: 9 }, { area: "nope", score: 1 }], exitCriteria: [{ name: "Only one" }], risks: "bad", evalPlan: { size: -5 } }, inputs, id);
    expect(plan.title).toHaveLength(90);
    expect(plan.readiness).toHaveLength(6);
    expect(plan.readiness.find((r) => r.area === "data")!.score).toBe(5);
    expect(plan.exitCriteria.length).toBe(5); // one isn't enough: template used
    expect(plan.risks.length).toBeGreaterThan(0);
    expect(plan.evalPlan.size).toBe(10);
  });

  it("keeps a saved plan's edits, statuses and ids", () => {
    const sample = sampleData("2026-10-22");
    const loaded = parseData(JSON.stringify(sample));
    const a = sample.pilots[0].plan;
    const b = loaded.pilots[0].plan;
    expect(b.exitCriteria.map((c) => [c.id, c.status])).toEqual(a.exitCriteria.map((c) => [c.id, c.status]));
    expect(b.firstSteps.filter((s) => s.done)).toHaveLength(2);
    expect(b.risks.map((r) => r.roam)).toEqual(a.risks.map((r) => r.roam));
    // A user who deletes down to one criterion keeps their one criterion.
    const trimmed = { pilots: [{ ...sample.pilots[0], plan: { ...a, exitCriteria: a.exitCriteria.slice(0, 1) } }] };
    expect(parseData(JSON.stringify(trimmed)).pilots[0].plan.exitCriteria).toHaveLength(1);
  });
});

describe("exports", () => {
  const pilot = sampleData("2026-10-22").pilots[0];
  it("writes Markdown with the gate table", () => {
    const md = planMarkdown(pilot);
    expect(md).toContain("# AI-drafted replies for customer support");
    expect(md).toContain("**Readiness:** 50/100 (Fix the gaps first)");
    expect(md).toContain("| Cost per draft | Under $0.10 |");
  });
  it("writes a backlog CSV with epics and stories", () => {
    const csv = backlogCsv(pilot.plan).split("\n");
    expect(csv[0]).toBe('"Issue Type","Summary","Description","Epic"');
    expect(csv[1]).toContain('"Epic","AI-drafted replies for customer support: Discover & frame"');
    expect(csv.filter((l) => l.startsWith('"Story"')).length).toBe(7);
  });
});
