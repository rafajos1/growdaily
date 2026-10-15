export const DIETS = ["vegetarian", "vegan", "gluten-free", "dairy-free"] as const;
export type Diet = (typeof DIETS)[number];
export const TIMES = [15, 30, 45, 60] as const;

export interface Ingredient {
  item: string;
  quantity: string;
}

export interface Meal {
  name: string;
  description: string;
  minutes: number;
  servings: number;
  /** Items from the person's own list that this meal uses. */
  uses: string[];
  /** Items they'd need to buy. */
  missing: Ingredient[];
  ingredients: Ingredient[];
  steps: string[];
}

export interface MealRequest {
  pantry: string[];
  diets: Diet[];
  maxMinutes: number;
  servings: number;
  craving: string;
  /** Assume salt, pepper, oil and water are available. */
  staples: boolean;
}

export const MEALS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["meals"],
  properties: {
    meals: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "description", "minutes", "servings", "uses", "missing", "ingredients", "steps"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          minutes: { type: "integer" },
          servings: { type: "integer" },
          uses: { type: "array", items: { type: "string" } },
          missing: {
            type: "array",
            items: { type: "object", additionalProperties: false, required: ["item", "quantity"], properties: { item: { type: "string" }, quantity: { type: "string" } } },
          },
          ingredients: {
            type: "array",
            items: { type: "object", additionalProperties: false, required: ["item", "quantity"], properties: { item: { type: "string" }, quantity: { type: "string" } } },
          },
          steps: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;
