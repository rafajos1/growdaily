import type { Guide } from "./types";

const D = "2026-10-19";

const POLICY = `[Organization name] AI Use Policy
Last updated: [date] · Questions: [name, email]

1. Why we use AI
We use AI tools to save time on routine work and to help us serve [customers / members / the people we serve] better. People stay responsible for everything we send, publish or decide.

2. Approved tools
You may use: [list approved tools and account types, e.g. "Claude Team account", "ChatGPT Business", "Microsoft Copilot through our Microsoft 365"].
Using other AI tools for work requires approval from [name/role].

3. What you may never put into AI tools
• Passwords, keys or login details
• Payment card, bank or Social Security numbers
• Health, counseling, pastoral or HR information about a person
• [Customer / donor / member] personal information, unless the tool is approved for it
• Confidential contracts or anything we've promised to keep private

4. Human review
A person must review AI output before it is:
• sent to anyone outside our team
• published (website, social media, newsletters)
• used to make a decision about a person (hiring, services, discipline)
Check facts, names, numbers and quotes. AI can be confidently wrong.

5. Being honest about AI
We don't present AI-written work as personal when that matters, like [sermons, personal letters, testimonials]. [Optional: note when content was AI-assisted.]

6. AI agents and connected tools
AI tools that can take actions (send email, change records, spend money) need approval from [name/role], the minimum access needed, and a person approving important actions.

7. Learning and help
New team members get a short AI training. Questions or mistakes? Tell [name/role]. We'd rather hear early than late.

8. Review
We review this policy every [6 months] because AI tools change quickly.`;

export const WORKPLACE_GUIDES: Guide[] = [
  {
    slug: "how-to-use-ai-at-work",
    topic: "workplace",
    title: "How to use AI at work: a practical starter guide",
    seoTitle: "How to Use AI at Work: A Practical Starter Guide",
    description: "Where AI actually helps at work (writing, summarizing, planning, customer messages), how to ask well, what to keep out of AI tools, and how to check its work.",
    shortAnswer:
      "Use AI for first drafts, summaries, brainstorming and repetitive writing, then check and finish the work yourself. Give it context and examples, keep private data out unless your tool is approved for it, and never send AI output without reading it.",
    sections: [
      {
        heading: "Where AI helps most",
        blocks: [
          "Surveys of small businesses consistently find the most common uses are marketing content, customer communication and admin tasks. They're good places to start:",
          {
            list: [
              "Writing: emails, social posts, newsletters, job descriptions, first drafts of anything.",
              "Summarizing: long emails, documents, meeting notes and reports.",
              "Planning: agendas, project plans, checklists and schedules.",
              "Customer messages: polite, clear replies to common questions.",
              "Thinking partner: brainstorming ideas, spotting gaps, preparing for a hard conversation.",
            ],
          },
        ],
      },
      {
        heading: "How to ask so you get good results",
        blocks: [
          {
            steps: [
              { title: "Give it a role and a goal", text: "\"You're helping a small bakery reply to customer emails. Write a friendly reply that…\"" },
              { title: "Give it context", text: "Paste the relevant details it can't know: your policy, the customer's message, your tone." },
              { title: "Show an example", text: "\"Here's a reply we liked. Match this style.\"" },
              { title: "Ask for the format", text: "\"Three bullet points,\" \"under 100 words,\" \"a table.\"" },
              { title: "Iterate", text: "\"Shorter.\" \"Warmer.\" \"Remove the jargon.\" The second and third drafts are usually the good ones." },
            ],
          },
        ],
      },
      {
        heading: "What to keep out of AI tools",
        blocks: [
          "Unless your organization has approved a tool for it, don't paste in passwords, financial account numbers, health or HR details about people, or private customer, donor or member information. Free consumer accounts may store or use what you type, depending on the tool's settings and terms.",
        ],
      },
      {
        heading: "Always check its work",
        blocks: [
          {
            list: [
              "Facts, names, numbers, dates and quotes. AI can state wrong things confidently.",
              "Tone: would you be comfortable signing it?",
              "Promises: make sure it didn't offer something you don't do.",
            ],
          },
        ],
      },
      {
        heading: "Keep it safe: AI governance",
        blocks: ["Check whether your organization has an AI policy and approved tools before you paste in work information. If it doesn't yet, share [what AI governance is](/learn/what-is-ai-governance) with whoever runs operations; it takes an afternoon to set up."],
      },
    ],
    faqs: [
      { q: "Which AI tool should I use at work?", a: "Use the one your organization has approved. If there isn't one, choose a business or team plan from a major provider, which typically offers stronger privacy terms than free personal accounts." },
      { q: "Is it okay to use AI to write emails at work?", a: "Generally yes, as long as you review and personalize them, keep private information out of unapproved tools, and follow any AI policy your workplace has." },
      { q: "Will my employer know if I use AI?", a: "Possibly. Many workplaces now have AI policies. It's best to ask, and to be open about using AI for drafts while taking responsibility for the final work." },
    ],
    related: ["how-to-write-ai-prompts", "ai-policy-template", "is-it-safe-to-put-business-data-in-ai", "how-to-train-your-team-on-ai"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [{ label: "Small Biz Talks: why small business AI statistics don't all agree", url: "https://smallbiztalks.com/small-business-ai-adoption-statistics/" }],
  },
  {
    slug: "ai-policy-template",
    topic: "governance",
    title: "How to write an AI policy for your team (free template)",
    seoTitle: "AI Policy Template for Businesses & Nonprofits (Free)",
    description: "A free, plain-English AI use policy template for businesses, nonprofits and churches of any size: approved tools, data rules, human review, AI agents, and how to roll it out.",
    shortAnswer:
      "A good AI policy fits on one or two pages and answers five things: which tools are approved, what information must never go into them, when a person must review AI work, who approves AI tools that take actions, and who to ask. Copy the template below and fill in the brackets.",
    sections: [
      {
        heading: "Why you need one now",
        blocks: [
          "Across 2026 surveys, the same pattern shows up in businesses, nonprofits and churches: most people already use AI, but few organizations have written guidelines. That gap means private information ends up in personal AI accounts, sometimes called \"shadow AI,\" and everyone guesses at the rules.",
          "A short policy isn't a ban. It's permission with guardrails, so your team can use AI confidently.",
        ],
      },
      {
        heading: "Free AI policy template",
        blocks: [{ template: { title: "AI use policy template", text: POLICY } }],
      },
      {
        heading: "How to roll it out",
        blocks: [
          {
            steps: [
              { title: "Ask what people already use", text: "A quick, no-blame survey. You'll learn where AI already helps and where data might be at risk." },
              { title: "Pick approved tools", text: "Prefer business or team plans, which usually offer better privacy terms than free accounts." },
              { title: "Fill in the template together", text: "Involve a few staff members so the rules match real work." },
              { title: "Train for an hour", text: "Walk through the policy with real examples of good and bad use." },
              { title: "Review every six months", text: "AI tools change quickly; your policy should too." },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does every business really need an AI policy?", a: "Yes, if anyone on the team uses AI. A one-page policy prevents the biggest risk, which is private information pasted into unapproved tools, and gives people confidence to use AI well." },
      { q: "Should we ban ChatGPT at work?", a: "Bans tend to push AI use underground. Approving specific tools, with clear rules about data and review, is usually safer than a ban." },
      { q: "What should an AI policy for a church include?", a: "The same basics, plus clear lines on pastoral care information, prayer requests, and how AI may or may not be used in preaching and teaching." },
    ],
    related: ["what-is-ai-governance", "how-to-create-an-ai-register", "what-is-shadow-ai", "how-to-train-your-team-on-ai"],
    service: "ai-governance",
    tool: { name: "the AI governance kit", href: "/apps/governwise", pitch: "List your AI tools and get an AI register, a ready-to-adopt AI policy and a one-page leadership summary in about 15 minutes. Free with a quick sign-up; your tool list stays private." },
    published: D,
    updated: D,
    sources: [
      { label: "Barna: church leaders' AI use and concerns", url: "https://www.barna.com/research/church-leaders-ai-usage-concerns/" },
      { label: "Chronicle of Philanthropy: the nonprofit AI gap", url: "https://www.philanthropy.com/news/the-nonprofit-ai-gap-bosses-are-bullish-staffs-are-wary/" },
    ],
  },
  {
    slug: "is-it-safe-to-put-business-data-in-ai",
    topic: "security",
    title: "Is it safe to put business data into ChatGPT, Claude or Copilot?",
    seoTitle: "Is It Safe to Put Business Data Into ChatGPT or Claude?",
    description: "When it's safe to use business information with AI tools, the difference between free and business accounts, what \"shadow AI\" is, and simple rules to protect your data.",
    shortAnswer:
      "It depends on the account, not just the tool. Business and team plans from major AI providers generally offer stronger privacy commitments than free personal accounts, such as not training on your data by default. Use approved business accounts for work, and keep the most sensitive information out of AI entirely.",
    sections: [
      {
        heading: "Free vs. business accounts",
        blocks: [
          "With free or personal accounts, what you type may be stored and, depending on settings and terms, used to improve the service. Business, team and enterprise plans typically add contract terms, admin controls and commitments about how your data is used.",
          { callout: "Check the current terms for the exact plan you use. They change, and they differ between providers and plans." },
          "Using personal accounts? See [how to stop ChatGPT, Claude, Gemini and Copilot from training on your data](/learn/how-to-stop-ai-training-on-your-data). Need more control? See [private AI for business](/learn/private-ai-for-business).",
        ],
      },
      {
        heading: "What \"shadow AI\" means",
        blocks: [
          "Shadow AI is staff using AI tools the organization hasn't approved, usually personal accounts, for work. It's rarely malicious; people just want to get work done. The risk is that customer lists, contracts or personal information leave your control. More in [what shadow AI is and how to manage it](/learn/what-is-shadow-ai).",
        ],
      },
      {
        heading: "Simple rules that cover most risk",
        blocks: [
          {
            list: [
              "Use approved business accounts for work.",
              "Never paste passwords, keys or financial account numbers.",
              "Keep health, HR, counseling and pastoral information out unless a tool is specifically approved for it.",
              "Remove names and identifying details when you can. The AI rarely needs them.",
              "Put these rules in a short written AI policy and train your team.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does ChatGPT or Claude train on my data?", a: "It depends on the account type and settings. Business and enterprise plans from major providers generally don't train on your data by default; free personal accounts may, depending on settings. Check the current terms for your plan." },
      { q: "What is the safest way to use AI with customer data?", a: "Use an approved business or enterprise plan, share only the data the task needs, remove identifying details where possible, and follow a written policy." },
    ],
    related: ["how-to-stop-ai-training-on-your-data", "private-ai-for-business", "what-is-shadow-ai", "ai-policy-template"],
    service: "ai-governance",
    published: D,
    updated: "2026-10-20",
  },
  {
    slug: "how-to-train-your-team-on-ai",
    topic: "workplace",
    title: "How to train your team on AI (without overwhelming them)",
    seoTitle: "How to Train Employees on AI: A Simple Plan That Works",
    description: "A simple plan for training staff or volunteers to use AI well and safely: start with real tasks, share wins, set rules, and close the gap between excited leaders and wary staff.",
    shortAnswer:
      "Train on people's real work, not on the technology. Spend an hour on the basics and your AI rules, then have everyone try AI on two tasks from their own week and share what worked. Follow up a month later.",
    sections: [
      {
        heading: "Why training matters more than the tool",
        blocks: [
          "Many organizations adopt AI tools without investing in training, and then see little benefit. Nonprofit research in 2026 also found leaders far more optimistic about AI than their staff. Training closes both gaps: people learn what's useful and what's off-limits, and they get a say in how AI is used.",
        ],
      },
      {
        heading: "A simple training plan",
        blocks: [
          {
            steps: [
              { title: "Session 1 (60 min): basics and rules", text: "What AI is good and bad at, live examples, and your AI policy: approved tools, data rules, human review." },
              { title: "Homework: two real tasks", text: "Each person tries AI on two things from their own week, like an email, a summary or a plan." },
              { title: "Session 2 (45 min): share and improve", text: "People show what worked and what didn't. Collect the best prompts into a shared document." },
              { title: "30 days later: check in", text: "What's saving time? What's risky? Update the policy and pick one workflow to improve together." },
            ],
          },
        ],
      },
      {
        heading: "Tips that help it stick",
        blocks: [
          {
            list: [
              "Let skeptics be skeptical. Their concerns often improve your rules.",
              "Celebrate time saved on boring work, not \"replacing\" anyone.",
              "Keep a shared prompt library for your organization's common tasks.",
              "Name a go-to person for AI questions.",
            ],
          },
        ],
      },
      {
        heading: "Keep it safe: AI governance",
        blocks: ["Training is part of AI governance: people can only follow rules they know. Pair the session with a short AI policy and an [AI register](/learn/how-to-create-an-ai-register), so the training covers the tools your team actually uses."],
      },
    ],
    faqs: [
      { q: "How long does AI training take?", a: "A useful start is about two hours spread over two sessions, plus a short check-in a month later." },
      { q: "Should volunteers be trained on AI too?", a: "If they handle your communications or people's information, yes. At least cover the data rules and when a person must review AI work." },
    ],
    related: ["ai-policy-template", "how-to-use-ai-at-work", "how-to-write-ai-prompts", "ai-implementation-plan"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [{ label: "Chronicle of Philanthropy: the nonprofit AI gap (NTEN and Bridgespan survey)", url: "https://www.philanthropy.com/news/the-nonprofit-ai-gap-bosses-are-bullish-staffs-are-wary/" }],
  },
  {
    slug: "how-to-write-ai-prompts",
    topic: "workplace",
    title: "How to write good AI prompts for work (with examples)",
    seoTitle: "How to Write Good AI Prompts for Work (With Examples)",
    description: "A simple formula for writing AI prompts that get useful results at work, with copy-and-paste examples for emails, summaries, plans and customer replies.",
    shortAnswer:
      "Good prompts tell the AI who it's helping, what you want, the context it can't know, an example of good output, and the format you need. Then refine with short follow-ups like \"shorter\" or \"warmer.\"",
    sections: [
      {
        heading: "The formula",
        blocks: [
          {
            steps: [
              { title: "Role and goal", text: "\"You're helping our nonprofit write a thank-you note to a monthly donor.\"" },
              { title: "Context", text: "The details only you know: the gift, the program, your tone." },
              { title: "Example", text: "\"Here's a note we liked: …\"" },
              { title: "Format", text: "\"Under 120 words, warm, no clichés.\"" },
            ],
          },
        ],
      },
      {
        heading: "Copy-and-paste examples",
        blocks: [
          {
            list: [
              "Summarize: \"Summarize this email thread in 5 bullet points, then list decisions made and open questions.\"",
              "Reply: \"Draft a friendly reply to this customer. Our policy is [policy]. Offer [option]. Under 100 words.\"",
              "Plan: \"Turn these notes into a project plan with tasks, owners and dates as a table.\"",
              "Rewrite: \"Rewrite this for a general audience at an 8th-grade reading level. Keep every fact.\"",
              "Prepare: \"I need to tell a volunteer we can't use them this season. Help me say it kindly and clearly.\"",
            ],
          },
        ],
      },
      {
        heading: "Fixing a bad answer",
        blocks: [
          {
            list: [
              "Too generic? Add context and an example.",
              "Wrong tone? Say who's reading and how you want them to feel.",
              "Made something up? Give it the source material and say \"use only this information.\"",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Do I need special prompt techniques?", a: "Not usually. Clear instructions, context and an example matter far more than tricks." },
      { q: "Should my team share prompts?", a: "Yes. A shared prompt library for your common tasks saves time and keeps tone consistent." },
    ],
    related: ["how-to-use-ai-at-work", "how-to-train-your-team-on-ai", "ai-for-customer-service"],
    service: "ai-training",
    published: D,
    updated: D,
  },
  {
    slug: "ai-for-customer-service",
    topic: "workplace",
    title: "AI for customer service: a practical guide for businesses",
    seoTitle: "AI for Customer Service: Where to Start (Practical Guide)",
    description: "How any business can use AI for customer service: answering common questions, drafting replies, a website assistant, and the guardrails that keep customers happy.",
    shortAnswer:
      "Start with AI that drafts replies to common questions for a person to approve, then consider a website assistant that answers only from your own information and hands off to a person when it's unsure. Speed matters to customers, but so does a human when things go wrong.",
    sections: [
      {
        heading: "Three levels to grow through",
        blocks: [
          {
            steps: [
              { title: "AI-drafted replies", text: "Staff paste a customer message and your policy; AI drafts a reply; staff edit and send. Low risk, immediate time savings." },
              { title: "A website question assistant", text: "Answers hours, services, policies and order questions from your own information, and hands off when it doesn't know." },
              { title: "An agent in your inbox", text: "Sorts and drafts replies to incoming email and handles simple requests, with a person approving anything unusual." },
            ],
          },
        ],
      },
      {
        heading: "Guardrails customers will thank you for",
        blocks: [
          {
            list: [
              "Answer only from your own approved information, and say \"I'm not sure\" otherwise.",
              "Make reaching a person easy and obvious.",
              "Never let AI promise refunds, discounts or exceptions on its own.",
              "Review a sample of conversations every week at first.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Can AI answer my customers' emails automatically?", a: "It can draft and even send simple replies, but start with AI drafts approved by a person, and automate only the questions it consistently gets right." },
      { q: "Will customers mind talking to AI?", a: "Many are fine with quick, accurate answers, as long as it's easy to reach a person when they need one." },
    ],
    related: ["ai-agent-examples", "how-to-write-ai-prompts", "how-to-start-with-ai-agents"],
    service: "build",
    published: D,
    updated: D,
  },
  {
    slug: "ai-implementation-plan",
    topic: "workplace",
    title: "How to implement AI in your organization: a 30-day plan",
    seoTitle: "How to Implement AI in Your Business: A 30-Day Plan",
    description: "A practical 30-day plan to implement AI in a business, nonprofit or church of any size: find the right tasks, set rules, train people, run one pilot and measure results.",
    shortAnswer:
      "Week 1, find out how people already use AI and pick three time-consuming tasks. Week 2, choose approved tools and write a short policy. Week 3, train your team. Week 4, run one pilot and measure the time saved. Then expand from what worked.",
    sections: [
      {
        heading: "The 30-day plan",
        blocks: [
          {
            steps: [
              { title: "Week 1: listen", text: "Ask the team where time goes and how they already use AI. Pick three repetitive tasks worth improving." },
              { title: "Week 2: set up", text: "Choose approved tools (business plans), and write a one-page AI policy covering data and review." },
              { title: "Week 3: train", text: "Run a hands-on session using the three tasks. Collect good prompts into a shared doc." },
              { title: "Week 4: pilot and measure", text: "Run one workflow with AI for two weeks. Compare time and quality to before." },
            ],
          },
        ],
      },
      {
        heading: "After 30 days",
        blocks: [
          {
            list: [
              "Keep what saved time; drop what didn't.",
              "Consider an AI agent for the workflow that worked best.",
              "Review the policy and tools every six months.",
            ],
          },
          "Taking a bigger AI project from pilot to production? See [why most AI pilots fail](/learn/why-ai-pilots-fail), or plan it with [Pilotwise](/apps/pilotwise).",
          { callout: "Plenty of organizations use AI without seeing major results. The difference is usually choosing specific tasks, training people and measuring, not buying more tools." },
        ],
      },
      {
        heading: "Keep it safe: AI governance",
        blocks: ["Put governance in place before you scale: an [AI register](/learn/how-to-create-an-ai-register) of tools in use, a short AI policy and a named owner. Use the [AI governance checklist](/learn/ai-governance-checklist) to see where you stand."],
      },
    ],
    faqs: [
      { q: "Where should a business start with AI?", a: "With the repetitive writing and admin work that eats the most time, like emails, summaries, scheduling and customer replies, plus a short policy so people use it safely." },
      { q: "How do I measure if AI is working?", a: "Time a task before and after, and check quality, like errors and customer replies. If it doesn't save time or improve quality, change the approach." },
    ],
    related: ["why-ai-pilots-fail", "ai-pilot-exit-criteria", "how-to-start-with-ai-agents", "ai-policy-template"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [{ label: "Virtuous: the 2026 nonprofit AI adoption report", url: "https://virtuous.org/resource/the-2026-nonprofit-ai-adoption-report/" }],
  },
];
