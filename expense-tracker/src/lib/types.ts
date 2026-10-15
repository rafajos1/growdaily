export const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  /** Calendar date in ISO `YYYY-MM-DD` form (no time zone). */
  date: string;
  /** Amount in integer cents to avoid floating-point rounding errors. */
  amountCents: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseInput = Pick<Expense, "date" | "amountCents" | "category" | "description">;

export interface ExpenseFilters {
  search: string;
  category: Category | "All";
  from: string;
  to: string;
}

export type SortKey = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
