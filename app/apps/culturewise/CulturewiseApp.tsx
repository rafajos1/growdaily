"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, Printer, Trash2 } from "lucide-react";
import { CopyButton } from "../../learn/CopyButton";
import {
  AI_USE,
  biggestGap,
  DIMENSIONS,
  newDepartment,
  RATING_LABELS,
  sampleOrg,
  scoreDepartment,
  STATEMENT_COUNT,
  summaryText,
  TYPES,
  WEAK_BELOW,
  type AiUse,
  type CultureType,
  type Department,
  type DeptResult,
  type Rating,
} from "../../../lib/culturewise/logic";

const KEY = "growdaily.culturewise.v1";
const MAX_DEPTS = 8;
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const input = "w-full rounded-lg border border-line bg-sunken px-3 py-2.5 text-base text-fg placeholder:text-dim focus:border-amber/60 focus:outline-none";
const label = "text-sm font-semibold text-soft";
const tab = (on: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${focus} ${on ? "bg-amber text-amber-ink" : "text-muted hover:text-fg"}`;
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-sm font-bold text-amber-ink transition hover:brightness-110 ${focus}`;
const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] ${focus}`;
const RATINGS: Rating[] = [1, 2, 3, 4, 5];
/** Map quadrants in grid order: top row is high trust and safety, left column is careful. */
const QUADRANTS: CultureType[] = ["builder", "explorer", "guarded", "sprinter"];

/** Score color: red below 40, amber below 60, green from 60. */
const heat = (v: number | null) => (v === null ? "bg-sunken text-dim" : v < 40 ? "bg-up/15 text-up" : v < WEAK_BELOW ? "bg-amber/15 text-amber" : "bg-down/15 text-down");

export function CulturewiseApp() {
  const [orgName, setOrgName] = useState("");
  const [depts, setDepts] = useState<Department[]>(() => [newDepartment("Whole organization")]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = JSON.parse(raw) as { orgName: string; depts: Department[] };
        if (v.depts?.length) {
          setOrgName(v.orgName ?? "");
          setDepts(v.depts);
        }
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ orgName, depts }));
    } catch {}
  }, [orgName, depts, ready]);

  const results = useMemo(() => depts.map(scoreDepartment), [depts]);
  const done = results.filter((r) => r.complete);
  const gap = useMemo(() => biggestGap(results), [results]);
  const summary = useMemo(() => summaryText(orgName, results), [orgName, results]);
  const dept = depts[Math.min(active, depts.length - 1)];

  const patch = (id: string, p: Partial<Department>) => setDepts((ds) => ds.map((d) => (d.id === id ? { ...d, ...p } : d)));
  const rate = (statement: string, r: Rating) => patch(dept.id, { answers: { ...dept.answers, [statement]: r } });
  const go = (n: 1 | 2 | 3) => {
    setStep(n);
    requestAnimationFrame(() => document.getElementById("culture-check")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const loadSample = () => {
    const s = sampleOrg();
    setOrgName(s.orgName);
    setDepts(s.departments);
    setActive(0);
    go(3);
  };
  const reset = () => {
    if (!window.confirm("Clear everything and start over?")) return;
    setOrgName("");
    setDepts([newDepartment("Whole organization")]);
    setActive(0);
    go(1);
  };
  const nextDept = () => {
    const i = depts.findIndex((d, k) => k > active && scoreDepartment(d).answered < STATEMENT_COUNT);
    if (i >= 0) {
      setActive(i);
      go(2);
    } else go(3);
  };

  return (
    <div id="culture-check" className="scroll-mt-6 rounded-2xl border border-line bg-panel print:border-0 print:bg-white print:text-black">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline p-3 sm:p-4 print:hidden">
        <nav aria-label="Steps" className="flex flex-wrap gap-1">
          <button type="button" className={tab(step === 1)} onClick={() => go(1)} aria-current={step === 1 ? "step" : undefined}>
            1. Your teams
          </button>
          <button type="button" className={tab(step === 2)} onClick={() => go(2)} aria-current={step === 2 ? "step" : undefined}>
            2. Rate each team
          </button>
          <button type="button" className={tab(step === 3)} onClick={() => go(3)} aria-current={step === 3 ? "step" : undefined}>
            3. Your culture map ({done.length})
          </button>
        </nav>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={loadSample} className={`font-semibold text-amber hover:underline ${focus}`}>
            See an example
          </button>
          <button type="button" onClick={reset} className={`text-muted hover:text-fg ${focus}`}>
            Start over
          </button>
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-6 p-5 sm:p-8">
          <div className="grid max-w-xl gap-1.5">
            <label htmlFor="cw-org" className={label}>
              Organization name
            </label>
            <input id="cw-org" className={input} value={orgName} maxLength={80} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Riverside Community Services" />
          </div>
          <fieldset className="grid gap-3">
            <legend className={label}>Which teams will you compare?</legend>
            <p className="-mt-1 text-sm text-muted">Culture often differs by department. Add up to {MAX_DEPTS}, or keep one for the whole organization. You&apos;ll rate each one from what you see day to day.</p>
            <ul className="grid gap-2">
              {depts.map((d, i) => (
                <li key={d.id} className="flex items-center gap-2">
                  <label htmlFor={`cw-d-${d.id}`} className="sr-only">
                    Team {i + 1} name
                  </label>
                  <input id={`cw-d-${d.id}`} className={input} value={d.name} maxLength={50} onChange={(e) => patch(d.id, { name: e.target.value })} placeholder="e.g. Finance, Programs, Youth ministry" />
                  {depts.length > 1 && (
                    <button type="button" onClick={() => setDepts((ds) => ds.filter((x) => x.id !== d.id))} className={`rounded-lg p-2.5 text-muted hover:bg-raised hover:text-fg ${focus}`} aria-label={`Remove ${d.name || `team ${i + 1}`}`}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {depts.length < MAX_DEPTS && (
              <button type="button" onClick={() => setDepts((ds) => [...ds, newDepartment()])} className={`${btnSecondary} justify-self-start`}>
                <Plus className="h-4 w-4" aria-hidden /> Add a team
              </button>
            )}
          </fieldset>
          <button
            type="button"
            onClick={() => {
              setActive(0);
              go(2);
            }}
            className={`${btnPrimary} justify-self-start`}
          >
            Next: rate each team <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {step === 2 && dept && (
        <div className="grid gap-6 p-5 sm:p-8">
          {depts.length > 1 && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Teams">
              {depts.map((d, i) => {
                const r = results[i];
                return (
                  <button key={d.id} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${focus} ${i === active ? "border-amber bg-amber/15 text-amber" : "border-line text-muted hover:text-fg"}`}>
                    {r.name} <span className="font-mono text-xs opacity-80">{r.answered}/{STATEMENT_COUNT}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">How true is each statement for {results[active]?.name}?</h3>
            <p className="mt-1 text-sm text-muted">Answer for how things really are, not how they should be. Your first instinct is usually right.</p>
          </div>

          {DIMENSIONS.map((dim) => (
            <fieldset key={dim.id} className="grid gap-3">
              <legend className="font-mono text-xs uppercase tracking-[0.14em] text-amber">{dim.name}</legend>
              {dim.statements.map((s) => (
                <div key={s.id} className="rounded-xl border border-line bg-sunken p-3 sm:p-4">
                  <p id={`q-${s.id}`} className="text-[15px] font-medium text-fg">
                    {s.text}
                  </p>
                  <div role="radiogroup" aria-labelledby={`q-${s.id}`} className="mt-3 grid grid-cols-5 gap-1.5">
                    {RATINGS.map((r) => {
                      const on = dept.answers[s.id] === r;
                      return (
                        <button key={r} type="button" role="radio" aria-checked={on} aria-label={RATING_LABELS[r]} title={RATING_LABELS[r]} onClick={() => rate(s.id, r)} className={`flex min-h-[44px] flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-sm font-bold transition ${focus} ${on ? "border-amber bg-amber text-amber-ink" : "border-line bg-panel text-muted hover:text-fg"}`}>
                          {r}
                          <span className="hidden text-[10px] font-medium leading-tight sm:block">{RATING_LABELS[r]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </fieldset>
          ))}

          <fieldset className="grid gap-2">
            <legend className="font-mono text-xs uppercase tracking-[0.14em] text-amber">AI today</legend>
            <p className="text-[15px] font-medium text-fg">How does this team use AI right now?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {AI_USE.map((a) => (
                <label key={a.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-sunken px-3 py-2.5 text-sm text-soft has-[:checked]:border-amber/60">
                  <input type="radio" name={`ai-${dept.id}`} className="accent-[#f2b54b]" checked={dept.aiUse === a.id} onChange={() => patch(dept.id, { aiUse: a.id as AiUse })} />
                  {a.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={nextDept} className={btnPrimary}>
              {depts.some((d, k) => k > active && scoreDepartment(d).answered < STATEMENT_COUNT) ? "Next team" : "See your culture map"} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <span className="font-mono text-xs text-muted">
              {results[active]?.answered} of {STATEMENT_COUNT} answered
            </span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-8 p-5 sm:p-8">
          {done.length === 0 ? (
            <div className="rounded-xl border border-line bg-sunken p-6 text-center">
              <p className="font-semibold">Rate at least one team to see your culture map.</p>
              <button type="button" onClick={() => go(2)} className={`${btnPrimary} mt-4`}>
                Rate a team
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{orgName.trim() || "Your organization"} · AI culture check</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Your culture map</h3>
                <p className="mt-1 max-w-[62ch] text-muted">Each team sits where its pace of change meets its trust and safety. Where a team sits tells you how to introduce AI there.</p>
              </div>

              <CultureMap results={done} />

              {gap && (
                <p className="rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-soft">
                  <strong className="text-fg">Biggest difference: {gap.dimension.name}.</strong> {gap.high.name} scores {gap.high.scores[gap.dimension.id]} and {gap.low.name} scores {gap.low.scores[gap.dimension.id]}. One rollout plan won&apos;t fit both, so plan each team&apos;s path separately.
                </p>
              )}

              <ScoreTable results={done} />

              <ul className="grid gap-4 lg:grid-cols-2">
                {done.map((r) => (
                  <TeamCard key={r.id} r={r} />
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <CopyButton text={summary} label="Copy summary" />
                <button type="button" onClick={() => window.print()} className={btnSecondary}>
                  <Printer className="h-4 w-4" aria-hidden /> Print or save as PDF
                </button>
                {results.some((r) => !r.complete) && (
                  <button type="button" onClick={() => go(2)} className={`text-sm font-semibold text-amber hover:underline ${focus}`}>
                    Finish rating {results.filter((r) => !r.complete).length} more team{results.filter((r) => !r.complete).length === 1 ? "" : "s"}
                  </button>
                )}
              </div>
              <p className="text-sm text-muted">This is a conversation starter, not a diagnosis. Compare it with what people tell you, and ask a few people in each team to rate it too.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CultureMap({ results }: { results: DeptResult[] }) {
  const description = results.map((r) => `${r.name}: ${TYPES[r.type!].name}, pace ${r.scores.pace}, trust and safety ${r.trustSafety}`).join("; ");
  return (
    <figure className="grid gap-2">
      <div className="flex gap-2">
        <span className="flex w-5 shrink-0 items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted [writing-mode:vertical-rl] rotate-180">Trust and safety →</span>
        <div role="img" aria-label={`Culture map. ${description}`} className="relative aspect-square w-full max-w-[560px] overflow-hidden rounded-2xl border border-line sm:aspect-[4/3]">
          <div className="grid h-full grid-cols-2 grid-rows-2">
            {QUADRANTS.map((t) => (
              <div key={t} className="relative border border-hairline p-3" style={{ background: `${TYPES[t].color}12` }}>
                <p className="text-sm font-bold" style={{ color: TYPES[t].color }}>
                  {TYPES[t].name}
                </p>
                <p className="hidden text-xs text-muted sm:block">{TYPES[t].tagline}</p>
              </div>
            ))}
          </div>
          {results.map((r, i) => (
            <span key={r.id} className="absolute flex -translate-x-1/2 translate-y-1/2 items-center gap-1.5" style={{ left: `${clamp(r.scores.pace!)}%`, bottom: `${clamp(r.trustSafety! + (i % 2 ? -3 : 3))}%` }}>
              <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[#0b1220] shadow-lg" style={{ background: TYPES[r.type!].color }} aria-hidden />
              <span className="whitespace-nowrap rounded-md bg-[#0b1220]/85 px-1.5 py-0.5 text-xs font-semibold text-fg">{r.name}</span>
            </span>
          ))}
        </div>
      </div>
      <figcaption className="ml-7 max-w-[560px] text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Pace of change →</figcaption>
    </figure>
  );
}

const clamp = (v: number) => Math.max(8, Math.min(92, v));

function ScoreTable({ results }: { results: DeptResult[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="border-b border-line bg-raised px-4 py-3 text-left font-semibold text-fg">Scores out of 100 (below {WEAK_BELOW} needs attention)</caption>
        <thead className="bg-panel">
          <tr>
            <th scope="col" className="px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-amber">
              Team
            </th>
            {DIMENSIONS.map((d) => (
              <th key={d.id} scope="col" className="px-3 py-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-amber">
                {d.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className="border-t border-line">
              <th scope="row" className="px-4 py-3 font-semibold text-fg">
                {r.name}
                <span className="block text-xs font-normal" style={{ color: TYPES[r.type!].color }}>
                  {TYPES[r.type!].name}
                </span>
              </th>
              {DIMENSIONS.map((d) => (
                <td key={d.id} className="px-3 py-3">
                  <span className={`inline-block min-w-[3rem] rounded-md px-2 py-1 text-center font-mono font-bold ${heat(r.scores[d.id])}`}>{r.scores[d.id]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamCard({ r }: { r: DeptResult }) {
  const t = TYPES[r.type!];
  return (
    <li className="grid gap-3 rounded-2xl border border-line bg-sunken p-5">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ background: t.color }} aria-hidden />
        <p className="text-lg font-bold">{r.name}</p>
        <span className="ml-auto rounded-full border px-2.5 py-0.5 text-xs font-bold" style={{ borderColor: `${t.color}80`, color: t.color }}>
          {t.name}
        </span>
      </div>
      <p className="text-sm text-muted">{t.tagline}.</p>
      <p className="text-sm text-soft">
        <strong className="text-fg">Lead with:</strong> {t.leadWith}
      </p>
      <p className="text-sm text-soft">
        <strong className="text-fg">Watch for:</strong> {t.watch}
      </p>
      {r.lowest && (
        <p className="text-sm text-soft">
          <strong className="text-fg">Weakest area: {r.lowest.name}</strong> <span className="font-mono text-xs text-amber">ADKAR: {r.lowest.fix.adkar}</span>
          <br />
          {r.lowest.fix.text}
        </p>
      )}
      {r.aiUse === "hidden" && (
        <p className="rounded-lg border border-up/40 bg-up/10 p-3 text-sm text-soft">
          AI is used quietly on personal accounts here. Bring it into the open with <a href="/apps/governwise" className="font-semibold text-amber underline-offset-2 hover:underline">the free AI governance kit</a>.
        </p>
      )}
    </li>
  );
}
