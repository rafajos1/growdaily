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
];
