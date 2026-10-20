import { addDays, weekday } from "../habitwise/dates";
import { newId } from "../habitwise/storage";
import type { CafeData, Count, Item, Receipt, Waste } from "./types";

type Def = Omit<Item, "id" | "onHand"> & { perDay: number; deliveryDays: number[] };

// Example prices are illustrative, so people can see how the numbers work.
const DEFS: Def[] = [
  { name: "Whole milk", area: "fridge", buyUnit: "gallon", useUnit: "oz", perBuyUnit: 128, price: 4.5, par: 14, supplier: "Dairy", perDay: 4, deliveryDays: [1, 3, 5] },
  { name: "Oat milk (barista)", area: "fridge", buyUnit: "carton", useUnit: "oz", perBuyUnit: 32, price: 4.25, par: 14, supplier: "Dairy", perDay: 6, deliveryDays: [1, 3, 5] },
  { name: "Croissants", area: "pastry", buyUnit: "croissant", useUnit: "each", perBuyUnit: 1, price: 1.4, par: 24, supplier: "Bakery", perDay: 18, deliveryDays: [0, 1, 2, 3, 4, 5, 6] },
  { name: "Espresso beans", area: "dry", buyUnit: "5 lb bag", useUnit: "g", perBuyUnit: 2268, price: 55, par: 5, supplier: "Roaster", perDay: 0.6, deliveryDays: [1] },
  { name: "Drip coffee beans", area: "dry", buyUnit: "5 lb bag", useUnit: "g", perBuyUnit: 2268, price: 45, par: 4, supplier: "Roaster", perDay: 0.4, deliveryDays: [1] },
  { name: "Vanilla syrup", area: "bar", buyUnit: "bottle", useUnit: "oz", perBuyUnit: 25.4, price: 9, par: 6, supplier: "Restaurant supply", perDay: 0.5, deliveryDays: [1] },
  { name: "12 oz hot cups", area: "dry", buyUnit: "case of 1,000", useUnit: "each", perBuyUnit: 1000, price: 85, par: 2, supplier: "Restaurant supply", perDay: 0.12, deliveryDays: [1] },
  { name: "16 oz hot cups", area: "dry", buyUnit: "case of 1,000", useUnit: "each", perBuyUnit: 1000, price: 95, par: 2, supplier: "Restaurant supply", perDay: 0.15, deliveryDays: [1] },
  { name: "Hot cup lids", area: "dry", buyUnit: "case of 1,000", useUnit: "each", perBuyUnit: 1000, price: 60, par: 3, supplier: "Restaurant supply", perDay: 0.27, deliveryDays: [1] },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Three weeks of believable history: daily counts, deliveries, oat milk that
 * runs out on busy Saturdays, and croissants left over most days.
 */
export function sampleData(today: string): CafeData {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const items: Item[] = DEFS.map(({ perDay: _p, deliveryDays: _d, ...d }) => ({ ...d, id: newId(), onHand: 0 }));
  const stock = new Map(items.map((i) => [i.id, i.par * 0.6]));
  const counts: Count[] = [];
  const receipts: Receipt[] = [];
  const waste: Waste[] = [];

  for (let date = addDays(today, -21); date < today; date = addDays(date, 1)) {
    const day = weekday(date);
    const busy = day === 6 ? 1.5 : day === 0 ? 1.2 : 1;
    const values: Record<string, number> = {};
    DEFS.forEach((def, i) => {
      const item = items[i];
      let s = stock.get(item.id)!;
      if (def.deliveryDays.includes(day)) {
        const qty = Math.ceil(item.par - s - 1e-9);
        if (qty > 0) {
          receipts.push({ date, itemId: item.id, qty });
          s += qty;
        }
      }
      const use = def.perDay * busy * (0.85 + 0.3 * rand());
      if (item.area === "pastry") {
        const sold = Math.min(s, Math.round(use));
        const unsold = s - sold;
        if (unsold > 0) waste.push({ id: newId(), date, itemId: item.id, qty: unsold, reason: "unsold" });
        s = 0;
      } else {
        s = Math.max(0, s - use);
      }
      stock.set(item.id, s);
      values[item.id] = round1(s);
    });
    counts.push({ date, values });
  }

  for (const item of items) item.onHand = round1(stock.get(item.id)!);
  const id = (name: string) => items.find((i) => i.name === name)!.id;
  const recipes = [
    { name: "Latte (12 oz)", price: 4.75, lines: [{ itemId: id("Espresso beans"), qty: 18 }, { itemId: id("Whole milk"), qty: 10 }, { itemId: id("12 oz hot cups"), qty: 1 }, { itemId: id("Hot cup lids"), qty: 1 }] },
    { name: "Oat milk latte (16 oz)", price: 5.25, lines: [{ itemId: id("Espresso beans"), qty: 18 }, { itemId: id("Oat milk (barista)"), qty: 13 }, { itemId: id("16 oz hot cups"), qty: 1 }, { itemId: id("Hot cup lids"), qty: 1 }] },
    { name: "Vanilla latte (16 oz)", price: 5.5, lines: [{ itemId: id("Espresso beans"), qty: 18 }, { itemId: id("Whole milk"), qty: 12 }, { itemId: id("Vanilla syrup"), qty: 1 }, { itemId: id("16 oz hot cups"), qty: 1 }, { itemId: id("Hot cup lids"), qty: 1 }] },
    { name: "Drip coffee (12 oz)", price: 2.75, lines: [{ itemId: id("Drip coffee beans"), qty: 21 }, { itemId: id("12 oz hot cups"), qty: 1 }, { itemId: id("Hot cup lids"), qty: 1 }] },
  ].map((r) => ({ ...r, id: newId() }));

  return { items, recipes, counts, receipts, waste, targetCost: 0.3 };
}
