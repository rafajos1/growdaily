import { monthlyTotals, type MonthTotal } from "./analytics";
import { monthKey } from "./dates";
import type { Expense } from "./types";

export interface Generosity {
  thisMonthCents: number;
  giftsThisMonth: number;
  /** Giving per month, oldest first, ending with this month. */
  months: MonthTotal[];
}

const toMonthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export function generosity(expenses: Expense[], months = 6, now: Date = new Date()): Generosity {
  const gifts = expenses.filter((e) => e.category === "Giving");
  const current = toMonthKey(now);
  const thisMonth = gifts.filter((e) => monthKey(e.date) === current);
  return {
    thisMonthCents: thisMonth.reduce((sum, e) => sum + e.amountCents, 0),
    giftsThisMonth: thisMonth.length,
    months: monthlyTotals(gifts, months, now),
  };
}

export interface Encouragement {
  ref: string;
  chapter: string;
  text: string;
}

/**
 * Said the way a friend would say it, not quoted. Each names the passage it's
 * drawn from. Generosity is framed as joy, never as a rule or a percentage.
 */
export const GENEROSITY_ENCOURAGEMENTS: Encouragement[] = [
  { ref: "2 Corinthians 9:7", chapter: "2 Corinthians 9", text: "Generosity isn't about the size of the gift. Give what you've decided in your heart, and give it gladly, never because you feel pressured." },
  { ref: "Acts 20:35", chapter: "Acts 20", text: "Jesus said there's more joy in giving than in receiving. Notice how it feels the next time you give something away." },
  { ref: "Proverbs 11:25", chapter: "Proverbs 11", text: "Generous people end up refreshed themselves. When you lift someone else up, you get lifted too." },
  { ref: "Matthew 6:21", chapter: "Matthew 6", text: "Where your money goes, your heart tends to follow. Giving is a way of pointing your heart toward what matters." },
  { ref: "1 John 3:18", chapter: "1 John 3", text: "Love isn't only something we say. It shows up in what we actually do for each other." },
];

/** A different encouragement each month. */
export function generosityEncouragement(now: Date = new Date()): Encouragement {
  const i = (now.getFullYear() * 12 + now.getMonth()) % GENEROSITY_ENCOURAGEMENTS.length;
  return GENEROSITY_ENCOURAGEMENTS[i];
}

/** The chapter in the New Living Translation, which reads easily for newcomers. */
export function passageUrl(e: Encouragement): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(e.chapter)}&version=NLT`;
}
