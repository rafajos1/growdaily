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

// ---------------------------------------------------------------------------
// Pace (this month vs. last month)
// ---------------------------------------------------------------------------

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Daily totals for every day of the month containing `date` (index 0 = day 1). */
export function dailyTotalsForMonth(expenses: Expense[], date: Date): number[] {
  const key = monthKey(toISODate(date));
  const days = new Array<number>(daysInMonth(date)).fill(0);
  for (const e of expenses) {
    if (monthKey(e.date) === key) days[Number(e.date.slice(8, 10)) - 1] += e.amountCents;
  }
  return days;
}

export function cumulative(values: number[]): number[] {
  let sum = 0;
  return values.map((v) => (sum += v));
}

export interface Pace {
  day: number;
  daysInMonth: number;
  spentCents: number;
  /** Running total for each day of this month up to today. */
  thisCumulative: number[];
  /** Running total for every day of last month. */
  lastCumulative: number[];
  lastMonthTotalCents: number;
  /** Last month's running total on the same day of the month (clamped to its length). */
  lastMonthAtDayCents: number;
  /** Month-end total if spending continues at the current daily rate. */
  projectedCents: number;
}

export function computePace(expenses: Expense[], now: Date = new Date()): Pace {
  const day = now.getDate();
  const thisCumulative = cumulative(dailyTotalsForMonth(expenses, now)).slice(0, day);
  const lastCumulative = cumulative(dailyTotalsForMonth(expenses, addMonths(now, -1)));
  const spentCents = thisCumulative[day - 1] ?? 0;
  const total = daysInMonth(now);
  return {
    day,
    daysInMonth: total,
    spentCents,
    thisCumulative,
    lastCumulative,
    lastMonthTotalCents: lastCumulative[lastCumulative.length - 1] ?? 0,
    lastMonthAtDayCents: lastCumulative[Math.min(day, lastCumulative.length) - 1] ?? 0,
    projectedCents: Math.round((spentCents / day) * total),
  };
}

// ---------------------------------------------------------------------------
// Trends (across months)
// ---------------------------------------------------------------------------

function earliestMonth(expenses: Expense[]): string | null {
  let min: string | null = null;
  for (const e of expenses) {
    const k = monthKey(e.date);
    if (min === null || k < min) min = k;
  }
  return min;
}

export interface TypicalMonth {
  averageCents: number;
  /** Complete months (oldest first) the average is based on. */
  basis: MonthTotal[];
  highest: MonthTotal;
  lowest: MonthTotal;
}

/**
 * Average spend over the last `months` complete calendar months, counting only
 * months on or after the first recorded expense. Null until one full month exists.
 */
export function typicalMonth(expenses: Expense[], months = 5, now: Date = new Date()): TypicalMonth | null {
  const first = earliestMonth(expenses);
  if (!first) return null;
  const basis = monthlyTotals(expenses, months, addMonths(now, -1)).filter((m) => m.month >= first);
  if (basis.length === 0) return null;
  const sum = basis.reduce((a, m) => a + m.totalCents, 0);
  return {
    averageCents: Math.round(sum / basis.length),
    basis,
    highest: basis.reduce((a, m) => (m.totalCents > a.totalCents ? m : a)),
    lowest: basis.reduce((a, m) => (m.totalCents < a.totalCents ? m : a)),
  };
}

export interface CategoryTrend {
  category: Category;
  /** Monthly totals, oldest first; the last entry is the current (partial) month. */
  series: number[];
  /** Average over the complete months in the window that are on/after the first expense. */
  averageCents: number;
  lastFullMonthCents: number;
  /** Last full month vs. average, in percent; null when the average is zero. */
  changePct: number | null;
}

export function categoryTrends(expenses: Expense[], months = 6, now: Date = new Date()): CategoryTrend[] {
  const keys = monthlyTotals([], months, now).map((m) => m.month);
  const first = earliestMonth(expenses) ?? keys[keys.length - 1];
  const complete = keys.slice(0, -1).filter((k) => k >= first);
  return CATEGORIES.map((category) => {
    const totals = new Map(keys.map((k) => [k, 0]));
    for (const e of expenses) {
      const k = monthKey(e.date);
      if (e.category === category && totals.has(k)) totals.set(k, totals.get(k)! + e.amountCents);
    }
    const series = keys.map((k) => totals.get(k)!);
    const averageCents = complete.length
      ? Math.round(complete.reduce((a, k) => a + totals.get(k)!, 0) / complete.length)
      : 0;
    const lastFullMonthCents = keys.length > 1 ? series[series.length - 2] : 0;
    return {
      category,
      series,
      averageCents,
      lastFullMonthCents,
      changePct: averageCents > 0 ? ((lastFullMonthCents - averageCents) / averageCents) * 100 : null,
    };
  }).filter((t) => t.series.some((v) => v > 0));
}

/** Total spend per weekday, index 0 = Sunday. */
export function weekdayTotals(expenses: Expense[]): number[] {
  const totals = new Array<number>(7).fill(0);
  for (const e of expenses) {
    const d = parseISODate(e.date);
    if (d) totals[d.getDay()] += e.amountCents;
  }
  return totals;
}

export interface RecurringExpense {
  description: string;
  category: Category;
  amountCents: number;
  /** Number of distinct months it appeared in. */
  months: number;
  lastDate: string;
}

/**
 * Finds charges that repeat: the same description (case-insensitive) and the
 * same amount in at least `minMonths` different months.
 */
export function detectRecurring(expenses: Expense[], minMonths = 2): RecurringExpense[] {
  const groups = new Map<string, { sample: Expense; months: Set<string>; lastDate: string }>();
  for (const e of expenses) {
    const key = `${e.description.trim().toLowerCase()}|${e.amountCents}`;
    const g = groups.get(key);
    if (g) {
      g.months.add(monthKey(e.date));
      if (e.date > g.lastDate) g.lastDate = e.date;
    } else {
      groups.set(key, { sample: e, months: new Set([monthKey(e.date)]), lastDate: e.date });
    }
  }
  return [...groups.values()]
    .filter((g) => g.months.size >= minMonths)
    .map((g) => ({
      description: g.sample.description,
      category: g.sample.category,
      amountCents: g.sample.amountCents,
      months: g.months.size,
      lastDate: g.lastDate,
    }))
    .sort((a, b) => b.amountCents - a.amountCents);
}

export function biggestExpenses(expenses: Expense[], count: number, sinceISO?: string): Expense[] {
  return expenses
    .filter((e) => !sinceISO || e.date >= sinceISO)
    .sort((a, b) => b.amountCents - a.amountCents || b.date.localeCompare(a.date))
    .slice(0, count);
}
