import { describe, expect, it } from "vitest";
import { biggestGap, cultureType, DIMENSIONS, newDepartment, sampleOrg, scoreDepartment, scoreDimension, STATEMENT_COUNT, summaryText, type Rating } from "./logic";

const all = (r: Rating) => Object.fromEntries(DIMENSIONS.flatMap((d) => d.statements.map((s) => [s.id, r])));

describe("culturewise scoring", () => {
  it("has twelve statements with unique ids", () => {
    const ids = DIMENSIONS.flatMap((d) => d.statements.map((s) => s.id));
    expect(STATEMENT_COUNT).toBe(12);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("maps 1–5 ratings to 0–100", () => {
    const pace = DIMENSIONS[0];
    expect(scoreDimension(pace, { pace1: 1, pace2: 1, pace3: 1 })).toBe(0);
    expect(scoreDimension(pace, { pace1: 3, pace2: 3, pace3: 3 })).toBe(50);
    expect(scoreDimension(pace, { pace1: 5, pace2: 5, pace3: 5 })).toBe(100);
    expect(scoreDimension(pace, {})).toBeNull();
  });

  it("places each corner of the map", () => {
    expect(cultureType(80, 80)).toBe("explorer");
    expect(cultureType(80, 20)).toBe("sprinter");
    expect(cultureType(20, 80)).toBe("builder");
    expect(cultureType(20, 20)).toBe("guarded");
    expect(cultureType(50, 50)).toBe("explorer");
  });

  it("gives no type until every statement is answered", () => {
    const d = { ...newDepartment("Ops"), answers: { pace1: 5 as Rating } };
    const r = scoreDepartment(d);
    expect(r.complete).toBe(false);
    expect(r.type).toBeNull();
    expect(r.lowest).toBeNull();
  });

  it("finds the weakest area, breaking ties in ADKAR order", () => {
    const r = scoreDepartment({ ...newDepartment("Ops"), answers: all(3) });
    expect(r.complete).toBe(true);
    expect(r.lowest?.id).toBe("trust");
    expect(scoreDepartment({ ...newDepartment("Ops"), answers: all(4) }).lowest).toBeNull();
  });

  it("scores the example and finds the biggest gap between departments", () => {
    const results = sampleOrg().departments.map(scoreDepartment);
    expect(results.map((r) => r.type)).toEqual(["explorer", "builder", "sprinter"]);
    const gap = biggestGap(results);
    expect(gap).not.toBeNull();
    expect(gap!.gap).toBeGreaterThanOrEqual(20);
    const text = summaryText("Riverside", results);
    expect(text).toContain("Programs: Explorer");
    expect(text).toContain("Biggest difference");
  });

  it("needs two finished departments to compare", () => {
    expect(biggestGap([scoreDepartment({ ...newDepartment("A"), answers: all(4) })])).toBeNull();
  });
});
