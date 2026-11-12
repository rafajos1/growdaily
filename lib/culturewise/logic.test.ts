import { describe, expect, it } from "vitest";
import { biggestGap, cultureType, DIMENSIONS, newDepartment, sampleOrg, scoreDepartment, scoreDimension, STATEMENT_COUNT, summaryText, type Rating } from "./logic";

const all = (r: Rating) => Object.fromEntries(DIMENSIONS.flatMap((d) => d.statements.map((s) => [s.id, r])));
const safety = DIMENSIONS.find((d) => d.id === "safety")!;

describe("culturewise scoring", () => {
  it("uses the full published scales: 12 ORIC items and Edmondson's 7", () => {
    const ids = DIMENSIONS.flatMap((d) => d.statements.map((s) => s.id));
    expect(STATEMENT_COUNT).toBe(19);
    expect(new Set(ids).size).toBe(ids.length);
    expect(DIMENSIONS.find((d) => d.id === "commitment")!.statements).toHaveLength(5);
    expect(DIMENSIONS.find((d) => d.id === "efficacy")!.statements).toHaveLength(7);
    expect(safety.statements).toHaveLength(7);
    expect(safety.statements.filter((s) => s.reverse).map((s) => s.id)).toEqual(["s1", "s3", "s5"]);
  });

  it("flips reverse-scored items", () => {
    // Strongly disagreeing that mistakes are held against you is high safety.
    expect(scoreDimension(safety, { s1: 1 })).toBe(100);
    expect(scoreDimension(safety, { s2: 1 })).toBe(0);
    expect(scoreDimension(safety, { s1: 5, s2: 1 })).toBe(0);
  });

  it("maps 1–5 ratings to 0–100", () => {
    const commitment = DIMENSIONS[0];
    expect(scoreDimension(commitment, { c1: 1, c2: 1 })).toBe(0);
    expect(scoreDimension(commitment, { c1: 3 })).toBe(50);
    expect(scoreDimension(commitment, { c1: 5 })).toBe(100);
    expect(scoreDimension(commitment, {})).toBeNull();
  });

  it("places each corner of the map, splitting at the neutral midpoint", () => {
    expect(cultureType(80, 80)).toBe("explorer");
    expect(cultureType(80, 20)).toBe("sprinter");
    expect(cultureType(20, 80)).toBe("builder");
    expect(cultureType(20, 20)).toBe("guarded");
    expect(cultureType(50, 50)).toBe("explorer");
  });

  it("gives no type until every statement is answered", () => {
    const r = scoreDepartment({ ...newDepartment("Ops"), answers: { c1: 5 } });
    expect(r.complete).toBe(false);
    expect(r.type).toBeNull();
    expect(r.lowest).toBeNull();
  });

  it("finds the weakest area, breaking ties in ADKAR order", () => {
    // All 3s: ORIC scores 50; safety scores 50 too (reverse items flip 3 to 3).
    const r = scoreDepartment({ ...newDepartment("Ops"), answers: all(3) });
    expect(r.complete).toBe(true);
    expect(r.readiness).toBe(50);
    expect(r.lowest?.id).toBe("commitment");
  });

  it("scores the example and finds the biggest gap between teams", () => {
    const results = sampleOrg().departments.map(scoreDepartment);
    expect(results.map((r) => r.type)).toEqual(["explorer", "builder", "sprinter"]);
    const gap = biggestGap(results);
    expect(gap).not.toBeNull();
    expect(gap!.gap).toBeGreaterThanOrEqual(20);
    const text = summaryText("Riverside", results);
    expect(text).toContain("Programs: Explorer");
    expect(text).toContain("Shea et al., 2014");
  });

  it("needs two finished teams to compare", () => {
    expect(biggestGap([scoreDepartment({ ...newDepartment("A"), answers: all(4) })])).toBeNull();
  });
});
