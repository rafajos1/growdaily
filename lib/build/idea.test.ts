import { describe, expect, it } from "vitest";
import { normalizeSketch, validateIdea } from "./idea";

describe("validateIdea", () => {
  const ok = { name: " Sam ", email: "Sam@Example.com", orgType: "Nonprofit", idea: "An assistant that answers volunteer questions about shifts." };
  it("cleans a good submission", () => {
    expect(validateIdea(ok)).toEqual({ name: "Sam", email: "sam@example.com", orgType: "Nonprofit", idea: ok.idea });
  });
  it("falls back to Something else for unknown types", () => {
    expect(validateIdea({ ...ok, orgType: "Hackers" })).toMatchObject({ orgType: "Something else" });
  });
  it("asks for what's missing", () => {
    expect(validateIdea({ ...ok, name: "" })).toEqual({ error: expect.stringContaining("name") });
    expect(validateIdea({ ...ok, email: "nope" })).toEqual({ error: expect.stringContaining("email") });
    expect(validateIdea({ ...ok, idea: "an app" })).toEqual({ error: expect.stringContaining("more") });
    expect(validateIdea({ ...ok, idea: "x".repeat(2001) })).toEqual({ error: expect.stringContaining("2,000") });
  });
});

describe("normalizeSketch", () => {
  it("trims and caps the AI's sketch", () => {
    const s = normalizeSketch({ name: "ShiftBuddy", oneLiner: "Answers volunteer questions.", features: ["a", "b", "c", "d", "e"], firstVersion: "x", aiRole: "y" })!;
    expect(s.features).toHaveLength(4);
  });
  it("rejects an empty sketch", () => {
    expect(normalizeSketch({ name: "", oneLiner: "", features: [] })).toBeNull();
    expect(normalizeSketch(null)).toBeNull();
  });
});
