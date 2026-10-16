import { describe, expect, it } from "vitest";
import { COMFORT, comfortVerse, recentGifts } from "./examen";
import { buildInsightInput, parseEntries } from "./logic";
import type { Entry } from "./types";

const e = (date: string, mood: number, extra: Partial<Entry> = {}): Entry => ({ date, mood, energy: 3, sleep: 7, tags: [], note: "", ...extra });

describe("Examen reflection", () => {
  it("keeps reflections through a save and reload, trimmed to 200 characters", () => {
    const raw = JSON.stringify({ entries: [{ ...e("2024-06-10", 2), gift: "A walk at sunset", heavy: "x".repeat(250) }, e("2024-06-11", 4)] });
    const [first, second] = parseEntries(raw);
    expect(first.gift).toBe("A walk at sunset");
    expect(first.heavy).toHaveLength(200);
    expect(second).not.toHaveProperty("gift");
  });

  it("never sends reflections to the AI", () => {
    const list = Array.from({ length: 10 }, (_, i) => e(`2024-06-${String(i + 1).padStart(2, "0")}`, 3, { gift: "PRIVATE-GIFT", heavy: "PRIVATE-HEAVY" }));
    const sent = JSON.stringify(buildInsightInput(list, "2024-06-10"));
    expect(sent).not.toContain("PRIVATE");
  });

  it("lists the newest good things first", () => {
    const list = [e("2024-06-08", 3, { gift: "old" }), e("2024-06-09", 3), e("2024-06-10", 3, { gift: "new" })];
    expect(recentGifts(list).map((g) => g.text)).toEqual(["new", "old"]);
  });

  it("draws comfort verses from the shared list and rotates daily", () => {
    expect(COMFORT).toHaveLength(5);
    expect(comfortVerse("2024-06-10")).not.toBe(comfortVerse("2024-06-11"));
  });
});
