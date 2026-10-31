/**
 * Governwise: a free AI governance starter kit. Every rating comes from fixed,
 * readable rules (no AI), so an organization can see exactly why a tool was
 * approved, limited or not allowed, and defend it to its leadership or board.
 */

export const ORG_TYPES = ["Business", "Nonprofit", "Church or ministry"] as const;
export type OrgType = (typeof ORG_TYPES)[number];
export const SIZES = ["1–10", "11–50", "51–250", "250+"] as const;

export const DATA_KINDS = [
  { id: "customers", label: "Customer, member or client personal details" },
  { id: "employees", label: "Staff or volunteer records" },
  { id: "donors", label: "Donor or giving records" },
  { id: "financial", label: "Payment, bank or financial account details" },
  { id: "health", label: "Health, counseling or care notes" },
  { id: "children", label: "Information about children" },
  { id: "confidential", label: "Confidential business information (contracts, pricing, strategy)" },
] as const;
export type DataKind = (typeof DATA_KINDS)[number]["id"];

export const PLANS = [
  { id: "free", label: "Free or personal account" },
  { id: "paid-personal", label: "Paid, but bought by an individual" },
  { id: "business", label: "Business, team or enterprise plan" },
] as const;
export type Plan = (typeof PLANS)[number]["id"];

export const SENSITIVITY = [
  { id: "public", label: "Public only", hint: "Things already on your website or meant to be shared" },
  { id: "internal", label: "Internal", hint: "Everyday work: drafts, notes, plans, no personal details" },
  { id: "personal", label: "Personal", hint: "Names, contact details or records about real people" },
  { id: "sensitive", label: "Sensitive", hint: "Health, financial, children's or confidential information" },
] as const;
export type Sensitivity = (typeof SENSITIVITY)[number]["id"];

export type Answer = "yes" | "no" | "unsure";

export interface Tool {
  id: string;
  name: string;
  use: string;
  plan: Plan;
  data: Sensitivity;
  /** Used to make or inform decisions about people (hiring, eligibility, discipline, care). */
  aboutPeople: boolean;
  /** Is training on your data turned off (or contractually excluded)? */
  trainingOff: Answer;
  /** Does anyone outside the organization see its output directly (website chat, public posts)? */
  publicFacing: boolean;
}

export const CHECKS = [
  { id: "policy", label: "We have a written AI policy that staff have read." },
  { id: "owner", label: "One named person owns AI decisions and this register." },
  { id: "training", label: "Staff and volunteers know what they may and may not paste into AI tools." },
  { id: "accounts", label: "AI used with work information runs on business accounts, not personal ones." },
  { id: "review", label: "A person reviews AI output before it goes to customers, members or the public." },
  { id: "disclose", label: "We tell people when they're talking to or reading something from AI." },
  { id: "incidents", label: "Staff know who to tell if something goes wrong with AI (a leak, a harmful answer)." },
] as const;
export type CheckId = (typeof CHECKS)[number]["id"];

export interface Org {
  name: string;
  type: OrgType;
  size: (typeof SIZES)[number];
  owner: string;
  data: DataKind[];
  checks: Partial<Record<CheckId, Answer>>;
}

export type Tier = "approved" | "limited" | "not-allowed";
export const TIER_LABEL: Record<Tier, string> = { approved: "Approved", limited: "Approved with limits", "not-allowed": "Not allowed" };

export interface Rating {
  tier: Tier;
  /** Why it got this rating, in plain words. */
  reasons: string[];
  /** What has to be true to use it (or to move it up a tier). */
  conditions: string[];
}

const personalPlan = (p: Plan) => p !== "business";

/** The rules. Order matters: the strictest finding wins, and every finding adds its reason. */
export function rateTool(t: Tool): Rating {
  const reasons: string[] = [];
  const conditions: string[] = [];
  let tier: Tier = "approved";
  const raise = (to: Tier) => {
    const order: Tier[] = ["approved", "limited", "not-allowed"];
    if (order.indexOf(to) > order.indexOf(tier)) tier = to;
  };

  if (personalPlan(t.plan) && (t.data === "personal" || t.data === "sensitive")) {
    raise("not-allowed");
    reasons.push("Information about real people goes into a personal account, where no business agreement protects it.");
    conditions.push("Move this work to a business plan with a data agreement, or remove names and personal details first.");
  }
  if (t.plan === "business" && t.data === "sensitive") {
    raise("limited");
    reasons.push("Sensitive information is allowed only with the right agreement in place.");
    conditions.push("Confirm a signed data processing agreement, where the data is stored and how long it's kept.");
    conditions.push("Share only the minimum needed; remove identifiers where you can.");
  }
  if (t.trainingOff !== "yes" && t.data !== "public") {
    raise(t.plan === "business" ? "approved" : "limited");
    if (t.plan !== "business") {
      reasons.push(t.trainingOff === "no" ? "The provider may use what you type to train its models." : "It's not confirmed whether the provider trains on what you type.");
      conditions.push("Turn off model training in the tool's settings, or confirm your plan excludes it.");
    }
  }
  if (t.aboutPeople) {
    raise("limited");
    reasons.push("It informs decisions about people, where mistakes and bias cause real harm.");
    conditions.push("A person makes the final decision and checks the AI's input every time.");
    conditions.push("Keep a short record of how AI was used in each decision.");
  }
  if (t.publicFacing) {
    raise("limited");
    reasons.push("People outside your organization see what it produces.");
    conditions.push("A person reviews AI-made content before it's published.");
    conditions.push("For chat or answer tools: tell people they're talking to AI, offer a way to reach a person, and review a sample of answers each month.");
  }
  if (tier === "approved") reasons.push(t.data === "public" ? "Only public information goes in." : "Everyday work information on a business plan.");
  conditions.push("Follow the AI policy: check facts, and a person stays responsible for the result.");
  return { tier, reasons, conditions: [...new Set(conditions)] };
}

export interface Readiness {
  score: number;
  label: string;
  gaps: CheckId[];
}

export function readiness(org: Org, tools: Tool[]): Readiness {
  const answers = CHECKS.map((c) => (org.checks[c.id] ?? "no") === "yes");
  const registerDone = tools.length > 0 ? 1 : 0;
  const score = Math.round(((answers.filter(Boolean).length + registerDone) / (CHECKS.length + 1)) * 100);
  const label = score >= 80 ? "Well governed" : score >= 50 ? "On the way" : "Getting started";
  return { score, label, gaps: CHECKS.filter((c, i) => !answers[i]).map((c) => c.id) };
}

const ACTION_FOR_GAP: Record<CheckId, string> = {
  policy: "Adopt the AI policy in this kit, adjust it with your leadership, and ask every staff member to read it.",
  owner: "Name one person to own AI decisions and keep this register up to date.",
  training: "Run a short session on what's okay to paste into AI tools, using the policy's data rules.",
  accounts: "Move AI work that uses company information onto business accounts.",
  review: "Make a person's review required before AI output reaches customers, members or the public.",
  disclose: "Label AI-written public content and AI chat tools clearly.",
  incidents: "Tell staff who to contact if AI leaks information or gives a harmful answer.",
};

const DATA_NOTES: Partial<Record<DataKind, string>> = {
  health: "Health, counseling and care notes may be covered by privacy laws such as HIPAA. Keep them out of AI tools unless your advisor confirms the tool and agreement qualify.",
  children: "Information about children needs extra care: keep it out of AI tools unless there's a clear, approved reason and the right agreement.",
  financial: "Never paste full card, bank or account numbers into AI tools.",
  donors: "Treat donor and giving records as personal information: no personal accounts, and only the minimum needed.",
  employees: "Staff and volunteer records are personal information; decisions about people always stay with a person.",
};

export interface Summary {
  counts: Record<Tier, number>;
  rated: { tool: Tool; rating: Rating }[];
  actions: string[];
  dataNotes: string[];
  readiness: Readiness;
}

export function summarize(org: Org, tools: Tool[]): Summary {
  const rated = tools.map((tool) => ({ tool, rating: rateTool(tool) }));
  const order: Tier[] = ["not-allowed", "limited", "approved"];
  rated.sort((a, b) => order.indexOf(a.rating.tier) - order.indexOf(b.rating.tier));
  const counts = { approved: 0, limited: 0, "not-allowed": 0 } as Record<Tier, number>;
  rated.forEach((r) => (counts[r.rating.tier] += 1));
  const r = readiness(org, tools);
  const actions: string[] = [];
  rated.filter((x) => x.rating.tier === "not-allowed").forEach((x) => actions.push(`Stop using ${x.tool.name || "this tool"} for ${x.tool.use || "this work"} until it's on a business plan or the personal details are removed.`));
  r.gaps.forEach((g) => actions.push(ACTION_FOR_GAP[g]));
  if (!tools.length) actions.unshift("List every AI tool your people use, including free ones on personal phones. Ask; don't assume.");
  actions.push("Review this register and policy again in six months, or whenever a new AI tool comes in.");
  return { counts, rated, actions, dataNotes: org.data.map((d) => DATA_NOTES[d]).filter((x): x is string => !!x), readiness: r };
}

const bullet = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");

/** A plain-English AI policy built from the organization's answers. */
export function policyMarkdown(org: Org, tools: Tool[], today = new Date()): string {
  const s = summarize(org, tools);
  const name = org.name.trim() || "Our organization";
  const owner = org.owner.trim() || "[name and role]";
  const review = new Date(today);
  review.setMonth(review.getMonth() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const people = org.type === "Church or ministry" ? "members, guests and the people we serve" : org.type === "Nonprofit" ? "clients, donors and the people we serve" : "customers and clients";
  const byTier = (t: Tier) => s.rated.filter((x) => x.rating.tier === t);
  const toolLine = (x: { tool: Tool; rating: Rating }) => `${x.tool.name || "Unnamed tool"}${x.tool.use ? ` (for ${x.tool.use})` : ""}`;

  return `# ${name} AI policy

Adopted: ${fmt(today)} · Owner: ${owner} · Next review: ${fmt(review)}

## Why we have this policy
AI tools can save our team real time. This policy lets us use them confidently while protecting our ${people}, our staff and our reputation. A person always stays responsible for the work, whether or not AI helped.

## Approved tools
${byTier("approved").length ? bullet(byTier("approved").map(toolLine)) : "- None yet. Ask " + owner + " before using an AI tool for work."}

## Approved with limits
${byTier("limited").length ? byTier("limited").map((x) => `- ${toolLine(x)}\n${x.rating.conditions.slice(0, -1).map((c) => `    - ${c}`).join("\n")}`).join("\n") : "- None."}

## Not allowed
${byTier("not-allowed").length ? bullet(byTier("not-allowed").map((x) => `${toolLine(x)}: ${x.rating.reasons[0]}`)) : "- No tools are currently ruled out."}
- Any AI tool not listed here, for work information, until ${owner} has reviewed it.

## What you may put into AI tools
- Yes: public information, and everyday work content without personal details.
- Only in approved business tools: names, contact details and records about real people, and only the minimum needed.
- Never: passwords, full card or bank numbers, or anything you've been told is confidential, unless ${owner} has approved it in writing.
${s.dataNotes.length ? bullet(s.dataNotes) + "\n" : ""}
## Using what AI produces
- Check facts, numbers, names and quotes before anything leaves your hands. AI can be confidently wrong.
- You are responsible for anything you send, publish or decide, even if AI drafted it.
- Decisions about people (hiring, eligibility, discipline, care) are made by people. AI may help prepare, never decide.
- Tell people when they're talking to an AI tool or reading something mostly written by AI.

## New tools and questions
Ask ${owner} before using a new AI tool for work. Add it to the AI register with what it's used for and what information goes in.

## If something goes wrong
If personal or confidential information was shared by mistake, or AI produced something harmful, tell ${owner} the same day. Mistakes reported quickly are much easier to fix.

---
This policy is practical guidance, not legal advice. Check laws that apply to your organization with a qualified advisor.
`;
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function registerCsv(tools: Tool[]): string {
  const head = ["Tool", "Used for", "Plan", "Information that goes in", "Informs decisions about people", "Public-facing", "Training off", "Rating", "Why", "Conditions"];
  const rows = tools.map((t) => {
    const r = rateTool(t);
    return [t.name, t.use, PLANS.find((p) => p.id === t.plan)!.label, SENSITIVITY.find((s) => s.id === t.data)!.label, t.aboutPeople ? "Yes" : "No", t.publicFacing ? "Yes" : "No", t.trainingOff, TIER_LABEL[r.tier], r.reasons.join(" "), r.conditions.join(" ")];
  });
  return [head, ...rows].map((r) => r.map((c) => csvCell(String(c))).join(",")).join("\n");
}

export const COMMON_TOOLS = ["ChatGPT", "Claude", "Microsoft Copilot", "Google Gemini", "Grammarly", "Otter.ai", "Zoom AI Companion", "Canva AI", "Notion AI", "Meeting note-taker"];

export const newTool = (name = ""): Tool => ({ id: Math.random().toString(36).slice(2, 10), name, use: "", plan: "free", data: "internal", aboutPeople: false, trainingOff: "unsure", publicFacing: false });

export const blankOrg = (): Org => ({ name: "", type: "Business", size: "11–50", owner: "", data: [], checks: {} });

export function sampleKit(): { org: Org; tools: Tool[] } {
  return {
    org: { name: "Riverside Community Services", type: "Nonprofit", size: "11–50", owner: "Dana Lopez, Operations Director", data: ["customers", "donors", "employees", "health"], checks: { owner: "yes", review: "yes", accounts: "no", policy: "no", training: "unsure" } },
    tools: [
      { id: "s1", name: "ChatGPT", use: "drafting donor thank-you letters", plan: "free", data: "personal", aboutPeople: false, trainingOff: "unsure", publicFacing: false },
      { id: "s2", name: "Microsoft Copilot", use: "summarizing internal meetings", plan: "business", data: "internal", aboutPeople: false, trainingOff: "yes", publicFacing: false },
      { id: "s3", name: "Claude", use: "screening volunteer applications", plan: "business", data: "personal", aboutPeople: true, trainingOff: "yes", publicFacing: false },
      { id: "s4", name: "Canva AI", use: "social media graphics", plan: "paid-personal", data: "public", aboutPeople: false, trainingOff: "unsure", publicFacing: true },
    ],
  };
}
