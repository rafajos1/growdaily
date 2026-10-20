import type { Guide } from "./types";

const D = "2026-10-19";

export const ORGANIZATION_GUIDES: Guide[] = [
  {
    slug: "ai-for-small-business",
    topic: "organizations",
    title: "AI for small business: where to start",
    seoTitle: "AI for Small Business: Where to Start (Practical Guide)",
    description: "A practical guide to AI for small businesses: the best first uses, tools to consider, costs, risks, and how to go from trying ChatGPT to AI that saves real hours every week.",
    shortAnswer:
      "Start where your time goes: customer messages, marketing content and admin. Use an approved AI tool for drafts and summaries, write a one-page AI policy, then automate one repetitive workflow with an AI agent once your team is comfortable.",
    sections: [
      {
        heading: "The best first uses",
        blocks: [
          {
            list: [
              "Marketing: social posts, emails, product descriptions and website copy.",
              "Customer communication: drafting replies, FAQs and review responses.",
              "Admin: summarizing email, meeting notes, scheduling and simple reports.",
              "Planning: turning ideas into checklists, plans and schedules.",
            ],
          },
        ],
      },
      {
        heading: "From \"trying ChatGPT\" to real results",
        blocks: [
          {
            steps: [
              { title: "Pick the tool", text: "Choose one business-grade AI assistant for the team instead of everyone using personal accounts." },
              { title: "Set simple rules", text: "A one-page policy on what data stays out and what needs review." },
              { title: "Standardize prompts", text: "Save the prompts that work for your common tasks." },
              { title: "Automate one workflow", text: "Turn your most repetitive task into an AI-assisted or agent workflow." },
            ],
          },
        ],
      },
      {
        heading: "What it costs",
        blocks: [
          "Business plans for AI assistants are usually priced per person per month. Custom tools and agents add setup plus small usage-based AI costs. Start with what you need and measure time saved before spending more.",
        ],
      },
    ],
    faqs: [
      { q: "What is the best AI tool for a small business?", a: "The one your team will actually use well. A business plan from a major AI assistant covers most needs. Add specialized or custom tools only for specific workflows." },
      { q: "Is AI worth it for a very small business?", a: "Often, yes, for writing and admin that eat your evenings. Measure time saved on a few tasks to be sure." },
    ],
    related: ["ai-implementation-plan", "ai-for-customer-service", "ai-policy-template", "ai-agent-examples"],
    service: "ai-consulting",
    published: D,
    updated: D,
  },
  {
    slug: "ai-for-nonprofits",
    topic: "organizations",
    title: "AI for nonprofits: practical uses and where to start",
    seoTitle: "AI for Nonprofits: Practical Uses, Policy & Where to Start",
    description: "How nonprofits can use AI well: grant writing help, donor communications, volunteer coordination and reporting, plus privacy, policy and bringing wary staff along.",
    shortAnswer:
      "Nonprofits get the most from AI in writing-heavy work (grants, donor thank-yous, reports, newsletters) and in coordinating volunteers. Pair it with a short AI policy that protects the people you serve, and involve staff early. Surveys show they're often more cautious than leaders.",
    sections: [
      {
        heading: "Where AI helps nonprofits most",
        blocks: [
          {
            list: [
              "Grant writing: outlining, tailoring drafts to each funder, and checking requirements. People own the facts and the story.",
              "Donor communications: personalized thank-yous and updates, reviewed by staff.",
              "Volunteer coordination: answering common questions, scheduling and reminders.",
              "Reporting: turning program notes and numbers into board and donor updates.",
              "Research: summarizing reports, policies and funding opportunities.",
            ],
          },
        ],
      },
      {
        heading: "Protect the people you serve",
        blocks: [
          "Client and beneficiary information often includes sensitive details. Keep it out of AI tools unless a tool is approved and appropriate for it, remove identifying details where possible, and put the rules in writing.",
        ],
      },
      {
        heading: "Bring your team along",
        blocks: [
          "2026 research found nonprofit executives far more optimistic about AI than their staff, and most groups lacking a written policy or rollout plan. Ask staff what would genuinely help, train together, and frame AI as taking busywork off their plates.",
        ],
      },
    ],
    faqs: [
      { q: "Can AI write a grant proposal?", a: "It can help outline, draft and tailor sections, but funders expect accurate facts and your organization's voice. A person should own the content and check every claim." },
      { q: "Are there discounts on AI tools for nonprofits?", a: "Several major technology providers offer nonprofit pricing or programs. Check each provider's current nonprofit offers." },
    ],
    related: ["ai-policy-template", "how-to-train-your-team-on-ai", "ai-agent-examples", "is-it-safe-to-put-business-data-in-ai"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [
      { label: "Chronicle of Philanthropy: the nonprofit AI gap (NTEN and Bridgespan survey)", url: "https://www.philanthropy.com/news/the-nonprofit-ai-gap-bosses-are-bullish-staffs-are-wary/" },
      { label: "Virtuous: the 2026 nonprofit AI adoption report", url: "https://virtuous.org/resource/the-2026-nonprofit-ai-adoption-report/" },
    ],
  },
  {
    slug: "ai-for-churches",
    topic: "churches",
    title: "How churches can use AI wisely",
    seoTitle: "AI for Churches: How to Use It Wisely (Plus a Policy Start)",
    description: "How churches can use AI wisely: communications, admin, newcomer questions and volunteer scheduling, where to draw lines on preaching and pastoral care, and why every church needs an AI policy.",
    shortAnswer:
      "Churches use AI best for logistics: newsletters, announcements, scheduling, newcomer questions and admin. Keep preaching, prayer and pastoral care personal, protect people's private information, and write a short AI policy, because most churches still don't have one.",
    sections: [
      {
        heading: "Good uses for AI in a church",
        blocks: [
          {
            list: [
              "Communications: drafting newsletters, announcements and social posts from staff notes.",
              "Newcomers: a [website assistant](/learn/how-to-build-a-church-chatbot-with-claude) that answers \"what to expect\" questions, like our [Ask](/faith/ask) does for questions about God.",
              "Volunteers: scheduling, reminders and answering common questions.",
              "Admin: meeting summaries, event planning, forms and reports.",
              "Small groups: turning sermon notes into discussion questions, written and checked by staff.",
            ],
          },
          "For reaching and welcoming new people, see [how to use AI to grow your church](/learn/how-to-use-ai-to-grow-your-church).",
        ],
      },
      {
        heading: "Where to draw lines",
        blocks: [
          "Many church leaders say their biggest concern is message integrity: sermons and teaching that aren't truly the pastor's own. A healthy approach that many leaders land on:",
          {
            list: [
              "AI may help with research, outlines and logistics; the message itself stays the preacher's.",
              "Pastoral care, prayer requests and counseling stay with people, and that information stays out of AI tools.",
              "Be open with your congregation about how AI is and isn't used.",
            ],
          },
          "More on this in [should pastors use AI for sermon prep?](/learn/should-pastors-use-ai-for-sermons)",
        ],
      },
      {
        heading: "Why every church needs an AI policy",
        blocks: [
          "Surveys in 2026 found church leaders using AI widely but only a small minority of churches with written AI guidelines, even though most pastors say they need one. Our free [church AI policy template](/learn/church-ai-policy-template) covers preaching, pastoral care and prayer requests.",
        ],
      },
    ],
    faqs: [
      { q: "Is it wrong for pastors to use AI for sermons?", a: "Christians disagree on the details. Many leaders are comfortable using AI for research and organization, but believe the message itself should be the pastor's own, prayed over and written by them." },
      { q: "Can a church website have an AI assistant?", a: "Yes. It can answer newcomer questions about service times, kids' programs and what to expect, written in the church's voice with clear guardrails, and point people to a real person for anything pastoral." },
    ],
    related: ["church-ai-policy-template", "how-to-build-a-church-chatbot-with-claude", "should-pastors-use-ai-for-sermons", "how-to-use-ai-to-grow-your-church"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [
      { label: "Barna: how church leaders are using AI and what concerns them", url: "https://www.barna.com/research/church-leaders-ai-usage-concerns/" },
      { label: "Exponential: your church needs an AI policy", url: "https://exponential.org/your-church-needs-an-ai-policy-and-heres-how-to-start/" },
    ],
  },
  {
    slug: "coffee-shop-inventory-management",
    topic: "organizations",
    title: "Coffee shop inventory: par levels, ordering and what each drink costs",
    seoTitle: "Coffee Shop Inventory: Par Levels, Ordering & Drink Costs",
    description: "A practical guide to coffee shop inventory: how often to count, how to set par levels, how to cost a latte, how to cut waste, and a free app that does the math.",
    shortAnswer:
      "Count perishables like milk and pastries at every delivery and dry goods weekly, set a par level for each item (enough to last until the next delivery plus a buffer), and order the difference. Then cost each drink from what you pay for every ingredient, cup and lid, so you know your margin.",
    sections: [
      {
        heading: "Why inventory is hard in a café",
        blocks: [
          "Coffee shops juggle perishables that spoil in days, like milk and pastries, alongside fast-moving supplies like beans, cups and lids. Without a simple routine, you either run out at the worst moment or throw money away. Many single-location cafés manage with paper or a spreadsheet, but it takes time every week, and the math is easy to get wrong, such as buying milk by the gallon but using it by the ounce.",
        ],
      },
      {
        heading: "How often to count",
        blocks: [
          {
            list: [
              "Milk, alternative milks and pastries: at each delivery and at close. They move fast and spoil.",
              "Beans, syrups and other bar items: weekly.",
              "Cups, lids, sleeves and other paper goods: weekly or every other week.",
            ],
          },
          "Count in the unit you buy (gallons, cartons, bags, cases), so the count turns straight into an order.",
        ],
      },
      {
        heading: "How to set par levels",
        blocks: [
          "A par level is how much of an item you want on hand right after a delivery. When you count, you order the difference between par and what's left.",
          {
            steps: [
              { title: "Find your daily use", text: "Compare two counts and add what was delivered in between: used = before + delivered − after. Divide by the days in between." },
              { title: "Cover until the next delivery", text: "Multiply daily use by the days until your next delivery. Many cafés get milk several times a week, so that's often about 3 days." },
              { title: "Add a buffer", text: "Add about 25% for busy days. For example, 4 gallons a day × 3 days × 1.25 = a par of 15 gallons." },
              { title: "Adjust by day", text: "If you run out every Saturday, raise the order before the weekend. If pastries are left over on Tuesdays, order fewer that day." },
            ],
          },
          { callout: "These are rules of thumb, not fixed rules. Your counts over a few weeks are the best guide." },
        ],
      },
      {
        heading: "How to work out what a latte costs",
        blocks: [
          "Add up everything that goes into the drink, using what you actually pay:",
          {
            list: [
              "Espresso: price per bag ÷ grams in the bag × your dose. A $55 five-pound bag (2,268 g) at 18 g is about $0.44.",
              "Milk: price per gallon ÷ 128 oz × ounces used. $4.50 a gallon at 10 oz is about $0.35.",
              "Cup, lid and sleeve: case price ÷ count per case. They often add $0.10 to $0.20.",
            ],
          },
          "In this example, a 12 oz latte costs about $0.93 to make. At $4.75 that's about 20% of the price. A common rule of thumb is to keep ingredient costs around 30 to 35% of sales, but remember rent and wages come on top. Alternative milks can push a drink well over that, so check them separately.",
        ],
      },
      {
        heading: "Cut waste without running out",
        blocks: [
          {
            list: [
              "Log what you throw away and why: unsold, expired or spilled. A week of notes usually shows one or two big leaks.",
              "Order perishables more often in smaller amounts rather than in big batches.",
              "Match pastry orders to the day of the week, not one number for every day.",
              "Rotate stock: first in, first out.",
            ],
          },
        ],
      },
      {
        heading: "Try it free: Cafewise",
        blocks: [
          "We built [Cafewise](/apps/cafewise) to do all of the above on your phone, for free and without an account. Count with quick − and + buttons, get an order list grouped by supplier that you can text in one tap, see the cost and margin of every drink, log waste, and get an AI ordering review that spots what you keep running out of or throwing away. It opens with an example café so you can see how it works first.",
        ],
      },
      {
        heading: "Want a version built for your café?",
        blocks: [
          "Cafewise covers the basics for one location. GrowDaily can build a custom version around how your café works, for example:",
          {
            list: [
              "Connected to your point of sale, so drink sales update stock on their own.",
              "Several locations, with a combined order list and each shop's own pars.",
              "Staff logins, so whoever closes can count and the owner sees it.",
              "Supplier ordering by email, and reading prices from a photo of an invoice.",
              "Your menu, recipes and suppliers set up for you, with training for your team.",
            ],
          },
          "First versions are kept small, with a fixed price agreed after a free call, and you own what we build. [Ask for a quote](/build#idea) and tell us how you order today.",
        ],
      },
    ],
    faqs: [
      { q: "What is a good par level for milk in a coffee shop?", a: "Enough to last until your next delivery plus a buffer for busy days, often about 25%. Work it out from your own daily use: for example, 4 gallons a day with deliveries every 3 days gives a par of about 15 gallons." },
      { q: "How much does a latte cost to make?", a: "It depends on your prices, but a typical 12 oz latte with whole milk often costs well under a dollar in ingredients and supplies. Add up espresso, milk, cup and lid at your own prices; alternative milks cost noticeably more." },
      { q: "Can I just use Square or Toast for inventory?", a: "Point-of-sale systems include some inventory features, and some offer more detailed add-ons. Many small cafés still find a simple count-and-order routine is what they actually need. Use whichever you'll keep up with." },
      { q: "Is there a free coffee shop inventory app?", a: "Yes. Cafewise from GrowDaily is free with no account: stock counts, order lists from par levels, cost per drink, a waste log and an AI ordering review." },
    ],
    related: ["ai-for-small-business", "ai-agent-examples", "ai-implementation-plan", "how-to-write-ai-prompts"],
    service: "build",
    published: "2026-10-20",
    updated: "2026-10-20",
    sources: [
      { label: "Toast: coffee shop inventory management guide", url: "https://pos.toasttab.com/blog/on-the-line/coffee-shop-inventory-software" },
      { label: "Roasters: inventory management for specialty cafés", url: "https://roasters.app/business/inventory-management-for-specialty-cafes" },
      { label: "Fresh Cup: how three coffee shops tackle inventory management", url: "https://freshcup.com/how-three-coffee-shops-tackle-inventory-management/" },
      { label: "Intermix: what a latte really costs", url: "https://www.intermixbev.com/resources/what-a-latte-really-costs" },
      { label: "Baristalife: café cost per cup", url: "https://baristalife.co/blogs/blog/cafe-cost-per-cup" },
    ],
  },
];
