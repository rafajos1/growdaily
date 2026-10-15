import { RECIPES, type LibraryRecipe } from "./recipes";
import type { Diet, Ingredient, Meal, MealRequest } from "./types";

export const STAPLES = ["salt", "pepper", "oil", "water"];

const ALIASES: Record<string, string> = {
  eggs: "egg",
  tomatoes: "tomato",
  potatoes: "potato",
  onions: "onion",
  "garlic cloves": "garlic",
  "olive oil": "oil",
  "vegetable oil": "oil",
  scallions: "green onion",
  "spring onions": "green onion",
  "bell peppers": "bell pepper",
  peppers: "bell pepper",
  "chicken breast": "chicken",
  "chicken breasts": "chicken",
  "chicken thighs": "chicken",
  "ground beef": "beef",
  "minced beef": "beef",
  noodles: "pasta",
  spaghetti: "pasta",
  penne: "pasta",
  "cheddar cheese": "cheese",
  cheddar: "cheese",
  parmesan: "cheese",
  "canned tomatoes": "tomato",
  chickpea: "chickpeas",
  bean: "beans",
  "black beans": "beans",
  tortilla: "tortillas",
  wraps: "tortillas",
  mushroom: "mushrooms",
  "soy sauce": "soy sauce",
  lemons: "lemon",
  limes: "lime",
};

/** Lower-cases, trims and maps common plurals/variants to one name: "Eggs " -> "egg". */
export function normalizeItem(raw: string): string {
  const s = raw.toLowerCase().replace(/[^a-z\s-]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (ALIASES[s]) return ALIASES[s];
  if (s.endsWith("es") && ALIASES[s.slice(0, -2)] === undefined && s.length > 4 && /(o|ch|sh)es$/.test(s)) return s.slice(0, -2);
  if (s.endsWith("s") && !s.endsWith("ss") && s.length > 3 && !Object.values(ALIASES).includes(s)) return s.slice(0, -1);
  return s;
}

/** Splits pasted text ("eggs, rice\nspinach") into unique normalized items. */
export function parsePantry(text: string): string[] {
  return [...new Set(text.split(/[,\n;]/).map(normalizeItem).filter(Boolean))];
}

function has(pantry: Set<string>, item: string): boolean {
  const n = normalizeItem(item);
  if (pantry.has(n)) return true;
  // "cheese" matches "feta cheese", "rice" matches "brown rice"
  for (const p of pantry) if (p.endsWith(` ${n}`) || n.endsWith(` ${p}`)) return true;
  return false;
}

export function fitsDiets(recipe: LibraryRecipe, diets: Diet[]): boolean {
  return diets.every((d) => recipe.diets.includes(d));
}

/**
 * Built-in fallback: ranks library recipes by how much of each the person
 * already has, respecting diet and time. Returns up to three meals.
 */
export function suggestFromLibrary(req: MealRequest): Meal[] {
  const pantry = new Set(req.pantry.map(normalizeItem).concat(req.staples ? STAPLES : []));
  return RECIPES.filter((r) => r.minutes <= req.maxMinutes && fitsDiets(r, req.diets))
    .map((r) => {
      const uses = r.ingredients.filter((i) => has(pantry, i.item));
      const missing = r.ingredients.filter((i) => !has(pantry, i.item));
      const craving = req.craving && `${r.name} ${r.description}`.toLowerCase().includes(req.craving.toLowerCase().trim()) ? 2 : 0;
      return { r, uses, missing, score: uses.length / r.ingredients.length + craving - missing.length * 0.05 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ r, uses, missing }) => ({
      name: r.name,
      description: r.description,
      minutes: r.minutes,
      servings: req.servings,
      uses: uses.map((i) => i.item).filter((i) => !STAPLES.includes(normalizeItem(i))),
      missing: missing.map((i) => ({ item: i.item, quantity: i.quantity })),
      ingredients: r.ingredients,
      steps: r.steps,
    }));
}

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "");
const cleanList = (v: unknown, max: number) =>
  (Array.isArray(v) ? v : [])
    .map((i) => ({ item: clean((i as Ingredient)?.item, 60), quantity: clean((i as Ingredient)?.quantity, 40) }))
    .filter((i) => i.item)
    .slice(0, max);

/** Validates and trims AI output so the page can render it safely. */
export function normalizeMeals(raw: unknown, maxMinutes: number): Meal[] {
  const list = (raw as { meals?: unknown[] } | null)?.meals;
  return (Array.isArray(list) ? list : [])
    .map((m) => m as Partial<Meal>)
    .map((m) => ({
      name: clean(m.name, 70),
      description: clean(m.description, 200),
      minutes: Math.min(Math.max(Math.round(Number(m.minutes) || maxMinutes), 5), maxMinutes),
      servings: Math.min(Math.max(Math.round(Number(m.servings) || 2), 1), 12),
      uses: (Array.isArray(m.uses) ? m.uses : []).map((u) => clean(u, 60)).filter(Boolean).slice(0, 20),
      missing: cleanList(m.missing, 15),
      ingredients: cleanList(m.ingredients, 25),
      steps: (Array.isArray(m.steps) ? m.steps : []).map((s) => clean(s, 300)).filter(Boolean).slice(0, 12),
    }))
    .filter((m) => m.name && m.steps.length > 0 && m.ingredients.length > 0)
    .slice(0, 3);
}

export interface GroceryItem {
  item: string;
  quantities: string[];
  meals: string[];
  checked: boolean;
}

/** Adds a meal's missing items to the list, merging items that are already there. */
export function addToGrocery(list: GroceryItem[], meal: Meal): GroceryItem[] {
  const next = list.map((g) => ({ ...g, quantities: [...g.quantities], meals: [...g.meals] }));
  for (const m of meal.missing) {
    const key = normalizeItem(m.item);
    const existing = next.find((g) => normalizeItem(g.item) === key);
    if (existing) {
      if (!existing.meals.includes(meal.name)) {
        existing.meals.push(meal.name);
        if (m.quantity) existing.quantities.push(m.quantity);
        existing.checked = false;
      }
    } else {
      next.push({ item: m.item, quantities: m.quantity ? [m.quantity] : [], meals: [meal.name], checked: false });
    }
  }
  return next;
}

export function groceryText(list: GroceryItem[]): string {
  return list
    .filter((g) => !g.checked)
    .map((g) => `• ${g.item}${g.quantities.length ? ` (${g.quantities.join(" + ")})` : ""}`)
    .join("\n");
}
