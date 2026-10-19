import type { Guide } from "./types";

const D = "2026-10-19";

export const AGENT_GUIDES: Guide[] = [
  {
    slug: "what-is-an-ai-agent",
    topic: "agents",
    title: "What is an AI agent? A plain-English explanation",
    seoTitle: "What Is an AI Agent? Plain-English Guide (vs. Chatbots)",
    description: "What an AI agent is, how it differs from a chatbot, what agents can and can't do well today, and simple examples for businesses, nonprofits and churches.",
    shortAnswer:
      "An AI agent is AI that doesn't just answer you; it takes steps to get a task done. It can read information, use tools like your email, calendar or spreadsheets, decide what to do next, and check its own work, usually with a person approving anything important.",
    sections: [
      {
        heading: "Chatbot vs. agent: the simple difference",
        blocks: [
          "A chatbot answers. You ask a question, it writes a reply, and you do the work.",
          "An agent acts. You give it a goal, and it works through the steps: looking things up, using the tools you've connected, drafting, checking and reporting back.",
          {
            list: [
              "Chatbot: \"Write a reply to this customer.\" You copy, paste and send it yourself.",
              "Agent: \"Answer new questions in the support inbox.\" It reads each email, checks your FAQ and order system, drafts a reply, and sends it or holds it for your OK.",
            ],
          },
        ],
      },
      {
        heading: "What an agent is made of",
        blocks: [
          "Every agent has the same four parts, whatever product it's built with:",
          {
            list: [
              "A model: the AI that reads, reasons and writes, such as Claude, GPT or Gemini.",
              "Instructions: what the job is, the rules to follow, and when to stop and ask a person.",
              "Tools: the things it's allowed to use, like a calendar, a spreadsheet, a website search or your CRM. MCP is a common standard for connecting these.",
              "A loop: it takes a step, looks at the result, and decides the next step until the job is done.",
            ],
          },
        ],
      },
      {
        heading: "What agents are good at today",
        blocks: [
          {
            list: [
              "Repetitive, multi-step office work with clear rules: sorting requests, updating records, following up.",
              "Research and summaries: gathering information from several places into one brief.",
              "First drafts: replies, reports and proposals for a person to review.",
              "Working across tools that don't talk to each other, so people stop copying and pasting between them.",
            ],
          },
          { callout: "Agents are still early for most small teams. Surveys in 2026 show larger organizations scaling agents faster than smaller ones, so if you're just starting, you're not behind." },
        ],
      },
      {
        heading: "Where agents still need a person",
        blocks: [
          "Agents can misread a situation, act on wrong information, or confidently get something wrong. Keep a person in charge of:",
          {
            list: [
              "Sending money, signing anything, or changing important records.",
              "Sensitive conversations: complaints, pastoral care, health, legal or HR matters.",
              "Anything public, like posts, emails to large lists, or published answers, until you trust the results.",
            ],
          },
        ],
      },
      {
        heading: "Simple examples to picture",
        blocks: [
          {
            list: [
              "A small business: an agent answers website questions from your own policies and books appointments into your calendar.",
              "A nonprofit: an agent sorts volunteer sign-ups, answers common questions, and sends shift reminders.",
              "A church: an agent drafts the weekly newsletter from staff notes and the calendar, for a person to edit and send.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Is ChatGPT or Claude an AI agent?", a: "They're chat assistants first, but both can now act as agents when you give them tools and permission to take steps, such as browsing, working with files, or connecting to your apps." },
      { q: "Do I need to code to use an AI agent?", a: "Not to start. Many agent features are built into tools you may already use. Custom agents connected to your own systems usually need someone technical to set them up safely." },
      { q: "Will AI agents replace employees?", a: "For most small teams, agents take over repetitive steps so people can spend time on work that needs judgment and relationships. Surveys of small businesses using AI mostly describe it as helping staff rather than replacing them." },
      { q: "Are AI agents safe?", a: "They can be, with limits: give an agent only the access it needs, require approval for important actions, keep a log of what it did, and keep sensitive data out unless the tool is approved for it." },
    ],
    related: ["ai-agent-examples", "how-to-start-with-ai-agents", "what-is-mcp", "ai-agents-vs-automation"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [
      { label: "McKinsey, The State of AI: Global Survey 2026", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
    ],
  },
  {
    slug: "ai-agent-examples",
    topic: "agents",
    title: "AI agent examples for businesses, nonprofits and churches",
    seoTitle: "12 Practical AI Agent Examples for Small Teams",
    description: "Twelve practical AI agent examples for small businesses, nonprofits and churches, from inbox triage to follow-ups, with what each needs and where a person should stay in the loop.",
    shortAnswer:
      "The best first agents take over repetitive, rule-based work: sorting an inbox, answering common questions from your own information, following up with leads or volunteers, and turning notes into reports. Start with one where a mistake is easy to catch and fix.",
    sections: [
      {
        heading: "For any team",
        blocks: [
          {
            steps: [
              { title: "Inbox triage", text: "Reads incoming email, labels it (question, order, complaint, spam), drafts replies to simple ones, and flags the rest for a person." },
              { title: "Meeting follow-up", text: "Turns a meeting transcript into a summary, action items with owners, and a draft follow-up email." },
              { title: "Weekly report", text: "Pulls numbers from your spreadsheet or tools every week and writes a short plain-English update." },
              { title: "Research brief", text: "Gathers information on a topic, vendor or grant from several sources into one page, with links to check." },
            ],
          },
        ],
      },
      {
        heading: "For businesses",
        blocks: [
          {
            steps: [
              { title: "Website question assistant", text: "Answers customer questions from your own hours, services and policies, and hands off to you when it doesn't know." },
              { title: "Lead follow-up", text: "Replies to new inquiries within minutes, asks qualifying questions, and books a call on your calendar." },
              { title: "Quote drafting", text: "Turns a customer's description of the job into a draft estimate for you to approve." },
              { title: "Review responses", text: "Drafts friendly, specific replies to online reviews for you to post." },
            ],
          },
        ],
      },
      {
        heading: "For nonprofits",
        blocks: [
          {
            steps: [
              { title: "Volunteer coordinator", text: "Answers volunteer questions, confirms shifts and sends reminders." },
              { title: "Donor thank-you drafts", text: "Drafts warm, specific thank-you notes from gift details for staff to review and send." },
              { title: "Program intake and referrals", text: "Helps people describe what they need and points them to the right program or partner, with a person checking anything sensitive." },
            ],
          },
        ],
      },
      {
        heading: "For churches",
        blocks: [
          {
            steps: [
              { title: "Newcomer questions", text: "Answers \"What should I wear? What about my kids?\" on the website and helps visitors plan a first Sunday." },
              { title: "Weekly communications", text: "Drafts the newsletter and announcements from staff notes and the church calendar for a person to edit." },
              { title: "Care follow-up routing", text: "Sorts prayer and care requests to the right person so nothing falls through the cracks, without the AI giving pastoral advice itself." },
            ],
          },
          { callout: "Many church leaders say message integrity is their biggest AI concern. A good rule is that AI helps with logistics and drafts, and people own the teaching and the care." },
        ],
      },
      {
        heading: "How to pick your first one",
        blocks: [
          {
            list: [
              "It happens often (weekly or daily), so the time saved adds up.",
              "The steps are clear enough to write down.",
              "A mistake is easy to spot and fix before it matters.",
              "It doesn't need access to sensitive data, or the tool is approved for that data.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "What is the easiest AI agent to start with?", a: "Inbox triage or meeting follow-up. Both save time every week, and a person still reviews the output before anything goes out." },
      { q: "Can an AI agent answer customers on my website?", a: "Yes, if it answers only from information you provide, says when it doesn't know, and hands off to a person. Test it with real customer questions before launch." },
      { q: "How much does an AI agent cost to run?", a: "It depends on the tool and how much it's used. Built-in agent features are often part of a subscription; custom agents usually have a small usage-based AI cost plus setup." },
    ],
    related: ["what-is-an-ai-agent", "how-to-start-with-ai-agents", "ai-for-customer-service", "ai-for-churches"],
    service: "build",
    published: D,
    updated: D,
    sources: [{ label: "Barna: How church leaders are using AI and what concerns them", url: "https://www.barna.com/research/church-leaders-ai-usage-concerns/" }],
  },
  {
    slug: "how-to-start-with-ai-agents",
    topic: "agents",
    title: "How to start using AI agents in your organization",
    seoTitle: "How to Start Using AI Agents: A Step-by-Step Guide",
    description: "A practical, step-by-step way to start with AI agents: pick one job, write the rules, limit access, test with real examples, and keep a person in the loop.",
    shortAnswer:
      "Pick one repetitive job, write down exactly how a good employee does it, give an agent only the access that job needs, and run it with a person approving its work until it has earned trust. Expand from there.",
    sections: [
      {
        heading: "The six steps",
        blocks: [
          {
            steps: [
              { title: "Pick one job", text: "Choose something frequent, rule-based and easy to check, like sorting the inbox or drafting follow-ups. Avoid anything involving money or sensitive data at first." },
              { title: "Write the playbook", text: "Describe the job as you'd explain it to a new hire: the goal, the steps, examples of good results, and when to stop and ask." },
              { title: "Choose the tool", text: "Start with agent features in tools you already use. Move to a custom agent only when you need it connected to your own systems." },
              { title: "Limit access", text: "Give it only the folders, inboxes and permissions the job needs. Read-only first, if possible." },
              { title: "Test with real examples", text: "Run it on last month's real cases and compare its work with what your team actually did." },
              { title: "Supervise, then expand", text: "Have a person approve its output for a few weeks. Loosen the reins only where it's consistently right." },
            ],
          },
        ],
      },
      {
        heading: "Mistakes to avoid",
        blocks: [
          {
            list: [
              "Starting with the hardest, most important process.",
              "Giving an agent broad access \"just in case.\"",
              "Skipping the written rules. Agents follow instructions, so vague instructions get vague results.",
              "Measuring nothing. Note the time a task takes before and after, so you know if it's worth it.",
              "Buying tools without training people. Many organizations use AI without investing in training or change, and get little from it.",
            ],
          },
        ],
      },
      {
        heading: "What success looks like after 30 days",
        blocks: [
          {
            list: [
              "One workflow running with a person reviewing it.",
              "A short written playbook and a list of what the agent may and may not do.",
              "A measured time saving, and a list of what to automate next.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Do I need a developer to build an AI agent?", a: "Not for agent features built into existing tools. For an agent connected to your own systems, like your CRM, database or website, a developer helps make it reliable and secure." },
      { q: "How long does it take to set up a first agent?", a: "A simple agent using existing tools can be running in days. Plan a few weeks of supervised use before you rely on it." },
      { q: "What if the agent makes a mistake?", a: "That's why you start with work that's easy to check and keep a person approving output. Update the agent's instructions with each mistake, the same way you'd coach a new team member." },
    ],
    related: ["what-is-an-ai-agent", "ai-agent-examples", "ai-implementation-plan", "is-it-safe-to-put-business-data-in-ai"],
    service: "ai-consulting",
    published: D,
    updated: D,
  },
  {
    slug: "what-is-mcp",
    topic: "agents",
    title: "What is MCP (Model Context Protocol)?",
    seoTitle: "What Is MCP (Model Context Protocol)? Plain-English Guide",
    description: "MCP, the Model Context Protocol, explained in plain English: what it is, why AI agents use it, who supports it, and what it means for your business's tools and security.",
    shortAnswer:
      "MCP (Model Context Protocol) is an open standard that lets AI assistants and agents connect to tools and data, like your files, calendar or CRM, in one consistent way. It's often described as \"USB-C for AI\": build one connector, and any AI that supports MCP can use it.",
    sections: [
      {
        heading: "Why MCP exists",
        blocks: [
          "Before MCP, connecting an AI to each tool meant a custom integration for every pairing of AI and tool. MCP gives every tool one standard way to say \"here's what I can do,\" and every AI one standard way to use it.",
          "Anthropic introduced MCP in November 2024 and released it as an open standard. Other major AI companies, including OpenAI, Google and Microsoft, have since added support, and in December 2025 Anthropic donated it to the Agentic AI Foundation under the Linux Foundation.",
        ],
      },
      {
        heading: "How it works, without the jargon",
        blocks: [
          {
            list: [
              "An MCP server is a small connector for one tool, like Google Drive, Slack, a database or your own system. It lists the actions it offers, such as \"search files\" or \"create ticket.\"",
              "An MCP client is the AI app, like Claude or another assistant, that connects to those servers.",
              "When you ask the AI to do something, it sees which actions are available and uses them, within the permissions you've granted.",
            ],
          },
        ],
      },
      {
        heading: "What it means for your organization",
        blocks: [
          {
            list: [
              "Less custom work: many popular tools already have MCP connectors.",
              "More choice: you can switch or mix AI providers without rebuilding every connection.",
              "More responsibility: a connector gives AI real access to real systems, so treat it like giving access to a new employee.",
            ],
          },
        ],
      },
      {
        heading: "Security basics",
        blocks: [
          {
            list: [
              "Only install connectors from sources you trust, and review what each can access.",
              "Use the narrowest permissions possible, read-only where you can.",
              "Require a person's approval for actions that change, send or delete things.",
              "Keep logs of what the AI did through each connector.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Is MCP a product I need to buy?", a: "No. It's an open standard. You use it through AI apps and tools that support it, and connectors for many tools are free." },
      { q: "Who created MCP?", a: "Anthropic introduced it in November 2024 as an open standard. In December 2025 it was donated to the Agentic AI Foundation, part of the Linux Foundation." },
      { q: "Do I need MCP to use AI agents?", a: "Not necessarily, but it's become a common way for agents to reach tools and data, so it's worth knowing when choosing tools or planning a custom agent." },
    ],
    related: ["what-is-an-ai-agent", "how-to-start-with-ai-agents", "is-it-safe-to-put-business-data-in-ai"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [
      { label: "Model Context Protocol (official site)", url: "https://modelcontextprotocol.io" },
      { label: "Anthropic: Introducing the Model Context Protocol", url: "https://www.anthropic.com/news/model-context-protocol" },
    ],
  },
  {
    slug: "ai-agents-vs-automation",
    topic: "agents",
    title: "AI agents vs. automation: which do you need?",
    seoTitle: "AI Agents vs. Automation (Zapier-Style): Which Do You Need?",
    description: "When to use simple automation (if this, then that) and when an AI agent is worth it, with examples and a quick way to decide for your team.",
    shortAnswer:
      "Use automation when the steps never change: if X happens, do Y. Use an AI agent when the work needs reading, judgment or writing, like understanding an email before deciding what to do. Many good setups use both: automation for the plumbing, AI for the thinking.",
    sections: [
      {
        heading: "The difference",
        blocks: [
          {
            list: [
              "Automation follows fixed rules. It's fast, cheap and predictable, but it breaks when something doesn't fit the rule.",
              "An AI agent handles messy, varied input like emails, documents and conversations, and decides the next step. It's flexible, but it needs guardrails and checking.",
            ],
          },
        ],
      },
      {
        heading: "Quick test: which one?",
        blocks: [
          {
            steps: [
              { title: "Could you write it as a simple rule?", text: "\"When a form is submitted, add a row to the sheet.\" Use automation." },
              { title: "Does it need to understand words?", text: "\"Read the request and decide if it's urgent.\" That's a job for AI." },
              { title: "Is a wrong answer costly?", text: "Keep a person approving the AI step, or keep it as automation plus a human." },
            ],
          },
        ],
      },
      {
        heading: "Examples",
        blocks: [
          {
            list: [
              "Automation: new sign-up → welcome email → add to mailing list.",
              "AI agent: customer email → understand the question → check order status → draft a reply.",
              "Both: form submitted (automation) → AI summarizes and scores the request → automation routes it to the right person.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Is Zapier an AI agent?", a: "Zapier and similar tools started as rule-based automation and now include AI steps and agent features. You can combine fixed steps with AI steps in one workflow." },
      { q: "Which is cheaper?", a: "Simple automation is usually cheaper and more predictable. Use AI only for the steps that need understanding or writing." },
    ],
    related: ["what-is-an-ai-agent", "ai-agent-examples", "how-to-start-with-ai-agents"],
    service: "ai-consulting",
    published: D,
    updated: D,
  },
];
