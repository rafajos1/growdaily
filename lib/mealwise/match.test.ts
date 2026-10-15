import { describe, expect, it } from "vitest";
import { addToGrocery, groceryText, normalizeItem, normalizeMeals, parsePantry, suggestFromLibrary } from "./match";
import type { Meal, MealRequest } from "./types";

const req = (over: Partial<MealRequest> = {}): MealRequest => ({ pantry: [], diets: [], maxMinutes: 30, servings: 2, craving: "", staples: true, ...over });

describe("ingredients", () => {
  it("normalizes common variants", () => {
    expect(normalizeItem(" Eggs ")).toBe("egg");
    expect(normalizeItem("Tomatoes")).toBe("tomato");
    expect(normalizeItem("chicken breasts")).toBe("chicken");
    expect(normalizeItem("Olive oil")).toBe("oil");
    expect(normalizeItem("mushrooms")).toBe("mushrooms");
    expect(normalizeItem("carrots")).toBe("carrot");
    expect(normalizeItem("rice")).toBe("rice");
  });

  it("parses a pasted pantry list", () => {
    expect(parsePantry("eggs, rice\nSpinach; eggs")).toEqual(["egg", "rice", "spinach"]);
  });
});

describe("library suggestions", () => {
  it("ranks recipes by what you already have", () => {
    const meals = suggestFromLibrary(req({ pantry: ["eggs", "rice", "peas", "green onion", "soy sauce"] }));
    expect(meals[0].name).toBe("Egg fried rice");
    expect(meals[0].missing).toEqual([]);
    expect(meals[0].uses).not.toContain("oil"); // staples aren't listed as "yours"
  });

  it("respects diet and time limits", () => {
    const vegan = suggestFromLibrary(req({ pantry: ["eggs", "cheese", "chicken"], diets: ["vegan"], maxMinutes: 60 }));
    expect(vegan.length).toBeGreaterThan(0);
    expect(vegan.every((m) => !m.ingredients.some((i) => ["egg", "cheese", "chicken", "butter"].includes(i.item)))).toBe(true);
    expect(suggestFromLibrary(req({ maxMinutes: 15 })).every((m) => m.minutes <= 15)).toBe(true);
  });

  it("lists what's missing when staples are off", () => {
    const m = suggestFromLibrary(req({ pantry: ["eggs", "rice", "peas", "green onion", "soy sauce"], staples: false }))[0];
    expect(m.missing.map((i) => i.item)).toEqual(["oil"]);
  });
});

describe("normalizeMeals", () => {
  it("trims, clamps and drops incomplete meals", () => {
    const meals = normalizeMeals(
      {
        meals: [
          { name: " Pasta ", description: "x", minutes: 300, servings: 0, uses: ["pasta"], missing: [{ item: "basil", quantity: "" }], ingredients: [{ item: "pasta", quantity: "200 g" }], steps: ["Boil."] },
          { name: "No steps", description: "", minutes: 10, servings: 2, uses: [], missing: [], ingredients: [{ item: "a", quantity: "" }], steps: [] },
          { name: "", steps: ["x"], ingredients: [{ item: "a" }] },
        ],
      },
      30,
    );
    expect(meals).toHaveLength(1);
    expect(meals[0]).toMatchObject({ name: "Pasta", minutes: 30, servings: 2 }); // invalid 0 falls back to the default
  });

  it("survives garbage", () => {
    expect(normalizeMeals(null, 30)).toEqual([]);
    expect(normalizeMeals({ meals: "nope" }, 30)).toEqual([]);
  });
});

describe("grocery list", () => {
  const meal = (name: string, missing: Meal["missing"]): Meal => ({ name, description: "", minutes: 10, servings: 2, uses: [], missing, ingredients: missing, steps: ["x"] });

  it("merges items from several meals", () => {
    let list = addToGrocery([], meal("Tacos", [{ item: "Tomatoes", quantity: "2" }, { item: "lettuce", quantity: "1" }]));
    list = addToGrocery(list, meal("Salad", [{ item: "tomato", quantity: "3" }]));
    list = addToGrocery(list, meal("Salad", [{ item: "tomato", quantity: "3" }])); // adding twice doesn't duplicate
    expect(list).toHaveLength(2);
    expect(list[0]).toMatchObject({ item: "Tomatoes", quantities: ["2", "3"], meals: ["Tacos", "Salad"] });
    expect(groceryText(list)).toBe("• Tomatoes (2 + 3)\n• lettuce (1)");
  });
});
