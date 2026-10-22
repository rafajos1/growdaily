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

export const DELIVERY_GUIDES: Guide[] = [
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
          { callout: "Plan your pilot in minutes with [Pilotwise](/apps/pilotwise), our free AI pilot planner: readiness score, exit criteria, phases, ROAM risks and a one-page brief for your sponsor." },
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
    related: ["ai-pilot-exit-criteria", "ai-implementation-plan", "private-ai-for-business", "what-is-shadow-ai"],
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
    related: ["why-ai-pilots-fail", "ai-implementation-plan", "ai-policy-template", "how-to-stop-ai-training-on-your-data"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [
      { label: "DS Stream: GenAI proof of concept to production (exit criteria)", url: "https://www.dsstream.com/post/genai-poc-to-production" },
      { label: "RAND: the root causes of failure for AI projects and how they can succeed (2024)", url: "https://www.rand.org/pubs/research_reports/RRA2680-1.html" },
    ],
  },
];
