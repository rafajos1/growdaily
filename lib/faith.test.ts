import { beforeEach, describe, expect, it, vi } from "vitest";
import { FAITH_EVENT, FAITH_KEY, readFaith, writeFaith } from "./faith";

// A minimal browser stand-in: the tests run in Node.
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
});
vi.stubGlobal("window", new EventTarget());

describe("Faith switch storage", () => {
  beforeEach(() => localStorage.clear());

  it("is off by default", () => {
    expect(readFaith()).toBe(false);
  });

  it("carries over Habitwise's earlier switch", () => {
    localStorage.setItem("habitwise:faith", "1");
    expect(readFaith()).toBe(true);
    expect(localStorage.getItem(FAITH_KEY)).toBe("1");
  });

  it("lets the shared setting win over the old one", () => {
    localStorage.setItem("habitwise:faith", "1");
    localStorage.setItem(FAITH_KEY, "0");
    expect(readFaith()).toBe(false);
  });

  it("saves, clears the old key, and tells the page", () => {
    localStorage.setItem("habitwise:faith", "1");
    const heard = vi.fn();
    window.addEventListener(FAITH_EVENT, (e) => heard((e as CustomEvent<boolean>).detail));
    writeFaith(false);
    expect(readFaith()).toBe(false);
    expect(localStorage.getItem("habitwise:faith")).toBeNull();
    expect(heard).toHaveBeenCalledWith(false);
  });
});
