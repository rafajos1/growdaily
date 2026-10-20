import { addDays, fromISO } from "../habitwise/dates";
import { isPerishable, type CafeData, type Item, type Recipe } from "./types";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Cost of one use unit (an ounce, gram or item). */
export function unitCost(item: Item): number {
  return item.perBuyUnit > 0 ? item.price / item.perBuyUnit : 0;
}

export interface DrinkCost {
  cost: number;
  margin: number;
  /** Ingredient cost as a share of the menu price. */
  costShare: number;
  overTarget: boolean;
  missing: number;
}

/** What a drink costs to make, and how that compares with its price and the target. */
export function drinkCost(recipe: Recipe, items: Item[], targetCost: number): DrinkCost {
  const byId = new Map(items.map((i) => [i.id, i]));
  let cost = 0;
  let missing = 0;
  for (const line of recipe.lines) {
    const item = byId.get(line.itemId);
    if (item) cost += unitCost(item) * line.qty;
    else missing++;
  }
  const costShare = recipe.price > 0 ? cost / recipe.price : 0;
  return { cost: round2(cost), margin: round2(recipe.price - cost), costShare, overTarget: costShare > targetCost, missing };
}

/** Price that brings a drink's ingredient cost down to the target share. */
export function priceForTarget(cost: number, targetCost: number): number {
  return targetCost > 0 ? Math.ceil((cost / targetCost) * 4) / 4 : 0;
}

export interface OrderLine {
  item: Item;
  qty: number;
  cost: number;
}

/** Whole buy units needed to bring each item back up to par, grouped by supplier. */
export function orderList(items: Item[]): { supplier: string; lines: OrderLine[]; total: number }[] {
  const groups = new Map<string, OrderLine[]>();
  for (const item of items) {
    const qty = Math.ceil(item.par - item.onHand - 1e-9);
    if (qty <= 0) continue;
    const supplier = item.supplier.trim() || "Other";
    groups.set(supplier, [...(groups.get(supplier) ?? []), { item, qty, cost: round2(qty * item.price) }]);
  }
  return [...groups.entries()]
    .map(([supplier, lines]) => ({ supplier, lines, total: round2(lines.reduce((s, l) => s + l.cost, 0)) }))
    .sort((a, b) => a.supplier.localeCompare(b.supplier));
}

const plural = (n: number, unit: string) => (n === 1 || /s$/.test(unit) ? unit : `${unit}s`);

/** The order as plain text to paste into a text or email to a supplier. */
export function orderText(supplier: string, lines: OrderLine[], cafeName = ""): string {
  const head = cafeName ? `Order from ${cafeName}` : "Order";
  return [`${head} for ${supplier}:`, ...lines.map((l) => `- ${l.qty} × ${l.item.name} (${plural(l.qty, l.item.buyUnit)})`), "", "Thank you!"].join("\n");
}

/**
 * Average buy units sold or used per day, from consecutive counts plus
 * deliveries in between (used = before + delivered − after), not counting
 * logged waste, so par follows real demand. Null without two counts.
 */
export function dailyUse(data: CafeData, itemId: string): number | null {
  const counts = data.counts.filter((c) => itemId in c.values).sort((a, b) => a.date.localeCompare(b.date));
  let used = 0;
  let days = 0;
  for (let i = 1; i < counts.length; i++) {
    const prev = counts[i - 1];
    const cur = counts[i];
    const gap = (fromISO(cur.date).getTime() - fromISO(prev.date).getTime()) / 86_400_000;
    if (gap <= 0) continue;
    const delivered = data.receipts.filter((r) => r.itemId === itemId && r.date > prev.date && r.date <= cur.date).reduce((s, r) => s + r.qty, 0);
    const wasted = data.waste.filter((w) => w.itemId === itemId && w.date > prev.date && w.date <= cur.date).reduce((s, w) => s + w.qty, 0);
    used += Math.max(0, prev.values[itemId] + delivered - cur.values[itemId] - wasted);
    days += gap;
  }
  return days > 0 ? used / days : null;
}

/**
 * The longest usual wait between deliveries of an item (like Friday to
 * Monday), from its last four weeks of deliveries; par has to last that long.
 * Without enough history: 3 days for perishables, 7 for everything else.
 */
export function deliveryGap(data: CafeData, item: Item): number {
  const dates = [...new Set(data.receipts.filter((r) => r.itemId === item.id).map((r) => r.date))].sort().slice(-12);
  if (dates.length < 3) return isPerishable(item.area) ? 3 : 7;
  let longest = 0;
  for (let i = 1; i < dates.length; i++) longest = Math.max(longest, Math.round((fromISO(dates[i]).getTime() - fromISO(dates[i - 1]).getTime()) / 86_400_000));
  return Math.min(14, Math.max(1, longest));
}

/**
 * Suggested par: enough for the days until the next delivery plus a buffer:
 * 25%, a common rule of thumb, or 10% for pastries, since leftovers are thrown away.
 */
export function suggestedPar(perDay: number, daysCover: number, area?: Item["area"]): number {
  return Math.max(1, Math.ceil(perDay * daysCover * (area === "pastry" ? 1.1 : 1.25)));
}

/** The weekday names on which an item was counted at zero (ran out). */
export function stockoutDays(data: CafeData, itemId: string, since: string): string[] {
  return data.counts.filter((c) => c.date >= since && c.values[itemId] === 0).map((c) => DAY_NAMES[fromISO(c.date).getDay()]);
}

/** Waste in buy units and dollars per item since a date. */
export function wasteSince(data: CafeData, since: string): { item: Item; qty: number; cost: number }[] {
  const byId = new Map(data.items.map((i) => [i.id, i]));
  const totals = new Map<string, number>();
  for (const w of data.waste) if (w.date >= since && byId.has(w.itemId)) totals.set(w.itemId, (totals.get(w.itemId) ?? 0) + w.qty);
  return [...totals.entries()]
    .map(([id, qty]) => {
      const item = byId.get(id)!;
      return { item, qty: round2(qty), cost: round2(qty * item.price) };
    })
    .sort((a, b) => b.cost - a.cost);
}

export interface ReviewInput {
  days: number;
  items: { name: string; buyUnit: string; perishable: boolean; par: number; onHand: number; usePerDay: number | null; suggestedPar: number | null; ranOutOn: string[]; wasted: number; wasteCost: number }[];
  drinks: { name: string; price: number; cost: number; costShare: number }[];
  targetCost: number;
}

/** A compact summary of the last four weeks for the AI ordering review. */
export function buildReviewInput(data: CafeData, today: string): ReviewInput {
  const since = addDays(today, -28);
  const waste = new Map(wasteSince(data, since).map((w) => [w.item.id, w]));
  return {
    days: 28,
    items: data.items.slice(0, 40).map((item) => {
      const perDay = dailyUse(data, item.id);
      return {
        name: item.name.slice(0, 60),
        buyUnit: item.buyUnit.slice(0, 30),
        perishable: isPerishable(item.area),
        par: item.par,
        onHand: item.onHand,
        usePerDay: perDay === null ? null : round2(perDay),
        suggestedPar: perDay === null ? null : suggestedPar(perDay, deliveryGap(data, item), item.area),
        ranOutOn: stockoutDays(data, item.id, since),
        wasted: waste.get(item.id)?.qty ?? 0,
        wasteCost: waste.get(item.id)?.cost ?? 0,
      };
    }),
    drinks: data.recipes.slice(0, 30).map((r) => {
      const d = drinkCost(r, data.items, data.targetCost);
      return { name: r.name.slice(0, 60), price: r.price, cost: d.cost, costShare: Math.round(d.costShare * 100) / 100 };
    }),
    targetCost: data.targetCost,
  };
}
