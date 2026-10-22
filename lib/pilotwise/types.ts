/** The six things that decide whether an AI pilot reaches production. */
export const AREAS = [
  { id: "problem", label: "Problem & value", hint: "A specific job, an owner, and a number that should move." },
  { id: "data", label: "Data", hint: "The data exists, is reachable, and is allowed to be used." },
  { id: "people", label: "People & process", hint: "The people who'll use it are involved, and the workflow is clear." },
  { id: "governance", label: "Risk & governance", hint: "Privacy, security and human review are agreed up front." },
  { id: "tech", label: "Tech & integration", hint: "There's a path into the systems people already use." },
  { id: "measurement", label: "Measurement", hint: "A test set and targets decide go or no-go, not opinions." },
] as const;
export type AreaId = (typeof AREAS)[number]["id"];

export type Level = "low" | "medium" | "high";
export type Roam = "open" | "resolved" | "owned" | "accepted" | "mitigated";
export type CriterionStatus = "not-measured" | "on-track" | "met" | "missed";
export const RISK_CATEGORIES = ["quality", "data", "privacy", "security", "adoption", "cost", "vendor", "compliance", "other"] as const;
export type RiskCategory = (typeof RISK_CATEGORIES)[number];

export interface Inputs {
  useCase: string;
  orgSize: string;
  industry: string;
  builder: string;
  data: string;
  weeks: number;
}

export interface Plan {
  title: string;
  problem: string;
  value: { metric: string; baseline: string; target: string; owner: string };
  users: string;
  readiness: { area: AreaId; score: number; note: string; gap: string }[];
  exitCriteria: { id: string; name: string; target: string; measure: string; status: CriterionStatus }[];
  phases: { id: string; name: string; weeks: number; goal: string; features: { id: string; title: string; outcome: string; done: boolean }[] }[];
  risks: { id: string; risk: string; category: RiskCategory; likelihood: Level; impact: Level; response: string; roam: Roam }[];
  evalPlan: { testSet: string; size: number; labeling: string; cadence: string };
  firstSteps: { id: string; text: string; done: boolean }[];
  brief: string;
}

export interface Pilot {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** "ai" when Claude drafted it, "template" when built from the starter template. */
  source: "ai" | "template";
  inputs: Inputs;
  plan: Plan;
}

export interface PilotData {
  pilots: Pilot[];
}

export const ORG_SIZES = ["1–10 people", "11–50 people", "51–250 people", "251–1,000 people", "1,000+ people"];
export const BUILDERS = ["Our own team", "A vendor or partner", "No-code / off-the-shelf tools", "Not sure yet"];
export const EMPTY: PilotData = { pilots: [] };
