import type { Guide } from "./types";

const D = "2026-10-23";

const STARTER_PROMPT = `I'm not a developer. Please build me a simple expense tracker as a single web page I can open in my browser.

What it should do:
- Add an expense: amount, category, date (default today) and an optional note
- Categories: Housing, Bills, Groceries, Eating out, Transport, Health, Fun, Other
- Show this month's total and a total for each category
- Compare this month with the same point last month
- List expenses, newest first, with a way to delete one
- Export everything to a CSV file

How it should work:
- Save everything in my browser on this device, so it's still there when I come back
- No accounts, no sign-up, and don't send my data anywhere
- Big, simple buttons that work well on a phone

Please explain in plain English how to save the page and open it on my phone.`;

const FOLLOW_UPS = `Fix one thing at a time. Examples:

"When I refresh the page my expenses disappear. Please save them in the browser so they stay."

"The total is wrong. I added $12.50 and $7.25 and it shows $19.70. It should be $19.75."

"On my phone the buttons are too small. Make the Add expense button big and fixed at the bottom of the screen."

"Add a way to mark an expense as repeating every month."

"Explain what you changed and why, in two sentences."`;

/** Guides that walk people through building their own small tools with AI, using our apps as the finished examples. */
export const BUILD_GUIDES: Guide[] = [
  {
    slug: "build-your-own-expense-tracker-with-ai",
    topic: "build",
    title: "Build your own expense tracker with AI (no coding)",
    seoTitle: "Build Your Own Expense Tracker With AI (No Coding)",
    description: "A step-by-step guide to building a simple, private expense tracker with an AI assistant like Claude: the exact prompt, how to test and fix it, and keeping your data safe.",
    shortAnswer:
      "Describe the tracker you want in plain English to an AI assistant like Claude, and ask for a single web page that saves your data in your browser. Try it with made-up expenses, then fix or add one thing at a time. Most people get a working first version in under an hour, with no code to write.",
    sections: [
      {
        heading: "What you'll build",
        blocks: [
          { list: ["Add an expense in a few taps: amount, category, date and a note", "This month's total, by category", "This month compared with the same point last month", "A list you can delete from, and a CSV export", "Everything saved in your own browser, with no account"] },
          "Want to see a finished version first? [Spendwise](/apps/spendwise) is our free expense tracker, built the same way and then polished. It's a good picture of where a first version can go.",
        ],
      },
      {
        heading: "Before you start",
        blocks: [
          {
            steps: [
              { title: "Pick three to five must-haves", text: "Small first versions work. You can always add more once the basics feel right." },
              { title: "Choose an AI assistant", text: "We use Claude in our examples. The same steps work with any capable AI assistant that can write and preview a web page." },
              { title: "Use made-up numbers for testing", text: "Never paste bank statements, account numbers or real receipts into an AI chat while you build. Test data is all it needs." },
            ],
          },
        ],
      },
      {
        heading: "Step by step",
        blocks: [
          {
            steps: [
              { title: "Paste the starter prompt", text: "Copy the prompt below into a new chat and send it. Change the categories to match your life." },
              { title: "Try it right away", text: "Add five or six made-up expenses across two months. Check that the totals add up and that everything is still there after you refresh." },
              { title: "Fix one thing at a time", text: "Tell the AI exactly what you saw and what you expected. One problem per message gets better results than a long list." },
              { title: "Add one feature", text: "Once the basics work, add the one thing you'll use most, like repeating bills or a monthly budget." },
              { title: "Save it and use it", text: "Ask the AI how to save the page as a file, open it in your phone's browser and add it to your home screen." },
            ],
          },
          { template: { title: "Starter prompt", text: STARTER_PROMPT } },
          { template: { title: "Follow-up prompts that work", text: FOLLOW_UPS } },
        ],
      },
      {
        heading: "Common problems and quick fixes",
        blocks: [
          {
            list: [
              "Expenses vanish when you reload: ask it to save to the browser's local storage.",
              "Totals are slightly off: give it the exact numbers you entered and the total you expected.",
              "Hard to use on a phone: ask for a mobile-first layout with large buttons.",
              "It keeps getting more complicated: say \"keep it simple\" and remove anything you don't use.",
              "Something broke after a change: ask it to go back to the last version that worked, then try again.",
            ],
          },
        ],
      },
      {
        heading: "Keep your money data private",
        blocks: [
          "AI is only as good as the data you give it, and that cuts both ways: give it test data while you build, never your real financial details. Once the page is saved on your device, your real expenses stay in your own browser.",
          { callout: "Browser storage lives on one device. Export to CSV now and then as a backup, especially before clearing your browser or switching phones." },
        ],
      },
    ],
    faqs: [
      { q: "Do I need to know how to code?", a: "No. You describe what you want in plain English, test it, and describe what to change. The AI writes the code." },
      { q: "Which AI assistant should I use?", a: "We use Claude in our examples. Any capable AI assistant that can write and preview a web page will work with the same steps." },
      { q: "Is it safe to track my money this way?", a: "Yes, if you build with made-up test data and keep your real expenses in your own browser. Don't paste bank statements or account numbers into an AI chat." },
      { q: "What if I get stuck?", a: "Describe exactly what you see and what you expected, one problem at a time. If you'd like a guide alongside you, GrowDaily offers a free 20-minute first call." },
    ],
    related: ["how-to-track-your-spending", "how-to-budget-with-irregular-income", "is-your-data-ready-for-ai"],
    service: "guided-build",
    published: D,
    updated: D,
  },
  {
    slug: "how-to-build-an-ai-dashboard",
    topic: "build",
    title: "How to build an AI dashboard from a spreadsheet (no BI team needed)",
    seoTitle: "How to Build an AI Dashboard From a Spreadsheet",
    description: "A plain-English guide to AI BI for small businesses and nonprofits: turn a spreadsheet into a dashboard that explains itself, with a prompt template and accuracy checks.",
    shortAnswer:
      "Pick the three to five questions you want answered every week, tidy your spreadsheet so each row is one sale, donation or day, and ask an AI assistant like Claude to build a dashboard page from it. Have the numbers calculated by formulas or code, let AI explain what changed, and check the totals against your spreadsheet before you trust it.",
    sections: [
      {
        heading: "What an AI dashboard is",
        blocks: [
          "A regular dashboard shows charts. An AI dashboard, sometimes called AI BI (AI business intelligence), also tells you what the charts mean in plain English and answers questions like \"why was last week slower?\" That matters most for small teams with no data analyst: the dashboard does the first read for you.",
          { list: ["Key numbers compared with last week or last month", "A few charts that answer your real questions", "A short, plain-English summary of what changed", "A box where you can ask the data a question"] },
        ],
      },
      {
        heading: "See one first: Dashwise (new, in beta)",
        blocks: [
          "We built [Dashwise](/apps/dashwise) to show what this looks like for a small business. It uses eight weeks of made-up sales for a fictional café: revenue, orders, average ticket and pastry waste, charts you can hover over, three insights written from the numbers, and a box where you can ask the data a question. It's brand new and in beta, and it's free to try.",
        ],
      },
      {
        heading: "Build your own, step by step",
        blocks: [
          {
            steps: [
              { title: "Write down your questions", text: "Three to five questions you want answered every week, such as: Are sales up or down? What sells best? Where are we wasting money? A dashboard without questions is just decoration." },
              { title: "Tidy the spreadsheet", text: "One row per sale, donation, visit or day. Clear column names, dates in one format, no merged cells or totals in the middle. Export it as a CSV file." },
              { title: "Take out what AI doesn't need", text: "Remove names, emails, phone numbers and anything personal. Totals by day and product are usually enough. Use a business AI account where your data isn't used for training." },
              { title: "Ask AI to build it", text: "Upload the file to an AI assistant like Claude and use the prompt below. Ask for a single dashboard page you can open in your browser." },
              { title: "Check the numbers", text: "Compare two or three totals on the dashboard with your spreadsheet. If one is off, tell the AI exactly which number is wrong and what it should be." },
              { title: "Make it a weekly habit", text: "Each week, export the new data and ask the AI to refresh the dashboard. Read the summary at the same time each week, and act on one thing." },
            ],
          },
        ],
      },
      {
        heading: "A prompt you can copy",
        blocks: [
          {
            template: {
              title: "Dashboard prompt",
              text: `I've attached a CSV of our [sales / donations / visits] for the last [8 weeks]. Each row is [one sale: date, product, quantity, price].

Please build me a dashboard as a single web page that answers these questions:
1. How did this week compare with last week (revenue, orders, average order)?
2. Which [products / programs] are growing or shrinking?
3. Where are we [losing money / wasting stock]?

How it should work:
- Calculate every number from the data with code, not by estimating
- Key numbers at the top with the change from last week
- Simple charts, each with a title and a way to see the exact numbers
- A short "What changed this week" section in plain English
- Works well on a phone

Then tell me two totals I can check against my spreadsheet.`,
            },
          },
        ],
      },
      {
        heading: "Keep it accurate and safe",
        blocks: [
          { callout: "Let formulas or code calculate the numbers, and let AI explain them. AI is good at describing a trend and suggesting a next step, but it can misread or round numbers if you ask it to do the math in its head." },
          {
            list: [
              "Spot-check totals against your spreadsheet every time the data changes.",
              "Label anything estimated or projected, so nobody mistakes it for a real result.",
              "Keep customer and donor details out of AI tools unless your AI policy allows it. Our [AI policy template](/learn/ai-policy-template) covers what may go in.",
              "Use a business account and check [how to stop AI training on your data](/learn/how-to-stop-ai-training-on-your-data).",
              "Keep a person responsible for decisions. The dashboard suggests; your team decides.",
            ],
          },
        ],
      },
      {
        heading: "When to go further",
        blocks: [
          "A spreadsheet dashboard is a great start. When you're updating it every week, the next step is a dashboard that reads straight from your point of sale, accounting or donor system, so it's always current. Your team can build its first one in our [build workshop](/build/ai-training), or we can build it with you.",
        ],
      },
    ],
    faqs: [
      { q: "What is AI BI?", a: "AI business intelligence: dashboards and reports that use AI to explain your numbers in plain English, point out what changed and answer questions about the data, on top of the usual charts." },
      { q: "Do I need Power BI or Tableau?", a: "Not to start. An AI assistant can build a simple dashboard page from a spreadsheet. Dedicated BI tools make sense when you have many data sources, many users or need live connections." },
      { q: "Is it safe to upload my spreadsheet to AI?", a: "Remove personal details first, use a business account where your data isn't used for training, and follow your organization's AI policy. Totals by day and product are usually all a dashboard needs." },
      { q: "How accurate are AI dashboards?", a: "As accurate as the calculations behind them. Ask the AI to calculate with code rather than estimate, check a few totals yourself, and treat its explanations as a first read, not the final word." },
      { q: "Is Dashwise free?", a: "Yes. Dashwise is a free demo with fictional café data. It's new and in beta, so we're still improving it." },
    ],
    related: ["build-your-own-expense-tracker-with-ai", "coffee-shop-inventory-management", "how-to-stop-ai-training-on-your-data"],
    service: "ai-training",
    tool: { name: "Dashwise", href: "/apps/dashwise", pitch: "Try an AI dashboard with a sample café's data: charts, plain-English insights and answers to your questions. New, in beta, free." },
    published: "2026-11-07",
    updated: "2026-11-07",
  },
];
