/**
 * Culturewise: a quick AI culture check. Leaders rate each department on
 * twelve statements; the scores place each department on a culture map
 * (pace of change × trust and safety) and give an AI rollout style for each.
 * Fixed, readable rules: no AI, nothing leaves the browser.
 */

export type DimensionId = "pace" | "safety" | "trust" | "voice";
export type Rating = 1 | 2 | 3 | 4 | 5;
export type AiUse = "none" | "hidden" | "some" | "open";
export type CultureType = "explorer" | "sprinter" | "builder" | "guarded";

export interface Dimension {
  id: DimensionId;
  name: string;
  /** What a low and a high score look like, in a few words. */
  low: string;
  high: string;
  statements: { id: string; text: string }[];
  /** Advice when this dimension is the department's lowest. */
  fix: { adkar: string; text: string };
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "pace",
    name: "Pace of change",
    low: "Careful, waits for proof",
    high: "Tries new things quickly",
    statements: [
      { id: "pace1", text: "When a new tool or idea comes along, people here try it rather than wait." },
      { id: "pace2", text: "People are comfortable changing how they work." },
      { id: "pace3", text: "Approvals and rules rarely slow a good idea down." },
    ],
    fix: { adkar: "Knowledge", text: "Lead with proof: a small, safe pilot with a clear measure, and show the results before asking for more." },
  },
  {
    id: "safety",
    name: "Safety to learn",
    low: "Mistakes are blamed",
    high: "Mistakes are lessons",
    statements: [
      { id: "safety1", text: "When something goes wrong, we look for the lesson, not someone to blame." },
      { id: "safety2", text: "People can say \"I don't know\" or admit a mistake without fear." },
      { id: "safety3", text: "People feel safe to question a decision, even one from leaders." },
    ],
    fix: { adkar: "Ability", text: "Make it safe to practice: protected time to try AI on low-stakes work, and leaders who share their own early mistakes." },
  },
  {
    id: "trust",
    name: "Trust in leaders",
    low: "Changes feel imposed",
    high: "People trust the why",
    statements: [
      { id: "trust1", text: "People believe leaders explain the real reasons behind changes." },
      { id: "trust2", text: "When leaders announce something, people expect them to follow through." },
      { id: "trust3", text: "People trust that new technology won't be used against them." },
    ],
    fix: { adkar: "Awareness", text: "Start with the why, from the top: what AI is for, what it is not for (like cutting jobs or watching people), and who sees the data." },
  },
  {
    id: "voice",
    name: "Voice and sharing",
    low: "Decided at the top, kept in silos",
    high: "Shaped together, shared openly",
    statements: [
      { id: "voice1", text: "The people who do the work help decide how it's done." },
      { id: "voice2", text: "Teams share what works with other teams." },
      { id: "voice3", text: "Information flows freely; people don't keep it to themselves." },
    ],
    fix: { adkar: "Desire", text: "Involve people early: ask each team where AI could help them, and name champions who share what works." },
  },
];

/** A dimension scoring below this (out of 100) is flagged as a weak spot. */
export const WEAK_BELOW = 60;

export const STATEMENT_COUNT =DIMENSIONS.reduce((n, d) => n + d.statements.length, 0);

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
    tagline: "Moves fast and trusts each other",
    leadWith: "Quick wins with light guardrails. Give them approved tools, a short policy and room to experiment, then share what works.",
    watch: "Running ahead of governance. Keep an AI register so the experiments stay visible.",
    color: "#53cfa0",
  },
  sprinter: {
    name: "Sprinter",
    tagline: "Moves fast, but doesn't feel safe",
    leadWith: "Make the safe way the easy way. Approve good tools quickly, explain the rules plainly and don't punish people for what they used before.",
    watch: "Shadow AI. People will use AI anyway, quietly, if the approved path feels risky or slow.",
    color: "#f2b54b",
  },
  builder: {
    name: "Builder",
    tagline: "Careful, with a solid base of trust",
    leadWith: "Governance first, then a well-run pilot. Show the policy, the safeguards and the results; this culture moves once it sees proof.",
    watch: "Waiting for perfect. Set a date for the first pilot so careful doesn't become never.",
    color: "#5cb8e6",
  },
  guarded: {
    name: "Guarded",
    tagline: "Careful, and wary of change",
    leadWith: "Listen first. Hold listening sessions, have a visible sponsor explain the why, and start with one small tool that removes a chore people dislike.",
    watch: "Rumors and quiet resistance. Say early and often what AI won't be used for.",
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
  /** 0–100: the average of safety and trust, the map's vertical axis. */
  trustSafety: number | null;
  type: CultureType | null;
  lowest: Dimension | null;
  aiUse?: AiUse;
}

let counter = 0;
export const newDepartment = (name = ""): Department => ({ id: `d${Date.now().toString(36)}${(counter++).toString(36)}`, name, answers: {} });

/** A 1–5 rating to 0–100: 1 → 0, 3 → 50, 5 → 100. */
const toPct = (avg: number) => Math.round(((avg - 1) / 4) * 100);

export function scoreDimension(d: Dimension, answers: Record<string, Rating>): number | null {
  const vals = d.statements.map((s) => answers[s.id]).filter((v): v is Rating => typeof v === "number");
  if (!vals.length) return null;
  return toPct(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/** Place a department on the map: pace across, trust-and-safety up. 50 and above counts as high. */
export function cultureType(pace: number, trustSafety: number): CultureType {
  const fast = pace >= 50;
  const safe = trustSafety >= 50;
  if (fast && safe) return "explorer";
  if (fast) return "sprinter";
  if (safe) return "builder";
  return "guarded";
}

export function scoreDepartment(dept: Department): DeptResult {
  const scores = Object.fromEntries(DIMENSIONS.map((d) => [d.id, scoreDimension(d, dept.answers)])) as Record<DimensionId, number | null>;
  const answered = Object.keys(dept.answers).filter((k) => DIMENSIONS.some((d) => d.statements.some((s) => s.id === k))).length;
  const complete = answered === STATEMENT_COUNT;
  const trustSafety = scores.safety !== null && scores.trust !== null ? Math.round((scores.safety + scores.trust) / 2) : null;
  const type = complete && scores.pace !== null && trustSafety !== null ? cultureType(scores.pace, trustSafety) : null;
  let lowest: Dimension | null = null;
  if (complete) {
    // Ties go to the earlier dimension in ADKAR order (trust → Awareness first).
    const order: DimensionId[] = ["trust", "voice", "pace", "safety"];
    for (const id of order) {
      const d = DIMENSIONS.find((x) => x.id === id)!;
      if (!lowest || scores[id]! < scores[lowest.id]!) lowest = d;
    }
    // Only call it a weak spot when it's below 60 out of 100.
    if (lowest && scores[lowest.id]! >= WEAK_BELOW) lowest = null;
  }
  return { id: dept.id, name: dept.name.trim() || "Unnamed department", answered, complete, scores, trustSafety, type, lowest, aiUse: dept.aiUse };
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
    lines.push(`  Scores out of 100: ${DIMENSIONS.map((d) => `${d.name} ${r.scores[d.id]}`).join(" · ")}`);
    lines.push(`  Lead with: ${t.leadWith}`);
    lines.push(`  Watch for: ${t.watch}`);
    if (r.lowest) lines.push(`  Weakest area: ${r.lowest.name} (ADKAR: ${r.lowest.fix.adkar}). ${r.lowest.fix.text}`);
    if (r.aiUse === "hidden") lines.push("  AI today: used quietly on personal accounts. Bring it into the open with an AI register and policy.");
    lines.push("");
  }
  const gap = biggestGap(results);
  if (gap) lines.push(`Biggest difference: ${gap.dimension.name}. ${gap.high.name} scores ${gap.high.scores[gap.dimension.id]}, ${gap.low.name} scores ${gap.low.scores[gap.dimension.id]}. Plan different rollouts for each.`, "");
  lines.push("This is a conversation starter, not a diagnosis. Compare it with what people tell you.");
  return lines.join("\n");
}

/** An example organization so first-time visitors can see a finished result. */
export function sampleOrg(): { orgName: string; departments: Department[] } {
  const fill = (vals: Record<DimensionId, Rating[]>): Record<string, Rating> =>
    Object.fromEntries(DIMENSIONS.flatMap((d) => d.statements.map((s, i) => [s.id, vals[d.id][i]])));
  return {
    orgName: "Riverside Community Services",
    departments: [
      { ...newDepartment("Programs"), answers: fill({ pace: [4, 4, 3], safety: [4, 5, 4], trust: [4, 4, 3], voice: [5, 4, 4] }), aiUse: "some" },
      { ...newDepartment("Finance"), answers: fill({ pace: [2, 2, 1], safety: [3, 4, 3], trust: [4, 4, 3], voice: [3, 2, 3] }), aiUse: "none" },
      { ...newDepartment("Development"), answers: fill({ pace: [5, 4, 4], safety: [2, 2, 3], trust: [2, 3, 2], voice: [3, 3, 2] }), aiUse: "hidden" },
    ],
  };
}
