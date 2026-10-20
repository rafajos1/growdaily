import { describe, expect, it } from "vitest";
import { buildReviewInput, dailyUse, deliveryGap, drinkCost, orderList, orderText, priceForTarget, stockoutDays, suggestedPar, unitCost, wasteSince } from "./logic";
import { sampleData } from "./sample";
import { parseData } from "./storage";
import type { CafeData, Item } from "./types";

const milk: Item = { id: "milk", name: "Whole milk", area: "fridge", buyUnit: "gallon", useUnit: "oz", perBuyUnit: 128, price: 4.48, par: 12, onHand: 4.5, supplier: "Dairy" };
const beans: Item = { id: "beans", name: "Espresso beans", area: "dry", buyUnit: "5 lb bag", useUnit: "g", perBuyUnit: 2268, price: 56.7, par: 4, onHand: 4, supplier: "Roaster" };
const cups: Item = { id: "cups", name: "12 oz cups", area: "dry", buyUnit: "case", useUnit: "each", perBuyUnit: 1000, price: 80, par: 2, onHand: 0.4, supplier: "" };

describe("costs", () => {
  it("works out the cost of one ounce, gram or item", () => {
    expect(unitCost(milk)).toBeCloseTo(0.035, 3);
    expect(unitCost(beans)).toBeCloseTo(0.025, 3);
    expect(unitCost({ ...milk, perBuyUnit: 0 })).toBe(0);
  });

  it("adds up a drink and compares it with the price and target", () => {
    const latte = { id: "l", name: "Latte", price: 4.75, lines: [{ itemId: "beans", qty: 18 }, { itemId: "milk", qty: 10 }, { itemId: "cups", qty: 1 }] };
    const d = drinkCost(latte, [milk, beans, cups], 0.3);
    expect(d.cost).toBeCloseTo(0.88, 2); // 0.45 beans + 0.35 milk + 0.08 cup
    expect(d.margin).toBeCloseTo(3.87, 2);
    expect(d.overTarget).toBe(false);
    expect(drinkCost(latte, [milk, beans, cups], 0.15).overTarget).toBe(true);
    expect(drinkCost({ ...latte, lines: [...latte.lines, { itemId: "gone", qty: 1 }] }, [milk, beans, cups], 0.3).missing).toBe(1);
  });

  it("suggests a price that meets the target, to the quarter", () => {
    expect(priceForTarget(1.2, 0.3)).toBe(4);
    expect(priceForTarget(1.3, 0.3)).toBe(4.5);
  });
});

describe("ordering", () => {
  it("orders whole units back up to par, grouped by supplier", () => {
    const groups = orderList([milk, beans, cups]);
    expect(groups.map((g) => g.supplier)).toEqual(["Dairy", "Other"]);
    expect(groups[0].lines[0]).toMatchObject({ qty: 8 });
    expect(groups[0].total).toBeCloseTo(35.84, 2);
    expect(groups[1].lines[0].qty).toBe(2);
  });

  it("writes an order to paste into a text", () => {
    const [dairy] = orderList([milk]);
    expect(orderText("Dairy", dairy.lines, "Main St Coffee")).toBe("Order from Main St Coffee for Dairy:\n- 8 × Whole milk (gallons)\n\nThank you!");
  });
});

describe("usage and par", () => {
  const data: CafeData = {
    items: [milk],
    recipes: [],
    counts: [
      { date: "2026-10-05", values: { milk: 10 } },
      { date: "2026-10-07", values: { milk: 6 } },
      { date: "2026-10-09", values: { milk: 0 } },
    ],
    receipts: [{ date: "2026-10-08", itemId: "milk", qty: 4 }],
    waste: [{ id: "w", date: "2026-10-08", itemId: "milk", qty: 0.5, reason: "expired" }],
    targetCost: 0.3,
  };

  it("estimates daily use from counts and deliveries, leaving out waste", () => {
    // (10 − 6) + (6 + 4 − 0 − 0.5 wasted) = 13.5 gallons over 4 days.
    expect(dailyUse(data, "milk")).toBe(3.375);
    expect(dailyUse({ ...data, counts: data.counts.slice(0, 1) }, "milk")).toBeNull();
  });

  it("suggests par as days of cover plus 25%", () => {
    expect(suggestedPar(3.5, 3)).toBe(14);
    expect(suggestedPar(0.5, 7)).toBe(5);
  });

  it("learns how often an item is delivered", () => {
    expect(deliveryGap(data, milk)).toBe(3); // not enough history: perishable default
    expect(deliveryGap(data, beans)).toBe(7);
    const daily = { ...data, receipts: ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"].map((date) => ({ date, itemId: "milk", qty: 1 })) };
    expect(deliveryGap(daily, milk)).toBe(1);
    // Monday, Wednesday, Friday: par has to last Friday to Monday.
    const mwf = { ...data, receipts: ["2026-10-05", "2026-10-07", "2026-10-09", "2026-10-12"].map((date) => ({ date, itemId: "milk", qty: 1 })) };
    expect(deliveryGap(mwf, milk)).toBe(3);
  });

  it("finds stockouts and waste", () => {
    expect(stockoutDays(data, "milk", "2026-10-01")).toEqual(["Friday"]);
    expect(wasteSince(data, "2026-10-01")[0]).toMatchObject({ qty: 0.5, cost: 2.24 });
  });
});

describe("example data", () => {
  const data = sampleData("2026-10-20");

  it("survives a save and load", () => {
    const loaded = parseData(JSON.stringify(data));
    expect(loaded.items).toHaveLength(data.items.length);
    expect(loaded.recipes).toHaveLength(4);
    expect(loaded.counts).toHaveLength(21);
  });

  it("tells the story the AI review should notice", () => {
    const review = buildReviewInput(data, "2026-10-20");
    const oat = review.items.find((i) => i.name.startsWith("Oat"))!;
    expect(oat.ranOutOn).toContain("Saturday");
    expect(oat.suggestedPar!).toBeGreaterThan(oat.par);
    const croissants = review.items.find((i) => i.name === "Croissants")!;
    expect(croissants.wasted).toBeGreaterThan(0);
    // Delivered daily, so par stays near a day's sales rather than three days'.
    expect(croissants.suggestedPar!).toBeLessThanOrEqual(croissants.par);
    // Oat milk is pricey: the oat latte is the one drink over the 30% target.
    expect(review.drinks.filter((d) => d.costShare > 0.3).map((d) => d.name)).toEqual(["Oat milk latte (16 oz)"]);
  });

  it("drops malformed data instead of failing", () => {
    expect(parseData(JSON.stringify({ items: [{ id: 1 }], targetCost: 5 }))).toMatchObject({ items: [], targetCost: 0.3 });
    expect(parseData(null).items).toEqual([]);
  });
});
