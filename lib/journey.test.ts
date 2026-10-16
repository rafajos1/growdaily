import { beforeEach, describe, expect, it, vi } from "vitest";
import { DAY_KEY, localISO, markDone, nextApps, readDone } from "./journey";

const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
});
vi.stubGlobal("window", new EventTarget());

describe("your day", () => {
  beforeEach(() => store.clear());

  it("records finished apps for today, in the order of the day", () => {
    markDone("moodwise", "2026-10-16");
    markDone("planwise", "2026-10-16");
    markDone("planwise", "2026-10-16");
    expect(readDone("2026-10-16")).toEqual(["planwise", "moodwise"]);
  });

  it("starts fresh on a new day", () => {
    markDone("habitwise", "2026-10-16");
    expect(readDone("2026-10-17")).toEqual([]);
    markDone("mealwise", "2026-10-17");
    expect(JSON.parse(store.get(DAY_KEY)!)).toEqual({ date: "2026-10-17", done: ["mealwise"] });
  });

  it("ignores damaged storage", () => {
    store.set(DAY_KEY, "{oops");
    expect(readDone("2026-10-16")).toEqual([]);
    store.set(DAY_KEY, JSON.stringify({ date: "2026-10-16", done: ["planwise", "not-an-app"] }));
    expect(readDone("2026-10-16")).toEqual(["planwise"]);
  });

  it("suggests what comes next in the day, skipping what's done", () => {
    expect(nextApps("habitwise", ["habitwise"])).toEqual(["spendwise", "mealwise"]);
    expect(nextApps("moodwise", ["moodwise"])).toEqual(["planwise", "habitwise"]);
    expect(nextApps("planwise", ["planwise", "habitwise", "spendwise"])).toEqual(["mealwise", "moodwise"]);
    expect(nextApps("mealwise", ["planwise", "habitwise", "spendwise", "mealwise", "moodwise"])).toEqual([]);
  });

  it("uses the local calendar date", () => {
    expect(localISO(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});
