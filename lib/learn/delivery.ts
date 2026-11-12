import type { Guide } from "./types";

const D = "2026-10-22";

const EXIT_CHECKLIST = `AI pilot exit criteria (go/no-go)
Agree these with the business owner BEFORE the first sprint. The pilot scales only when every one is met.

Use case: [what the AI does, for whom]
Business owner: [name]          Gate review date: [date]

1. Value
   Metric: [e.g. time to first reply]  Baseline: [measured]  Target: [number]
   Met? [ ]

2. Quality on a fixed test set
   Test set: [100+ real cases, including hard and unusual ones]
   Target: [e.g. ≥ 90% rated acceptable by the people who do the work]
   Met? [ ]

3. Safe failure
   When unsure or out of scope, it says so and hands off to a person.
   Tested with tricky, out-of-scope and adversarial cases.
   Met? [ ]

4. Cost per task
   Target: [below today's cost of doing it by hand], measured from real usage.
   Met? [ ]

5. Speed
   Target: [fast enough for the workflow, e.g. under 10 seconds]
   Met? [ ]

6. Permissions and data
   People only see what they're allowed to; sensitive data handled per policy.
   Security/privacy review signed off by: [name]
   Met? [ ]

7. Path to production
   Runs in: [system people already use]   Supported by: [team]
   Met? [ ]

8. Adoption
   Target: [e.g. 4 of 5 pilot users choose to use it weekly]
   Met? [ ]

Decision: [ ] Go   [ ] Adjust and re-test by [date]   [ ] Stop
Signed: [owner], [sponsor]`;

const LIFECYCLE_DATE = "2026-11-11";

const LIFECYCLE_FLOW = `flowchart TD
  A(["1 · Capture the use case<br/>problem, owner, baseline"]) --> B["2 · Score and prioritize<br/>value · feasibility · adoption + risk tier"]
  B --> C["3 · Design<br/>who's in charge, success measure, test set"]
  C --> G1{"Gate 1<br/>Approve to build?"}
  G1 -- "Not yet" --> B
  G1 -- "Yes" --> D["4 · Build and test<br/>smallest version, run the test set"]
  D --> E["5 · Pilot<br/>real users, real work"]
  E --> G2{"Gate 2<br/>Go, adjust or stop?"}
  G2 -- "Adjust" --> D
  G2 -- "Stop" --> S(["Stop and keep the lessons"])
  G2 -- "Go" --> F["6 · Launch<br/>owner, sign-off, training, register"]
  F --> G3{"Gate 3<br/>Approve for production?"}
  G3 -- "Yes" --> M["7 · Monitor<br/>outputs, usage, cost"]
  M -- "Drifting" --> D
  M -- "Value drops" --> R(["8 · Retire<br/>switch off, update the register"])
  classDef gate fill:#f2b54b,stroke:#f6c56d,color:#1b1408,font-weight:bold
  classDef live fill:#1f4a3a,stroke:#3f8f6e,color:#e8eef5
  classDef stop fill:#3a1f24,stroke:#8f3f4a,color:#e8eef5
  class G1,G2,G3 gate
  class M live
  class S,R stop`;

const INTAKE = `AI USE CASE: [name]          Owner: [one person]

Problem (no tool names): [what takes too long or goes wrong]
Who has it, how often:   [team, times per week]
Today's baseline:        [time, errors or cost per task]
Better looks like:       [the one number, and the target]
Data it needs:           [where it lives; personal or confidential? Y/N]
Who stays in charge:     AI drafts, person approves / AI acts within limits

Value __/5   Feasibility __/5   Adoption __/5   Risk: Low / Med / High
Decision: Build now / Later / No      Reviewed by: ____   Date: ____`;

const CULTURE_DATE = "2026-11-12";

const CULTURE_FLOW = `flowchart LR
  A(["Culture check<br/>rate each team"]) --> B["Culture map<br/>pace × trust and safety"]
  B --> E1["Explorer<br/>quick wins + guardrails"]
  B --> E2["Sprinter<br/>make the safe way easy"]
  B --> E3["Builder<br/>governance, then proof"]
  B --> E4["Guarded<br/>listen, explain the why"]
  E1 --> P["Pilot and launch<br/>at each team's pace"]
  E2 --> P
  E3 --> P
  E4 --> P
  P --> K(["ADKAR<br/>find where each person is stuck"])
  classDef explorer fill:#1f4a3a,stroke:#53cfa0,color:#e8eef5
  classDef sprinter fill:#4a3a14,stroke:#f2b54b,color:#e8eef5
  classDef builder fill:#16384a,stroke:#5cb8e6,color:#e8eef5
  classDef guarded fill:#4a2620,stroke:#e8826b,color:#e8eef5
  class E1 explorer
  class E2 sprinter
  class E3 builder
  class E4 guarded`;

export const DELIVERY_GUIDES: Guide[] = [
  {
    slug: "ai-culture-assessment",
    topic: "delivery",
    title: "How to assess your culture before rolling out AI",
    seoTitle: "AI Culture Assessment: Check Readiness by Team (Free Tool)",
    description: "Why culture decides how AI lands, the four things to check in each department, the four culture types and how to roll out AI in each, with a free culture check.",
    shortAnswer:
      "Check culture team by team before you roll out AI, because the same tool lands differently in different departments. Look at four things: pace of change, safety to learn, trust in leaders, and voice. Then match the rollout to each team: guardrails for fast teams, proof for careful ones, and the why first where trust is low.",
    sections: [
      {
        heading: "Why culture comes first",
        blocks: [
          "Most organizations don't fully know their own culture. The culture leaders describe in values statements is often not the one people live day to day, and it can differ sharply between departments. Finance may want proof and controls while Programs wants to try things this week.",
          "Run one rollout plan across both and it fits neither. A quick culture check, before the first pilot, tells you which pace and which message each team needs.",
          {
            mermaid: {
              title: "From culture check to rollout",
              code: CULTURE_FLOW,
              caption: "The culture map sets each team's pace. ADKAR then shows where individual people are stuck.",
            },
          },
        ],
      },
      {
        heading: "The four things to check",
        blocks: [
          {
            table: {
              head: ["Area", "What to ask", "Why it matters for AI"],
              rows: [
                ["Pace of change", "Do people try new things quickly, or wait for proof?", "Sets how fast you can move and how much evidence you need first"],
                ["Safety to learn", "Can people admit mistakes and question decisions without fear?", "AI takes practice; people won't experiment where mistakes are punished"],
                ["Trust in leaders", "Do people believe the real reasons behind changes?", "Without trust, people assume AI is about cutting jobs or watching them"],
                ["Voice and sharing", "Do the people doing the work help decide how it's done?", "Teams adopt what they helped shape, and share what works"],
              ],
            },
          },
          "Also ask how each team uses AI today. If the honest answer is \"quietly, on personal accounts,\" you have [shadow AI](/learn/what-is-shadow-ai) to bring into the open first.",
        ],
      },
      {
        heading: "The four culture types and how to roll out AI",
        blocks: [
          {
            table: {
              head: ["Type", "Looks like", "Lead with", "Watch for"],
              rows: [
                ["Explorer", "Fast, with high trust and safety", "Quick wins with light guardrails", "Running ahead of governance"],
                ["Sprinter", "Fast, but people don't feel safe", "Approved tools that are easier than the workarounds", "Shadow AI"],
                ["Builder", "Careful, with high trust", "Governance first, then a well-run pilot", "Waiting for perfect"],
                ["Guarded", "Careful and wary of change", "Listening sessions and a visible sponsor explaining the why", "Rumors and quiet resistance"],
              ],
            },
          },
          { callout: "Map your own teams in about 5 minutes each with [Culturewise, the free AI culture check](/apps/culturewise). No sign-up, and your answers stay in your browser." },
        ],
      },
      {
        heading: "How to run it well",
        blocks: [
          {
            steps: [
              { title: "Rate each team separately", text: "Start with a leader who knows each team. Departments, sites and ministries often differ more than you expect." },
              { title: "Ask the team too", text: "Have two or three people in each team rate it. Where their answers differ from the leader's is often the most useful finding." },
              { title: "Watch what happens, not what's said", text: "Notice how decisions really get made, who gets praised, and what happens after a mistake. Those show the culture people live." },
              { title: "Plan each team's path", text: "Use the culture type to set the pace and the message, then the [AI lifecycle](/learn/ai-lifecycle) to run the pilots and launches." },
              { title: "Check again after launch", text: "Rerun it in three to six months. A good rollout should raise trust and safety, not only usage." },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Isn't culture too vague to measure?", a: "You can't measure it precisely, but you can see its signs: how fast people try new things, what happens after mistakes, whether people trust the why, and who gets a say. A quick check turns hunches into a shared picture leaders can talk about." },
      { q: "How is this different from ADKAR?", a: "Culture is the ground the change lands on, across a whole team. ADKAR looks at each person: whether they know why, want to, know how, can do it, and keep doing it. Use the culture check to set each team's rollout, and ADKAR to find where individuals are stuck." },
      { q: "Should we use a formal culture survey?", a: "For a large or regulated rollout, a validated instrument run by HR or a consultant is worth it. Frameworks like the Competing Values Framework are widely used. For most teams, a quick check plus honest conversations is enough to start." },
    ],
    related: ["ai-lifecycle", "what-is-shadow-ai", "how-to-train-your-team-on-ai", "ai-implementation-plan"],
    service: "ai-governance",
    tool: { name: "Culturewise", href: "/apps/culturewise", pitch: "Rate each team on 12 statements, see them on a culture map, and get the AI rollout style that fits each one. About 5 minutes per team, no sign-up." },
    published: CULTURE_DATE,
    updated: CULTURE_DATE,
    sources: [
      { label: "Edmondson, Psychological Safety and Learning Behavior in Work Teams, Administrative Science Quarterly (1999)", url: "https://doi.org/10.2307/2666999" },
      { label: "Prosci: the ADKAR Model", url: "https://www.prosci.com/methodology/adkar" },
      { label: "NIST AI Risk Management Framework (AI RMF 1.0), Govern function", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    ],
  },
  {
    slug: "ai-lifecycle",
    topic: "delivery",
    title: "The AI lifecycle: from use case to production, the way the pros do it",
    seoTitle: "The AI Lifecycle: From Use Case to Production (Free Form)",
    description: "The eight stages every AI idea should move through, from use case and scoring to launch and retirement, with three approval gates, a scoring rubric and a free intake form.",
    shortAnswer:
      "Pros don't start by building. Every AI idea moves through eight stages, from use case to retirement, with three approval gates where governance happens: approve to build, go or stop after the pilot, and approve for production. You can run a light version as a team of one.",
    sections: [
      {
        heading: "The lifecycle at a glance",
        blocks: [
          "Gartner predicted that at least 30% of generative AI projects would be abandoned after proof of concept by the end of 2025, citing poor data, weak risk controls, rising costs and unclear value. A lifecycle catches each of those before people depend on the tool. See also [why most AI pilots fail](/learn/why-ai-pilots-fail).",
          {
            mermaid: {
              title: "The AI lifecycle: eight stages, three gates",
              code: LIFECYCLE_FLOW,
              caption: "Amber diamonds are the approval gates. Copy the Mermaid source into Notion, GitHub or Confluence to reuse it.",
            },
          },
        ],
      },
      {
        heading: "The eight stages",
        blocks: [
          {
            steps: [
              { title: "Capture the use case", text: "Put every idea on one intake form (below): the problem, not the tool; who has it; and how long it takes today. That time is your baseline." },
              { title: "Score and prioritize", text: "Rate value, feasibility and adoption from 1 to 5, and set a risk tier separately (rubric below). Start with high-value, low-risk wins." },
              { title: "Design", text: "Decide who stays in charge (start with \"AI drafts, a person approves\"), pick the simplest tool that could work, and agree the success measure, exit criteria and a test set of real cases. → Gate 1: approve to build." },
              { title: "Build and test", text: "Build the smallest version, run the test set, fix what fails and repeat. Check quality, safe failure, fairness and cost per task, not just a good demo." },
              { title: "Pilot", text: "Give it to a few real users for real work and measure against the baseline. If they don't use it, find the gap with Prosci's [ADKAR model](https://www.prosci.com/methodology/adkar): Awareness, Desire, Knowledge, Ability, Reinforcement. → Gate 2: go, adjust or stop." },
              { title: "Launch 🚀", text: "Name an owner, get sign-off for the risk tier, train users, add it to your [AI register](/learn/how-to-create-an-ai-register), and know how to switch it off. → Gate 3: approve for production." },
              { title: "Monitor", text: "Spot-check outputs, usage and cost on a schedule. Models and data change even when you don't touch them." },
              { title: "Retire", text: "When the value drops or something better arrives, tell users, switch it off, keep or delete the data per policy, and update the register." },
            ],
          },
          { callout: "Need exit criteria for Gate 2? Use the [go/no-go checklist](/learn/ai-pilot-exit-criteria). Not sure who signs each gate? See the [AI governance RACI](/learn/ai-governance-raci)." },
        ],
      },
      {
        heading: "How to score a use case",
        blocks: [
          "Rate each from 1 to 5. Keep risk out of the total: it sets how much review the idea needs, not whether it's worth doing.",
          {
            table: {
              head: ["Score", "A 1 looks like", "A 5 looks like"],
              rows: [
                ["Value", "Saves a few minutes a month", "Saves hours every week"],
                ["Feasibility", "Data is scattered; needs heavy custom work", "Data is ready; a tool you have can do it"],
                ["Adoption", "No owner; users weren't asked", "Owner named; users want it"],
              ],
            },
          },
          {
            table: {
              head: ["Risk tier", "Typical use", "Review needed"],
              rows: [
                ["Low", "Internal drafting, no personal data", "Owner signs off"],
                ["Medium", "Customer-facing, or uses personal data", "Plus a privacy and security check"],
                ["High", "Decisions about people: hiring, credit, schooling, benefits", "Leadership and legal review; a person makes the decision"],
              ],
            },
          },
          "The high tier follows the areas the [EU AI Act lists as high-risk](https://artificialintelligenceact.eu/annex/3/).",
        ],
      },
      {
        heading: "Watch: the lifecycle in five minutes",
        blocks: [
          {
            video: {
              id: "-x9bVcEmkUk",
              title: "AI Model Life Cycle: From Planning to Deployment to Retirement",
              creator: "IBM Technology",
              channelUrl: "https://www.youtube.com/@IBMTechnology",
              note: "The middle covers training a model, more technical than you need if you build with Claude, but the shape matches this page.",
            },
          },
        ],
      },
      {
        heading: "Copy-ready intake form",
        blocks: [
          "Paste this into a doc, a form or a ticket. One per idea; review them together once a month.",
          { template: { title: "AI use case intake form", text: INTAKE } },
        ],
      },
    ],
    faqs: [
      { q: "Does a small organization really need all this?", a: "You need the thinking, not the paperwork. For a small team, each stage is a few lines in one document and each gate is a ten-minute talk with one other person." },
      { q: "Is this the same as MLOps?", a: "No. MLOps is the engineering of building and running models. The lifecycle also covers the business decisions before the build and the people side after launch." },
      { q: "Which framework should we follow?", a: "Start with the free NIST AI Risk Management Framework; its Govern, Map, Measure and Manage functions fit these stages. ISO/IEC 5338 and CRISP-ML(Q) describe the same shape, and ISO/IEC 42001 is the standard if you want certification." },
    ],
    related: ["why-ai-pilots-fail", "ai-pilot-exit-criteria", "ai-culture-assessment", "how-to-create-an-ai-register", "ai-governance-raci"],
    service: "ai-governance",
    tool: { name: "the AI governance kit", href: "/apps/governwise", pitch: "Get your AI register and policy in place before your first launch: list your AI tools and get a register, a ready-to-adopt policy and a leadership summary in about 15 minutes." },
    published: LIFECYCLE_DATE,
    updated: LIFECYCLE_DATE,
    sources: [
      { label: "NIST AI Risk Management Framework (AI RMF 1.0), January 2023", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { label: "ISO/IEC 5338:2023, AI system life cycle processes", url: "https://www.iso.org/standard/81118.html" },
      { label: "ISO/IEC 42001:2023, AI management system", url: "https://www.iso.org/standard/42001" },
      { label: "Studer et al., Towards CRISP-ML(Q): a machine learning process model with quality assurance", url: "https://arxiv.org/abs/2003.05155" },
      { label: "Gartner: 30% of generative AI projects will be abandoned after proof of concept by end of 2025 (July 29, 2024)", url: "https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025" },
      { label: "EU AI Act, Annex III: high-risk AI systems", url: "https://artificialintelligenceact.eu/annex/3/" },
      { label: "Prosci: the ADKAR Model", url: "https://www.prosci.com/methodology/adkar" },
    ],
  },
  {
    slug: "why-ai-pilots-fail",
    topic: "delivery",
    title: "Why most AI pilots fail, and how to get yours to production",
    seoTitle: "Why Most AI Pilots Fail, and How to Get Yours to Production",
    description: "Research suggests most AI pilots never deliver measurable value. The real reasons (problem, data, measurement, path to production) and a practical way to avoid them.",
    shortAnswer:
      "Most AI pilots stall for reasons that have little to do with the model: an unclear problem and owner, data that isn't ready, no agreed measure of success, and no path into the tools people use. Fix those before you build: name an owner and a metric, build a test set, agree go/no-go exit criteria, and plan the route to production from day one.",
    sections: [
      {
        heading: "What the research says",
        blocks: [
          "RAND's 2024 study of AI projects, based on interviews with experienced data scientists and engineers, estimated that more than 80% of AI projects fail, about twice the rate of IT projects without AI. MIT's 2025 \"GenAI Divide\" report, a preliminary study that hasn't been peer-reviewed, found that about 95% of generative AI pilots at large companies produced no measurable financial return.",
          "The exact numbers are debated, but the pattern isn't: most AI pilots don't make it into everyday work with results anyone can measure.",
        ],
      },
      {
        heading: "The real reasons",
        blocks: [
          "RAND found the leading causes are organizational, not technical:",
          {
            list: [
              "The problem is misunderstood or miscommunicated: leaders and builders aren't solving the same problem.",
              "The data isn't there: not enough of it, not clean enough, or not allowed to be used.",
              "No infrastructure to run it: nothing to deploy, monitor and support it after the demo.",
              "Technology first: chasing the latest model instead of a real problem.",
              "Problems too hard for current AI: aiming at something it can't yet do reliably.",
            ],
          },
          "Commentary on the MIT report points the same way: tools that don't fit into how people actually work, and organizations that weren't ready.",
        ],
      },
      {
        heading: "How to get a pilot to production",
        blocks: [
          {
            steps: [
              { title: "Pick one workflow and one owner", text: "A specific piece of work, a named business owner, and one number that should move. Measure today's baseline for two weeks." },
              { title: "Check readiness before you build", text: "Problem and value, data, people and process, risk and governance, tech and integration, and measurement. Fix the weakest area first." },
              { title: "Agree exit criteria up front", text: "Quality on a fixed test set, cost per task, speed, safe failure, permissions, a path to production and adoption. Decided before the first sprint, not after the demo." },
              { title: "Build a test set of real cases", text: "100 or more real examples, including hard ones, with agreed good answers. Run it every sprint." },
              { title: "Pilot small, with people reviewing", text: "A thin end-to-end version for a few real users, inside the tools they already use." },
              { title: "Hold a real gate", text: "Go, adjust or stop, based on the criteria. Stopping a pilot that doesn't meet them is a success, not a failure." },
            ],
          },
          { callout: "Plan your pilot in minutes with [Pilotwise](/apps/pilotwise), our free AI pilot planner: a readiness verdict, what to fix first, a go/no-go test and a one-page brief for your sponsor." },
        ],
      },
      {
        heading: "Signs your pilot is in trouble",
        blocks: [
          {
            list: [
              "Nobody can say what number will prove it worked.",
              "The demo used hand-picked examples, not a test set.",
              "Real users haven't touched it yet.",
              "It runs in a separate tool nobody opens.",
              "Security, privacy or legal haven't seen it.",
              "There's no named team to support it after the pilot.",
            ],
          },
          "Any one of these is fixable. All of them together is how pilots quietly die. Our [AI pilot exit criteria checklist](/learn/ai-pilot-exit-criteria) helps you close them.",
        ],
      },
    ],
    faqs: [
      { q: "What percentage of AI projects fail?", a: "Estimates vary by study and definition. RAND estimated more than 80% of AI projects fail, and MIT's preliminary 2025 report found about 95% of generative AI pilots at large companies had no measurable financial return." },
      { q: "What is the most common reason AI pilots fail?", a: "Research points to problem framing and leadership: teams that aren't clear on the problem, owner and measure of success, followed by data and infrastructure gaps." },
      { q: "How long should an AI pilot take?", a: "Often 8 to 16 weeks for a focused use case: a couple of weeks to frame and measure, a few sprints with real users, and a gate review before scaling." },
    ],
    related: ["ai-lifecycle", "ai-pilot-exit-criteria", "ai-implementation-plan", "what-is-shadow-ai"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [
      { label: "RAND: the root causes of failure for AI projects and how they can succeed (2024)", url: "https://www.rand.org/pubs/research_reports/RRA2680-1.html" },
      { label: "OODA Loop: 95% of generative AI pilots at companies are failing (summary of MIT NANDA's 2025 report)", url: "https://oodaloop.com/briefs/technology/95-of-generative-ai-pilots-at-companies-are-failing" },
    ],
  },
  {
    slug: "ai-pilot-exit-criteria",
    topic: "delivery",
    title: "AI pilot exit criteria: a go/no-go checklist (free template)",
    seoTitle: "AI Pilot Exit Criteria: Go/No-Go Checklist (Free Template)",
    description: "The exit criteria that decide whether an AI pilot scales: quality on a test set, cost per task, safe failure, permissions, a path to production and adoption. Free checklist.",
    shortAnswer:
      "Exit criteria are the measurable conditions, agreed before the first sprint, that decide whether an AI pilot goes to production: value against a baseline, quality on a fixed test set of real cases, safe failure, cost per task, speed, permissions and data, a named path to production, and adoption. If any isn't met at the gate, you adjust and re-test, or stop.",
    sections: [
      {
        heading: "Why exit criteria matter",
        blocks: [
          "Without criteria agreed up front, a pilot ends with a demo and a feeling. The demo uses good examples, everyone is impressed, and then nothing scales because no one can say whether it's good enough. Criteria turn the end of the pilot into a decision.",
        ],
      },
      {
        heading: "The eight criteria",
        blocks: [
          {
            list: [
              "Value: the metric the owner cares about moves from a measured baseline to an agreed target.",
              "Quality on a fixed test set: 100+ real cases, including hard ones, rated by the people who do the work. The same set every sprint.",
              "Safe failure: when it's unsure or out of scope, it says so and hands off to a person.",
              "Cost per task: from real usage, not list prices, and below today's cost.",
              "Speed: fast enough for the workflow it sits in.",
              "Permissions and data: people only see what they're allowed to, and sensitive data is handled per policy, signed off by security or privacy.",
              "Path to production: a named system it runs in and a team that supports it.",
              "Adoption: the people it's for choose to use it.",
            ],
          },
          { callout: "Leave model choice and screen polish off the list. They matter less than the test set, which is the asset you keep whatever you build on." },
        ],
      },
      {
        heading: "Free go/no-go checklist",
        blocks: [
          "Copy this into your plan and fill in the brackets with the business owner before you start.",
          { template: { title: "AI pilot exit criteria checklist", text: EXIT_CHECKLIST } },
          "Want it done for you? [Pilotwise](/apps/pilotwise) drafts exit criteria for your use case, tracks each one through the pilot, and prints a one-page brief for your sponsor.",
        ],
      },
      {
        heading: "Running the gate review",
        blocks: [
          {
            steps: [
              { title: "Share the numbers first", text: "Test-set results, cost per task, usage and the value metric against baseline, before anyone sees a demo." },
              { title: "Decide against the criteria", text: "Go if all are met. Adjust and re-test by a date if one or two are close. Stop if the core value isn't there." },
              { title: "Write the decision down", text: "Who decided, on what evidence, and what happens next." },
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "What are exit criteria for an AI pilot?", a: "Measurable conditions agreed before the pilot starts that decide whether it scales: value, quality on a test set, safe failure, cost, speed, permissions, a path to production and adoption." },
      { q: "How big should an AI test set be?", a: "A common starting point is 100 or more real cases, including hard and unusual ones, with good answers agreed by the people who do the work. Keep it fixed so results are comparable sprint to sprint." },
      { q: "Is stopping a pilot a failure?", a: "No. Stopping a pilot that doesn't meet its criteria saves the cost of scaling something that won't deliver, and what you learned (and the test set) carries into the next one." },
    ],
    related: ["why-ai-pilots-fail", "ai-lifecycle", "ai-implementation-plan", "ai-policy-template"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [
      { label: "DS Stream: GenAI proof of concept to production (exit criteria)", url: "https://www.dsstream.com/post/genai-poc-to-production" },
      { label: "RAND: the root causes of failure for AI projects and how they can succeed (2024)", url: "https://www.rand.org/pubs/research_reports/RRA2680-1.html" },
    ],
  },
];
