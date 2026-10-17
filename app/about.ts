import type { AboutContent } from "./components/AppAbout";

const PRIVATE = "Everything you enter is saved in your own browser on this device. If you tap Save my progress and sign in with your email, a private copy is kept in your GrowDaily account so it comes back on any device.";

/** Search-friendly explainers for each app, shown under the app and used in structured data. */
export const ABOUT: Record<"habitwise" | "planwise" | "mealwise" | "moodwise", AboutContent> = {
  habitwise: {
    name: "Habitwise",
    path: "/apps/habitwise",
    category: "LifestyleApplication",
    description: "Free habit tracker with streaks, a 15-week calendar and a weekly AI review. No sign-up.",
    heading: "A free habit tracker that shows you when and why habits slip",
    intro: "Habitwise is a simple daily habit tracker. Check off habits each day, build streaks, see 15 weeks of progress on a calendar, and get a short weekly review that points out what's working and one small change to try.",
    faqs: [
      { q: "Is Habitwise free?", a: "Yes. It's free with no account, sign-up or trial, and it works in any browser on your phone or computer." },
      { q: "What happens if I miss a day?", a: "You can fill in any day from the last week. Your streak restarts, but your full history stays, and the weekly review shows which days tend to slip." },
      { q: "Where is my data stored?", a: `${PRIVATE} Only habit names and numbers are sent for the AI review.` },
      { q: "Can I track habits on only some days?", a: "Yes. Each habit can be every day, weekdays, weekends, or any days you pick, and missed days only count on scheduled days." },
    ],
  },
  planwise: {
    name: "Planwise",
    path: "/apps/planwise",
    category: "ProductivityApplication",
    description: "Free AI day planner: turn a messy to-do list into a realistic, time-blocked plan for today, with a focus timer.",
    heading: "A free AI day planner that turns your to-do list into a realistic day",
    intro: "Planwise turns everything on your mind into a time-blocked plan for today. Write your list in any order, set your hours, and get focus blocks, breaks and your top three, with a focus timer to work through them.",
    faqs: [
      { q: "How does the AI planner work?", a: "It reads your list, puts fixed appointments at their times, schedules important work first, adds breaks, and moves anything that won't fit to Later." },
      { q: "What if I don't finish everything?", a: "Unfinished items carry over to tomorrow's list automatically, and you can re-plan the rest of today from the current time." },
      { q: "Is Planwise free?", a: "Yes. No account or sign-up, and it still makes a simple plan without AI." },
      { q: "Is my to-do list private?", a: `${PRIVATE} Your list is only sent to AI when you press Plan my day.` },
    ],
  },
  mealwise: {
    name: "Mealwise",
    path: "/apps/mealwise",
    category: "LifestyleApplication",
    description: "What can I cook with what I have? Free AI meal ideas from the food in your fridge, plus a grocery list for what's missing.",
    heading: "What can I cook with what I have? Free meal ideas from your fridge",
    intro: "Mealwise suggests three meals you can make tonight from the ingredients you already have. Set how much time you have, how many people you're cooking for and any diet, and add what's missing to a shared grocery list.",
    faqs: [
      { q: "How does Mealwise pick meals?", a: "It looks for meals that use as much of what you have as possible and need little extra shopping, within your time limit." },
      { q: "Can it follow a diet?", a: "Yes. Vegetarian, vegan, gluten-free and dairy-free are treated as strict rules, not preferences. Always check labels if you have allergies." },
      { q: "Is Mealwise free?", a: "Yes. No account or sign-up. If AI isn't available, it suggests matches from its built-in recipe book." },
      { q: "Where are my favorites and grocery list saved?", a: PRIVATE },
    ],
  },
  moodwise: {
    name: "Moodwise",
    path: "/apps/moodwise",
    category: "HealthApplication",
    description: "Free private mood tracker: a two-minute daily check-in on mood, energy and sleep, and patterns behind your better days.",
    heading: "A free, private mood tracker that finds what goes with your better days",
    intro: "Moodwise is a two-minute daily check-in on mood, energy and sleep, with optional tags and a one-line note. Over time it shows a mood calendar, how sleep and habits like exercise line up with your mood, and AI insights into your patterns.",
    faqs: [
      { q: "Are my notes private?", a: `${PRIVATE} Notes are never sent for AI insights; only numbers and tag names are.` },
      { q: "When do insights unlock?", a: "After seven check-ins, so there's enough to see real patterns." },
      { q: "Is Moodwise free?", a: "Yes. No account, sign-up or trial." },
      { q: "Is this a substitute for professional help?", a: "No. Moodwise can help you notice patterns, but it isn't medical advice. If you're struggling, talk to a doctor or counselor. In the US you can call or text 988 any time." },
    ],
  },
};
