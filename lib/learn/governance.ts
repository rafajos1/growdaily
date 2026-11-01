import type { Guide } from "./types";

const D = "2026-11-01";

const KIT = { name: "the AI governance kit", href: "/apps/governwise", pitch: "List your AI tools and get an AI register, a ready-to-adopt AI policy and a one-page leadership summary in about 15 minutes. Free with a quick sign-up; your tool list stays private." };

const REGISTER = `AI REGISTER · [Organization] · Owner: [name] · Last reviewed: [date]

Tool | Used for | Who uses it | Account type | Most sensitive info that goes in | Decisions about people? | Public sees output? | Training off? | Rating | Conditions
ChatGPT | drafting emails | office team | Business plan | Internal | No | No | Yes | Approved | Check facts before sending
[tool] | [task] | [team] | Free / Personal paid / Business | Public / Internal / Personal / Sensitive | Yes / No | Yes / No | Yes / No / Not sure | Approved / Limited / Not allowed | [conditions]

Ratings
- Approved: public or everyday work information on a business plan.
- Approved with limits: sensitive information (with a signed data agreement), anything that informs decisions about people (a person decides), or anything the public sees (labeled and reviewed).
- Not allowed: personal or sensitive information in free or personal accounts.`;

const BOARD = `AI BRIEFING · [Organization] · [date]

1. Where we stand
We found [number] AI tools in use across [teams]. [number] are approved, [number] approved with limits, [number] not allowed.

2. What AI is doing for us
[One or two examples of real time saved, with rough hours per week.]

3. The risks we found
[Top one to three risks, in plain words. Example: donor details were being pasted into a free personal AI account.]

4. What we've done
- Adopted an AI policy on [date]; [name] owns it.
- Moved [work] onto a business plan.
- Trained [number] staff and volunteers.

5. What we're asking of the board
[Decision or support needed, e.g. approve the policy, budget for business accounts, a yearly review.]

Next review: [date]`;

export const GOVERNANCE_GUIDES: Guide[] = [
  {
    slug: "what-is-ai-governance",
    topic: "governance",
    title: "What is AI governance? A plain-English guide for businesses and nonprofits",
    seoTitle: "What Is AI Governance? Plain-English Guide for Small Teams",
    description: "What AI governance means for a business, nonprofit or church of any size, the five pieces you actually need, the frameworks behind it, and how to start this week.",
    shortAnswer:
      "AI governance is the simple set of rules for how your organization uses AI: which tools are allowed, what information can go into them, who checks the results, and who is responsible. For most organizations it starts with three things: a list of the AI tools in use, a short AI policy, and one named person who owns it.",
    sections: [
      {
        heading: "Why it matters now",
        blocks: [
          "Your people are almost certainly using AI already. In 2026 surveys, roughly half or more of workers said they use AI tools their employer hasn't approved, usually free personal accounts. That's understandable, since AI helps them, but it means customer, donor or staff information can leave your control without anyone deciding it should.",
          "Governance isn't about slowing that down. It's about making AI safe enough that people can use it openly and confidently.",
          { callout: "Governance is permission with guardrails, not a ban. Bans push AI use onto personal phones, where you have the least protection." },
        ],
      },
      {
        heading: "The five pieces you actually need",
        blocks: [
          {
            steps: [
              { title: "An AI register", text: "A simple list of every AI tool in use, what it's for and what information goes in. See [how to create an AI register](/learn/how-to-create-an-ai-register)." },
              { title: "Clear ratings", text: "Each tool approved, approved with limits, or not allowed, with the reason written down so anyone can understand it." },
              { title: "A short AI policy", text: "Approved tools, what must never go in, when a person must review AI work, and who to ask. Start from our [AI policy template](/learn/ai-policy-template)." },
              { title: "A trained team", text: "An hour of practice on real work, so people know the rules and use AI well. See [how to train your team on AI](/learn/how-to-train-your-team-on-ai)." },
              { title: "An owner and a review date", text: "One named person keeps the register and policy current, and leaders see a short update at least twice a year. See [how to brief your board on AI](/learn/how-to-brief-your-board-on-ai)." },
            ],
          },
        ],
      },
      {
        heading: "The frameworks behind it, in plain words",
        blocks: [
          "You don't need to adopt a formal framework to govern AI well, but it helps to know the main ones, because larger customers, funders and partners may mention them:",
          {
            list: [
              "NIST AI Risk Management Framework (US, voluntary, released January 2023): organizes the work into four functions, Govern, Map, Measure and Manage. \"Govern\" is the culture, roles and policies that make the rest work.",
              "ISO/IEC 42001 (international, published December 2023): a certifiable standard for an AI management system, mostly used by larger organizations and AI providers.",
              "EU AI Act: since February 2, 2025, organizations that provide or use AI systems in the EU must take steps to ensure their staff have sufficient AI literacy, so training is part of governance there.",
              "US state laws: several states are passing their own AI rules, and dates keep changing. Colorado's first AI law, for example, was replaced before it took effect. Check what applies to you with a qualified advisor.",
            ],
          },
          "The good news: the five pieces above line up with the \"Govern\" part of these frameworks, and they're where every organization should start.",
        ],
      },
      {
        heading: "How to start this week",
        blocks: [
          {
            steps: [
              { title: "Ask what people use", text: "A quick, no-blame survey: which AI tools, for what, and with what information. See [what shadow AI is and how to manage it](/learn/what-is-shadow-ai)." },
              { title: "Build your kit", text: "Enter what you learn into [the free AI governance kit](/apps/governwise). It rates each tool and drafts your register, policy and leadership summary." },
              { title: "Fix the riskiest use first", text: "Usually that's personal or sensitive information in free personal accounts. Move it to a business plan or remove the personal details. Where AI affects people, [check it for bias](/learn/how-to-check-ai-for-bias), and use the [AI governance checklist](/learn/ai-governance-checklist) to see what else needs attention." },
              { title: "Adopt the policy and train", text: "Adjust the policy with your leaders, then spend an hour walking your team through it with real examples." },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Is AI governance only for big companies?", a: "No. Small teams need the small version: a list of tools, a one-page policy and a named owner. It takes an afternoon to set up and protects the information people trust you with." },
      { q: "What's the difference between AI governance and an AI policy?", a: "The policy is one piece. Governance also includes knowing which tools are in use, rating them, training people, and keeping it all current with a named owner." },
      { q: "Do we need to follow the NIST framework or ISO 42001?", a: "Usually not formally. They're useful references, and some customers or funders ask about them. Starting with a register, policy, training and an owner covers the basics they describe." },
      { q: "Is AI governance a legal requirement?", a: "It depends on where you operate and what you do. Some laws, like the EU AI Act's AI literacy duty, already apply to certain organizations, and US states are adding their own. Check with a qualified advisor; good governance makes any requirement easier to meet." },
    ],
    related: ["how-to-create-an-ai-register", "ai-governance-checklist", "how-to-check-ai-for-bias", "what-is-shadow-ai"],
    service: "ai-governance",
    tool: KIT,
    published: D,
    updated: D,
    sources: [
      { label: "NIST AI Risk Management Framework (AI RMF 1.0)", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { label: "ISO/IEC 42001:2023, AI management systems", url: "https://www.iso.org/standard/81230.html" },
      { label: "EU AI Act, Article 4: AI literacy", url: "https://artificialintelligenceact.eu/article/4/" },
      { label: "Seyfarth: Colorado enacts AI replacement law", url: "https://www.seyfarth.com/news-insights/colorado-enacts-artificial-intelligence-replacement-law.html" },
      { label: "The Register: bosses blinded by confidence about shadow AI use (2026)", url: "https://www.theregister.com/ai-ml/2026/05/27/bosses-blinded-by-confidence-about-shadow-ai-use-by-workers/5247275" },
    ],
  },
  {
    slug: "how-to-create-an-ai-register",
    topic: "governance",
    title: "How to create an AI register (AI inventory) for your organization",
    seoTitle: "How to Create an AI Register: Free AI Inventory Template",
    description: "An AI register is a list of every AI tool your organization uses, what it's for and what information goes in. How to build one in an afternoon, with a free template.",
    shortAnswer:
      "An AI register (or AI inventory) is a simple list of every AI tool your people use, what it's used for, the type of account, the most sensitive information that goes in, and whether it's approved. Build it by asking your team, not by guessing, then rate each tool and name one person to keep it current.",
    sections: [
      {
        heading: "Why start with a register",
        blocks: [
          "You can't set sensible rules for tools you don't know about. The register turns \"I think people use ChatGPT\" into a clear picture: which tools, for what, and with what information. Everything else in [AI governance](/learn/what-is-ai-governance), from your [AI policy](/learn/ai-policy-template) to your [team training](/learn/how-to-train-your-team-on-ai), builds on it.",
        ],
      },
      {
        heading: "What to record for each tool",
        blocks: [
          {
            list: [
              "The tool, and what it's used for (\"drafting donor letters\", not just \"writing\").",
              "Who uses it: a team, a role, or everyone.",
              "The account type: free or personal, paid by an individual, or a business or team plan.",
              "The most sensitive information that goes in: public, internal, personal (about real people), or sensitive (health, financial, children's or confidential). Not sure what's safe? See [is it safe to put business data in AI?](/learn/is-it-safe-to-put-business-data-in-ai)",
              "Whether it helps make decisions about people, like hiring, eligibility or care.",
              "Whether customers, members or the public see its output directly.",
              "Whether training on your data is turned off. See [how to stop AI training on your data](/learn/how-to-stop-ai-training-on-your-data).",
              "Its rating (approved, approved with limits, or not allowed) and any conditions.",
            ],
          },
        ],
      },
      {
        heading: "How to build it in an afternoon",
        blocks: [
          {
            steps: [
              { title: "Ask, without blame", text: "Send a two-minute anonymous survey: which AI tools do you use for work, for what, and what do you paste in? Promise no one is in trouble. Honest answers are the whole point; see [how to manage shadow AI](/learn/what-is-shadow-ai)." },
              { title: "Check the tools you already pay for", text: "Many everyday tools now include AI: meeting note-takers, email, design and writing tools. Add those too, along with any [AI agents](/learn/what-is-an-ai-agent) or automations that act on your behalf." },
              { title: "Rate each tool", text: "Personal or sensitive information in a personal account is not allowed. Sensitive information on a business plan needs the right agreement. Anything about people or seen by the public needs a person's review, and AI that affects people should be [checked for bias](/learn/how-to-check-ai-for-bias)." },
              { title: "Name an owner", text: "One person keeps the register, approves new tools and reviews it every six months, alongside your [AI policy](/learn/ai-policy-template)." },
            ],
          },
          { callout: "Want it faster? Enter your tools into [the free AI governance kit](/apps/governwise). It rates each one with reasons and exports your register as a spreadsheet." },
        ],
      },
      {
        heading: "Free AI register template",
        blocks: [{ template: { title: "AI register template", text: REGISTER } }],
      },
      {
        heading: "Blank template vs. a register built for you",
        blocks: [
          "The template gives you the columns. Filling them in well is the hard part:",
          {
            list: [
              "Finding the tools nobody mentions, like free accounts on personal phones and AI switched on inside software you already use.",
              "Rating each tool consistently, with a reason you could defend to your board or a customer.",
              "Turning each rating into clear conditions, like business accounts, training off, a data agreement or a person's review.",
              "Connecting the register to your [AI policy](/learn/ai-policy-template), so the approved list and the rules always match.",
              "Keeping it current, with evidence and a review date, and summarizing it for your leaders in a [board briefing](/learn/how-to-brief-your-board-on-ai).",
            ],
          },
          { callout: "Get your register rated automatically, plus a draft AI policy and a one-page leadership summary, in about 15 minutes: [build your AI register free](/apps/governwise). Want it built with your team, verified and kept current? See [AI governance with GrowDaily](/build/ai-governance)." },
        ],
      },
    ],
    faqs: [
      { q: "What's the difference between an AI register and an AI inventory?", a: "Nothing important. Both mean a list of the AI tools and uses in your organization. \"Register\" usually implies it also records approvals and owners." },
      { q: "How often should we update it?", a: "Whenever someone wants to use a new AI tool, and a full review every six months. AI features appear in existing software all the time." },
      { q: "Do built-in AI features count?", a: "Yes. AI inside your email, meeting or design tools can see the same information as a stand-alone chatbot, so list it with the same questions." },
    ],
    related: ["what-is-ai-governance", "what-is-shadow-ai", "ai-policy-template", "ai-governance-checklist"],
    service: "ai-governance",
    tool: KIT,
    published: D,
    updated: D,
  },
  {
    slug: "ai-governance-checklist",
    topic: "governance",
    title: "AI governance checklist: 10 questions for any organization",
    seoTitle: "AI Governance Checklist: 10 Questions for Any Organization",
    description: "Ten plain-English questions to check how well your business, nonprofit or church governs AI, what a good answer looks like, and the quickest fix for each gap.",
    shortAnswer:
      "Ten questions tell you where you stand: Do you know which AI tools are in use? Is there a policy and an owner? Are tools on business accounts? Does a person review AI work and decisions about people? Is AI labeled when the public sees it? Is your team trained, and is there a review date? Each \"no\" has a quick, practical fix.",
    sections: [
      {
        heading: "The checklist",
        blocks: [
          {
            steps: [
              { title: "1. Do we know every AI tool in use?", text: "Good: an up-to-date AI register, including free tools and AI built into software we already use. Fix: run a no-blame survey and build [an AI register](/learn/how-to-create-an-ai-register)." },
              { title: "2. Do we have a written AI policy?", text: "Good: one or two pages that staff have read. Fix: adapt our [AI policy template](/learn/ai-policy-template)." },
              { title: "3. Does one person own AI decisions?", text: "Good: a named owner who approves new tools and keeps the register current. Fix: name one this week; [what AI governance is](/learn/what-is-ai-governance) explains the role." },
              { title: "4. Is work information only in business accounts?", text: "Good: no customer, donor, member or staff details in free personal accounts. Fix: move that work to a business plan, or remove personal details first. See [is it safe to put business data in AI?](/learn/is-it-safe-to-put-business-data-in-ai)" },
              { title: "5. Is training on our data turned off?", text: "Good: confirmed in settings or by contract for every tool. Fix: see [how to stop AI training on your data](/learn/how-to-stop-ai-training-on-your-data)." },
              { title: "6. Does a person review AI work before it goes out?", text: "Good: facts, names and numbers checked before anything reaches customers or the public. Fix: write it into the policy and model it from the top." },
              { title: "7. Do people make decisions about people?", text: "Good: AI may help prepare, but a person decides on hiring, eligibility, discipline or care, notes how AI was used, and the AI has been [checked for bias](/learn/how-to-check-ai-for-bias). Fix: mark these uses \"approved with limits\" and run a bias test." },
              { title: "8. Do we tell people when they're dealing with AI?", text: "Good: AI chat tools and mostly AI-written public content are labeled, with a way to reach a person. Fix: add a short label and a contact link." },
              { title: "9. Has our team been trained?", text: "Good: everyone who uses AI has had practical training on the policy. Fix: an hour of practice on real work; see [how to train your team on AI](/learn/how-to-train-your-team-on-ai)." },
              { title: "10. Is there a review date?", text: "Good: the register and policy are reviewed at least every six months, with a short update to leaders. Fix: put the date in the policy now, and use a one-page [board briefing](/learn/how-to-brief-your-board-on-ai)." },
            ],
          },
        ],
      },
      {
        heading: "How to score yourself",
        blocks: [
          "Count your clear \"yes\" answers. Eight to ten: you're well governed; keep it current. Five to seven: you're on the way; fix the gaps in the order above. Four or fewer: start with questions 1 to 4 this month. They remove most of the risk.",
          { callout: "Prefer a guided version? [The free AI governance kit](/apps/governwise) asks these questions, rates each AI tool and gives you a readiness score with next steps." },
        ],
      },
      {
        heading: "Self-check vs. a full AI governance audit",
        blocks: [
          "These ten questions cover the basics, and answering them honestly puts you ahead of most organizations. A full audit goes further:",
          {
            list: [
              "Evidence for every answer, not just a yes or no, so your board, funders or customers can check it.",
              "Every AI tool rated with reasons in an [AI register](/learn/how-to-create-an-ai-register), including the ones staff don't mention ([shadow AI](/learn/what-is-shadow-ai)).",
              "The newer risks: [AI agents](/learn/what-is-an-ai-agent) acting on your behalf, prompt injection, and voice-clone or deepfake payment scams ([what to watch for](/learn/ai-voice-cloning-scams)).",
              "[Bias testing](/learn/how-to-check-ai-for-bias) wherever AI affects people.",
              "A tailored [AI policy](/learn/ai-policy-template), team training, a prioritized action plan and a one-page [board briefing](/learn/how-to-brief-your-board-on-ai), each versioned so changes are tracked.",
            ],
          },
          { callout: "Start free: [run the AI governance kit](/apps/governwise) for your readiness score, AI register and draft policy in about 15 minutes. Want the full audit, done with your team? See [AI governance with GrowDaily](/build/ai-governance)." },
        ],
      },
    ],
    faqs: [
      { q: "Who should fill in the checklist?", a: "Whoever owns operations or IT, ideally with one or two people who use AI every day. Their answers are usually more accurate than leadership's guesses." },
      { q: "How long does it take to fix the gaps?", a: "Most small organizations can close questions 1 to 4 in a couple of weeks: a survey, a policy, an owner and a move to business accounts. Training and reviews follow." },
      { q: "Is this checklist enough for compliance?", a: "It covers good everyday practice, not legal compliance. If you handle regulated information, like health or children's data, check your obligations with a qualified advisor." },
    ],
    related: ["what-is-ai-governance", "how-to-create-an-ai-register", "ai-policy-template", "how-to-brief-your-board-on-ai"],
    service: "ai-governance",
    tool: KIT,
    published: D,
    updated: D,
  },
  {
    slug: "how-to-brief-your-board-on-ai",
    topic: "governance",
    title: "How to brief your board on AI (with a one-page template)",
    seoTitle: "How to Brief Your Board on AI: One-Page Template",
    description: "Boards and owners are asking \"what's our AI policy?\" How to answer in one page: where you stand, the risks you found, what you've done and what you need, with a free template.",
    shortAnswer:
      "Keep it to one page and five parts: where you stand (which AI tools are in use and how they're rated), what AI is doing for you, the risks you found, what you've already done, and what you need from the board. Plain words and real numbers beat a slide deck.",
    sections: [
      {
        heading: "What boards actually want to know",
        blocks: [
          {
            list: [
              "Are we using AI, and where?",
              "Is our people's and customers' or donors' information safe?",
              "Who is responsible?",
              "Is it helping, and is anything we should worry about?",
              "What do you need from us?",
            ],
          },
          "Answer those five, briefly and honestly, and most boards will be reassured, even if the honest answer is \"we're just getting started.\"",
        ],
      },
      {
        heading: "Free one-page board briefing template",
        blocks: [{ template: { title: "AI briefing for your board or owners", text: BOARD } }],
      },
      {
        heading: "Tips for the conversation",
        blocks: [
          {
            list: [
              "Lead with the facts from your [AI register](/learn/how-to-create-an-ai-register) and your answers to the [AI governance checklist](/learn/ai-governance-checklist), not with hype or fear.",
              "Name the riskiest use you found and what you did about it. It builds trust.",
              "Show one real example of time saved, so the board sees the benefit as well as the risk.",
              "Ask for a specific decision, such as approving the policy or a budget for business accounts.",
              "Agree on how often they'll hear about AI, usually twice a year.",
            ],
          },
          { callout: "[The free AI governance kit](/apps/governwise) produces a one-page leadership summary with your readiness score, the tool ratings and next steps, a good starting point for this briefing." },
        ],
      },
    ],
    faqs: [
      { q: "Should the board approve our AI policy?", a: "For most nonprofits and many businesses, yes, or at least see it. It shows the organization takes the information it holds seriously, and gives the policy weight with staff." },
      { q: "What if we don't have answers yet?", a: "Say so, and present a short plan: survey the team, build the register, adopt a policy and train staff within a set number of weeks. Boards respond well to a clear plan." },
      { q: "Does a church council or elder board need this too?", a: "Yes. Churches hold sensitive information, like pastoral care notes and giving records. See our [church AI policy template](/learn/church-ai-policy-template)." },
    ],
    related: ["what-is-ai-governance", "ai-governance-checklist", "ai-policy-template", "ai-for-nonprofits"],
    service: "ai-governance",
    tool: KIT,
    published: D,
    updated: D,
  },
  {
    slug: "how-to-check-ai-for-bias",
    topic: "governance",
    title: "How to check AI for bias: a practical test any organization can run",
    seoTitle: "How to Check AI for Bias: A Practical Test You Can Run",
    description: "A plain-English way to check AI for bias: when you need to, paired tests that swap only names or traits, comparing outcomes across groups, and how to fix and record what you find.",
    shortAnswer:
      "Check AI for bias wherever it affects people, like hiring, eligibility, pricing or care. Review the data for who's missing, run paired tests that change only a name or trait, compare outcome rates across groups (a ratio below 0.8 is a warning sign), then fix, re-test and write it all down.",
    sections: [
      {
        heading: "When you need a bias check",
        blocks: [
          "Any time AI informs a decision about a person or writes content about people: screening applications, approving requests, setting prices, prioritizing cases, drafting performance notes, or answering the public. If AI only helps with internal drafts that a person rewrites, a lighter review is usually enough. Bias testing is one part of [AI governance](/learn/what-is-ai-governance).",
          { callout: "Employment, housing, lending, insurance, education and health are legally sensitive. If AI touches those decisions, involve a qualified advisor before relying on any test." },
        ],
      },
      {
        heading: "A five-step bias test",
        blocks: [
          {
            steps: [
              { title: "1. Scope it", text: "Write down the decision AI influences, who is affected, and which groups could be treated unfairly: sex or gender, age, race or ethnicity, disability, language, religion, location, and proxies for them like names, zip codes or gaps in work history." },
              { title: "2. Check the data", text: "Does the information the AI uses represent the people it affects? Who's missing? Is any input a stand-in for a protected trait that you could remove? Your AI is only as good as your data." },
              { title: "3. Run paired tests", text: "Build 10 to 30 realistic cases. Make versions that differ in only one thing, like the same résumé with a different name, or the same question in another language. Run each several times and note any difference in outcome, score or tone." },
              { title: "4. Compare outcomes across groups", text: "When you have enough real decisions, work out each group's selection rate (selected ÷ considered) and divide the lowest by the highest. Below 0.8, the \"four-fifths rule\" used by the US EEOC, is a warning sign to investigate, not proof of discrimination. Small numbers can mislead." },
              { title: "5. Fix, re-test, record", text: "Remove proxy inputs, change instructions, add a person's review, or stop using AI for that decision. Re-test, then record what you tested, what you found, what you changed, and who signed off. Repeat yearly and whenever the tool or data changes." },
            ],
          },
        ],
      },
      {
        heading: "Free bias test record",
        blocks: [
          { template: { title: "AI bias test record", text: `AI BIAS TEST RECORD · [Organization] · [date]

AI use and decision: ______
People affected: ______
Groups considered: ______
Data review (who's missing, proxy inputs removed): ______

Paired tests run: [n] · Differences found: ______
Outcome rates by group: ______ · Impact ratio (lowest ÷ highest): ______

Findings: ______
Fixes made: ______
Re-test result: ______

Signed off by: ______ · Next test due: ______` } },
          "Keep the record with your [AI register](/learn/how-to-create-an-ai-register). It's the evidence that shows you checked, if anyone ever asks.",
        ],
      },
    ],
    faqs: [
      { q: "Do small organizations really need to test AI for bias?", a: "If AI influences decisions about people, yes, in proportion. A dozen paired tests and a written record take an afternoon and show you took care." },
      { q: "Does the four-fifths rule prove discrimination?", a: "No. It's a screening heuristic from the US EEOC's guidelines: a ratio below 0.8 is a signal to look closer. Small samples, job requirements and other factors all matter, so get advice for anything legally sensitive." },
      { q: "Can generative AI be biased in what it writes?", a: "Yes. Review a sample of its output for stereotypes, uneven tone or missing perspectives, especially in anything public or about people." },
      { q: "Are there laws that require bias audits?", a: "Some. New York City, for example, requires bias audits for automated employment decision tools. Rules differ by place and change often, so check with a qualified advisor." },
    ],
    related: ["what-is-ai-governance", "ai-governance-checklist", "how-to-create-an-ai-register", "ai-policy-template"],
    service: "ai-governance",
    tool: KIT,
    published: D,
    updated: D,
    sources: [
      { label: "NIST SP 1270: Towards a Standard for Identifying and Managing Bias in AI", url: "https://www.nist.gov/publications/towards-standard-identifying-and-managing-bias-artificial-intelligence" },
      { label: "US EEOC Uniform Guidelines, 29 CFR 1607.4(D) (four-fifths rule)", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1607/section-1607.4" },
      { label: "NYC: Automated employment decision tools (Local Law 144)", url: "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page" },
    ],
  },
];
