/**
 * Culturewise: a quick AI culture check built on two published, tested
 * questionnaires, rated for each team:
 *  - ORIC, Organizational Readiness for Implementing Change (Shea et al.,
 *    2014): change commitment (5 items) and change efficacy (7 items).
 *    Open access under CC BY 2.0; "this change" is adapted to "bringing AI
 *    into their work", as ORIC's own adaptations name the change.
 *  - Edmondson's team psychological safety scale (1999): 7 items, items
 *    1, 3 and 5 reverse scored.
 * Both are rated 1 to 5 here. Readiness (all 12 ORIC items) and safety place
 * each team on the culture map. The scales don't publish cutoffs, so the map
 * splits at the scale's neutral midpoint. Nothing leaves the browser.
 */

export type DimensionId = "commitment" | "efficacy" | "safety";
export type Rating = 1 | 2 | 3 | 4 | 5;
export type AiUse = "none" | "hidden" | "some" | "open";
export type CultureType = "explorer" | "sprinter" | "builder" | "guarded";

export interface Statement {
  id: string;
  text: string;
  /** Reverse scored: agreeing means less of what the scale measures. */
  reverse?: boolean;
}

export interface Dimension {
  id: DimensionId;
  name: string;
  /** What it measures, in a few plain words. */
  measures: string;
  /** The published questionnaire it comes from. */
  source: string;
  statements: Statement[];
  /** Advice when this is the team's weakest area. */
  fix: { adkar: string; text: string };
}

const AI = "bringing AI into their work";

export const DIMENSIONS: Dimension[] = [
  {
    id: "commitment",
    name: "Commitment",
    measures: "Do people want to bring AI into their work?",
    source: "ORIC change commitment (Shea et al., 2014)",
    statements: [
      { id: "c1", text: `People who work here are committed to ${AI}.` },
      { id: "c2", text: `People who work here will do whatever it takes to succeed at ${AI}.` },
      { id: "c3", text: `People who work here want to succeed at ${AI}.` },
      { id: "c4", text: `People who work here are determined to succeed at ${AI}.` },
      { id: "c5", text: `People who work here are motivated to succeed at ${AI}.` },
    ],
    fix: { adkar: "Desire", text: "Build the want before the how: explain why AI matters for this team, what it is not for, and what's in it for each person. Involve people in choosing the first uses." },
  },
  {
    id: "efficacy",
    name: "Confidence",
    measures: "Do people believe they can make it work?",
    source: "ORIC change efficacy (Shea et al., 2014)",
    statements: [
      { id: "e1", text: `People who work here feel confident that the organization can get people invested in ${AI}.` },
      { id: "e2", text: `People who work here feel confident that they can keep track of progress in ${AI}.` },
      { id: "e3", text: `People who work here feel confident that the organization can support people as they adjust to ${AI}.` },
      { id: "e4", text: `People who work here feel confident that they can keep the momentum going in ${AI}.` },
      { id: "e5", text: `People who work here feel confident that they can handle the challenges that might arise in ${AI}.` },
      { id: "e6", text: `People who work here feel confident that they can coordinate tasks so that ${AI} goes smoothly.` },
      { id: "e7", text: `People who work here feel confident that they can manage the politics of ${AI}.` },
    ],
    fix: { adkar: "Knowledge and Ability", text: "Build confidence with a plan people can see: role-based training, a named person to ask, time to practice, and a small pilot with a clear measure." },
  },
  {
    id: "safety",
    name: "Psychological safety",
    measures: "Is it safe to try, ask and admit mistakes?",
    source: "Edmondson team psychological safety scale (1999)",
    statements: [
      { id: "s1", text: "If you make a mistake on this team, it is often held against you.", reverse: true },
      { id: "s2", text: "Members of this team are able to bring up problems and tough issues." },
      { id: "s3", text: "People on this team sometimes reject others for being different.", reverse: true },
      { id: "s4", text: "It is safe to take a risk on this team." },
      { id: "s5", text: "It is difficult to ask other members of this team for help.", reverse: true },
      { id: "s6", text: "No one on this team would deliberately act in a way that undermines my efforts." },
      { id: "s7", text: "Working with members of this team, my unique skills and talents are valued and utilized." },
    ],
    fix: { adkar: "Ability", text: "Make it safe to learn in the open: leaders share their own AI mistakes, early tries are low-stakes, and questions are welcomed, not judged." },
  },
];

/** A dimension scoring below this (out of 100) is flagged as a weak spot. */
export const WEAK_BELOW = 60;

export const STATEMENT_COUNT = DIMENSIONS.reduce((n, d) => n + d.statements.length, 0);

export const RATING_LABELS: Record<Rating, string> = { 1: "Strongly disagree", 2: "Disagree", 3: "Neutral", 4: "Agree", 5: "Strongly agree" };

export const AI_USE: { id: AiUse; label: string }[] = [
  { id: "none", label: "Not at all, as far as we know" },
  { id: "hidden", label: "Quietly, on personal accounts" },
  { id: "some", label: "Openly, with a few approved tools" },
  { id: "open", label: "Widely, with clear rules" },
];

export const TYPES: Record<CultureType, { name: string; tagline: string; leadWith: string; watch: string; color: string }> = {
  explorer: {
    name: "Explorer",
    tagline: "Ready for AI, and safe to learn",
    leadWith: "Quick wins with light guardrails. Give them approved tools, a short policy and room to experiment, then share what works.",
    watch: "Running ahead of governance. Keep an AI register so the experiments stay visible.",
    color: "#53cfa0",
  },
  sprinter: {
    name: "Sprinter",
    tagline: "Ready for AI, but mistakes feel risky",
    leadWith: "Make it safe to try. Leaders go first and share what didn't work, early uses are low-stakes, and the approved tools are easier than the workarounds.",
    watch: "Hidden use and hidden mistakes. People will use AI quietly and won't flag when it gets things wrong.",
    color: "#f2b54b",
  },
  builder: {
    name: "Builder",
    tagline: "Safe to learn, not yet ready for AI",
    leadWith: "Show the why, then build confidence. A clear reason, a visible plan, training and one well-run pilot with results they can see.",
    watch: "Polite agreement without action. Set a date for the first pilot so open minds turn into real use.",
    color: "#5cb8e6",
  },
  guarded: {
    name: "Guarded",
    tagline: "Not yet ready, and not yet safe",
    leadWith: "Listen first. Hold listening sessions, have a visible sponsor explain the why and what AI won't be used for, and start with one small tool that removes a chore people dislike.",
    watch: "Rumors and quiet resistance. Fix safety before pushing the tools.",
    color: "#e8826b",
  },
};

export interface Department {
  id: string;
  name: string;
  /** Statement id → rating. Unanswered statements are missing. */
  answers: Record<string, Rating>;
  aiUse?: AiUse;
}

export interface DeptResult {
  id: string;
  name: string;
  answered: number;
  complete: boolean;
  /** 0–100 per dimension, null if none of its statements are answered. */
  scores: Record<DimensionId, number | null>;
  /** 0–100: all 12 ORIC items (commitment and confidence), the map's horizontal axis. */
  readiness: number | null;
  type: CultureType | null;
  lowest: Dimension | null;
  aiUse?: AiUse;
}

let counter = 0;
export const newDepartment = (name = ""): Department => ({ id: `d${Date.now().toString(36)}${(counter++).toString(36)}`, name, answers: {} });

/** A 1–5 rating to 0–100: 1 → 0, 3 → 50, 5 → 100. */
const toPct = (avg: number) => Math.round(((avg - 1) / 4) * 100);

/** A rating with reverse-scored items flipped (1 ↔ 5), so higher always means more. */
const scored = (s: Statement, r: Rating) => (s.reverse ? 6 - r : r);

/** Mean of the answered items, on 0–100. */
function meanPct(statements: Statement[], answers: Record<string, Rating>): number | null {
  const vals = statements.filter((s) => typeof answers[s.id] === "number").map((s) => scored(s, answers[s.id]));
  if (!vals.length) return null;
  return toPct(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export const scoreDimension = (d: Dimension, answers: Record<string, Rating>) => meanPct(d.statements, answers);

/** Place a team on the map: readiness across, psychological safety up. The scale's neutral midpoint (50) and above counts as high. */
export function cultureType(readiness: number, safety: number): CultureType {
  const ready = readiness >= 50;
  const safe = safety >= 50;
  if (ready && safe) return "explorer";
  if (ready) return "sprinter";
  if (safe) return "builder";
  return "guarded";
}

export function scoreDepartment(dept: Department): DeptResult {
  const scores = Object.fromEntries(DIMENSIONS.map((d) => [d.id, scoreDimension(d, dept.answers)])) as Record<DimensionId, number | null>;
  const answered = Object.keys(dept.answers).filter((k) => DIMENSIONS.some((d) => d.statements.some((s) => s.id === k))).length;
  const complete = answered === STATEMENT_COUNT;
  const oric = DIMENSIONS.filter((d) => d.id !== "safety").flatMap((d) => d.statements);
  const readiness = meanPct(oric, dept.answers);
  const type = complete && readiness !== null && scores.safety !== null ? cultureType(readiness, scores.safety) : null;
  let lowest: Dimension | null = null;
  if (complete) {
    // Ties go to the earlier dimension in ADKAR order (Desire before Knowledge and Ability).
    const order: DimensionId[] = ["commitment", "efficacy", "safety"];
    for (const id of order) {
      const d = DIMENSIONS.find((x) => x.id === id)!;
      if (!lowest || scores[id]! < scores[lowest.id]!) lowest = d;
    }
    // Only call it a weak spot when it's below 60 out of 100.
    if (lowest && scores[lowest.id]! >= WEAK_BELOW) lowest = null;
  }
  return { id: dept.id, name: dept.name.trim() || "Unnamed department", answered, complete, scores, readiness, type, lowest, aiUse: dept.aiUse };
}

export interface Comparison {
  dimension: Dimension;
  gap: number;
  high: DeptResult;
  low: DeptResult;
}

/** The dimension where completed departments differ most, if at least two are complete and the gap is meaningful. */
export function biggestGap(results: DeptResult[]): Comparison | null {
  const done = results.filter((r) => r.complete);
  if (done.length < 2) return null;
  let best: Comparison | null = null;
  for (const d of DIMENSIONS) {
    const sorted = [...done].sort((a, b) => a.scores[d.id]! - b.scores[d.id]!);
    const low = sorted[0], high = sorted[sorted.length - 1];
    const gap = high.scores[d.id]! - low.scores[d.id]!;
    if (!best || gap > best.gap) best = { dimension: d, gap, high, low };
  }
  return best && best.gap >= 20 ? best : null;
}

/** A plain-text summary leaders can paste into an email or doc. */
export function summaryText(orgName: string, results: DeptResult[]): string {
  const done = results.filter((r) => r.complete);
  const lines = [`AI CULTURE CHECK: ${orgName.trim() || "Our organization"}`, `Made with Culturewise (growdaily.ai/apps/culturewise)`, ""];
  for (const r of done) {
    const t = TYPES[r.type!];
    lines.push(`${r.name}: ${t.name} (${t.tagline.toLowerCase()})`);
    lines.push(`  Scores out of 100: Readiness ${r.readiness} · ${DIMENSIONS.map((d) => `${d.name} ${r.scores[d.id]}`).join(" · ")}`);
    lines.push(`  Lead with: ${t.leadWith}`);
    lines.push(`  Watch for: ${t.watch}`);
    if (r.lowest) lines.push(`  Weakest area: ${r.lowest.name} (ADKAR: ${r.lowest.fix.adkar}). ${r.lowest.fix.text}`);
    if (r.aiUse === "hidden") lines.push("  AI today: used quietly on personal accounts. Bring it into the open with an AI register and policy.");
    lines.push("");
  }
  const gap = biggestGap(results);
  if (gap) lines.push(`Biggest difference: ${gap.dimension.name}. ${gap.high.name} scores ${gap.high.scores[gap.dimension.id]}, ${gap.low.name} scores ${gap.low.scores[gap.dimension.id]}. Plan different rollouts for each.`, "");
  lines.push("Built on ORIC (Shea et al., 2014, CC BY 2.0) and Edmondson's team psychological safety scale (1999). A conversation starter, not a diagnosis: compare it with what people tell you.");
  return lines.join("\n");
}

/** An example organization so first-time visitors can see a finished result. */
export function sampleOrg(): { orgName: string; departments: Department[] } {
  const fill = (vals: Record<DimensionId, Rating[]>): Record<string, Rating> =>
    Object.fromEntries(DIMENSIONS.flatMap((d) => d.statements.map((s, i) => [s.id, vals[d.id][i]])));
  return {
    orgName: "Riverside Community Services",
    departments: [
      // Ratings as a person would give them; safety items 1, 3 and 5 are reverse scored.
      { ...newDepartment("Programs"), answers: fill({ commitment: [4, 4, 5, 4, 4], efficacy: [4, 3, 4, 4, 4, 4, 3], safety: [2, 4, 1, 4, 2, 4, 4] }), aiUse: "some" },
      { ...newDepartment("Finance"), answers: fill({ commitment: [2, 2, 3, 2, 2], efficacy: [3, 2, 3, 2, 3, 3, 2], safety: [2, 4, 2, 3, 2, 4, 4] }), aiUse: "none" },
      { ...newDepartment("Development"), answers: fill({ commitment: [5, 4, 5, 5, 5], efficacy: [4, 3, 3, 4, 3, 4, 2], safety: [4, 2, 3, 2, 4, 3, 2] }), aiUse: "hidden" },
    ],
  };
}
