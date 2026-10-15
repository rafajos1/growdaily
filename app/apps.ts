export type AppStatus = "live" | "soon";

export interface GrowApp {
  slug: string;
  name: string;
  area: string;
  color: string;
  tagline: string;
  ai: string;
  status: AppStatus;
  href?: string;
}

// The GrowDaily app family, in launch order.
export const APPS: GrowApp[] = [
  {
    slug: "spendwise",
    name: "Spendwise",
    area: "Money",
    color: "#f2b54b",
    tagline: "See your pace for the month, the days you spend most, and what repeats every month.",
    ai: "Projects where your month will end, and spots subscriptions on its own.",
    status: "live",
    href: "/apps/spendwise",
  },
  {
    slug: "habitwise",
    name: "Habitwise",
    area: "Habits",
    color: "#53cfa0",
    tagline: "Check off daily habits and watch your streaks build on a calendar.",
    ai: "A weekly review that tells you when and why habits slip.",
    status: "live",
    href: "/apps/habitwise",
  },
  {
    slug: "planwise",
    name: "Planwise",
    area: "Time",
    color: "#5cb8e6",
    tagline: "Dump everything on your mind; get a realistic plan for today.",
    ai: "Turns a messy list into time blocks, most important first.",
    status: "live",
    href: "/apps/planwise",
  },
  {
    slug: "mealwise",
    name: "Mealwise",
    area: "Food",
    color: "#ef7fa8",
    tagline: "Tell it what's in your fridge; get three dinners you can make tonight.",
    ai: "Suggests meals and writes the grocery list for what's missing.",
    status: "soon",
  },
  {
    slug: "moodwise",
    name: "Moodwise",
    area: "Mood",
    color: "#b48cf2",
    tagline: "A two-minute daily check-in on mood, energy and sleep.",
    ai: "Finds the patterns behind your best and worst days.",
    status: "soon",
  },
];
