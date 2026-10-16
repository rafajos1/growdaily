import { describe, expect, it } from "vitest";
import { generateSampleExpenses } from "./sample-data";
import { GENEROSITY_ENCOURAGEMENTS, generosity, generosityEncouragement, passageUrl } from "./generosity";
import type { Category, Expense } from "./types";

const exp = (date: string, amountCents: number, category: Category = "Giving"): Expense => ({
  id: date + amountCents + category,
  date,
  amountCents,
  category,
  description: "x",
  createdAt: "",
  updatedAt: "",
});

describe("generosity", () => {
  const now = new Date(2024, 5, 15); // June 15, 2024

  it("totals only Giving for this month", () => {
    const g = generosity([exp("2024-06-02", 5000), exp("2024-06-10", 2500), exp("2024-06-03", 9900, "Food"), exp("2024-05-30", 4000)], 6, now);
    expect(g.thisMonthCents).toBe(7500);
    expect(g.giftsThisMonth).toBe(2);
  });

  it("gives a six-month history ending this month, with empty months as zero", () => {
    const g = generosity([exp("2024-06-02", 5000), exp("2024-03-01", 1000), exp("2023-11-01", 777)], 6, now);
    expect(g.months.map((m) => m.month)).toEqual(["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"]);
    expect(g.months.map((m) => m.totalCents)).toEqual([0, 0, 1000, 0, 0, 5000]);
  });

  it("reports nothing given when there are no gifts", () => {
    expect(generosity([exp("2024-06-02", 5000, "Bills")], 6, now)).toMatchObject({ thisMonthCents: 0, giftsThisMonth: 0 });
  });

  it("includes a monthly donation in the example data", () => {
    const giving = generateSampleExpenses().filter((e) => e.category === "Giving");
    expect(giving.length).toBeGreaterThanOrEqual(5);
  });
});

describe("generosity encouragements", () => {
  it("changes month to month and links to each passage", () => {
    expect(generosityEncouragement(new Date(2024, 5, 1))).not.toBe(generosityEncouragement(new Date(2024, 6, 1)));
    expect(generosityEncouragement(new Date(2024, 5, 1))).toBe(generosityEncouragement(new Date(2024, 5, 30)));
    expect(passageUrl(GENEROSITY_ENCOURAGEMENTS[0])).toBe("https://www.biblegateway.com/passage/?search=2%20Corinthians%209&version=NLT");
  });

  it("speaks in everyday words and never sets a percentage", () => {
    for (const e of GENEROSITY_ENCOURAGEMENTS) expect(e.text).not.toMatch(/["“”%]|\btithe|\b(thee|thou|thy|hath)\b/i);
  });
});
