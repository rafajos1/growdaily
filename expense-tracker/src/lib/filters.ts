import type { Expense, ExpenseFilters, SortKey } from "./types";

export const EMPTY_FILTERS: ExpenseFilters = { search: "", category: "All", from: "", to: "" };

export function hasActiveFilters(f: ExpenseFilters): boolean {
  return Boolean(f.search.trim() || f.category !== "All" || f.from || f.to);
}

export function filterExpenses(expenses: Expense[], f: ExpenseFilters): Expense[] {
  const query = f.search.trim().toLowerCase();
  return expenses.filter((e) => {
    if (f.category !== "All" && e.category !== f.category) return false;
    if (f.from && e.date < f.from) return false;
    if (f.to && e.date > f.to) return false;
    if (query) {
      const haystack = `${e.description} ${e.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortExpenses(expenses: Expense[], sort: SortKey): Expense[] {
  const copy = [...expenses];
  // Tie-break on createdAt so entries on the same date stay in a stable order.
  const byDate = (a: Expense, b: Expense) =>
    a.date === b.date ? a.createdAt.localeCompare(b.createdAt) : a.date.localeCompare(b.date);
  switch (sort) {
    case "date-asc":
      return copy.sort(byDate);
    case "date-desc":
      return copy.sort((a, b) => byDate(b, a));
    case "amount-asc":
      return copy.sort((a, b) => a.amountCents - b.amountCents || byDate(b, a));
    case "amount-desc":
      return copy.sort((a, b) => b.amountCents - a.amountCents || byDate(b, a));
  }
}
