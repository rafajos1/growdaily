import type { AboutContent } from "./components/AppAbout";

const PRIVATE = "Everything you enter is saved in your own browser on this device. If you tap Save my progress and sign in with your email, a private copy is kept in your GrowDaily account so it comes back on any device.";

/** Search-friendly explainers for each app, shown under the app and used in structured data. */
export const ABOUT: Record<"habitwise" | "planwise" | "mealwise" | "moodwise" | "cafewise" | "quotewise", AboutContent> = {
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
  quotewise: {
    name: "Quotewise",
    path: "/apps/quotewise",
    category: "BusinessApplication",
    description: "Free quote and estimate maker with AI: describe the job and get itemized line items, then print, save as PDF or email it, and turn it into an invoice.",
    heading: "A free quote, estimate and invoice maker that drafts the line items for you",
    intro: "Quotewise helps contractors, handymen, cleaners, photographers, florists and other small businesses send professional quotes fast. Describe the job in plain words and AI drafts the line items, using your hourly rate for labor and estimating materials. Check the prices, add tax or a discount, then print it, save it as a PDF or email it. When the client says yes, turn the quote into an invoice in one tap.",
    faqs: [
      { q: "Is Quotewise free?", a: "Yes. No account, sign-up or trial, and it works in any browser on your phone or computer." },
      { q: "What's the difference between a quote and an estimate?", a: "People use the words loosely. Usually an estimate is a best guess that can change, while a quote is a firm price for the work described, valid for a set time. Quotewise lets you set a valid-until date and notes that spell out what's included." },
      { q: "Are the AI prices accurate?", a: "Labor uses your own hourly rate. Material prices are typical estimates, so always check them against your supplier before you send a quote." },
      { q: "Can I save a quote as a PDF?", a: "Yes. Open the preview and choose Print or save as PDF. On a phone, use the share or print menu to save the PDF." },
      { q: "Where is my data kept?", a: `${PRIVATE} When you use AI drafting, only the job description, what your business does and your hourly rate are sent.` },
    ],
  },
  cafewise: {
    name: "Cafewise",
    path: "/apps/cafewise",
    category: "BusinessApplication",
    description: "Free coffee shop inventory app: quick stock counts, an order list from your par levels, cost per drink and margin, a waste log and an AI ordering review.",
    heading: "A free coffee shop inventory app: count, order and know what each drink costs",
    intro: "Cafewise is a simple stock and ordering helper for independent cafés. Count milk, pastries, beans and cups on your phone, and it builds an order list from your par levels, grouped by supplier and ready to text. Add your drinks to see what each one costs to make and your margin, log waste in a tap, and get an AI review that spots what you keep running out of or throwing away.",
    faqs: [
      { q: "Is Cafewise free?", a: "Yes. No account, sign-up or trial, and it works in any browser on your phone or computer." },
      { q: "What is a par level?", a: "The amount of an item you want on hand right after a delivery. Cafewise orders the difference between par and what you counted, and suggests pars from your actual use: enough to last until the next delivery, plus a 25% buffer (10% for pastries, since leftovers are thrown away)." },
      { q: "How do I work out the cost of a latte?", a: "Add up what goes in: espresso by the gram, milk by the ounce, plus the cup and lid. Cafewise does the math from what you pay for each item and shows the cost, your margin and the cost as a share of the price." },
      { q: "Where is my data kept?", a: `${PRIVATE} For the AI review, only item names and numbers are sent.` },
      { q: "Does it connect to Square or Toast?", a: "Not this free version. GrowDaily can build a custom version for your café that connects to your point of sale, supports several locations and gives staff their own logins." },
    ],
  },
};
