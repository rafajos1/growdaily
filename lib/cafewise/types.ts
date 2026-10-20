/** Where an item lives in the café; fridge and pastry items are perishable. */
export type Area = "fridge" | "pastry" | "bar" | "dry";
export const AREAS: { id: Area; label: string }[] = [
  { id: "fridge", label: "Fridge" },
  { id: "pastry", label: "Pastry case" },
  { id: "bar", label: "Bar" },
  { id: "dry", label: "Dry storage" },
];
export const isPerishable = (area: Area) => area === "fridge" || area === "pastry";

/** The unit recipes use: ounces, grams or single items. */
export type UseUnit = "oz" | "g" | "each";

export interface Item {
  id: string;
  name: string;
  area: Area;
  /** How it's bought, e.g. "gallon" or "5 lb bag". Counts, par and orders are in this unit. */
  buyUnit: string;
  useUnit: UseUnit;
  /** How many use units are in one buy unit, e.g. 128 oz in a gallon. */
  perBuyUnit: number;
  /** Price paid for one buy unit. */
  price: number;
  /** How many buy units to have on hand after an order. */
  par: number;
  /** Buy units on hand at the last count or delivery. */
  onHand: number;
  supplier: string;
}

export interface Recipe {
  id: string;
  name: string;
  /** Menu price. */
  price: number;
  lines: { itemId: string; qty: number }[];
}

/** A stock count: buy units on hand per item. */
export interface Count {
  date: string;
  values: Record<string, number>;
}

/** Stock added between counts (a delivery). */
export interface Receipt {
  date: string;
  itemId: string;
  qty: number;
}

export type WasteReason = "expired" | "unsold" | "spilled" | "other";
export interface Waste {
  id: string;
  date: string;
  itemId: string;
  /** In buy units. */
  qty: number;
  reason: WasteReason;
}

export interface CafeData {
  items: Item[];
  recipes: Recipe[];
  counts: Count[];
  receipts: Receipt[];
  waste: Waste[];
  /** Target ingredient cost as a share of each drink's price, e.g. 0.3. */
  targetCost: number;
}

export const EMPTY: CafeData = { items: [], recipes: [], counts: [], receipts: [], waste: [], targetCost: 0.3 };
