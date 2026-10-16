import { createId } from "./storage";
import { daysAgoISO } from "./dates";
import type { Category, Expense } from "./types";

const TEMPLATES: { description: string; category: Category; min: number; max: number }[] = [
  { description: "Groceries", category: "Food", min: 3500, max: 12000 },
  { description: "Coffee", category: "Food", min: 350, max: 750 },
  { description: "Lunch with team", category: "Food", min: 1200, max: 3500 },
  { description: "Dinner out", category: "Food", min: 2500, max: 8500 },
  { description: "Gas", category: "Transportation", min: 3000, max: 6500 },
  { description: "Rideshare", category: "Transportation", min: 900, max: 3200 },
  { description: "Transit pass", category: "Transportation", min: 2500, max: 2500 },
  { description: "Movie tickets", category: "Entertainment", min: 1400, max: 3200 },
  { description: "Concert", category: "Entertainment", min: 4500, max: 12000 },
  { description: "Streaming subscription", category: "Entertainment", min: 1099, max: 1599 },
  { description: "New shoes", category: "Shopping", min: 6000, max: 14000 },
  { description: "Household supplies", category: "Shopping", min: 1500, max: 5000 },
  { description: "Electric bill", category: "Bills", min: 7000, max: 13000 },
  { description: "Internet", category: "Bills", min: 6500, max: 6500 },
  { description: "Phone plan", category: "Bills", min: 4500, max: 4500 },
  { description: "Gift", category: "Other", min: 2000, max: 7500 },
  { description: "Haircut", category: "Other", min: 2500, max: 4500 },
];

/** Deterministic PRNG so the demo data looks the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSampleExpenses(count = 70, days = 170): Expense[] {
  const rand = mulberry32(42);
  const now = new Date().toISOString();
  // A monthly donation, so the Giving category and generosity view have something to show.
  const donations: Expense[] = [5, 35, 65, 95, 125, 155]
    .filter((ago) => ago < days)
    .map((ago) => ({ id: createId(), date: daysAgoISO(ago), amountCents: 4000, category: "Giving", description: "Monthly donation", createdAt: now, updatedAt: now }));
  return [...donations, ...Array.from({ length: count }, (): Expense => {
    const t = TEMPLATES[Math.floor(rand() * TEMPLATES.length)];
    const amount = Math.round(t.min + rand() * (t.max - t.min));
    return {
      id: createId(),
      date: daysAgoISO(Math.floor(rand() * days)),
      amountCents: amount,
      category: t.category,
      description: t.description,
      createdAt: now,
      updatedAt: now,
    };
  })];
}
