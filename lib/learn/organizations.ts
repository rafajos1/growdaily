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
        heading: "Want a version built around your café?",
        blocks: [
          "Cafewise covers the basics for one location. You could build your own version around how your café works, and GrowDaily can guide you through it. For example:",
          {
            list: [
              "Connected to your point of sale, so drink sales update stock on their own.",
              "Several locations, with a combined order list and each shop's own pars.",
              "Staff logins, so whoever closes can count and the owner sees it.",
              "Supplier ordering by email, and reading prices from a photo of an invoice.",
              "Your menu, recipes and suppliers set up, with your team trained to use it.",
            ],
          },
          "First versions are kept small, and our help is quoted up front after a free call. You own what you build. [Start your build](/build#idea) and tell us how you order today.",
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
  {
    slug: "how-to-write-a-quote-for-a-job",
    topic: "organizations",
    title: "How to write a quote for a job (with a free quote maker)",
    seoTitle: "How to Write a Quote for a Job: What to Include + Free Tool",
    description: "How to write a professional quote or estimate for a job: quote vs. estimate, what to include, how to price labor and materials, and a free AI quote maker.",
    shortAnswer:
      "A good quote clearly lists who it's for, what you'll do, itemized labor and materials, tax, the total, how long the price is valid and your payment terms. Use an estimate when the scope might change and a quote when you're committing to a price. Send it quickly, and turn it into an invoice when the client says yes.",
    sections: [
      {
        heading: "Quote or estimate?",
        blocks: [
          "People use the words loosely, but there's a real difference. An estimate is your best guess when the scope isn't certain, like work behind a wall, and the final price can change. A quote is a firm price for the work described, valid for a set time. Don't call something a quote unless you're prepared to stand by the price.",
        ],
      },
      {
        heading: "What to include",
        blocks: [
          {
            list: [
              "Your business name and contact details.",
              "A quote number and the date.",
              "The client's name, contact details and job address.",
              "A short description of the job, including what's not included.",
              "Itemized lines: labor (hours × your rate) and materials (quantity × price).",
              "Discount and sales tax, if they apply, and the total.",
              "How long the price is valid. This protects you if material prices change.",
              "Payment terms: deposit, when payment is due and how to pay.",
            ],
          },
        ],
      },
      {
        heading: "How to price the job",
        blocks: [
          {
            steps: [
              { title: "Estimate the hours", text: "Break the job into steps and estimate each one. Include travel, setup and cleanup." },
              { title: "Use your real hourly rate", text: "Your rate should cover your time plus overhead: insurance, vehicle, tools and the hours you spend on quotes and admin." },
              { title: "List materials at your cost", text: "Check current supplier prices. Many trades add a markup on materials for sourcing and handling; decide what's right for your business and be consistent." },
              { title: "Add a buffer where the scope is uncertain", text: "Or say clearly in the notes what would change the price." },
            ],
          },
          { callout: "Sales tax on services and materials varies by state and by type of work. Check what applies to you." },
        ],
      },
      {
        heading: "Send it fast, and follow up",
        blocks: [
          "Customers often contact more than one business, and a clear quote that arrives quickly makes a strong first impression. Send it the same day if you can, by email or as a PDF, and follow up a few days later if you haven't heard back. When the client accepts, turn the quote into an invoice with the same line items.",
        ],
      },
      {
        heading: "Try it free: Quotewise",
        blocks: [
          "We built [Quotewise](/apps/quotewise) so you can make a professional quote on your phone in minutes, free and without an account. Describe the job in plain words and AI drafts the line items, using your hourly rate for labor and estimating materials for you to check. Add tax or a discount, print it or save it as a PDF, email it, and turn it into an invoice in one tap. It opens with an example handyman business so you can see how it works.",
        ],
      },
      {
        heading: "Want quoting built around your business?",
        blocks: [
          "Quotewise covers the basics. You could build your own version around how your business works, and GrowDaily can guide you through it. For example:",
          {
            list: [
              "Your own price list and packages, so quotes use your real prices every time.",
              "Online quote approval with an e-signature, and deposits or payments by card.",
              "Connected to your accounting software, CRM or job scheduling.",
              "Branded PDFs with your logo, and automatic follow-up reminders.",
              "Photos of the job turned into a first draft of the quote.",
            ],
          },
          "First versions are kept small, and our help is quoted up front after a free call. You own what you build. [Start your build](/build#idea) and tell us how you quote today.",
        ],
      },
    ],
    faqs: [
      { q: "Is a quote legally binding?", a: "A written quote that a client accepts can be treated as an agreement in many situations, which is why it should be clear about scope, price and how long it's valid. For anything significant, a written contract is better. This isn't legal advice." },
      { q: "How long should a quote be valid?", a: "Commonly 14 to 30 days. A shorter window protects you when material prices move." },
      { q: "Should I show labor and materials separately?", a: "Usually yes. Itemized quotes are easier for clients to trust and compare, and they make changes easier to price." },
      { q: "Is there a free quote and estimate app?", a: "Yes. Quotewise from GrowDaily is free with no account: AI-drafted line items, tax and discounts, print or PDF, email, and one-tap invoices." },
    ],
    related: ["ai-for-small-business", "coffee-shop-inventory-management", "how-to-write-ai-prompts", "ai-implementation-plan"],
    service: "build",
    published: "2026-10-20",
    updated: "2026-10-20",
    sources: [
      { label: "Invoice2go: quote vs. estimate", url: "https://www.invoice2go.com/learn/estimates/quote-vs-estimate/" },
      { label: "Tradebase: estimates vs. quotes", url: "https://www.yourtradebase.com/blog/estimates-vs-quotes" },
      { label: "GoCardless: the difference between a quote and an estimate", url: "https://gocardless.com/en-us/guides/posts/difference-between-a-quote-and-estimate/" },
      { label: "FreshBooks: estimate vs. quote vs. bid vs. proposal", url: "https://www.freshbooks.com/blog/estimate-quote-bid-proposal" },
    ],
  },
  {
    slug: "meeting-room-booking-for-small-business",
    topic: "organizations",
    title: "Meeting room booking for small businesses: stop double-booked rooms",
    seoTitle: "Free Meeting Room Booking for Small Businesses & Offices",
    description: "How small businesses can book meeting rooms and shared spaces without double-booking: one calendar, a few simple rules, your existing tools, and a free room booking app.",
    shortAnswer:
      "Put every bookable room in one shared calendar, set a few simple rules (book the setup time, release rooms you don't need, keep long bookings for big groups), and check for clashes before you confirm. Google Workspace and Microsoft 365 can handle basic room calendars; a simple room booking tool with a floor plan can be easier for small teams and shared spaces.",
    sections: [
      {
        heading: "Why room booking goes wrong",
        blocks: [
          "In a small office, studio or shared space, rooms are usually booked by whoever grabs them first: a sticky note on the door, a group chat or one person's memory. That works until two teams show up for the same conference room, a client meeting lands on top of a training session, or a room sits empty because someone booked it \"just in case\".",
        ],
      },
      {
        heading: "A simple system",
        blocks: [
          {
            steps: [
              { title: "One calendar for every room", text: "List each bookable space with how many it seats and what it has: TV or screen, whiteboard, video call setup." },
              { title: "A few house rules", text: "Book setup and cleanup time, cancel what you don't need, and keep the biggest room for the biggest groups." },
              { title: "Check clashes before confirming", text: "Including every week of a recurring meeting." },
              { title: "Make it visible", text: "Share the day's schedule, or post it by the door, so walk-ins know what's free." },
            ],
          },
        ],
      },
      {
        heading: "Can I use Google or Microsoft?",
        blocks: [
          "Often, yes. In Google Workspace an admin can add rooms as calendar resources, and people add the room to a meeting like a guest. In Microsoft 365, rooms are room mailboxes that accept or decline invitations based on availability, and Outlook's Room Finder shows what's free. Both work well for teams that already live in those calendars. They're less helpful when guests or outside groups book, or when you want a visual view of the whole space.",
        ],
      },
      {
        heading: "Try it free: Roomwise",
        blocks: [
          "[Roomwise](/apps/roomwise) is a free room booking app with a map of your space. Drag rooms into place to draw your floor plan, see what's free or booked at any time, book once or every week without double-booking, keep requests pending until confirmed, and print or copy the day's schedule. You can ask for a room in plain words, like \"a room for 8 with a TV tomorrow at 2pm\". No account needed. It opens with an example building so you can see how it works first.",
          "Running a church office? See [church room booking and facility scheduling](/learn/church-room-booking-and-facility-scheduling).",
        ],
      },
      {
        heading: "Want a booking system built around your space?",
        blocks: [
          "Roomwise is for the person who manages the calendar. You could build your own version around how your business works, and GrowDaily can guide you through it. For example:",
          {
            list: [
              "Staff book from Slack, Teams or their calendar, and get reminders.",
              "A tablet by each door showing what's on, with check-in that releases no-show bookings.",
              "Customers or members book rentable rooms online, with payments and rules by room.",
              "Reports on how rooms are used, so you know whether you need more space or less.",
            ],
          },
          "First versions are kept small, and our help is quoted up front after a free call. You own what you build. [Start your build](/build#idea).",
        ],
      },
    ],
    faqs: [
      { q: "What is the easiest way to book meeting rooms in a small office?", a: "One shared calendar for all rooms, a few simple rules, and a clash check before anything's confirmed. Use your Google or Microsoft calendar if everyone already does, or a simple room booking app if you want a visual view or guests book too." },
      { q: "How do I stop meeting rooms being double-booked?", a: "Use one calendar that checks for overlaps, including each week of recurring meetings, and make it the only place rooms get booked." },
      { q: "Is there a free meeting room booking app?", a: "Yes. Roomwise from GrowDaily is free with no account: a floor-plan map, conflict checks, weekly repeats, pending requests and AI room search." },
    ],
    related: ["church-room-booking-and-facility-scheduling", "ai-for-small-business", "how-to-write-a-quote-for-a-job", "ai-implementation-plan"],
    service: "build",
    published: "2026-10-20",
    updated: "2026-10-20",
    sources: [
      { label: "Google Workspace Admin Help: create buildings, features and calendar resources", url: "https://support.google.com/a/answer/1686462" },
      { label: "Microsoft Learn: manage resource mailboxes in Exchange Online", url: "https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-resource-mailboxes" },
    ],
  },
];
