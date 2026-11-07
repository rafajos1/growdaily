import { describe, expect, it } from "vitest";
import { buildDays, dataSummary, END_DATE, insights, productRevenue, salesMix, wasteByWeekday, WEEKS, weekTotals } from "./data";

describe("Dashwise sample data", () => {
  const days = buildDays();

  it("covers eight full Monday–Sunday weeks ending on the end date", () => {
    expect(days).toHaveLength(WEEKS * 7);
    expect(days[0].weekday).toBe("Mon");
    expect(days.at(-1)?.weekday).toBe("Sun");
    expect(days.at(-1)?.date).toBe(END_DATE);
  });

  it("is the same for every visitor", () => {
    expect(buildDays()).toEqual(days);
  });

  it("adds up: weekly revenue equals the sum of daily revenue", () => {
    const weeks = weekTotals(days);
    const daily = days.filter((d) => d.week === WEEKS - 1).reduce((s, d) => s + d.revenue, 0);
    expect(weeks.at(-1)?.revenue).toBeCloseTo(daily, 2);
    expect(weeks.every((w) => w.avgTicket > 3 && w.avgTicket < 10)).toBe(true);
  });

  it("tells the story the insights describe", () => {
    const products = productRevenue(days);
    const coldBrew = products.find((p) => p.id === "cold-brew")!;
    const latte = products.find((p) => p.id === "latte")!;
    expect(coldBrew.change).toBeLessThan(0);
    expect(latte.thisWeek).toBe(Math.max(...products.map((p) => p.thisWeek)));
    const waste = wasteByWeekday(days);
    const worst = [...waste].sort((a, b) => b.cost - a.cost)[0];
    expect(["Mon", "Tue", "Wed", "Thu"]).toContain(worst.weekday);
    expect(insights(days)).toHaveLength(3);
  });

  it("splits this week's revenue into a mix that adds up", () => {
    const mix = salesMix(days);
    expect(mix.map((m) => m.group)).toEqual(["Hot drinks", "Cold drinks", "Food"]);
    expect(mix.reduce((s, m) => s + m.revenue, 0)).toBeCloseTo(weekTotals(days).at(-1)!.revenue, 1);
    expect(mix.reduce((s, m) => s + m.share, 0)).toBeGreaterThan(99.8);
    const cold = mix.find((m) => m.group === "Cold drinks")!;
    expect(cold.share).toBeLessThan(cold.lastShare);
  });

  it("gives the AI a summary that names the data as fictional", () => {
    expect(dataSummary(days).cafe).toContain("fictional");
  });
});
