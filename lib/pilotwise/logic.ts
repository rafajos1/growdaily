import type { Pilot, Plan } from "./types";
import { AREAS } from "./types";

/** Readiness as 0–100: the average of the six 1–5 scores. */
export function readinessScore(plan: Plan): number {
  const scores = AREAS.map((a) => plan.readiness.find((r) => r.area === a.id)?.score ?? 1);
  const avg = scores.reduce((s, n) => s + n, 0) / scores.length;
  return Math.round(((avg - 1) / 4) * 100);
}

export function verdict(score: number, weakest: number): { label: string; tone: "good" | "warn" | "bad"; text: string } {
  if (score >= 70 && weakest >= 3) return { label: "Ready to pilot", tone: "good", text: "The basics are in place. Run the pilot against the exit criteria below." };
  if (score >= 45) return { label: "Fix the gaps first", tone: "warn", text: "Close the weakest areas before you commit a team, or the pilot will stall at the gate." };
  return { label: "Not ready yet", tone: "bad", text: "Start with discovery: sharpen the problem, find the data and agree how you'll measure success." };
}

/** Weakest readiness areas, lowest first. */
export function gaps(plan: Plan) {
  return [...plan.readiness].sort((a, b) => a.score - b.score).filter((r) => r.score <= 2);
}

/**
 * Up to three areas to fix before building, weakest first: any area scored 3
 * or below, with the plan's stated gap or, failing that, what good looks like.
 */
export function topGaps(plan: Plan, n = 3): { area: string; label: string; score: number; action: string }[] {
  return AREAS.map((a, i) => ({ a, i, r: plan.readiness.find((x) => x.area === a.id) }))
    .filter((x) => (x.r?.score ?? 1) <= 3)
    .sort((x, y) => (x.r?.score ?? 1) - (y.r?.score ?? 1) || x.i - y.i)
    .slice(0, n)
    .map(({ a, r }) => ({ area: a.id, label: a.label, score: r?.score ?? 1, action: r?.gap || a.hint }));
}

/** Where the go/no-go gate stands. */
export function gateStatus(plan: Plan): { met: number; total: number; missed: number; decision: "go" | "no-go" | "pending" } {
  const total = plan.exitCriteria.length;
  const met = plan.exitCriteria.filter((c) => c.status === "met").length;
  const missed = plan.exitCriteria.filter((c) => c.status === "missed").length;
  return { met, total, missed, decision: total > 0 && met === total ? "go" : missed > 0 ? "no-go" : "pending" };
}

export const totalWeeks = (plan: Plan) => plan.phases.reduce((s, p) => s + Math.max(0, p.weeks), 0);

/** The plan as Markdown, to paste into Confluence, Notion, a doc or an email. */
export function planMarkdown(p: Pilot): string {
  const { plan } = p;
  const score = readinessScore(plan);
  const lines = [
    `# ${plan.title}`,
    "",
    `**Readiness:** ${score}/100 (${verdict(score, Math.min(...plan.readiness.map((r) => r.score))).label})`,
    "",
    "## Problem",
    plan.problem,
    "",
    "## Value hypothesis",
    `- Metric: ${plan.value.metric}`,
    `- Baseline: ${plan.value.baseline}`,
    `- Target: ${plan.value.target}`,
    `- Owner: ${plan.value.owner}`,
    `- Users: ${plan.users}`,
    "",
    "## Readiness",
    ...AREAS.map((a) => {
      const r = plan.readiness.find((x) => x.area === a.id);
      return `- ${a.label}: ${r?.score ?? 1}/5. ${r?.note ?? ""}${r?.gap ? ` Gap: ${r.gap}` : ""}`;
    }),
    "",
    "## Go / no-go checks",
    "| Criterion | Target | How it's measured | Status |",
    "| --- | --- | --- | --- |",
    ...plan.exitCriteria.map((c) => `| ${c.name} | ${c.target} | ${c.measure} | ${c.status} |`),
    "",
    "## Delivery plan",
    ...plan.phases.flatMap((ph) => [`### ${ph.name} (${ph.weeks} wk)`, ph.goal, ...ph.features.map((f) => `- ${f.title}: ${f.outcome}`), ""]),
    "## Risks",
    "| Risk | Category | Likelihood | Impact | Response | Status |",
    "| --- | --- | --- | --- | --- | --- |",
    ...plan.risks.map((r) => `| ${r.risk} | ${r.category} | ${r.likelihood} | ${r.impact} | ${r.response} | ${r.roam} |`),
    "",
    "## How we'll test it",
    `- Test set: ${plan.evalPlan.testSet} (${plan.evalPlan.size} cases)`,
    `- Labeling: ${plan.evalPlan.labeling}`,
    `- Cadence: ${plan.evalPlan.cadence}`,
    "",
    "## First two weeks",
    ...plan.firstSteps.map((s) => `- [${s.done ? "x" : " "}] ${s.text}`),
    "",
    "## Brief for the sponsor",
    plan.brief,
  ];
  return lines.join("\n");
}

const csvCell = (s: string) => `"${s.replace(/"/g, '""')}"`;

/** Epics and features as CSV for Jira or Azure DevOps import. */
export function backlogCsv(plan: Plan): string {
  const rows = [["Issue Type", "Summary", "Description", "Epic"]];
  for (const ph of plan.phases) {
    rows.push(["Epic", `${plan.title}: ${ph.name}`, ph.goal, ""]);
    for (const f of ph.features) rows.push(["Story", f.title, f.outcome, `${plan.title}: ${ph.name}`]);
  }
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}
