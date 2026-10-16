import { describe, expect, it } from "vitest";
import { GRACES, graceFor } from "./grace";

describe("graceFor", () => {
  it("is the same all day and changes the next day", () => {
    expect(graceFor("2026-10-16")).toBe(graceFor("2026-10-16"));
    expect(graceFor("2026-10-17")).not.toBe(graceFor("2026-10-16"));
  });

  it("uses every grace over a few days", () => {
    const seen = new Set(Array.from({ length: GRACES.length }, (_, i) => graceFor(`2026-03-${String(i + 1).padStart(2, "0")}`)));
    expect(seen.size).toBe(GRACES.length);
  });
});
