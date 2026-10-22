import type { Guide } from "./types";

const D = "2026-10-22";

const SPENDING_LOG = `Spending log: [month]

Date | What | Category | Amount | Fixed or flexible
-----|------|----------|--------|------------------
     |      |          |        |

Categories (keep it to about eight):
Housing · Bills & utilities · Groceries · Eating out · Transport · Health · Fun · Other

End of week: total so far ______   Biggest surprise: ______
End of month: total ______   Fixed ______   Flexible ______
One change for next month: ______`;

const HABIT_PLAN = `My habit plan

Habit (tiny version): ______
  e.g. "one push-up", "read one page", "two minutes of tidying"

Cue: After I ______, I will ______.
  e.g. "After I pour my morning coffee, I will read one page."

Where: ______        When: ______

If I miss a day: I start again the next day. One miss doesn't undo the progress.

Weekly check (Sunday): How many days? ___ / 7   What got in the way? ______
Grow it when it feels automatic: next version ______`;

const DAY_PLAN = `Today's plan

1. Brain dump (everything, any order):
   ______

2. Fixed times (meetings, pickups, appointments):
   ______

3. Top 3 (the one that matters most first):
   1. ______  (time needed: ___ × 1.5 = ___)
   2. ______
   3. ______

4. Blocks:
   ___–___  Top task 1
   ___–___  Break
   ___–___  Top task 2
   ___–___  Small tasks batch
   ___–___  Buffer

5. Later (not today, and that's fine):
   ______`;

export const EVERYDAY_GUIDES: Guide[] = [
  {
    slug: "how-to-track-your-spending",
    topic: "everyday",
    title: "How to track your spending: a simple 30-day method",
    seoTitle: "How to Track Your Spending: A Simple 30-Day Method",
    description: "A simple way to see where your money goes: log every purchase for one month in a few categories, review weekly, and pick one change. No bank linking or sign-up needed.",
    shortAnswer:
      "Write down every purchase for one full month, the same day you make it, in about eight categories. Review the total once a week, and at the end of the month split it into fixed and flexible costs. That one month shows where your money really goes and the one change most worth making.",
    sections: [
      {
        heading: "Why a full month",
        blocks: [
          "A week or two misses the bills that come once a month, like rent, insurance and subscriptions. The US Consumer Financial Protection Bureau's spending tracker suggests tracking a full month so you see income and expenses in one place, and noting the costs that are the same every month as your fixed obligations.",
          "You don't need to link a bank account or install anything. The habit of writing it down is what makes you notice.",
        ],
      },
      {
        heading: "The 30-day method",
        blocks: [
          {
            steps: [
              { title: "Pick one place", text: "Paper, a notes app, a spreadsheet or a free tracker like [Spendwise](/apps/spendwise). One place, so nothing gets lost." },
              { title: "Log it the same day", text: "Amount, what it was, and a category. Same-day logging takes seconds; reconstructing a week from memory doesn't work." },
              { title: "Keep categories few", text: "About eight is plenty: housing, bills, groceries, eating out, transport, health, fun and other. Too many categories and you'll stop." },
              { title: "Mark fixed or flexible", text: "Fixed costs are the same every month (rent, loan payments). Flexible costs are the ones you choose day to day (eating out, shopping)." },
              { title: "Review weekly", text: "Ten minutes, once a week: total so far, the biggest category and anything that surprised you." },
              { title: "Pick one change", text: "At the end of the month, choose one flexible category to adjust. One change you keep beats five you abandon." },
            ],
          },
          { template: { title: "A simple spending log", text: SPENDING_LOG } },
        ],
      },
      {
        heading: "Find the charges that repeat",
        blocks: [
          "Recurring charges are easy to forget because they happen without you doing anything. When the month is done, look for:",
          { list: ["Subscriptions you no longer use (streaming, apps, memberships)", "Free trials that turned into paid plans", "Annual renewals coming up in the next few months", "Bank or card fees you could avoid"] },
          { callout: "Spendwise flags what repeats every month and shows your pace against last month, with no account. Your data stays in your browser unless you choose to save it." },
        ],
      },
      {
        heading: "What to do with what you learn",
        blocks: [
          "Your month of tracking is the starting point for a budget: you now know your real fixed costs and what your flexible spending usually is. If your income changes month to month, see [how to budget with irregular income](/learn/how-to-budget-with-irregular-income).",
        ],
      },
    ],
    faqs: [
      { q: "Do I need to link my bank account?", a: "No. Writing purchases down by hand (or in a simple app) for a month works well, and many people find it makes them more aware of spending than automatic imports." },
      { q: "How long should I track my spending?", a: "At least one full month, so monthly bills are included. Many people keep going because the weekly review becomes a quick habit." },
      { q: "What categories should I use?", a: "Start with about eight: housing, bills and utilities, groceries, eating out, transport, health, fun and other. Split a category only if it gets too big to understand." },
      { q: "What if I forget to log something?", a: "Add it when you remember, or check your bank statement at the weekly review. Close enough is fine; the goal is a clear picture, not perfect accounting." },
    ],
    related: ["how-to-budget-with-irregular-income", "how-to-build-a-habit-that-sticks"],
    service: "build",
    tool: { name: "Spendwise", href: "/apps/spendwise", pitch: "A free expense tracker that shows your pace for the month and what repeats. No sign-up." },
    published: D,
    updated: D,
    sources: [{ label: "CFPB: Spending tracker (Your Money, Your Goals)", url: "https://files.consumerfinance.gov/f/documents/cfpb_spending-tracker_tool_2021-08.pdf" }],
  },
  {
    slug: "how-to-budget-with-irregular-income",
    topic: "everyday",
    title: "How to budget with irregular income",
    seoTitle: "How to Budget With Irregular Income: A Simple Plan",
    description: "Freelance, commission, gig or seasonal pay? Budget on your lean months, pay yourself a steady amount from a buffer, and use good months to get ahead. A simple step-by-step plan.",
    shortAnswer:
      "Work out your bare-minimum monthly costs, then budget on what you earn in a lean month, not an average one. Put all income into one holding account and pay yourself the same amount each month from it. Good months fill a buffer and cover taxes; lean months draw from it.",
    sections: [
      {
        heading: "Step 1: know your baseline",
        blocks: [
          "Your baseline is what you must pay every month no matter what: housing, utilities, insurance, minimum debt payments, groceries and transport to work. If you don't know it yet, [track your spending for a month](/learn/how-to-track-your-spending) first.",
        ],
      },
      {
        heading: "Step 2: sort your income",
        blocks: [
          "The CFPB's income tracker suggests labeling each source as regular, irregular, seasonal or one-time, so you can see when less is coming in and prepare for it. Look back over the last 6 to 12 months and note your lowest typical month.",
        ],
      },
      {
        heading: "Step 3: pay yourself a steady amount",
        blocks: [
          {
            steps: [
              { title: "One holding account", text: "All income lands in one account first, separate from the account you spend from." },
              { title: "A steady 'salary'", text: "Each month, move the same amount (your baseline plus a modest flexible amount) into your spending account. Base it on your lean months." },
              { title: "Build the buffer first", text: "Aim to hold at least one month of baseline costs in the holding account, then grow it toward three or more over time." },
              { title: "Set taxes aside as you're paid", text: "If no one withholds tax from your pay, put a share of every payment aside. In the US, self-employed people generally pay estimated tax each quarter." },
            ],
          },
        ],
      },
      {
        heading: "Good months and lean months",
        blocks: [
          { list: ["Good month: fill the buffer, set aside taxes, then put extra toward debt or goals. Resist raising your 'salary' until the buffer is full.", "Lean month: pay yourself from the buffer. If it's running low, cut from a flexible list you wrote in advance, in order, so you're not deciding under pressure.", "Every few months: check whether your lean-month estimate still holds, and adjust your 'salary' up or down."] },
          { callout: "This is general information, not financial or tax advice. For tax questions, check with the IRS or a tax professional." },
        ],
      },
    ],
    faqs: [
      { q: "Should I budget on my average income?", a: "No. Budget on a lean month. Averages hide the months that cause trouble; a lean-month budget plus a buffer smooths them out." },
      { q: "How big should my buffer be?", a: "Start with one month of baseline costs, then build toward three or more. The more uneven your income, the bigger the buffer helps." },
      { q: "What if I have no savings to start the buffer?", a: "Start with your baseline costs only and put every good-month surplus into the buffer until it holds one month. It takes time, and that's normal." },
    ],
    related: ["how-to-track-your-spending", "how-to-plan-your-day-when-overwhelmed"],
    service: "build",
    tool: { name: "Spendwise", href: "/apps/spendwise", pitch: "Track what you spend for free and see your pace against last month. No sign-up." },
    published: D,
    updated: D,
    sources: [
      { label: "CFPB: Income and benefits tracker", url: "https://files.consumerfinance.gov/f/documents/cfpb_income-benefits-tracker_tool_2021-08.pdf" },
      { label: "CFPB: Spending tracker", url: "https://files.consumerfinance.gov/f/documents/cfpb_spending-tracker_tool_2021-08.pdf" },
      { label: "IRS: Estimated taxes", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes" },
    ],
  },
  {
    slug: "what-to-cook-with-what-you-have",
    topic: "everyday",
    title: "What to cook with what you have: a simple fridge method",
    seoTitle: "What to Cook With What You Have: A Simple Fridge Method",
    description: "Not sure what to make for dinner? Start with what needs using, pick a base, add protein, veg and flavor. Easy formula meals, a staples list, and leftover safety tips.",
    shortAnswer:
      "Start with what needs using up, then build a meal in four parts: a base (rice, pasta, eggs, tortillas, bread or potatoes), a protein, a vegetable and something for flavor. Fried rice, omelets, pasta, quesadillas, soups and grain bowls work with almost anything.",
    sections: [
      {
        heading: "The four-part method",
        blocks: [
          {
            steps: [
              { title: "Use it first", text: "Check for leftovers and anything close to going off. Cooked leftovers are best eaten within 3 to 4 days." },
              { title: "Pick a base", text: "Rice, pasta, noodles, eggs, tortillas, bread, potatoes or beans." },
              { title: "Add a protein", text: "Eggs, beans, chicken, ground meat, tofu, canned fish, cheese or yogurt." },
              { title: "Add a vegetable", text: "Fresh, frozen or canned all count. Frozen vegetables are a weeknight lifesaver." },
              { title: "Add flavor", text: "Garlic, onion, soy sauce, salsa, lemon, spices, a stock cube or a spoon of pesto." },
            ],
          },
        ],
      },
      {
        heading: "Formula meals that take almost anything",
        blocks: [
          { list: ["Fried rice: day-old rice, an egg, any vegetables, soy sauce", "Omelet or frittata: eggs plus whatever vegetables and cheese you have", "Pasta: pasta, garlic and oil or a jar of sauce, plus a vegetable and protein", "Quesadillas or wraps: tortillas, cheese, beans or leftover meat, salsa", "Soup: stock, an onion, vegetables, and beans, pasta or rice", "Sheet-pan dinner: chopped vegetables and a protein roasted together", "Grain bowl: rice or grains, a protein, vegetables and a sauce"] },
          "Or tell [Mealwise](/apps/mealwise) what's in your fridge and get three meal ideas you can make tonight, with a grocery list for anything missing.",
        ],
      },
      {
        heading: "Staples that make it easier",
        blocks: [
          { list: ["Rice, pasta and a few cans of beans", "Eggs", "Canned tomatoes and stock", "Frozen vegetables", "Onions and garlic", "Oil, salt, pepper and two or three favorite spices or sauces"] },
        ],
      },
      {
        heading: "Leftovers, safely",
        blocks: [
          "The USDA's food safety guidance: refrigerate leftovers within 2 hours, eat them within 3 to 4 days, and reheat to 165°F (74°C). Frozen leftovers keep their best quality for about 3 to 4 months. Pack them in small, shallow containers and label them with the date.",
          "Using what you have also cuts waste: the USDA estimates that 30 to 40 percent of the US food supply goes to waste.",
        ],
      },
    ],
    faqs: [
      { q: "How long do leftovers last in the fridge?", a: "Three to four days, according to USDA food safety guidance. Freeze them sooner if you won't eat them in time." },
      { q: "What if I only have a few ingredients?", a: "Eggs, rice or pasta plus one vegetable and a sauce make a real meal: fried rice, an omelet or a simple pasta." },
      { q: "Is there a free tool that suggests meals from my ingredients?", a: "Yes. Mealwise suggests three meals from what you have, within your time limit and diet, with no sign-up." },
    ],
    related: ["how-to-track-your-spending", "how-to-plan-your-day-when-overwhelmed"],
    service: "build",
    tool: { name: "Mealwise", href: "/apps/mealwise", pitch: "Type what's in your fridge and get three meals you can make tonight. Free, no sign-up." },
    published: D,
    updated: D,
    sources: [
      { label: "USDA FSIS: Leftovers and food safety", url: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety" },
      { label: "USDA: Food loss and waste", url: "https://www.usda.gov/foodwaste" },
      { label: "FoodSafety.gov: FoodKeeper app", url: "https://www.foodsafety.gov/keep-food-safe/foodkeeper-app" },
    ],
  },
  {
    slug: "how-to-plan-your-day-when-overwhelmed",
    topic: "everyday",
    title: "How to plan your day when you feel overwhelmed",
    seoTitle: "How to Plan Your Day When You Feel Overwhelmed",
    description: "Too much to do and no idea where to start? Get it all out of your head, pick three things, give each a realistic block of time, and move the rest to later. A simple daily plan.",
    shortAnswer:
      "Write everything down, then choose the three things that matter most today. Put fixed appointments in first, give each top task a block of time about one and a half times your first guess, add breaks, and move everything else to a 'later' list. Start with the smallest next step.",
    sections: [
      {
        heading: "Why overwhelm happens",
        blocks: [
          "Overwhelm usually isn't about the amount of work. It's about holding it all in your head with no order. Writing it down and choosing turns a cloud of worry into a short list.",
          "There's a second trap: we almost always underestimate how long our own tasks take. In a classic study by Buehler, Griffin and Ross, students predicted they'd finish their theses in about 34 days on average; it took about 56, and only around 30 percent finished by their own estimate. Researchers call this the planning fallacy.",
        ],
      },
      {
        heading: "A plan in ten minutes",
        blocks: [
          {
            steps: [
              { title: "Brain dump", text: "Write down everything on your mind, in any order. Big, small, work, home." },
              { title: "Mark fixed times", text: "Meetings, pickups and appointments go in first. They shape the rest of the day." },
              { title: "Pick your top three", text: "Which three would make today a good day if they were done? Put the most important first." },
              { title: "Time-block with a buffer", text: "Give each top task a block about one and a half times your first guess, and leave some open time for the unexpected." },
              { title: "Add breaks", text: "Short breaks between blocks keep you going longer than pushing straight through." },
              { title: "Move the rest to later", text: "Everything else goes on a 'later' list. Not today is a decision, not a failure." },
              { title: "Start small", text: "Begin the first task with a two-minute step: open the document, write one line, make the call." },
            ],
          },
          { template: { title: "A one-page day plan", text: DAY_PLAN } },
        ],
      },
      {
        heading: "When the day goes sideways",
        blocks: [
          { list: ["Re-plan at midday from the current time: what's realistic now?", "Drop to your top one if the day falls apart.", "At the end of the day, move what's unfinished to tomorrow's list so your head can rest."] },
          "Prefer not to do it by hand? [Planwise](/apps/planwise) turns a messy to-do list into a time-blocked plan for today, with breaks and a focus timer, and carries unfinished items to tomorrow.",
          { callout: "If overwhelm feels constant or is affecting your sleep, health or relationships, it's worth talking to a doctor, counselor or someone you trust." },
        ],
      },
    ],
    faqs: [
      { q: "How many tasks should I plan for a day?", a: "Three that really matter, plus any fixed appointments and a batch of small tasks. Most people plan far more than fits." },
      { q: "Does time blocking work?", a: "There's little formal research on time blocking itself, but many people find it helps them focus. Its biggest benefit is showing you, before the day starts, that your list doesn't fit." },
      { q: "What if I don't finish my top three?", a: "Move what's left to tomorrow and make the next estimate longer. Over a few days your plans get more realistic." },
    ],
    related: ["how-to-build-a-habit-that-sticks", "how-to-track-your-mood"],
    service: "build",
    tool: { name: "Planwise", href: "/apps/planwise", pitch: "Write your to-do list in any order and get a realistic plan for today. Free, no sign-up." },
    published: D,
    updated: D,
    sources: [
      { label: "Buehler, Griffin & Ross (1994): Exploring the planning fallacy", url: "https://doi.org/10.1037/0022-3514.67.3.366" },
      { label: "SPSP: The planning fallacy", url: "https://spsp.org/news-center/blog/buehler-planning-fallacy" },
    ],
  },
  {
    slug: "how-to-build-a-habit-that-sticks",
    topic: "everyday",
    title: "How to build a habit that sticks, according to research",
    seoTitle: "How to Build a Habit That Sticks (What the Research Says)",
    description: "How long does a habit really take? What a well-known study found, why a missed day doesn't ruin it, and a simple plan: start tiny, tie it to a cue, and track it.",
    shortAnswer:
      "Start with a tiny version of the habit, tie it to something you already do every day ('after I pour my coffee, I will…'), and do it at the same time and place. Expect it to take around two months to feel automatic, and don't worry about missing a day: one miss doesn't undo your progress.",
    sections: [
      {
        heading: "What the research found",
        blocks: [
          "In a study at University College London, Lally and colleagues asked volunteers to repeat a new daily habit, like eating fruit at lunch or a short walk, and to rate how automatic it felt. Among the people whose results fit the researchers' model, it took a median of 66 days to reach automaticity, with a very wide range of 18 to 254 days.",
          "Two findings matter most: simple habits got automatic faster than harder ones, and missing a single day didn't materially affect the process. The study was small, so treat '66 days' as a rough guide, not a rule.",
        ],
      },
      {
        heading: "A plan that works",
        blocks: [
          {
            steps: [
              { title: "Make it tiny", text: "Shrink the habit until it's almost too easy: one page, one push-up, two minutes. You can grow it once it sticks." },
              { title: "Tie it to a cue", text: "Use an 'after I…, I will…' plan. Research on these if-then plans (called implementation intentions) shows they make people noticeably more likely to follow through." },
              { title: "Same time, same place", text: "Habits form through repetition in a consistent setting." },
              { title: "Track it", text: "A simple check-off or streak makes progress visible. [Habitwise](/apps/habitwise) does this with a 15-week calendar and a weekly review." },
              { title: "Plan for misses", text: "Decide now: if I miss a day, I start again the next day." },
              { title: "One at a time", text: "Add a second habit once the first feels automatic." },
            ],
          },
          { template: { title: "A one-page habit plan", text: HABIT_PLAN } },
        ],
      },
      {
        heading: "Why habits slip",
        blocks: [{ list: ["The habit is too big for a busy day", "There's no clear cue, so it depends on remembering", "Weekends or travel break the routine; plan a weekend version", "One missed day turns into giving up; restart the next day instead"] }],
      },
    ],
    faqs: [
      { q: "Does it take 21 days to form a habit?", a: "Probably not. In the best-known study, it took a median of 66 days for a simple daily habit to feel automatic, with a range of 18 to 254 days." },
      { q: "Does missing a day ruin a habit?", a: "No. In the Lally study, missing one opportunity didn't materially affect habit formation. Start again the next day." },
      { q: "How many habits should I work on at once?", a: "One, until it feels automatic. Then add the next." },
    ],
    related: ["how-to-plan-your-day-when-overwhelmed", "how-to-track-your-mood"],
    service: "build",
    tool: { name: "Habitwise", href: "/apps/habitwise", pitch: "Check off habits, keep streaks and see 15 weeks of progress. Free, no sign-up." },
    published: D,
    updated: D,
    sources: [
      { label: "Lally et al. (2010): How are habits formed (European Journal of Social Psychology)", url: "https://doi.org/10.1002/ejsp.674" },
      { label: "UCL: How long does it take to form a habit?", url: "https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit" },
      { label: "Gollwitzer & Sheeran (2006): Implementation intentions and goal achievement", url: "https://doi.org/10.1016/S0065-2601(06)38002-1" },
    ],
  },
  {
    slug: "how-to-track-your-mood",
    topic: "everyday",
    title: "How to track your mood, and why it helps",
    seoTitle: "How to Track Your Mood (and Why It Helps)",
    description: "A two-minute daily mood check-in can show what lifts you and what drags you down. What to log, how to spot patterns, the downsides, and when to talk to someone.",
    shortAnswer:
      "Once a day, at about the same time, rate your mood from 1 to 5, name the feeling in a word, and note sleep and anything that stood out. After a week or two, look for patterns across days rather than reading into any single day. It can help you notice what lifts you, and it's useful to share with a doctor or counselor.",
    sections: [
      {
        heading: "What to log",
        blocks: [
          { list: ["A mood rating from 1 to 5", "One word for the feeling (calm, anxious, flat, hopeful…)", "Energy and how you slept", "What happened: exercise, time outside, time with people, work stress", "Optionally, one line about the day"] },
          "Naming a feeling is more than bookkeeping. In a well-known brain-imaging study, putting feelings into words reduced activity in the amygdala, a brain area involved in emotional reactions.",
        ],
      },
      {
        heading: "How to spot patterns",
        blocks: [
          {
            steps: [
              { title: "Check in daily", text: "Same time each day, about two minutes. Evenings work well for most people." },
              { title: "Wait a week or two", text: "Single days are noisy. Patterns show up over weeks." },
              { title: "Look for what goes with better days", text: "Sleep, movement, sunlight, people and routines are common links." },
              { title: "Try one change", text: "If walks line up with better days, plan a few and see if the pattern holds." },
            ],
          },
          "[Moodwise](/apps/moodwise) does this in a two-minute check-in and, after seven entries, shows a mood calendar and how sleep and habits line up with your mood. Your notes stay on your device.",
        ],
      },
      {
        heading: "The honest downsides",
        blocks: [
          "Tracking isn't for everyone. Researchers note that mood monitoring can feel distressing or time-consuming for some people. If tracking makes you feel worse, take a break. A mood log is a tool for noticing, not a diagnosis.",
          "People who track over the long term often find it most useful to share with a professional: in one survey of people with bipolar disorder, most valued long-term tracking, and many found it helpful to share their graphs with clinicians.",
        ],
      },
      {
        heading: "When to talk to someone",
        blocks: [
          "If you feel low, empty or hopeless most of the day, nearly every day, for two weeks or more, talk to a doctor or counselor. That's a common sign of depression, and it's treatable.",
          { callout: "If you're in crisis or thinking about suicide, in the US call or text 988 any time to reach the 988 Suicide & Crisis Lifeline. If someone's life is in immediate danger, call 911. Outside the US, contact your local emergency number." },
        ],
      },
    ],
    faqs: [
      { q: "How often should I track my mood?", a: "Once a day at about the same time is enough. It should take a couple of minutes." },
      { q: "Can mood tracking diagnose depression or anxiety?", a: "No. It can help you notice patterns and give a doctor or counselor useful information, but only a professional can diagnose." },
      { q: "Is it normal for mood to go up and down?", a: "Yes. Everyone has ups and downs. Look at the pattern over weeks, and talk to someone if low moods last two weeks or more." },
    ],
    related: ["how-to-build-a-habit-that-sticks", "how-to-plan-your-day-when-overwhelmed"],
    service: "build",
    tool: { name: "Moodwise", href: "/apps/moodwise", pitch: "A free, private two-minute check-in that shows what goes with your better days." },
    published: D,
    updated: D,
    sources: [
      { label: "Lieberman et al. (2007): Putting feelings into words (Psychological Science)", url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x" },
      { label: "NIMH: Depression", url: "https://www.nimh.nih.gov/health/topics/depression" },
      { label: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org" },
      { label: "Systematic review: electronic self-monitoring of mood (PMC)", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4714425/" },
      { label: "JMIR Mental Health (2025): mood monitoring", url: "https://mental.jmir.org/2025/1/e79500" },
      { label: "Gordon-Smith et al.: mood tracking in bipolar disorder (University of Oxford)", url: "https://www.neuroscience.ox.ac.uk/publications/1318315" },
    ],
  },
];
