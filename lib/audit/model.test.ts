import { describe, expect, it } from "vitest";
import { CONTROLS, controlsCsv, findings, FUNCTIONS, newEngagement, parseImport, readinessIssues, score } from "./model";

const ev = { id: "e1", label: "Policy", where: "drive/policy.pdf", date: "2026-11-01" };

describe("audit model", () => {
  it("has unique controls in every function, each with evidence and a fix", () => {
    expect(new Set(CONTROLS.map((c) => c.id)).size).toBe(CONTROLS.length);
    for (const f of FUNCTIONS) expect(CONTROLS.some((c) => c.fn === f.id)).toBe(true);
    for (const c of CONTROLS) {
      expect(c.evidence.length).toBeGreaterThan(0);
      expect(c.rmf).toMatch(/^(GOVERN|MAP|MEASURE|MANAGE) \d$/);
      expect(c.rmf.split(" ")[0].toLowerCase()).toBe(c.fn);
    }
  });

  it("scores met 1, partly 0.5, and leaves not applicable out", () => {
    const e = newEngagement("Acme");
    e.results.G1 = { status: "met", notes: "", evidence: [ev] };
    e.results.G2 = { status: "partial", notes: "", evidence: [ev] };
    for (const c of CONTROLS.filter((c) => c.fn === "govern" && !["G1", "G2"].includes(c.id))) e.results[c.id] = { status: "na", notes: "n/a", evidence: [] };
    expect(score(e, "govern")).toMatchObject({ pct: 75, counted: 2, assessed: 7 });
  });

  it("flags anything that would make the audit hard to defend", () => {
    const e = newEngagement("Acme");
    e.results.G1 = { status: "met", notes: "", evidence: [] };
    e.results.G2 = { status: "not-met", notes: "", evidence: [] };
    e.results.G3 = { status: "na", notes: "", evidence: [] };
    const issues = readinessIssues(e).filter((i) => ["G1", "G2", "G3"].includes(i.controlId!));
    expect(issues.map((i) => i.text).join(" ")).toMatch(/G1.*no evidence/);
    expect(issues.find((i) => i.controlId === "G2")!.text).toMatch(/no owner or due date/);
    expect(issues.find((i) => i.controlId === "G3")!.level).toBe("warning");
    expect(readinessIssues(newEngagement("x")).filter((i) => i.level === "blocker")).toHaveLength(CONTROLS.length);
  });

  it("lists findings worst first with the control's default fix", () => {
    const e = newEngagement("Acme");
    e.results.G3 = { status: "not-met", notes: "", evidence: [] };
    e.results.G1 = { status: "partial", notes: "", evidence: [ev] };
    const f = findings(e);
    expect(f.map((x) => x.control.id)).toEqual(["G1", "G3"]);
    expect(f[0].finding.recommendation).toMatch(/AI policy/);
  });

  it("exports CSV and round-trips JSON", () => {
    const e = newEngagement("Acme, Inc.");
    e.results.G1 = { status: "met", notes: "Approved \"May\"", evidence: [ev] };
    const csv = controlsCsv(e).split("\n");
    expect(csv).toHaveLength(CONTROLS.length + 1);
    expect(csv[1]).toContain('"Approved ""May"""');
    expect(parseImport(JSON.stringify({ engagements: [e] }))[0].client).toBe("Acme, Inc.");
    expect(() => parseImport('{"x":1}')).toThrow();
  });
});
