"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, Check, ClipboardCopy, Download, Plus, Printer, Trash2, X } from "lucide-react";
import { newId } from "../../../lib/habitwise/storage";
import { printArea } from "../../../lib/print/printArea";
import { backlogCsv, gaps, gateStatus, planMarkdown, readinessScore, totalWeeks, verdict } from "../../../lib/pilotwise/logic";
import { AREAS, RISK_CATEGORIES, type CriterionStatus, type Pilot, type Plan, type Roam } from "../../../lib/pilotwise/types";
import { btn, eyebrow, inline, Modal, panel } from "./ui";

const STATUS: Record<CriterionStatus, { label: string; cls: string }> = {
  "not-measured": { label: "Not measured", cls: "text-muted" },
  "on-track": { label: "On track", cls: "text-amber" },
  met: { label: "Met", cls: "text-down" },
  missed: { label: "Missed", cls: "text-up" },
};
const ROAM_LABEL: Record<Roam, string> = { open: "Open", resolved: "Resolved", owned: "Owned", accepted: "Accepted", mitigated: "Mitigated" };
const TONE = { good: "#53cfa0", warn: "#f2b54b", bad: "#f2846b" } as const;

function Section({ id, title, kicker, children, aside }: { id: string; title: string; kicker?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className={`${panel} p-5 sm:p-6`} aria-labelledby={id}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {kicker && <p className={eyebrow}>{kicker}</p>}
          <h2 id={id} className="text-lg font-bold">
            {title}
          </h2>
        </div>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Half-circle readiness gauge. */
function Gauge({ score, color }: { score: number; color: string }) {
  const r = 52;
  const len = Math.PI * r;
  return (
    <svg viewBox="0 0 128 76" className="w-40" role="img" aria-label={`Readiness ${score} out of 100`}>
      <path d="M 12 68 A 52 52 0 0 1 116 68" fill="none" stroke="#1e2d42" strokeWidth="11" strokeLinecap="round" />
      <path d="M 12 68 A 52 52 0 0 1 116 68" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(len * score) / 100} ${len}`} style={{ transition: "stroke-dasharray 400ms ease" }} />
      <text x="64" y="62" textAnchor="middle" fontSize="26" fontWeight="800" fill="#e8eef5" fontFamily="var(--font-manrope), sans-serif">
        {score}
      </text>
    </svg>
  );
}

/** Phases drawn to scale by weeks, with the go/no-go gate marked where the pilot ends. */
function Timeline({ plan }: { plan: Plan }) {
  const total = Math.max(1, totalWeeks(plan));
  const colors = ["#5cb8e6", "#f2b54b", "#b48cf2", "#53cfa0", "#ef7fa8", "#d9965b"];
  // The gate sits at the end of a "gate/decide" phase, or else where scaling starts.
  const decideIdx = plan.phases.findIndex((p) => /gate|decide|decision|go\/no/i.test(p.name));
  const scaleIdx = plan.phases.findIndex((p) => /scale|roll ?out/i.test(p.name));
  const gateAt = decideIdx >= 0 ? decideIdx + 1 : scaleIdx > 0 ? scaleIdx : -1;
  const gateWeek = gateAt > 0 ? plan.phases.slice(0, gateAt).reduce((s, p) => s + p.weeks, 0) : null;
  let acc = 0;
  return (
    <div aria-hidden className="mb-5">
      <div className="relative flex h-9 overflow-hidden rounded-lg">
        {plan.phases.map((p, i) => {
          const w = (Math.max(0, p.weeks) / total) * 100;
          acc += p.weeks;
          return (
            <div key={p.id} className="flex min-w-0 items-center justify-center border-r-2 border-bg px-1 text-[11px] font-bold text-[#0d1520]" style={{ width: `${w}%`, background: colors[i % colors.length] }} title={`${p.name}: ${p.weeks} wk`}>
              <span className="truncate">{w > 24 ? p.name : i + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
        <span>Week 0</span>
        {gateWeek !== null && <span className="text-amber">◆ Go/no-go at week {gateWeek}</span>}
        <span>Week {acc}</span>
      </div>
    </div>
  );
}

export function PlanView({ pilot, onChange, onBack, onDelete, onToast }: { pilot: Pilot; onChange: (plan: Plan) => void; onBack: () => void; onDelete: () => void; onToast: (m: string) => void }) {
  const { plan } = pilot;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const score = readinessScore(plan);
  const weakest = Math.min(...plan.readiness.map((r) => r.score));
  const v = verdict(score, weakest);
  const gate = gateStatus(plan);
  const set = (patch: Partial<Plan>) => onChange({ ...plan, ...patch });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(planMarkdown(pilot));
      onToast("Plan copied as Markdown. Paste it into Confluence, Notion, a doc or an email.");
    } catch {
      onToast("Couldn't copy on this browser.");
    }
  };
  const downloadCsv = () => {
    const blob = new Blob([backlogCsv(plan)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${plan.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "pilot"}-backlog.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    onToast("Backlog downloaded. Import it into Jira or Azure DevOps.");
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onBack} className={`${btn.ghost} gap-1.5 text-sm`}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> My pilots
        </button>
        <span className="ml-auto flex flex-wrap gap-2">
          <button type="button" onClick={printArea} className={`${btn.secondary} px-3 py-2`}>
            <Printer className="h-4 w-4" aria-hidden /> Print / PDF
          </button>
          <button type="button" onClick={copy} className={`${btn.secondary} px-3 py-2`}>
            <ClipboardCopy className="h-4 w-4" aria-hidden /> Copy
          </button>
          <button type="button" onClick={downloadCsv} className={`${btn.secondary} px-3 py-2`}>
            <Download className="h-4 w-4" aria-hidden /> Backlog CSV
          </button>
        </span>
      </div>

      {/* Overview */}
      <section className={`${panel} p-5 sm:p-7`} aria-labelledby="pw-title">
        <p className={eyebrow}>{pilot.source === "ai" ? "AI-drafted pilot plan" : "Pilot plan from the template"} · edit anything</p>
        <label htmlFor="pw-title" className="sr-only">
          Pilot name
        </label>
        <textarea id="pw-title" rows={2} className={`${inline} mt-1 -ml-1.5 resize-none text-2xl font-extrabold leading-tight tracking-tight [field-sizing:content] sm:text-3xl`} value={plan.title} maxLength={90} onChange={(e) => set({ title: e.target.value.replace(/\n/g, " ") })} />
        <div className="mt-4 grid items-center gap-5 sm:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center">
            <Gauge score={score} color={TONE[v.tone]} />
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Readiness</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: TONE[v.tone] }}>
              {v.label}
            </p>
            <p className="mt-1 text-soft">{v.text}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-line px-3 py-1 text-soft">
                Gate: <strong className="text-fg">{gate.met}</strong> of {gate.total} criteria met
              </span>
              <span className="rounded-full border border-line px-3 py-1 text-soft">{totalWeeks(plan)} weeks, {plan.phases.length} phases</span>
              {gaps(plan).length > 0 && <span className="rounded-full border border-up/40 px-3 py-1 text-up">{gaps(plan).length} gaps to close</span>}
            </div>
          </div>
        </div>
      </section>

      <Section id="pw-value" kicker="Why it matters" title="Problem and value">
        <textarea aria-label="Problem" rows={3} className={`${inline} -ml-1.5 text-soft`} value={plan.problem} maxLength={600} onChange={(e) => set({ problem: e.target.value })} />
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["metric", "Value metric"],
              ["baseline", "Baseline today"],
              ["target", "Target"],
              ["owner", "Business owner"],
            ] as const
          ).map(([k, name]) => (
            <div key={k} className="rounded-xl bg-sunken p-3">
              <dt className="text-xs text-muted">{name}</dt>
              <dd>
                <input aria-label={name} className={`${inline} -ml-1.5 font-semibold`} value={plan.value[k]} maxLength={160} onChange={(e) => set({ value: { ...plan.value, [k]: e.target.value } })} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="pw-ready" kicker="Before you build" title="Readiness check">
        <ul className="space-y-3">
          {AREAS.map((a) => {
            const r = plan.readiness.find((x) => x.area === a.id)!;
            return (
              <li key={a.id} className="grid gap-2 sm:grid-cols-[11rem_auto_1fr] sm:items-start">
                <span className="font-semibold">{a.label}</span>
                <span className="flex gap-1" role="radiogroup" aria-label={`${a.label} score`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={r.score === n}
                      aria-label={`${n} of 5`}
                      onClick={() => set({ readiness: plan.readiness.map((x) => (x.area === a.id ? { ...x, score: n } : x)) })}
                      className={`h-7 w-7 rounded-md text-xs font-bold transition ${n <= r.score ? (r.score <= 2 ? "bg-up/70 text-[#2a0d06]" : r.score === 3 ? "bg-amber/80 text-amber-ink" : "bg-down/80 text-[#06231a]") : "bg-raised text-muted hover:bg-[#24364f]"}`}
                    >
                      {n}
                    </button>
                  ))}
                </span>
                <span className="text-sm text-soft">
                  {r.note}
                  {r.gap && <span className="block text-up">Gap: {r.gap}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        id="pw-gate"
        kicker="Go / no-go"
        title="Exit criteria"
        aside={
          <span className={`rounded-full px-3 py-1 font-mono text-xs ${gate.decision === "go" ? "bg-down/15 text-down" : gate.decision === "no-go" ? "bg-up/15 text-up" : "bg-raised text-muted"}`}>
            {gate.decision === "go" ? "Ready to scale" : gate.decision === "no-go" ? `${gate.missed} missed` : `${gate.met}/${gate.total} met`}
          </span>
        }
      >
        <p className="mb-3 text-sm text-muted">Agree these before the first sprint. The pilot scales only when every one is met.</p>
        <ul className="divide-y divide-hairline">
          {plan.exitCriteria.map((c) => (
            <li key={c.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="min-w-0">
                <input aria-label="Criterion" className={`${inline} -ml-1.5 font-semibold`} value={c.name} maxLength={80} onChange={(e) => set({ exitCriteria: plan.exitCriteria.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) })} />
                <textarea aria-label={`${c.name} target`} rows={1} className={`${inline} -ml-1.5 resize-none text-sm text-soft [field-sizing:content]`} value={c.target} maxLength={200} onChange={(e) => set({ exitCriteria: plan.exitCriteria.map((x) => (x.id === c.id ? { ...x, target: e.target.value.replace(/\n/g, " ") } : x)) })} />
                <p className="px-0.5 text-xs text-muted">{c.measure}</p>
              </div>
              <div className="flex items-center gap-1">
                <select aria-label={`${c.name} status`} value={c.status} onChange={(e) => set({ exitCriteria: plan.exitCriteria.map((x) => (x.id === c.id ? { ...x, status: e.target.value as CriterionStatus } : x)) })} className={`w-36 rounded-[10px] border border-line bg-sunken px-2 py-2 text-sm font-semibold ${STATUS[c.status].cls}`}>
                  {(Object.keys(STATUS) as CriterionStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS[s].label}
                    </option>
                  ))}
                </select>
                <button type="button" aria-label={`Remove ${c.name}`} onClick={() => set({ exitCriteria: plan.exitCriteria.filter((x) => x.id !== c.id) })} className={btn.ghost}>
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => set({ exitCriteria: [...plan.exitCriteria, { id: newId(), name: "New criterion", target: "Target", measure: "How it's measured", status: "not-measured" }] })} className={`${btn.secondary} mt-2 px-3 py-2`}>
          <Plus className="h-4 w-4" aria-hidden /> Add criterion
        </button>
      </Section>

      <Section id="pw-plan" kicker="Agile delivery" title="Delivery plan">
        <Timeline plan={plan} />
        <ol className="space-y-4">
          {plan.phases.map((ph, i) => (
            <li key={ph.id} className="rounded-xl border border-hairline p-4">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-xs text-muted">Phase {i + 1}</span>
                <strong>{ph.name}</strong>
                <span className="text-sm text-muted">· {ph.weeks} {ph.weeks === 1 ? "week" : "weeks"}</span>
              </p>
              <p className="mt-1 text-sm text-soft">{ph.goal}</p>
              <ul className="mt-2 space-y-1.5">
                {ph.features.map((f) => (
                  <li key={f.id}>
                    <label className="flex cursor-pointer gap-2.5 text-sm">
                      <input type="checkbox" checked={f.done} onChange={() => set({ phases: plan.phases.map((p) => (p.id === ph.id ? { ...p, features: p.features.map((x) => (x.id === f.id ? { ...x, done: !x.done } : x)) } : p)) })} className="mt-0.5 h-4 w-4 shrink-0 accent-[#f2b54b]" />
                      <span className={f.done ? "text-muted line-through" : ""}>
                        <strong className="font-semibold text-fg">{f.title}</strong>
                        {f.outcome ? `: ${f.outcome}` : ""}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="pw-risks" kicker="ROAM" title="Risks">
        <ul className="divide-y divide-hairline">
          {plan.risks.map((r) => (
            <li key={r.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="min-w-0">
                <p className="font-semibold">{r.risk}</p>
                <p className="text-xs text-muted">
                  <span className="capitalize">{r.category}</span> · likelihood {r.likelihood} · impact {r.impact}
                  {r.likelihood === "high" && r.impact === "high" && <span className="text-up"> · top risk</span>}
                </p>
                <p className="mt-1 text-sm text-soft">{r.response}</p>
              </div>
              <div className="flex items-center gap-1">
                <select aria-label={`${r.risk} ROAM status`} value={r.roam} onChange={(e) => set({ risks: plan.risks.map((x) => (x.id === r.id ? { ...x, roam: e.target.value as Roam } : x)) })} className="w-36 rounded-[10px] border border-line bg-sunken px-2 py-2 text-sm font-semibold text-fg">
                  {(Object.keys(ROAM_LABEL) as Roam[]).map((k) => (
                    <option key={k} value={k}>
                      {ROAM_LABEL[k]}
                    </option>
                  ))}
                </select>
                <button type="button" aria-label={`Remove risk: ${r.risk}`} onClick={() => set({ risks: plan.risks.filter((x) => x.id !== r.id) })} className={btn.ghost}>
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <AddRisk onAdd={(risk) => set({ risks: [...plan.risks, risk] })} />
        <p className="mt-3 text-xs text-muted">ROAM: Resolved (no longer a risk), Owned (someone is on it), Accepted (we&apos;ll live with it), Mitigated (reduced). Open means not yet decided.</p>
      </Section>

      <div className="grid gap-5 md:grid-cols-2">
        <Section id="pw-eval" kicker="Evidence" title="Evaluation plan">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted">Test set ({plan.evalPlan.size} cases)</dt>
              <dd className="text-soft">{plan.evalPlan.testSet}</dd>
            </div>
            <div>
              <dt className="text-muted">Who decides what&apos;s good</dt>
              <dd className="text-soft">{plan.evalPlan.labeling}</dd>
            </div>
            <div>
              <dt className="text-muted">When it runs</dt>
              <dd className="text-soft">{plan.evalPlan.cadence}</dd>
            </div>
          </dl>
        </Section>
        <Section id="pw-steps" kicker="Start Monday" title="First two weeks">
          <ul className="space-y-2">
            {plan.firstSteps.map((s) => (
              <li key={s.id}>
                <label className="flex cursor-pointer gap-2.5 text-sm">
                  <input type="checkbox" checked={s.done} onChange={() => set({ firstSteps: plan.firstSteps.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)) })} className="mt-0.5 h-4 w-4 shrink-0 accent-[#f2b54b]" />
                  <span className={s.done ? "text-muted line-through" : "text-soft"}>{s.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section id="pw-brief" kicker="For your sponsor" title="Executive brief">
        <textarea aria-label="Executive brief" rows={5} className={`${inline} -ml-1.5 leading-relaxed text-soft`} value={plan.brief} maxLength={1500} onChange={(e) => set({ brief: e.target.value })} />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={printArea} className={btn.primary}>
            <Printer className="h-4 w-4" aria-hidden /> Print or save the one-pager
          </button>
          <button type="button" onClick={() => setConfirmDelete(true)} className={`${btn.ghost} gap-1.5 text-sm`}>
            <Trash2 className="h-4 w-4" aria-hidden /> Delete plan
          </button>
        </div>
      </Section>

      <Modal open={confirmDelete} title="Delete this plan?" onClose={() => setConfirmDelete(false)}>
        <p className="text-sm text-soft">“{plan.title}” will be removed from this device. This can&apos;t be undone.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className={btn.secondary} onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
          <button type="button" className={btn.danger} onClick={onDelete}>
            Delete
          </button>
        </div>
      </Modal>

      <OnePager pilot={pilot} score={score} verdictLabel={v.label} />
    </>
  );
}

function AddRisk({ onAdd }: { onAdd: (r: Plan["risks"][number]) => void }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Plan["risks"][number]["category"]>("quality");
  const add = () => {
    if (!text.trim()) return;
    onAdd({ id: newId(), risk: text.trim().slice(0, 200), category, likelihood: "medium", impact: "medium", response: "Agree a response and an owner", roam: "open" });
    setText("");
  };
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <label className="sr-only" htmlFor="pw-newrisk">
        New risk
      </label>
      <input id="pw-newrisk" value={text} maxLength={200} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a risk…" className="min-w-0 flex-1 basis-48 rounded-[10px] border border-line bg-sunken px-3 py-2 text-sm text-fg placeholder:text-dim" />
      <label className="sr-only" htmlFor="pw-newcat">
        Category
      </label>
      <select id="pw-newcat" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="rounded-[10px] border border-line bg-sunken px-2 py-2 text-sm capitalize text-fg">
        {RISK_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="button" onClick={add} disabled={!text.trim()} className={`${btn.secondary} px-3 py-2`}>
        <Check className="h-4 w-4" aria-hidden /> Add
      </button>
    </div>
  );
}

/** The printed one-pager for a sponsor: hidden on screen, the only thing printed. */
function OnePager({ pilot, score, verdictLabel }: { pilot: Pilot; score: number; verdictLabel: string }) {
  const { plan } = pilot;
  return (
    <article className="print-area hidden bg-white p-8 text-[13px] leading-snug text-[#111827] print:block">
      <header className="flex items-start justify-between gap-6 border-b border-gray-300 pb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">AI pilot plan</p>
          <h1 className="text-2xl font-extrabold">{plan.title}</h1>
          <p className="mt-1 text-gray-700">{plan.problem}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-3xl font-extrabold">{score}</p>
          <p className="text-xs text-gray-600">Readiness · {verdictLabel}</p>
        </div>
      </header>
      <section className="mt-3">
        <h2 className="font-bold">Value</h2>
        <p>
          {plan.value.metric}: from {plan.value.baseline} to {plan.value.target}. Owner: {plan.value.owner}. Users: {plan.users}.
        </p>
      </section>
      <section className="mt-3">
        <h2 className="font-bold">Go / no-go criteria</h2>
        <table className="mt-1 w-full text-left">
          <tbody>
            {plan.exitCriteria.map((c) => (
              <tr key={c.id} className="border-b border-gray-200 align-top">
                <td className="py-1 pr-3 font-semibold">{c.name}</td>
                <td className="py-1 pr-3">{c.target}</td>
                <td className="py-1 text-gray-600">{STATUS[c.status].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mt-3">
        <h2 className="font-bold">Plan ({totalWeeks(plan)} weeks)</h2>
        <ol className="mt-1 list-decimal pl-5">
          {plan.phases.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> ({p.weeks} wk): {p.goal}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-3">
        <h2 className="font-bold">Top risks</h2>
        <ul className="mt-1 list-disc pl-5">
          {[...plan.risks]
            .sort((a, b) => (b.impact === "high" ? 1 : 0) - (a.impact === "high" ? 1 : 0))
            .slice(0, 4)
            .map((r) => (
              <li key={r.id}>
                {r.risk}: {r.response} ({ROAM_LABEL[r.roam]})
              </li>
            ))}
        </ul>
      </section>
      <section className="mt-3">
        <h2 className="font-bold">Recommendation</h2>
        <p className="whitespace-pre-line">{plan.brief}</p>
      </section>
      <p className="mt-4 text-[10px] text-gray-500">Made with Pilotwise · growdaily.ai/apps/pilotwise</p>
    </article>
  );
}
