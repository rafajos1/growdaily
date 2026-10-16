"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Check, Church, Flame, Info, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { addDays, fromISO, todayISO, weekday } from "../../../lib/habitwise/dates";
import {
  bestStreak,
  buildReviewInput,
  completionRate,
  currentStreak,
  dayScore,
  describeSchedule,
  isDone,
  isScheduled,
  missesByWeekday,
  todayProgress,
  toggleCheck,
} from "../../../lib/habitwise/logic";
import { chapterUrl, FAITH_HABITS, verseFor } from "../../../lib/habitwise/faith";
import { FaithSwitch } from "../../components/FaithSwitch";
import { useFaith } from "../../components/useFaith";
import { sampleData } from "../../../lib/habitwise/sample";
import { loadData, newId, saveData, STORAGE_KEY } from "../../../lib/habitwise/storage";
import type { Habit, HabitData } from "../../../lib/habitwise/types";
import { HabitForm, type HabitDraft } from "./HabitForm";
import { ACCENT, btn, eyebrow, Modal, panel } from "./ui";

const EXAMPLES_KEY = "habitwise:examples";
const REVIEW_KEY = "habitwise:review";
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Tab = "today" | "progress";
type Dialog = { kind: "none" } | { kind: "create" } | { kind: "edit"; habit: Habit } | { kind: "delete"; habit: Habit };

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

const longDate = (iso: string) => fromISO(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export function HabitwiseApp() {
  const [data, setData] = useState<HabitData>({ habits: [], checks: {} });
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [examples, setExamples] = useState(false);
  const [tab, setTab] = useState<Tab>("today");
  const [dialog, setDialog] = useState<Dialog>({ kind: "none" });
  const [toast, setToast] = useState<string | null>(null);
  const [faith, setFaith] = useFaith();
  const today = todayISO();
  const takenNames = new Set(data.habits.map((h) => h.name.toLowerCase()));
  const faithSuggestions = faith ? FAITH_HABITS.filter((f) => !takenNames.has(f.name.toLowerCase())) : undefined;

  // Load once; seed examples on the very first visit so the app opens in a working state.
  useEffect(() => {
    try {
      let loaded = loadData();
      if (loaded.habits.length === 0 && safeGet(EXAMPLES_KEY) === null) {
        loaded = sampleData(todayISO());
        saveData(loaded);
        safeSet(EXAMPLES_KEY, "1");
      }
      setData(loaded);
      setExamples(safeGet(EXAMPLES_KEY) === "1" && loaded.habits.length > 0);
    } catch {
      setStorageError("Your browser isn't letting Habitwise save. Changes will be lost when you close the page.");
    }
    setReady(true);
    if (location.hash === "#progress") setTab("progress");
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
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = useCallback((next: HabitData, message?: string) => {
    setData(next);
    try {
      saveData(next);
      setStorageError(null);
    } catch {
      setStorageError("Couldn't save your last change. Your browser storage may be full or blocked.");
    }
    if (message) setToast(message);
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "progress" ? "#progress" : location.pathname);
  };

  const saveHabit = (draft: HabitDraft) => {
    if (dialog.kind === "edit") {
      commit({ ...data, habits: data.habits.map((h) => (h.id === dialog.habit.id ? { ...h, ...draft } : h)) }, "Habit updated.");
    } else {
      const habit: Habit = { id: newId(), ...draft, startDate: today, createdAt: new Date().toISOString() };
      commit({ ...data, habits: [...data.habits, habit] }, `Added “${draft.name}”.`);
    }
    setDialog({ kind: "none" });
  };

  const deleteHabit = (habit: Habit) => {
    const checks = { ...data.checks };
    delete checks[habit.id];
    commit({ habits: data.habits.filter((h) => h.id !== habit.id), checks }, `Deleted “${habit.name}”.`);
    setDialog({ kind: "none" });
  };

  const toggleFaith = () => {
    const next = !faith;
    setFaith(next);
    setToast(next ? "Faith is on across GrowDaily. A verse for each day, plus faith habit ideas when you add a habit." : "Faith is off.");
  };

  const clearExamples = () => {
    commit({ habits: [], checks: {} }, "Examples cleared. Add your first habit.");
    safeSet(EXAMPLES_KEY, "0");
    setExamples(false);
  };

  return (
    <div className="min-h-screen pb-28 px-[max(16px,env(safe-area-inset-left))] sm:pb-16">
      <header className="mx-auto flex h-[72px] max-w-5xl items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/" className={btn.ghost} aria-label="Back to GrowDaily">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <span className="h-3 w-3 rounded-full bg-down shadow-[0_0_0_4px_rgba(83,207,160,0.15)]" aria-hidden />
            Habitwise
          </span>
        </div>
        <nav aria-label="Habitwise" className="flex gap-1 rounded-[10px] border border-line bg-panel p-1">
          {(["today", "progress"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-current={tab === t ? "page" : undefined}
              onClick={() => switchTab(t)}
              className={`rounded-[7px] px-3 py-1.5 text-sm font-semibold capitalize transition ${tab === t ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="hidden sm:block">
          <button type="button" onClick={() => setDialog({ kind: "create" })} className={btn.primary}>
            <Plus className="h-4 w-4" aria-hidden /> New habit
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5">
        {storageError && (
          <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm text-soft">
            {storageError}
          </p>
        )}
        {examples && (
          <div className="flex flex-col gap-3 rounded-xl border border-down/40 bg-down/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
            <Info className="h-5 w-5 shrink-0 text-down" aria-hidden />
            <p className="flex-1">
              These are <strong className="text-fg">example habits</strong> with six weeks of history, so you can see how Habitwise works.
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
                Keep them
              </button>
              <button type="button" className={btn.primary} onClick={clearExamples}>
                Start fresh
              </button>
            </div>
          </div>
        )}

        {!ready ? (
          <div className={`${panel} h-64 animate-pulse`} aria-busy="true" aria-label="Loading" />
        ) : data.habits.length === 0 ? (
          <div className={`${panel} flex flex-col items-center px-6 py-16 text-center`}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-down/15 text-down">
              <Check className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="mt-4 text-lg font-bold">Start with one small habit</h1>
            <p className="mt-1 max-w-sm text-sm text-muted">Pick something you can do in five minutes. Habitwise tracks your streak and tells you each week what&apos;s working.</p>
            <button type="button" onClick={() => setDialog({ kind: "create" })} className={`${btn.primary} mt-6`}>
              <Plus className="h-4 w-4" aria-hidden /> Add your first habit
            </button>
          </div>
        ) : tab === "today" ? (
          <TodayView data={data} today={today} faith={faith} canSuggest={!!faithSuggestions?.length} onAddFaithHabit={() => setDialog({ kind: "create" })} onToggle={(id, date) => commit(toggleCheck(data, id, date))} onEdit={(h) => setDialog({ kind: "edit", habit: h })} onDelete={(h) => setDialog({ kind: "delete", habit: h })} />
        ) : (
          <ProgressView data={data} today={today} faith={faith} />
        )}
        {ready && <FaithPanel on={faith} onToggle={toggleFaith} />}
      </main>

      {/* Mobile add button */}
      <button
        type="button"
        onClick={() => setDialog({ kind: "create" })}
        aria-label="New habit"
        className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] right-[max(20px,env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-down text-[#06231a] shadow-lg shadow-black/40 sm:hidden"
      >
        <Plus className="h-6 w-6" aria-hidden />
      </button>

      <Modal open={dialog.kind === "create" || dialog.kind === "edit"} title={dialog.kind === "edit" ? "Edit habit" : "New habit"} onClose={() => setDialog({ kind: "none" })}>
        <HabitForm key={dialog.kind === "edit" ? dialog.habit.id : "new"} initial={dialog.kind === "edit" ? dialog.habit : undefined} suggestions={faithSuggestions} onSubmit={saveHabit} onCancel={() => setDialog({ kind: "none" })} />
      </Modal>
      <Modal open={dialog.kind === "delete"} title="Delete habit?" onClose={() => setDialog({ kind: "none" })}>
        {dialog.kind === "delete" && (
          <>
            <p className="text-sm text-soft">
              “{dialog.habit.name}” and its whole history will be removed. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className={btn.secondary} onClick={() => setDialog({ kind: "none" })}>
                Cancel
              </button>
              <button type="button" className={btn.danger} onClick={() => deleteHabit(dialog.habit)}>
                Delete habit
              </button>
            </div>
          </>
        )}
      </Modal>

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

// ---------------------------------------------------------------------------

function ProgressRing({ done, due }: { done: number; due: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const frac = due ? done / due : 0;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${done} of ${due} done`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="#1d2b3e" strokeWidth="8" />
      <circle cx="42" cy="42" r={r} fill="none" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${c * frac} ${c}`} transform="rotate(-90 42 42)" style={{ transition: "stroke-dasharray 300ms ease" }} />
      <text x="42" y="47" textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="15" fill="#e8eef5">
        {due ? Math.round(frac * 100) : 0}%
      </text>
    </svg>
  );
}

function FaithPanel({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <section className={`${panel} flex items-center gap-4 p-4 sm:p-5`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber">
        <Church className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p id="faith-label" className="text-sm font-semibold">
          Faith
        </p>
        <p className="mt-0.5 text-xs text-muted">
          A Bible verse each day, ideas like prayer and gratitude, and a weekly review that honors them. Questions welcome, no church background needed.{" "}
          <Link href="/faith" className="text-amber underline-offset-2 hover:underline">
            More about Faith
          </Link>
        </p>
      </div>
      <FaithSwitch on={on} onChange={onToggle} labelledBy="faith-label" />
    </section>
  );
}

function VerseCard({ today, canSuggest, onAddFaithHabit }: { today: string; canSuggest: boolean; onAddFaithHabit: () => void }) {
  const v = verseFor(today);
  return (
    <section className={`${panel} relative overflow-hidden p-5 sm:p-6`} aria-labelledby="verse-heading">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden />
      <p id="verse-heading" className={`${eyebrow} flex items-center gap-1.5`}>
        <BookOpen className="h-3.5 w-3.5 text-amber" aria-hidden /> Verse for today
      </p>
      <blockquote className="mt-3 text-lg font-medium leading-relaxed text-fg sm:text-xl">“{v.text}”</blockquote>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted">
          {v.ref} · KJV ·{" "}
          <a href={chapterUrl(v)} target="_blank" rel="noopener noreferrer" className="text-amber underline-offset-2 hover:underline">
            Read {v.chapter}
          </a>
        </p>
        {canSuggest && (
          <button type="button" onClick={onAddFaithHabit} className={btn.secondary}>
            <Plus className="h-4 w-4" aria-hidden /> Add a faith habit
          </button>
        )}
      </div>
    </section>
  );
}

function TodayView({
  data,
  today,
  faith,
  canSuggest,
  onAddFaithHabit,
  onToggle,
  onEdit,
  onDelete,
}: {
  data: HabitData;
  today: string;
  faith: boolean;
  canSuggest: boolean;
  onAddFaithHabit: () => void;
  onToggle: (id: string, date: string) => void;
  onEdit: (h: Habit) => void;
  onDelete: (h: Habit) => void;
}) {
  const { due, done } = todayProgress(data, data.habits, today);
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const message =
    due === 0 ? "Nothing scheduled today. Enjoy the rest day." : done === due ? "Everything done for today. Nice work." : done === 0 ? "A fresh day. Start with the easiest one." : `${due - done} to go.`;
  const sorted = [...data.habits].sort((a, b) => Number(isScheduled(b, today)) - Number(isScheduled(a, today)));

  return (
    <>
      <section className={`${panel} flex items-center justify-between gap-6 p-5 sm:p-6`}>
        <div>
          <p className={eyebrow}>{longDate(today)}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            {done} <span className="text-muted">of {due} done</span>
          </h1>
          <p className="mt-2 text-soft">{message}</p>
        </div>
        <ProgressRing done={done} due={due} />
      </section>

      {faith && <VerseCard today={today} canSuggest={canSuggest} onAddFaithHabit={onAddFaithHabit} />}

      <ul className="space-y-3">
        {sorted.map((h) => {
          const scheduledToday = isScheduled(h, today);
          const doneToday = isDone(data, h.id, today);
          const streak = currentStreak(data, h, today);
          return (
            <li key={h.id} className={`${panel} group flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:flex-nowrap sm:p-5 ${scheduledToday ? "" : "opacity-60"}`}>
              <button
                type="button"
                onClick={() => scheduledToday && onToggle(h.id, today)}
                disabled={!scheduledToday}
                aria-pressed={doneToday}
                aria-label={scheduledToday ? `${doneToday ? "Undo" : "Mark done"}: ${h.name}` : `${h.name} isn't scheduled today`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-95 disabled:cursor-default"
                style={{ borderColor: h.color, background: doneToday ? h.color : "transparent", color: doneToday ? "#06231a" : h.color }}
              >
                {doneToday && <Check className="h-6 w-6" strokeWidth={3} aria-hidden />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate font-semibold ${doneToday ? "text-muted line-through decoration-2" : ""}`}>{h.name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted">
                  {describeSchedule(h.days)}
                  {!scheduledToday && <span>· not today</span>}
                  {streak > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber">
                      <Flame className="h-3.5 w-3.5" aria-hidden /> {streak} day{streak === 1 ? "" : "s"}
                    </span>
                  )}
                </p>
              </div>
              <div className="order-last flex w-full items-center justify-between gap-1.5 sm:order-none sm:w-auto sm:justify-start" role="group" aria-label={`Last 7 days for ${h.name}`}>
                {week.map((date) => {
                  const sched = isScheduled(h, date);
                  const ok = isDone(data, h.id, date);
                  const label = `${DAY_SHORT[weekday(date)]} ${Number(date.slice(8))}`;
                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={!sched}
                      onClick={() => onToggle(h.id, date)}
                      title={sched ? `${label}: ${ok ? "done" : "missed"} (tap to change)` : `${label}: not scheduled`}
                      aria-label={sched ? `${label}: ${ok ? "done" : "not done"}` : `${label}: not scheduled`}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className="block h-6 w-6 rounded-md border transition"
                        style={
                          !sched
                            ? { borderColor: "transparent", background: "#172638" }
                            : ok
                              ? { borderColor: h.color, background: h.color }
                              : { borderColor: date === today ? h.color : "#2b3a50", background: "transparent" }
                        }
                      />
                      <span className={`font-mono text-[10px] ${date === today ? "text-fg" : "text-dim"}`}>{DAY_SHORT[weekday(date)][0]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button type="button" onClick={() => onEdit(h)} className={btn.ghost} aria-label={`Edit ${h.name}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onDelete(h)} className={`${btn.ghost} hover:bg-up/10 hover:text-up`} aria-label={`Delete ${h.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-center font-mono text-xs text-dim">Forgot a day? Tap any square in the last week to fill it in.</p>
    </>
  );
}

// ---------------------------------------------------------------------------

const WEEKS = 15;
const HEAT = ["#172638", "#1c4a3d", "#24705a", "#36a47f", "#53cfa0"];

function Heatmap({ data, today }: { data: HabitData; today: string }) {
  // Columns are weeks (oldest left), rows Sunday..Saturday; the last column is this week.
  const lastSunday = addDays(today, -weekday(today));
  const start = addDays(lastSunday, -(WEEKS - 1) * 7);
  const level = (s: number | null) => (s === null ? -1 : s === 0 ? 0 : s < 0.34 ? 1 : s < 0.67 ? 2 : s < 1 ? 3 : 4);
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1.5" role="img" aria-label={`Daily completion over the last ${WEEKS} weeks`}>
        <div className="mr-1 grid grid-rows-7 gap-1.5 font-mono text-[10px] text-dim">
          {DAY_SHORT.map((d, i) => (
            <span key={d} className="flex h-4 items-center sm:h-5">{i % 2 ? d : ""}</span>
          ))}
        </div>
        {Array.from({ length: WEEKS }, (_, w) => (
          <div key={w} className="grid grid-rows-7 gap-1.5">
            {Array.from({ length: 7 }, (_, d) => {
              const date = addDays(start, w * 7 + d);
              if (date > today) return <span key={d} className="h-4 w-4 sm:h-5 sm:w-5" />;
              const lv = level(dayScore(data, data.habits, date));
              return (
                <span
                  key={d}
                  title={date}
                  className={`h-4 w-4 rounded-[4px] sm:h-5 sm:w-5 ${date === today ? "outline outline-1 outline-offset-1 outline-down" : ""}`}
                  style={{ background: lv === -1 ? "transparent" : HEAT[lv], border: lv === -1 ? "1px dashed #22324a" : undefined }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted" aria-hidden>
        none {HEAT.map((c) => <i key={c} className="inline-block h-2.5 w-[18px] rounded-[3px]" style={{ background: c }} />)} all done
      </div>
    </div>
  );
}

function ReviewPanel({ data, today, faith }: { data: HabitData; today: string; faith: boolean }) {
  const [state, setState] = useState<{ status: "idle" | "loading" | "done" | "error"; text?: string; date?: string }>({ status: "idle" });

  useEffect(() => {
    const saved = safeGet(REVIEW_KEY);
    if (!saved) return;
    try {
      const r = JSON.parse(saved) as { text: string; date: string };
      if (r.text && r.date) setState({ status: "done", text: r.text, date: r.date });
    } catch {
      /* ignore */
    }
  }, []);

  const request = async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/habitwise/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...buildReviewInput(data, today), faith }),
      });
      const body = (await res.json().catch(() => ({}))) as { review?: string; error?: string };
      if (!res.ok || !body.review) throw new Error(body.error || "The review couldn't be written right now. Please try again.");
      safeSet(REVIEW_KEY, JSON.stringify({ text: body.review, date: today }));
      setState({ status: "done", text: body.review, date: today });
    } catch (err) {
      setState({ status: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  const fresh = state.status === "done" && state.date === today;
  return (
    <section className={`${panel} p-5 sm:p-6`} aria-labelledby="review-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="review-heading" className="flex items-center gap-2 text-base font-bold">
          <Sparkles className="h-4 w-4 text-down" aria-hidden /> Your weekly review
        </h2>
        <button type="button" onClick={request} disabled={state.status === "loading" || fresh} className={state.status === "done" ? btn.secondary : btn.primary}>
          {state.status === "loading" ? "Writing your review…" : fresh ? "Updated today" : state.status === "done" ? "Refresh review" : "Get my review"}
        </button>
      </div>
      {state.status === "idle" && (
        <p className="mt-3 text-sm text-muted">
          AI looks at your last 7 and 30 days and tells you what&apos;s working, what&apos;s slipping, and one small change to try. Only your habit names and numbers are sent, never anything else.
        </p>
      )}
      {state.status === "loading" && <div className="mt-4 space-y-2" aria-busy="true">{[90, 75, 60].map((w) => <div key={w} className="h-3.5 animate-pulse rounded bg-raised" style={{ width: `${w}%` }} />)}</div>}
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm font-semibold text-up">
          {state.text}
        </p>
      )}
      {state.status === "done" && (
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-soft">
          {state.text!.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="font-mono text-xs text-dim">Written {state.date === today ? "today" : fromISO(state.date!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
        </div>
      )}
    </section>
  );
}

function ProgressView({ data, today, faith }: { data: HabitData; today: string; faith: boolean }) {
  const stats = useMemo(
    () =>
      data.habits.map((h) => ({
        habit: h,
        rate: completionRate(data, h, today, 30),
        current: currentStreak(data, h, today),
        best: bestStreak(data, h, today),
      })),
    [data, today],
  );
  const misses = useMemo(() => missesByWeekday(data, data.habits, today, 28), [data, today]);
  const maxMiss = Math.max(...misses, 1);
  const worst = misses.indexOf(Math.max(...misses));
  const week = data.habits.reduce(
    (acc, h) => {
      const r = completionRate(data, h, today, 7);
      return { done: acc.done + r.done, scheduled: acc.scheduled + r.scheduled };
    },
    { done: 0, scheduled: 0 },
  );

  return (
    <>
      <h1 className="sr-only">Progress</h1>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <section className={`${panel} min-w-0 p-5 sm:p-6`}>
          <p className={eyebrow}>Last 7 days</p>
          <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em]">
            {week.scheduled ? Math.round((week.done / week.scheduled) * 100) : 0}%
            <span className="ml-2 font-mono text-base font-medium tracking-normal text-muted">
              {week.done} of {week.scheduled} check-ins
            </span>
          </p>
          <div className="mt-5">
            <Heatmap data={data} today={today} />
          </div>
        </section>
        <ReviewPanel data={data} today={today} faith={faith} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_1fr]">
        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="text-base font-bold">Each habit, last 30 days</h2>
          <ul className="mt-3 divide-y divide-hairline">
            {stats.map(({ habit, rate, current, best }) => (
              <li key={habit.id} className="py-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: habit.color }} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{habit.name}</span>
                  <span className="font-mono text-sm">{rate.rate === null ? "–" : `${Math.round(rate.rate * 100)}%`}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-raised">
                  <div className="h-full rounded-full" style={{ width: `${(rate.rate ?? 0) * 100}%`, background: habit.color }} />
                </div>
                <p className="mt-1.5 flex gap-4 font-mono text-xs text-muted">
                  <span>{rate.done}/{rate.scheduled} days</span>
                  <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3 text-amber" aria-hidden /> {current} now</span>
                  <span>best {best}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="text-base font-bold">When habits slip</h2>
          <p className="mt-1 text-sm text-muted">
            {misses[worst] > 0 ? (
              <>
                Most missed days fall on <b className="text-up">{DAY_SHORT[worst]}</b>s over the last 4 weeks.
              </>
            ) : (
              "No missed days in the last 4 weeks."
            )}
          </p>
          <div className="mt-5 flex h-36 items-end gap-2" role="img" aria-label="Missed check-ins by weekday">
            {misses.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className={`font-mono text-[11px] ${i === worst && m > 0 ? "text-up" : "text-muted"}`}>{m}</span>
                <div className="w-full rounded-md" style={{ height: `${Math.max((m / maxMiss) * 96, 3)}px`, background: i === worst && m > 0 ? "#f2846b" : "#2a4462" }} />
                <span className="font-mono text-[11px] text-muted">{DAY_SHORT[i]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
