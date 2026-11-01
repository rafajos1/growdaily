/**
 * The documents an audit produces for the client. Each is generated as plain
 * Markdown from the audit, can be edited by the auditor, and is issued as a
 * numbered version with a SHA-256 fingerprint so anyone can verify it later.
 */
import { DATA_KINDS, PLANS, policyMarkdown, rateTool, registerCsv, SENSITIVITY, TIER_LABEL, type Org, type OrgType } from "../governwise/logic";
import { CONTROLS, findings, FUNCTIONS, maturity, resultFor, score, STATUSES, type Artifact, type ArtifactType, type Engagement } from "./model";

export const ARTIFACTS: { type: ArtifactType; name: string; blurb: string }[] = [
  { type: "register", name: "AI register", blurb: "Every AI tool in use, its rating and the reasons, with conditions for use." },
  { type: "policy", name: "AI policy", blurb: "A tailored, ready-to-adopt AI policy built from the register and the client's data." },
  { type: "briefing", name: "Leadership briefing", blurb: "One page for leaders or the board: where they stand, top risks, what's needed." },
  { type: "action-plan", name: "Action plan", blurb: "Every finding with its fix, owner, due date and status." },
  { type: "report", name: "Audit report", blurb: "The full audit: scores, findings, and each control's notes and evidence." },
];

const ORG_TYPES: OrgType[] = ["Business", "Nonprofit", "Church or ministry"];
const fmt = (d: string) => (d ? new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "");
const statusLabel = (id: string) => STATUSES.find((s) => s.id === id)!.label;

export function orgFor(e: Engagement): Org {
  return { name: e.client, type: ORG_TYPES.includes(e.orgType as OrgType) ? (e.orgType as OrgType) : "Business", size: (["1–10", "11–50", "51–250", "250+"].includes(e.size) ? e.size : "11–50") as Org["size"], owner: e.aiOwner, data: e.dataKinds, checks: {} };
}

function header(e: Engagement, title: string): string {
  return `# ${e.client}: ${title}\n\nPrepared by ${e.auditor || "[auditor]"}, GrowDaily · ${fmt(e.end || new Date().toISOString())}\n`;
}

function registerMd(e: Engagement): string {
  const rows = e.tools.map((t) => ({ t, r: rateTool(t) }));
  const data = e.dataKinds.map((d) => DATA_KINDS.find((k) => k.id === d)?.label).filter(Boolean);
  return `${header(e, "AI register")}
AI owner: ${e.aiOwner || "[name and role]"} · Tools listed: ${rows.length}
${data.length ? `\nInformation the organization handles: ${data.join("; ")}.\n` : ""}
| Tool | Used for | Account | Information that goes in | Rating |
| --- | --- | --- | --- | --- |
${rows.map(({ t, r }) => `| ${t.name || "Unnamed"} | ${t.use || "-"} | ${PLANS.find((p) => p.id === t.plan)!.label} | ${SENSITIVITY.find((s) => s.id === t.data)!.label}${t.aboutPeople ? "; informs decisions about people" : ""}${t.publicFacing ? "; public-facing" : ""} | ${TIER_LABEL[r.tier]} |`).join("\n") || "| (no tools listed yet) | | | | |"}

## Reasons and conditions
${rows.map(({ t, r }) => `### ${t.name || "Unnamed tool"} · ${TIER_LABEL[r.tier]}\n- Why: ${r.reasons.join(" ")}\n${r.conditions.map((c) => `- Condition: ${c}`).join("\n")}`).join("\n\n") || "No tools listed yet."}

Ratings follow fixed rules: personal or sensitive information in personal accounts is not allowed; sensitive information on business plans needs a data agreement; anything that informs decisions about people or is seen by the public needs a person's review.
`;
}

function briefingMd(e: Engagement): string {
  const s = score(e);
  const f = findings(e);
  const tiers = e.tools.map((t) => rateTool(t).tier);
  return `${header(e, "AI governance briefing")}
## Where we stand
- Overall AI governance maturity: ${s.pct}% (${maturity(s.pct)}), across ${s.counted} applicable controls.
${FUNCTIONS.map((fn) => `- ${fn.name}: ${score(e, fn.id).pct}% (${maturity(score(e, fn.id).pct)})`).join("\n")}
- AI tools in use: ${e.tools.length} (${tiers.filter((t) => t === "approved").length} approved, ${tiers.filter((t) => t === "limited").length} approved with limits, ${tiers.filter((t) => t === "not-allowed").length} not allowed).

## Top risks
${f.slice(0, 5).map((x) => `- ${x.finding.severity.toUpperCase()}: ${x.control.title}. ${x.finding.recommendation}`).join("\n") || "- No gaps found."}

## What we've agreed
${f.filter((x) => x.finding.owner).slice(0, 5).map((x) => `- ${x.finding.recommendation} Owner: ${x.finding.owner}${x.finding.due ? `, by ${fmt(x.finding.due)}` : ""}.`).join("\n") || "- [Agreed actions, owners and dates]"}

## What we need from leadership
- [Decision or support needed, e.g. approve the AI policy, budget for business accounts, a review in six months]

Next review: [date]
`;
}

function actionPlanMd(e: Engagement): string {
  const f = findings(e);
  return `${header(e, "AI governance action plan")}
| # | Severity | Finding | Action | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- | --- |
${f.map((x, i) => `| ${i + 1} | ${x.finding.severity} | ${x.control.id} ${x.control.title} (${statusLabel(x.result.status)}) | ${x.finding.recommendation} | ${x.finding.owner || "Not set"} | ${fmt(x.finding.due) || "Not set"} | ${x.finding.state === "done" ? "Done" : x.finding.state === "in-progress" ? "In progress" : "Open"} |`).join("\n") || "| | | No findings | | | | |"}
`;
}

function reportMd(e: Engagement): string {
  const s = score(e);
  const f = findings(e);
  return `${header(e, "AI governance audit report")}
Organization type: ${e.orgType}${e.contact ? ` · Client contact: ${e.contact}` : ""} · Audit period: ${fmt(e.start)}${e.end ? ` to ${fmt(e.end)}` : ""}

Scope: ${e.scope}

## Summary
Overall maturity ${s.pct}% (${maturity(s.pct)}) across ${s.counted} applicable controls, mapped to the NIST AI Risk Management Framework (AI RMF 1.0). ${f.length} finding${f.length === 1 ? "" : "s"}.

| Function | Score | Maturity |
| --- | --- | --- |
${FUNCTIONS.map((fn) => `| ${fn.name} | ${score(e, fn.id).pct}% | ${maturity(score(e, fn.id).pct)} |`).join("\n")}

## Findings
${f.map((x) => `- ${x.finding.severity.toUpperCase()} · ${x.control.id} ${x.control.title}: ${x.finding.recommendation} (Owner: ${x.finding.owner || "not set"}${x.finding.due ? `, due ${fmt(x.finding.due)}` : ""})`).join("\n") || "- No gaps found."}

## Controls and evidence
${CONTROLS.map((c) => {
  const r = resultFor(e, c.id);
  return `### ${c.id} ${c.title} · ${statusLabel(r.status)}\nNIST AI RMF ${c.rmf}${r.notes ? `\n\nNotes: ${r.notes}` : ""}${r.evidence.length ? `\n\n${r.evidence.map((x) => `- Evidence: ${x.label} (${x.where}${x.date ? `, ${x.date}` : ""})`).join("\n")}` : ""}`;
}).join("\n\n")}

---
Practical governance guidance, not legal advice.
`;
}

/** The generated text for an artifact, before any edits. */
export function generate(e: Engagement, type: ArtifactType): string {
  switch (type) {
    case "register":
      return registerMd(e);
    case "policy":
      return policyMarkdown(orgFor(e), e.tools);
    case "briefing":
      return briefingMd(e);
    case "action-plan":
      return actionPlanMd(e);
    case "report":
      return reportMd(e);
  }
}

export const registerCsvFor = (e: Engagement) => registerCsv(e.tools);

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** A new issued version: numbered after the last version of the same type. */
export async function issue(e: Engagement, type: ArtifactType, content: string, issuedBy: string, at = new Date()): Promise<Artifact> {
  const prev = e.artifacts.filter((a) => a.type === type);
  const version = prev.length ? Math.max(...prev.map((a) => a.version)) + 1 : 1;
  const name = ARTIFACTS.find((a) => a.type === type)!.name;
  return { id: Math.random().toString(36).slice(2, 10), type, version, title: `${e.client} ${name} v${version}`, issuedAt: at.toISOString(), issuedBy, sha256: await sha256(content), content };
}

/** What gets downloaded: the issued text plus a footer that records how to verify it. */
export function issuedFile(a: Artifact): string {
  return `${a.content.trimEnd()}\n\n---\nIssued: ${a.title} · ${new Date(a.issuedAt).toISOString()} · by ${a.issuedBy || "auditor"}\nSHA-256 of the text above this line: ${a.sha256}\n`;
}
