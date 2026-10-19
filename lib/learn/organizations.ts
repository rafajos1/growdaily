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
              "Newcomers: answering \"what to expect\" questions on your website.",
              "Volunteers: scheduling, reminders and answering common questions.",
              "Admin: meeting summaries, event planning, forms and reports.",
              "Small groups: turning sermon notes into discussion questions, written and checked by staff.",
            ],
          },
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
        ],
      },
      {
        heading: "Why every church needs an AI policy",
        blocks: [
          "Surveys in 2026 found church leaders using AI widely but only a small minority of churches with written AI guidelines, even though most pastors say they need one. Our free church AI policy template covers preaching, pastoral care and prayer requests.",
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
];
