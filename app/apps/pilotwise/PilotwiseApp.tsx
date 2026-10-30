"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Info, Plus, Rocket } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { SaveProgress } from "../../components/SaveProgress";
import { newId } from "../../../lib/habitwise/storage";
import { gateStatus, readinessScore, verdict } from "../../../lib/pilotwise/logic";
import { sampleData } from "../../../lib/pilotwise/sample";
import { loadData, saveData, STORAGE_KEY } from "../../../lib/pilotwise/storage";
import { cleanPlan, templatePlan } from "../../../lib/pilotwise/template";
import { EMPTY, type Inputs, type Pilot, type PilotData, type Plan } from "../../../lib/pilotwise/types";
import { NewPlan } from "./NewPlan";
import { PlanView } from "./PlanView";
import { btn, eyebrow, panel } from "./ui";
import { LogoMark } from "../../components/LogoMark";

const EXAMPLES_KEY = "pilotwise:examples";
type View = { kind: "list" } | { kind: "new" } | { kind: "plan"; id: string };

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

export function PilotwiseApp({ intro }: { intro?: ReactNode } = {}) {
  const [data, setData] = useState<PilotData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [examples, setExamples] = useState(false);
  const [view, setView] = useState<View>({ kind: "list" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      let loaded = loadData();
      if (loaded.pilots.length === 0 && safeGet(EXAMPLES_KEY) === null) {
        loaded = sampleData(new Date().toISOString());
        saveData(loaded);
        safeSet(EXAMPLES_KEY, "1");
      }
      setData(loaded);
      setExamples(safeGet(EXAMPLES_KEY) === "1" && loaded.pilots.length > 0);
      if (location.hash === "#new" || loaded.pilots.length === 0) setView({ kind: "new" });
    } catch {
      setStorageError("Your browser isn't letting Pilotwise save. Plans will be lost when you close the page.");
    }
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setData(loadData());
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = useCallback((next: PilotData, message?: string) => {
    setData(next);
    try {
      saveData(next);
      setStorageError(null);
    } catch {
      setStorageError("Couldn't save your last change. Your browser storage may be full or blocked.");
    }
    if (message) setToast(message);
  }, []);

  const open = (id: string) => {
    setView({ kind: "plan", id });
    window.scrollTo(0, 0);
  };
  const add = (inputs: Inputs, plan: Plan, source: Pilot["source"]) => {
    const now = new Date().toISOString();
    const pilot: Pilot = { id: newId(), createdAt: now, updatedAt: now, source, inputs, plan };
    commit({ pilots: [pilot, ...data.pilots].slice(0, 30) }, source === "ai" ? "Your plan is ready. Edit anything, then share the one-pager." : "Template plan created. Tailor it to your use case.");
    open(pilot.id);
  };

  const buildWithAi = async (inputs: Inputs) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/pilotwise/plan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(inputs) });
      const body = (await res.json().catch(() => ({}))) as { plan?: unknown; error?: string };
      if (!res.ok || !body.plan) throw new Error(body.error || "The plan couldn't be written right now. Try again, or start from the template.");
      add(inputs, cleanPlan(body.plan, inputs, newId), "ai");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const updatePlan = (id: string, plan: Plan) => commit({ pilots: data.pilots.map((p) => (p.id === id ? { ...p, plan, updatedAt: new Date().toISOString() } : p)) });
  const current = view.kind === "plan" ? data.pilots.find((p) => p.id === view.id) : undefined;

  return (
    <div className="min-h-screen pb-28 px-[max(16px,env(safe-area-inset-left))] sm:pb-16">
      <header className="mx-auto flex min-h-[72px] max-w-5xl flex-wrap items-center justify-between gap-2 py-3 sm:py-0">
        <div className="flex items-center gap-1 sm:gap-3">
          <HomeLink />
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <LogoMark className="h-8 w-8" />
            Pilotwise
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {data.pilots.length > 0 && (
            <button type="button" onClick={() => setView({ kind: "list" })} className={`${btn.secondary} px-3 py-2`} aria-current={view.kind === "list" ? "page" : undefined}>
              My pilots ({data.pilots.length})
            </button>
          )}
          <button type="button" onClick={() => setView({ kind: "new" })} className={btn.primary}>
            <Plus className="h-4 w-4" aria-hidden /> New plan
          </button>
        </div>
      </header>

      <div className="mx-auto mb-5 max-w-5xl">
        {intro}
        <SaveProgress />
      </div>

      <main className="mx-auto max-w-5xl space-y-5">
        <h1 className="sr-only">Pilotwise: plan an AI pilot that reaches production</h1>
        {storageError && (
          <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm text-soft">
            {storageError}
          </p>
        )}

        {!ready ? (
          <div className={`${panel} h-64 animate-pulse`} aria-busy="true" aria-label="Loading" />
        ) : view.kind === "plan" && current ? (
          <PlanView
            pilot={current}
            onChange={(plan) => updatePlan(current.id, plan)}
            onBack={() => setView({ kind: "list" })}
            onDelete={() => {
              commit({ pilots: data.pilots.filter((p) => p.id !== current.id) }, "Plan deleted.");
              setView(data.pilots.length > 1 ? { kind: "list" } : { kind: "new" });
            }}
            onToast={setToast}
          />
        ) : view.kind === "new" ? (
          <>
            <section className="pt-2">
              <p className={eyebrow}>Free AI pilot planner</p>
              <p className="mt-2 max-w-[24ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
                Get your AI pilot <span className="text-amber">into production</span>.
              </p>
              <p className="mt-4 max-w-[60ch] text-lg text-soft">Most AI pilots never deliver measurable value. Describe yours in a sentence and see what to fix before you build.</p>
            </section>
            <NewPlan busy={busy} error={error} onAi={buildWithAi} onTemplate={(inputs) => add(inputs, templatePlan(inputs, newId), "template")} />
          </>
        ) : (
          <>
            {examples && (
              <div className="flex flex-col gap-3 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
                <Info className="h-5 w-5 shrink-0 text-amber" aria-hidden />
                <p className="flex-1">
                  Here&apos;s an <strong className="text-fg">example pilot</strong>, halfway through, so you can see how Pilotwise works.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={btn.secondary}
                    onClick={() => {
                      safeSet(EXAMPLES_KEY, "0");
                      setExamples(false);
                    }}
                  >
                    Keep it
                  </button>
                  <button
                    type="button"
                    className={btn.primary}
                    onClick={() => {
                      commit({ pilots: [] }, "Example removed.");
                      safeSet(EXAMPLES_KEY, "0");
                      setExamples(false);
                      setView({ kind: "new" });
                    }}
                  >
                    Plan my own
                  </button>
                </div>
              </div>
            )}
            <ul className="grid gap-4 md:grid-cols-2">
              {data.pilots.map((p) => {
                const score = readinessScore(p.plan);
                const v = verdict(score, Math.min(...p.plan.readiness.map((r) => r.score)));
                const g = gateStatus(p.plan);
                return (
                  <li key={p.id}>
                    <button type="button" onClick={() => open(p.id)} className={`${panel} flex h-full w-full flex-col p-5 text-left transition hover:border-[#35507a]`}>
                      <span className="flex items-center gap-2 text-sm">
                        <Rocket className="h-4 w-4 text-amber" aria-hidden />
                        <span className="font-mono text-xs text-muted">Readiness {score}</span>
                        <span className="text-xs" style={{ color: v.tone === "good" ? "#53cfa0" : v.tone === "warn" ? "#f2b54b" : "#f2846b" }}>
                          {v.label}
                        </span>
                      </span>
                      <span className="mt-2 text-lg font-bold">{p.plan.title}</span>
                      <span className="mt-1 text-sm text-muted">
                        Gate: {g.met} of {g.total} criteria met
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {ready && view.kind !== "plan" && (
          <aside className={`${panel} flex flex-col gap-3 p-5 sm:flex-row sm:items-center`}>
            <p className="flex-1 text-sm text-soft">
              <strong className="text-fg">Want an experienced hand on your pilot?</strong> We help teams frame AI use cases, set exit criteria, and run the pilot to a clear go or no-go.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/learn/why-ai-pilots-fail" className={btn.secondary}>
                Why pilots fail
              </Link>
              <Link href="/build/ai-consulting" className={btn.secondary}>
                AI consulting
              </Link>
            </div>
          </aside>
        )}
      </main>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6">
        {toast && (
          <p role="status" className="pointer-events-auto rounded-xl border border-line bg-raised px-4 py-3 text-sm shadow-xl shadow-black/40">
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}
