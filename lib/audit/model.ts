/**
 * Governwise Audit: a consultant's AI governance audit workspace. The controls
 * are practical checks for organizations of any size, each mapped to a category
 * of the NIST AI Risk Management Framework (AI RMF 1.0). Everything is plain data
 * and pure functions, so scores and readiness checks are easy to test and explain.
 */

import type { DataKind, Tool } from "../governwise/logic";

export const FUNCTIONS = [
  { id: "govern", name: "Govern", blurb: "Policies, roles, training and accountability for AI." },
  { id: "map", name: "Map", blurb: "Knowing which AI is in use, for what, with what data and impact." },
  { id: "measure", name: "Measure", blurb: "Testing, reviewing and monitoring how AI performs." },
  { id: "manage", name: "Manage", blurb: "Acting on risks: human review, incidents, vendors and retirement." },
] as const;
export type FunctionId = (typeof FUNCTIONS)[number]["id"];

export type Severity = "high" | "medium" | "low";

export interface Control {
  id: string;
  fn: FunctionId;
  /** The NIST AI RMF category it maps to, e.g. "GOVERN 1". */
  rmf: string;
  title: string;
  /** What "met" looks like. */
  good: string;
  /** Evidence an auditor would expect to see. */
  evidence: string[];
  /** Default severity if it isn't met. */
  severity: Severity;
  /** Default recommendation for the finding. */
  fix: string;
}

export const CONTROLS: Control[] = [
  { id: "G1", fn: "govern", rmf: "GOVERN 1", title: "Written AI policy, approved by leadership", good: "A short AI policy covers approved tools, data rules, human review and who to ask, and leadership has formally approved it.", evidence: ["The AI policy document", "Approval record (minutes, email or signed page)"], severity: "high", fix: "Adopt a short AI policy and record leadership approval." },
  { id: "G2", fn: "govern", rmf: "GOVERN 2", title: "Named AI owner and clear roles", good: "One named person owns AI decisions and the AI register; responsibilities for approving tools and handling issues are written down.", evidence: ["Role description or assignment", "Policy section naming the owner"], severity: "high", fix: "Name an AI owner and write down who approves new AI tools." },
  { id: "G3", fn: "govern", rmf: "GOVERN 2", title: "Staff and volunteers trained on AI use", good: "Everyone who uses AI for work has had practical training on the policy and on what's safe to share.", evidence: ["Training materials", "Attendance or completion records"], severity: "medium", fix: "Run practical AI training on the policy and record attendance." },
  { id: "G4", fn: "govern", rmf: "GOVERN 1", title: "Policy and register reviewed on a schedule", good: "The policy and AI register have a review date at least every six months, and past reviews are recorded.", evidence: ["Review dates in the policy", "Notes from the last review"], severity: "medium", fix: "Set a six-month review date and keep a short record of each review." },
  { id: "G5", fn: "govern", rmf: "GOVERN 4", title: "Leaders informed about AI risk", good: "Leadership or the board receives a short AI update at least twice a year, including risks and incidents.", evidence: ["Board or leadership briefing", "Meeting minutes"], severity: "medium", fix: "Brief leadership on AI at least twice a year with a one-page summary." },
  { id: "G6", fn: "govern", rmf: "GOVERN 4", title: "Clear way to report AI problems", good: "Staff know who to tell if AI leaks information or produces something harmful, and reports are logged.", evidence: ["Policy section on reporting", "Incident or issue log"], severity: "medium", fix: "Tell staff who to contact about AI problems and start an issue log." },
  { id: "G7", fn: "govern", rmf: "GOVERN 6", title: "AI vendors checked before use", good: "Before approval, each AI vendor's data terms are reviewed: data processing agreement, retention, location, and whether customer data trains its models.", evidence: ["Vendor review notes", "Signed data processing agreements", "Screenshots of training/retention settings"], severity: "high", fix: "Review each AI vendor's data terms and keep the agreements on file." },

  { id: "M1", fn: "map", rmf: "MAP 1", title: "Complete AI register, including shadow AI", good: "Every AI tool and use is listed, including free tools on personal accounts and AI built into existing software, found by asking staff.", evidence: ["The AI register", "Staff survey results"], severity: "high", fix: "Survey staff without blame and build a complete AI register." },
  { id: "M2", fn: "map", rmf: "MAP 2", title: "Each AI use classified by risk", good: "Each use is rated (approved, approved with limits, not allowed) based on account type, data sensitivity and who is affected, with reasons recorded.", evidence: ["Ratings and reasons in the register"], severity: "high", fix: "Rate every AI use and record the reason for each rating." },
  { id: "M3", fn: "map", rmf: "MAP 3", title: "Purpose, benefits and limits documented", good: "For each significant AI use, the purpose, expected benefit and known limits are written down.", evidence: ["Use-case descriptions", "Pilot or business case notes"], severity: "low", fix: "Write a short purpose-and-limits note for each significant AI use." },
  { id: "M4", fn: "map", rmf: "MAP 4", title: "Data flows understood", good: "For each AI use, it's known what information goes in, where it's processed and stored, and which third parties see it.", evidence: ["Data flow notes or diagram", "Register column for data sensitivity"], severity: "high", fix: "Document what data each AI tool receives and where it goes." },
  { id: "M5", fn: "map", rmf: "MAP 5", title: "Impact on people assessed", good: "Uses that affect customers, members, staff or decisions about people have a short impact assessment, including fairness and harm.", evidence: ["Impact assessment notes"], severity: "medium", fix: "Assess impact on people for every AI use that affects them." },

  { id: "M6", fn: "map", rmf: "MAP 4", title: "AI agents and connectors inventoried", good: "Every AI agent, automation and connector is listed with what it can read, what it can do (send, pay, change, delete) and whose account it acts under.", evidence: ["Agent and connector list with permissions", "Admin console screenshots"], severity: "high", fix: "List every AI agent and connector with exactly what it can read and do." },

  { id: "ME1", fn: "measure", rmf: "MEASURE 2", title: "AI output checked before it goes out", good: "Facts, names, numbers and quotes in AI output are checked by a person before reaching customers, members or the public.", evidence: ["Review step in the policy or workflow", "Examples of reviewed output"], severity: "high", fix: "Require a person's review of AI output before it goes out." },
  { id: "ME2", fn: "measure", rmf: "MEASURE 2", title: "Tested before launch, including misuse", good: "Customer- or public-facing AI is tested before launch with real questions, hard questions and attempts to misuse it (such as prompt injection).", evidence: ["Test plan and results", "Sign-off before launch"], severity: "high", fix: "Test AI with real, hard and adversarial questions before launch and record sign-off." },
  { id: "ME3", fn: "measure", rmf: "MEASURE 2", title: "Bias tested where people are affected", good: "Where AI informs decisions about people or produces content about them, it's tested before launch and at least yearly: paired tests that swap only names, gender, age, ethnicity or language; outcome rates compared across groups (a selection-rate ratio below 0.8 is a warning sign to investigate); the data checked for who is missing; results, fixes and the person accountable recorded.", evidence: ["Bias test plan and results", "Outcome comparison by group", "Record of fixes and sign-off"], severity: "high", fix: "Run and record a bias test (paired swaps plus outcome rates by group) before launch and at least yearly, and fix what it finds." },
  { id: "ME4", fn: "measure", rmf: "MEASURE 2", title: "Security and access reviewed", good: "AI tools use business accounts with proper access control (ideally single sign-on), least-privilege access to data, and logging where available.", evidence: ["Account and access settings", "Admin console screenshots"], severity: "high", fix: "Move AI to business accounts with proper access controls and logging." },
  { id: "ME5", fn: "measure", rmf: "MEASURE 3", title: "AI monitored after launch", good: "A sample of AI outputs is reviewed on a schedule, and simple measures (errors, complaints, escalations) are tracked over time.", evidence: ["Monitoring log or dashboard", "Sample review notes"], severity: "medium", fix: "Review a sample of AI outputs each month and track simple quality measures." },
  { id: "ME6", fn: "measure", rmf: "MEASURE 3", title: "Users can give feedback on AI", good: "People using or affected by AI can easily report wrong or harmful results, and feedback is reviewed.", evidence: ["Feedback channel", "Feedback log"], severity: "low", fix: "Add an easy way to report AI problems and review it regularly." },

  { id: "MA1", fn: "manage", rmf: "MANAGE 1", title: "AI risks prioritized with owners", good: "Identified AI risks are ranked, each with an owner, a response and a due date.", evidence: ["Risk or findings register with owners"], severity: "medium", fix: "Rank AI risks and give each an owner, a response and a due date." },
  { id: "MA2", fn: "manage", rmf: "MANAGE 2", title: "People decide about people", good: "AI may help prepare, but a person makes decisions about hiring, eligibility, discipline or care, and records how AI was used.", evidence: ["Policy rule", "Decision records"], severity: "high", fix: "Make a person the decision-maker for anything about people, and record AI's role." },
  { id: "MA3", fn: "manage", rmf: "MANAGE 2", title: "People told when AI is involved", good: "AI chat tools and mostly AI-generated public content are labeled, with a way to reach a person.", evidence: ["Screenshots of labels and contact options"], severity: "medium", fix: "Label AI tools and AI-generated content and offer a way to reach a person." },
  { id: "MA4", fn: "manage", rmf: "MANAGE 3", title: "Third-party AI risks monitored", good: "Vendor terms and AI features are re-checked at renewal or when vendors change their AI, and new AI features in existing tools are reviewed before use.", evidence: ["Vendor review log", "Renewal checklist"], severity: "medium", fix: "Re-check AI vendors at renewal and review new AI features before turning them on." },
  { id: "MA5", fn: "manage", rmf: "MANAGE 4", title: "AI incident response plan", good: "There's a written plan for AI incidents: who to call, how to stop or roll back the tool, how to tell affected people, and how to learn from it.", evidence: ["Incident response plan", "Record of any past incidents"], severity: "high", fix: "Write a one-page AI incident plan: stop, contain, notify, learn." },
  { id: "MA6", fn: "manage", rmf: "MANAGE 2", title: "AI can be switched off and retired", good: "Each AI tool can be turned off quickly, and there's a process to retire it and delete or export its data.", evidence: ["Off-switch and retirement steps", "Data deletion confirmation"], severity: "low", fix: "Document how to switch off each AI tool and delete its data when retired." },
  { id: "MA7", fn: "manage", rmf: "MANAGE 1", title: "AI agents have least-privilege access", good: "Each agent can reach only the data and systems its job needs, through its own scoped account, never a shared admin login; access is reviewed when its job changes.", evidence: ["Agent permission settings", "Access review record"], severity: "high", fix: "Cut each agent's access to only what its job needs, under its own scoped account." },
  { id: "MA8", fn: "manage", rmf: "MANAGE 2", title: "People approve consequential agent actions", good: "Before an agent sends, pays, signs, deletes or changes records, a person sees exactly what it will do and approves it; content from emails, files or web pages is never treated as instructions (prompt-injection defense).", evidence: ["Approval settings", "Prompt-injection test results"], severity: "high", fix: "Require a person's approval for any agent action that sends, pays, signs or deletes, and test for prompt injection." },
  { id: "MA9", fn: "manage", rmf: "MANAGE 4", title: "Agents can be stopped and are logged", good: "Each agent can be switched off in minutes by a named person, and its actions are logged and reviewed.", evidence: ["Off-switch steps and owner", "Activity logs"], severity: "high", fix: "Name who can stop each agent, document how, and turn on activity logs." },
  { id: "MA10", fn: "manage", rmf: "MANAGE 2", title: "Deepfake and voice-clone fraud verification", good: "Payment, bank-detail and urgent requests are verified by calling back on a known number or a second channel, never on the strength of a voice, video or email alone, and staff know the rule.", evidence: ["Payment verification procedure", "Staff awareness record"], severity: "high", fix: "Adopt a call-back rule for payment and urgent requests and brief staff on voice-clone and deepfake scams." },
];

export const STATUSES = [
  { id: "not-assessed", label: "Not assessed" },
  { id: "met", label: "Met" },
  { id: "partial", label: "Partly met" },
  { id: "not-met", label: "Not met" },
  { id: "na", label: "Not applicable" },
] as const;
export type Status = (typeof STATUSES)[number]["id"];

export interface Evidence {
  id: string;
  label: string;
  /** A link, file name or where it's kept. */
  where: string;
  date: string;
}

export interface Finding {
  severity: Severity;
  recommendation: string;
  owner: string;
  due: string;
  state: "open" | "in-progress" | "done";
}

export interface ControlResult {
  status: Status;
  notes: string;
  evidence: Evidence[];
  finding?: Finding;
}

export interface LogEntry {
  at: string;
  text: string;
}

export type ArtifactType = "register" | "policy" | "briefing" | "action-plan" | "report";

/** An issued, versioned document. The fingerprint is a SHA-256 of the exact text issued. */
export interface Artifact {
  id: string;
  type: ArtifactType;
  version: number;
  title: string;
  issuedAt: string;
  issuedBy: string;
  sha256: string;
  content: string;
}

export interface Engagement {
  id: string;
  client: string;
  orgType: string;
  contact: string;
  auditor: string;
  scope: string;
  start: string;
  end: string;
  results: Record<string, ControlResult>;
  /** The client's AI tools, rated with the same rules as the free Governwise kit. */
  tools: Tool[];
  size: string;
  /** Who owns AI decisions at the client. */
  aiOwner: string;
  dataKinds: DataKind[];
  /** Draft text the auditor has customized, per artifact type. */
  drafts: Partial<Record<ArtifactType, string>>;
  artifacts: Artifact[];
  log: LogEntry[];
  created: string;
  updated: string;
}

export const blankResult = (): ControlResult => ({ status: "not-assessed", notes: "", evidence: [] });
export const resultFor = (e: Engagement, id: string): ControlResult => e.results[id] ?? blankResult();

const uid = () => Math.random().toString(36).slice(2, 10);
export { uid };

export function newEngagement(client: string, today = new Date().toISOString().slice(0, 10)): Engagement {
  const now = new Date().toISOString();
  return { id: uid(), client, orgType: "Business", contact: "", auditor: "", scope: "All AI tools and uses across the organization.", start: today, end: "", results: {}, tools: [], size: "11–50", aiOwner: "", dataKinds: [], drafts: {}, artifacts: [], log: [{ at: now, text: "Audit created." }], created: now, updated: now };
}

/** Points for a status: met 1, partly 0.5, not met 0. Not assessed counts as 0; not applicable is left out. */
const points = (s: Status) => (s === "met" ? 1 : s === "partial" ? 0.5 : 0);

export interface Score {
  pct: number;
  counted: number;
  assessed: number;
  total: number;
}

export function score(e: Engagement, fn?: FunctionId): Score {
  const list = CONTROLS.filter((c) => !fn || c.fn === fn);
  const rs = list.map((c) => resultFor(e, c.id));
  const counted = rs.filter((r) => r.status !== "na");
  const pct = counted.length ? Math.round((counted.reduce((n, r) => n + points(r.status), 0) / counted.length) * 100) : 0;
  return { pct, counted: counted.length, assessed: rs.filter((r) => r.status !== "not-assessed").length, total: list.length };
}

export const maturity = (pct: number) => (pct >= 85 ? "Strong" : pct >= 60 ? "Developing" : pct >= 30 ? "Early" : "Not yet in place");

export interface ReadinessIssue {
  controlId?: string;
  level: "blocker" | "warning";
  text: string;
}

/**
 * What would make this audit hard to defend: unassessed controls, "met" with no
 * evidence, gaps without a finding owner or due date, and open high findings.
 */
export function readinessIssues(e: Engagement): ReadinessIssue[] {
  const out: ReadinessIssue[] = [];
  for (const c of CONTROLS) {
    const r = resultFor(e, c.id);
    if (r.status === "not-assessed") out.push({ controlId: c.id, level: "blocker", text: `${c.id} ${c.title}: not assessed yet.` });
    if ((r.status === "met" || r.status === "partial") && r.evidence.length === 0) out.push({ controlId: c.id, level: "blocker", text: `${c.id} ${c.title}: marked ${r.status === "met" ? "met" : "partly met"} with no evidence recorded.` });
    if (r.status === "na" && !r.notes.trim()) out.push({ controlId: c.id, level: "warning", text: `${c.id} ${c.title}: not applicable, but no reason is noted.` });
    if (r.status === "partial" || r.status === "not-met") {
      const f = r.finding;
      if (!f || !f.owner.trim() || !f.due) out.push({ controlId: c.id, level: "warning", text: `${c.id} ${c.title}: finding has no owner or due date.` });
    }
  }
  return out;
}

/** The finding for a gap, with the control's defaults filled in. */
export const findingFor = (c: Control, r: ControlResult): Finding => r.finding ?? { severity: c.severity, recommendation: c.fix, owner: "", due: "", state: "open" };

export interface FindingRow {
  control: Control;
  result: ControlResult;
  finding: Finding;
}

export function findings(e: Engagement): FindingRow[] {
  const order: Severity[] = ["high", "medium", "low"];
  return CONTROLS.map((c) => ({ c, r: resultFor(e, c.id) }))
    .filter(({ r }) => r.status === "partial" || r.status === "not-met")
    .map(({ c, r }) => ({ control: c, result: r, finding: findingFor(c, r) }))
    .sort((a, b) => order.indexOf(a.finding.severity) - order.indexOf(b.finding.severity) || CONTROLS.indexOf(a.control) - CONTROLS.indexOf(b.control));
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const statusLabel = (s: Status) => STATUSES.find((x) => x.id === s)!.label;

export function controlsCsv(e: Engagement): string {
  const head = ["Control", "Function", "NIST AI RMF", "Title", "Status", "Notes", "Evidence", "Finding severity", "Recommendation", "Owner", "Due", "Finding status"];
  const rows = CONTROLS.map((c) => {
    const r = resultFor(e, c.id);
    const gap = r.status === "partial" || r.status === "not-met";
    const f = gap ? findingFor(c, r) : null;
    return [c.id, c.fn, c.rmf, c.title, statusLabel(r.status), r.notes, r.evidence.map((x) => `${x.label} (${x.where}${x.date ? `, ${x.date}` : ""})`).join("; "), f?.severity ?? "", f?.recommendation ?? "", f?.owner ?? "", f?.due ?? "", f?.state ?? ""];
  });
  return [head, ...rows].map((r) => r.map((x) => csvCell(String(x))).join(",")).join("\n");
}

/** Accepts an exported file: one engagement or a whole workspace. Rejects anything malformed. */
export function parseImport(text: string): Engagement[] {
  const data = JSON.parse(text) as unknown;
  const list = Array.isArray((data as { engagements?: unknown }).engagements) ? (data as { engagements: unknown[] }).engagements : [data];
  const ok = list.filter((x): x is Engagement => !!x && typeof x === "object" && typeof (x as Engagement).id === "string" && typeof (x as Engagement).client === "string" && typeof (x as Engagement).results === "object");
  if (!ok.length) throw new Error("No audits found in that file.");
  return ok.map(normalize);
}

/** Fills in fields added since an audit was saved, so older saves and backups keep working. */
export function normalize(x: Engagement): Engagement {
  return { ...newEngagement(x.client), ...x, tools: Array.isArray(x.tools) ? x.tools : [], dataKinds: Array.isArray(x.dataKinds) ? x.dataKinds : [], drafts: x.drafts && typeof x.drafts === "object" ? x.drafts : {}, artifacts: Array.isArray(x.artifacts) ? x.artifacts : [], log: Array.isArray(x.log) ? x.log : [] };
}
