import { AREAS, EMPTY, type CafeData, type Count, type Item, type Receipt, type Recipe, type Waste } from "./types";

export const STORAGE_KEY = "cafewise:v1";
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const AREA_IDS = new Set(AREAS.map((a) => a.id));
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;

function isItem(v: unknown): v is Item {
  const i = v as Item;
  return (
    !!i &&
    typeof i.id === "string" &&
    typeof i.name === "string" &&
    AREA_IDS.has(i.area) &&
    typeof i.buyUnit === "string" &&
    (i.useUnit === "oz" || i.useUnit === "g" || i.useUnit === "each") &&
    num(i.perBuyUnit) &&
    num(i.price) &&
    num(i.par) &&
    num(i.onHand) &&
    typeof i.supplier === "string"
  );
}

function isRecipe(v: unknown): v is Recipe {
  const r = v as Recipe;
  return !!r && typeof r.id === "string" && typeof r.name === "string" && num(r.price) && Array.isArray(r.lines) && r.lines.every((l) => typeof l?.itemId === "string" && num(l.qty));
}

/** Parses stored data, dropping anything malformed instead of failing the whole load. */
export function parseData(raw: string | null): CafeData {
  if (!raw) return { ...EMPTY };
  const p = JSON.parse(raw) as Partial<CafeData> | null;
  const items = Array.isArray(p?.items) ? p.items.filter(isItem) : [];
  const ids = new Set(items.map((i) => i.id));
  const recipes = Array.isArray(p?.recipes) ? p.recipes.filter(isRecipe) : [];
  const counts = (Array.isArray(p?.counts) ? p.counts : []).filter(
    (c): c is Count => !!c && typeof c.date === "string" && ISO.test(c.date) && !!c.values && typeof c.values === "object",
  );
  const receipts = (Array.isArray(p?.receipts) ? p.receipts : []).filter((r): r is Receipt => !!r && ISO.test(r.date) && ids.has(r.itemId) && num(r.qty));
  const waste = (Array.isArray(p?.waste) ? p.waste : []).filter((w): w is Waste => !!w && typeof w.id === "string" && ISO.test(w.date) && ids.has(w.itemId) && num(w.qty));
  const targetCost = typeof p?.targetCost === "number" && p.targetCost > 0 && p.targetCost < 1 ? p.targetCost : EMPTY.targetCost;
  return { items, recipes, counts, receipts, waste, targetCost };
}

export function loadData(): CafeData {
  return parseData(window.localStorage.getItem(STORAGE_KEY));
}

export function saveData(data: CafeData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
}
