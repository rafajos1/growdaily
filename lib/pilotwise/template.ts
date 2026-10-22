import { AREAS, RISK_CATEGORIES, type AreaId, type Inputs, type Level, type Plan, type Roam } from "./types";

type IdFn = () => string;

const str = (v: unknown, max: number, fallback = "") => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : fallback);
const level = (v: unknown): Level => (v === "low" || v === "medium" || v === "high" ? v : "medium");
const int = (v: unknown, lo: number, hi: number, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : fallback);

/** A useful starting plan for any AI use case, without AI: the gates and risks every pilot needs. */
export function templatePlan(inputs: Inputs, id: IdFn): Plan {
  const useCase = inputs.useCase.trim() || "Our AI pilot";
  const short = useCase.length > 70 ? `${useCase.slice(0, 67).trimEnd()}…` : useCase;
  const pilotWeeks = Math.max(2, inputs.weeks - 3);
  return {
    title: short,
    problem: `${useCase}. Write down who does this work today, how long it takes, and what goes wrong, so the pilot has a clear before and after.`,
    value: { metric: "Hours saved per week (or another number the owner cares about)", baseline: "Measure for two weeks before the pilot", target: "Agree a target with the owner before building", owner: "Name one business owner" },
    users: "The team that does this work today",
    readiness: AREAS.map((a) => ({ area: a.id, score: 3, note: a.hint, gap: "" })),
    exitCriteria: [
      { id: id(), name: "Quality on a fixed test set", target: "≥ 90% of answers rated acceptable on 100+ real cases", measure: "Same test set every sprint, rated by the people who do the work", status: "not-measured" },
      { id: id(), name: "Path to production", target: "A named system and owner for running it after the pilot", measure: "Integration and support plan agreed", status: "not-measured" },
      { id: id(), name: "Adoption", target: "Most pilot users choose to use it weekly", measure: "Usage data plus a short survey", status: "not-measured" },
      { id: id(), name: "Cost per task", target: "Below the cost of doing it by hand today", measure: "From actual usage and bills, not list prices", status: "not-measured" },
      { id: id(), name: "Safe failure", target: "When unsure, it hands off to a person; people only see data they're allowed to", measure: "Tricky and out-of-scope test cases, plus a privacy and security sign-off", status: "not-measured" },
    ],
    phases: [
      {
        id: id(),
        name: "Discover & frame",
        weeks: 2,
        goal: "Agree the problem, owner, baseline and exit criteria before building anything.",
        features: [
          { id: id(), title: "Map today's workflow", outcome: "Steps, time spent and pain points written down with the people who do the work", done: false },
          { id: id(), title: "Measure the baseline", outcome: "Two weeks of real numbers for the value metric", done: false },
          { id: id(), title: "Build the test set", outcome: "100+ real examples with agreed good answers", done: false },
        ],
      },
      {
        id: id(),
        name: "Build the pilot",
        weeks: pilotWeeks,
        goal: "Ship a thin, end-to-end version to a small group of real users, and improve it sprint by sprint against the test set.",
        features: [
          { id: id(), title: "Thin end-to-end slice", outcome: "Real users can use it for real work, with a person reviewing outputs", done: false },
          { id: id(), title: "Guardrails and hand-off", outcome: "It declines out-of-scope requests and hands tricky cases to a person", done: false },
          { id: id(), title: "Weekly evaluation", outcome: "Test-set results tracked every sprint", done: false },
        ],
      },
      {
        id: id(),
        name: "Measure & decide",
        weeks: 1,
        goal: "Compare results with the exit criteria and make a clear go, adjust or stop decision.",
        features: [{ id: id(), title: "Gate review", outcome: "Owner and sponsor decide go, adjust or stop based on the criteria", done: false }],
      },
      {
        id: id(),
        name: "Scale",
        weeks: 4,
        goal: "Integrate, train and roll out to everyone who does this work, with monitoring.",
        features: [
          { id: id(), title: "Production integration", outcome: "Runs inside the tools people already use, with support owners", done: false },
          { id: id(), title: "Training and rollout", outcome: "Users trained; usage and quality monitored", done: false },
        ],
      },
    ],
    risks: [
      { id: id(), risk: "Confident but wrong answers reach customers or decisions", category: "quality", likelihood: "medium", impact: "high", response: "Human review during the pilot; test set gates any wider rollout", roam: "open" },
      { id: id(), risk: "Sensitive data shared with the wrong tool or people", category: "privacy", likelihood: "medium", impact: "high", response: "Approved business AI tools only; permissions reviewed before launch", roam: "open" },
      { id: id(), risk: "People don't use it", category: "adoption", likelihood: "medium", impact: "medium", response: "Involve users from week one; fit it into their existing workflow", roam: "open" },
      { id: id(), risk: "Running costs higher than expected", category: "cost", likelihood: "low", impact: "medium", response: "Track cost per task from the first sprint", roam: "open" },
      { id: id(), risk: "Locked into one vendor or model", category: "vendor", likelihood: "low", impact: "medium", response: "Keep the test set and prompts portable; review options at the gate", roam: "open" },
    ],
    evalPlan: { testSet: "Real, recent examples of the work, including hard and unusual cases", size: 100, labeling: "The people who do the work agree what a good answer is", cadence: "Run every sprint and before every change goes live" },
    firstSteps: [
      { id: id(), text: "Name the business owner and the pilot team", done: false },
      { id: id(), text: "Sit with two people who do this work and map their steps", done: false },
      { id: id(), text: "Start measuring the baseline for the value metric", done: false },
      { id: id(), text: "Collect the first 30 real examples for the test set", done: false },
      { id: id(), text: "Check which AI tools and data you're allowed to use", done: false },
    ],
    brief: `We propose a ${inputs.weeks}-week pilot of AI for: ${useCase}. Success is decided by agreed exit criteria (quality on a fixed test set, cost per task, safe failure, permissions, adoption) and a named owner. We start small with real users and human review, measure against a baseline, and decide go, adjust or stop at the gate before investing in scale.`,
  };
}

const STATUSES = ["not-measured", "on-track", "met", "missed"] as const;
const ROAMS = ["open", "resolved", "owned", "accepted", "mitigated"] as const;

/**
 * Turns a plan (drafted by AI, or loaded from storage) into a complete, safe
 * Plan: every field present, numbers in range, and ids, statuses and ticks
 * kept when valid. With `fill`, lists that came back too short (an AI draft)
 * are filled from the template; without it (a saved plan), the user's edits stand.
 */
export function cleanPlan(raw: unknown, inputs: Inputs, id: IdFn, fill = true): Plan {
  const base = templatePlan(inputs, id);
  const keepId = (x: Record<string, unknown>) => (typeof x.id === "string" && x.id ? x.id.slice(0, 64) : id());
  const r = (raw ?? {}) as Record<string, unknown>;
  const v = (r.value ?? {}) as Record<string, unknown>;
  const arr = (x: unknown) => (Array.isArray(x) ? x : []);

  const readiness = AREAS.map((a) => {
    const found = arr(r.readiness).find((x) => (x as { area?: string })?.area === a.id) as Record<string, unknown> | undefined;
    return { area: a.id as AreaId, score: int(found?.score, 1, 5, 3), note: str(found?.note, 240, a.hint), gap: str(found?.gap, 240) };
  });
  const exitCriteria = arr(r.exitCriteria)
    .slice(0, 15)
    .map((c) => c as Record<string, unknown>)
    .filter((c) => str(c.name, 80))
    .map((c) => ({ id: keepId(c), name: str(c.name, 80), target: str(c.target, 200, "Agree a target"), measure: str(c.measure, 200, "Agree how to measure"), status: (STATUSES as readonly string[]).includes(c.status as string) ? (c.status as (typeof STATUSES)[number]) : "not-measured" }));
  const phases = arr(r.phases)
    .slice(0, 6)
    .map((p) => p as Record<string, unknown>)
    .filter((p) => str(p.name, 60))
    .map((p) => ({
      id: keepId(p),
      name: str(p.name, 60),
      weeks: int(p.weeks, 1, 26, 2),
      goal: str(p.goal, 300),
      features: arr(p.features)
        .slice(0, 8)
        .map((f) => f as Record<string, unknown>)
        .filter((f) => str(f.title, 100))
        .map((f) => ({ id: keepId(f), title: str(f.title, 100), outcome: str(f.outcome, 240), done: f.done === true })),
    }));
  const risks = arr(r.risks)
    .slice(0, 10)
    .map((x) => x as Record<string, unknown>)
    .filter((x) => str(x.risk, 200))
    .map((x) => ({
      id: keepId(x),
      risk: str(x.risk, 200),
      category: (RISK_CATEGORIES as readonly string[]).includes(x.category as string) ? (x.category as (typeof RISK_CATEGORIES)[number]) : "other",
      likelihood: level(x.likelihood),
      impact: level(x.impact),
      response: str(x.response, 240),
      roam: (ROAMS as readonly string[]).includes(x.roam as string) ? (x.roam as Roam) : "open",
    }));
  const e = (r.evalPlan ?? {}) as Record<string, unknown>;
  // AI drafts send plain strings; saved plans send {id, text, done}.
  const firstSteps = arr(r.firstSteps)
    .slice(0, 12)
    .map((s) => (typeof s === "string" ? { text: s } : (s as Record<string, unknown>)))
    .filter((s) => str(s?.text, 200))
    .map((s) => ({ id: keepId(s), text: str(s.text, 200), done: s.done === true }));

  return {
    title: str(r.title, 90, base.title),
    problem: str(r.problem, 600, base.problem),
    value: { metric: str(v.metric, 160, base.value.metric), baseline: str(v.baseline, 160, base.value.baseline), target: str(v.target, 160, base.value.target), owner: str(v.owner, 100, base.value.owner) },
    users: str(r.users, 200, base.users),
    readiness,
    exitCriteria: !fill || exitCriteria.length >= 3 ? exitCriteria : base.exitCriteria,
    phases: !fill || phases.length >= 1 ? phases : base.phases,
    risks: !fill || risks.length >= 2 ? risks : base.risks,
    evalPlan: { testSet: str(e.testSet, 240, base.evalPlan.testSet), size: int(e.size, 10, 5000, base.evalPlan.size), labeling: str(e.labeling, 240, base.evalPlan.labeling), cadence: str(e.cadence, 200, base.evalPlan.cadence) },
    firstSteps: !fill || firstSteps.length >= 2 ? firstSteps : base.firstSteps,
    brief: str(r.brief, 1500, base.brief),
  };
}
