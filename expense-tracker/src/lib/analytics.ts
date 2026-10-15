import { addMonths, monthKey, parseISODate, toISODate } from "./dates";
import { CATEGORIES, type Category, type Expense } from "./types";

export type CategoryTotal = {
  category: Category;
  totalCents: number;
  count: number;
  share: number;
};

export type MonthTotal = {
  month: string;
  totalCents: number;
};

export interface Summary {
  totalCents: number;
  count: number;
  thisMonthCents: number;
  lastMonthCents: number;
  /** Percent change vs. last month, or null when last month had no spending. */
  monthChangePct: number | null;
  avgPerDayThisMonthCents: number;
  topCategories: CategoryTotal[];
}

export function sumCents(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amountCents, 0);
}

export function totalsByCategory(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<Category, { totalCents: number; count: number }>();
  for (const c of CATEGORIES) totals.set(c, { totalCents: 0, count: 0 });
  for (const e of expenses) {
    const t = totals.get(e.category)!;
    t.totalCents += e.amountCents;
    t.count += 1;
  }
  const grand = sumCents(expenses);
  return CATEGORIES.map((category) => {
    const t = totals.get(category)!;
    return { category, ...t, share: grand > 0 ? t.totalCents / grand : 0 };
  })
    .filter((t) => t.count > 0)
    .sort((a, b) => b.totalCents - a.totalCents);
}

/** Totals for the last `months` calendar months ending at `now`, oldest first, zero-filled. */
export function monthlyTotals(expenses: Expense[], months: number, now: Date = new Date()): MonthTotal[] {
  const keys: string[] = [];
  for (let i = months - 1; i >= 0; i--) keys.push(monthKey(toISODate(addMonths(now, -i))));
  const totals = new Map(keys.map((k) => [k, 0]));
  for (const e of expenses) {
    const k = monthKey(e.date);
    if (totals.has(k)) totals.set(k, totals.get(k)! + e.amountCents);
  }
  return keys.map((month) => ({ month, totalCents: totals.get(month)! }));
}

/** Daily totals for each day of the month containing `now`, up to today. */
export function dailyTotalsThisMonth(expenses: Expense[], now: Date = new Date()): { day: number; totalCents: number }[] {
  const key = monthKey(toISODate(now));
  const days = Array.from({ length: now.getDate() }, (_, i) => ({ day: i + 1, totalCents: 0 }));
  for (const e of expenses) {
    if (monthKey(e.date) !== key) continue;
    const d = parseISODate(e.date);
    if (d && d.getDate() <= days.length) days[d.getDate() - 1].totalCents += e.amountCents;
  }
  return days;
}

export function computeSummary(expenses: Expense[], now: Date = new Date()): Summary {
  const thisKey = monthKey(toISODate(now));
  const lastKey = monthKey(toISODate(addMonths(now, -1)));
  const thisMonth = expenses.filter((e) => monthKey(e.date) === thisKey);
  const thisMonthCents = sumCents(thisMonth);
  const lastMonthCents = sumCents(expenses.filter((e) => monthKey(e.date) === lastKey));

  return {
    totalCents: sumCents(expenses),
    count: expenses.length,
    thisMonthCents,
    lastMonthCents,
    monthChangePct: lastMonthCents > 0 ? ((thisMonthCents - lastMonthCents) / lastMonthCents) * 100 : null,
    avgPerDayThisMonthCents: Math.round(thisMonthCents / now.getDate()),
    topCategories: totalsByCategory(thisMonth.length > 0 ? thisMonth : expenses),
  };
}
