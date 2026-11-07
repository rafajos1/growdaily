/**
 * Dashwise sample data: eight weeks of daily sales and pastry waste for a
 * fictional café, generated from a fixed seed so every visitor (and every
 * test) sees the same numbers. Nothing here is real business data.
 */

export const CAFE_NAME = "Corner Bean Café";
/** Last day of the sample: a Sunday, so "this week" is a full Monday–Sunday week. */
export const END_DATE = "2026-11-01";
export const WEEKS = 8;

export interface Product {
  id: string;
  name: string;
  price: number;
  /** Average units sold on a weekday at the start of the sample. */
  base: number;
  /** Change in daily units per week (a gentle trend that tells a story). */
  trend: number;
  weekendLift: number;
  /** Pastries are baked in batches, so unsold ones are thrown away. */
  baked?: { batch: number; cost: number };
}

export const PRODUCTS: Product[] = [
  { id: "latte", name: "Latte", price: 5.25, base: 62, trend: 2.4, weekendLift: 1.35 },
  { id: "drip", name: "Drip coffee", price: 3.0, base: 48, trend: 0, weekendLift: 0.85 },
  { id: "cold-brew", name: "Cold brew", price: 4.75, base: 40, trend: -3.6, weekendLift: 1.2 },
  { id: "cappuccino", name: "Cappuccino", price: 4.75, base: 26, trend: 0.6, weekendLift: 1.25 },
  { id: "croissant", name: "Croissant", price: 3.75, base: 30, trend: 0.3, weekendLift: 1.4, baked: { batch: 44, cost: 1.2 } },
  { id: "sandwich", name: "Breakfast sandwich", price: 7.5, base: 22, trend: 0.8, weekendLift: 1.6 },
  { id: "muffin", name: "Muffin", price: 3.25, base: 18, trend: -0.4, weekendLift: 1.15, baked: { batch: 26, cost: 0.9 } },
];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export interface Day {
  date: string;
  weekday: (typeof WEEKDAYS)[number];
  /** 0 = oldest week, WEEKS - 1 = this week. */
  week: number;
  units: Record<string, number>;
  waste: Record<string, number>;
  revenue: number;
  orders: number;
  wasteCost: number;
}

/** Small, fast, seeded random numbers (mulberry32). */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function buildDays(): Day[] {
  const rand = rng(20261101);
  const total = WEEKS * 7;
  const days: Day[] = [];
  for (let i = 0; i < total; i++) {
    const date = addDays(END_DATE, i - total + 1);
    const dow = i % 7; // the sample starts on a Monday
    const week = Math.floor(i / 7);
    const weekend = dow >= 5;
    // Quieter Mondays, busier Fridays.
    const dayFactor = [0.88, 0.95, 1, 1.02, 1.1, 1, 0.92][dow];
    const units: Record<string, number> = {};
    const waste: Record<string, number> = {};
    let revenue = 0;
    let items = 0;
    let wasteCost = 0;
    for (const p of PRODUCTS) {
      const mean = Math.max(2, (p.base + p.trend * week) * dayFactor * (weekend ? p.weekendLift : 1));
      const sold = Math.max(0, Math.round(mean * (0.88 + rand() * 0.24)));
      if (p.baked) {
        // The same batch is baked every day, so slow days leave the most behind.
        const s = Math.min(sold, p.baked.batch);
        units[p.id] = s;
        waste[p.id] = p.baked.batch - s;
        wasteCost += waste[p.id] * p.baked.cost;
      } else {
        units[p.id] = sold;
      }
      revenue += units[p.id] * p.price;
      items += units[p.id];
    }
    days.push({
      date,
      weekday: WEEKDAYS[dow],
      week,
      units,
      waste,
      revenue: round2(revenue),
      // About 1.6 items per order at a café counter.
      orders: Math.round(items / 1.6),
      wasteCost: round2(wasteCost),
    });
  }
  return days;
}

export interface WeekTotals {
  week: number;
  start: string;
  revenue: number;
  orders: number;
  avgTicket: number;
  wasteCost: number;
}

export function weekTotals(days: Day[]): WeekTotals[] {
  const out: WeekTotals[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const d = days.filter((x) => x.week === w);
    const revenue = round2(d.reduce((s, x) => s + x.revenue, 0));
    const orders = d.reduce((s, x) => s + x.orders, 0);
    out.push({ week: w, start: d[0].date, revenue, orders, avgTicket: round2(revenue / orders), wasteCost: round2(d.reduce((s, x) => s + x.wasteCost, 0)) });
  }
  return out;
}

export interface ProductWeek {
  id: string;
  name: string;
  thisWeek: number;
  lastWeek: number;
  /** Percent change in revenue, one decimal. */
  change: number;
}

export function productRevenue(days: Day[]): ProductWeek[] {
  const sum = (w: number, p: Product) => round2(days.filter((d) => d.week === w).reduce((s, d) => s + d.units[p.id] * p.price, 0));
  return PRODUCTS.map((p) => {
    const thisWeek = sum(WEEKS - 1, p);
    const lastWeek = sum(WEEKS - 2, p);
    return { id: p.id, name: p.name, thisWeek, lastWeek, change: Math.round(((thisWeek - lastWeek) / lastWeek) * 1000) / 10 };
  }).sort((a, b) => b.thisWeek - a.thisWeek);
}

/** Pastry waste cost by weekday over the last four weeks. */
export function wasteByWeekday(days: Day[]): { weekday: string; cost: number; items: number }[] {
  const recent = days.filter((d) => d.week >= WEEKS - 4);
  return WEEKDAYS.map((wd) => {
    const d = recent.filter((x) => x.weekday === wd);
    return { weekday: wd, cost: round2(d.reduce((s, x) => s + x.wasteCost, 0)), items: d.reduce((s, x) => s + Object.values(x.waste).reduce((a, b) => a + b, 0), 0) };
  });
}

export const pct = (now: number, before: number) => Math.round(((now - before) / before) * 1000) / 10;

export interface Insight {
  title: string;
  text: string;
}

const DAY_NAMES: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

export const money = (n: number, cents = true) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })}`;

export const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** Plain-English findings, written from the numbers by rules (not by AI), so they are always correct. */
export function insights(days: Day[]): Insight[] {
  const weeks = weekTotals(days);
  const [prev, now] = weeks.slice(-2);
  const products = productRevenue(days);
  const up = [...products].sort((a, b) => b.change - a.change)[0];
  const down = [...products].sort((a, b) => a.change - b.change)[0];
  const waste = wasteByWeekday(days);
  const worst = [...waste].sort((a, b) => b.cost - a.cost)[0];
  const best = [...waste].sort((a, b) => a.cost - b.cost)[0];
  const unitsIn = (w: number, id: string) => days.filter((d) => d.week === w).reduce((s, d) => s + d.units[id], 0);
  const revChange = pct(now.revenue, prev.revenue);
  return [
    {
      title: `Revenue ${revChange >= 0 ? "up" : "down"} ${Math.abs(revChange)}% on last week`,
      text: `${money(now.revenue)} this week from ${now.orders.toLocaleString("en-US")} orders, an average ticket of ${money(now.avgTicket)}.`,
    },
    {
      title: `${down.name} is fading as the weather cools`,
      text: `${down.name} revenue fell ${Math.abs(down.change)}% this week, and weekly sales dropped from ${unitsIn(0, down.id)} to ${unitsIn(WEEKS - 1, down.id)} since the week of ${shortDate(weeks[0].start)}. ${up.name} grew fastest (${up.change > 0 ? "+" : ""}${up.change}%). Consider a seasonal hot drink in its menu spot.`,
    },
    {
      title: `${DAY_NAMES[worst.weekday]}s waste the most pastries`,
      text: `Over the last four weeks, ${DAY_NAMES[worst.weekday]}s threw away ${money(worst.cost)} of pastries (${worst.items} items), against ${money(best.cost)} on ${DAY_NAMES[best.weekday]}s. A smaller batch early in the week would cut most of it.`,
    },
  ];
}

/** A compact summary of the whole dataset, for the AI to answer questions from. */
export function dataSummary(days: Day[]) {
  return {
    cafe: `${CAFE_NAME} (fictional sample data)`,
    period: `${days[0].date} to ${days[days.length - 1].date}, ${WEEKS} weeks, Monday to Sunday`,
    products: PRODUCTS.map((p) => ({ name: p.name, price: p.price, pastryBatchPerDay: p.baked?.batch ?? null, pastryUnitCost: p.baked?.cost ?? null })),
    weeks: weekTotals(days),
    productUnitsByWeek: PRODUCTS.map((p) => ({ name: p.name, units: Array.from({ length: WEEKS }, (_, w) => days.filter((d) => d.week === w).reduce((s, d) => s + d.units[p.id], 0)) })),
    averageRevenueByWeekday: WEEKDAYS.map((wd) => {
      const d = days.filter((x) => x.weekday === wd);
      return { weekday: wd, revenue: round2(d.reduce((s, x) => s + x.revenue, 0) / d.length) };
    }),
    pastryWasteLast4WeeksByWeekday: wasteByWeekday(days),
  };
}
