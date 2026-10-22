"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { BUILDERS, ORG_SIZES, type Inputs } from "../../../lib/pilotwise/types";
import { btn, input, label } from "./ui";

const EXAMPLES = [
  "Draft first replies to customer support emails so agents answer faster",
  "Summarize sales calls and update the CRM automatically",
  "Answer employee HR and policy questions from our handbook",
  "Extract data from supplier invoices into our accounting system",
  "Help the finance team write the monthly variance commentary",
];

const STAGES = ["Framing the problem and value", "Checking readiness", "Setting go/no-go exit criteria", "Planning the phases", "Listing the risks", "Writing the executive brief"];

/** The use-case form. AI drafts the plan; the template works without it. */
export function NewPlan({ busy, error, onAi, onTemplate }: { busy: boolean; error: string | null; onAi: (i: Inputs) => void; onTemplate: (i: Inputs) => void }) {
  const [i, setI] = useState<Inputs>({ useCase: "", orgSize: ORG_SIZES[2], industry: "", builder: BUILDERS[3], data: "", weeks: 12 });
  const [stage, setStage] = useState(0);
  const set = (patch: Partial<Inputs>) => setI({ ...i, ...patch });
  const ready = i.useCase.trim().length >= 15;

  useEffect(() => {
    if (!busy) return setStage(0);
    const t = setInterval(() => setStage((s) => Math.min(STAGES.length - 1, s + 1)), 4000);
    return () => clearInterval(t);
  }, [busy]);

  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-7" aria-labelledby="new-heading">
      <h2 id="new-heading" className="text-xl font-extrabold tracking-tight">
        What do you want AI to do?
      </h2>
      <p className="mt-1 text-sm text-muted">Describe one piece of work. Pilotwise turns it into a plan with go/no-go criteria, phases, risks and a brief for your sponsor.</p>

      <label htmlFor="pw-usecase" className="sr-only">
        AI use case
      </label>
      <textarea id="pw-usecase" rows={3} maxLength={1500} className={`${input} mt-4`} value={i.useCase} onChange={(e) => set({ useCase: e.target.value })} placeholder="Draft first replies to customer support emails so agents answer faster" />
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Examples">
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" onClick={() => set({ useCase: ex })} className="rounded-full border border-line px-3 py-1 text-xs text-soft transition hover:border-amber/50 hover:text-fg">
            {ex.length > 46 ? `${ex.slice(0, 44)}…` : ex}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pw-size" className={label}>
            Organization size
          </label>
          <select id="pw-size" className={`${input} mt-1.5`} value={i.orgSize} onChange={(e) => set({ orgSize: e.target.value })}>
            {ORG_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pw-industry" className={label}>
            Industry <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="pw-industry" className={`${input} mt-1.5`} value={i.industry} maxLength={80} onChange={(e) => set({ industry: e.target.value })} placeholder="Online retail, healthcare, nonprofit…" />
        </div>
        <div>
          <label htmlFor="pw-builder" className={label}>
            Who will build it?
          </label>
          <select id="pw-builder" className={`${input} mt-1.5`} value={i.builder} onChange={(e) => set({ builder: e.target.value })}>
            {BUILDERS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pw-weeks" className={label}>
            Weeks until you decide to scale
          </label>
          <select id="pw-weeks" className={`${input} mt-1.5`} value={i.weeks} onChange={(e) => set({ weeks: Number(e.target.value) })}>
            {[6, 8, 10, 12, 16, 20].map((w) => (
              <option key={w} value={w}>
                {w} weeks
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pw-data" className={label}>
            What data does it need, and where is it? <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="pw-data" className={`${input} mt-1.5`} value={i.data} maxLength={800} onChange={(e) => set({ data: e.target.value })} placeholder="About 2,000 support emails a week in our help desk, plus a help center" />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">Don&apos;t include confidential details: describe the work, not the customers. Your plan is saved on this device.</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={!ready || busy} onClick={() => onAi(i)} className={btn.primary}>
          <Sparkles className="h-4 w-4" aria-hidden /> {busy ? "Building your plan…" : "Build my plan with AI"}
        </button>
        <button type="button" disabled={!ready || busy} onClick={() => onTemplate(i)} className={btn.secondary}>
          <FileText className="h-4 w-4" aria-hidden /> Start from the template
        </button>
      </div>
      {busy && (
        <p className="mt-4 flex items-center gap-2 text-sm text-soft" aria-live="polite">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber" aria-hidden /> {STAGES[stage]}… <span className="text-muted">(about 30–60 seconds)</span>
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-up">
          {error}
        </p>
      )}
    </section>
  );
}
