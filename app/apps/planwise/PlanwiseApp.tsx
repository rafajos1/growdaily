"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Church, Coffee, Info, Pause, Play, RotateCcw, Sparkles, Square, Sun, Target, Wand2 } from "lucide-react";
import { markDone } from "../../../lib/journey";
import { addQuietMoments, isQuiet } from "../../../lib/planwise/quiet";
import { FaithPanel } from "../../components/FaithPanel";
import { FaithToggle } from "../../components/FaithToggle";
import { NextUp } from "../../components/NextUp";
import { useFaith } from "../../components/useFaith";
import { EXAMPLE_DUMP, EXAMPLE_PLAN } from "../../../lib/planwise/example";
import {
  basicPlan,
  currentBlockIndex,
  formatTime,
  fromMinutes,
  plannedMinutes,
  splitDump,
  toMinutes,
  type Block,
  type BlockKind,
  type Plan,
} from "../../../lib/planwise/plan";

const ACCENT = "#5cb8e6";
const STORAGE_KEY = "planwise:v1";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5cb8e6]";
const btn = {
  primary: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#5cb8e6] px-4 py-2.5 text-sm font-bold text-[#04202e] transition hover:brightness-110 disabled:opacity-60 ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] disabled:opacity-60 ${focus}`,
  ghost: `inline-flex items-center justify-center rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg ${focus}`,
};
const panel = "rounded-2xl border border-line bg-panel";
const eyebrow = "font-mono text-xs uppercase tracking-[0.14em] text-muted";

const KIND: Record<BlockKind, { label: string; color: string }> = {
  focus: { label: "Focus", color: "#5cb8e6" },
  task: { label: "Task", color: "#8a9bb2" },
  break: { label: "Break", color: "#53cfa0" },
  fixed: { label: "Fixed", color: "#f2b54b" },
};

type Source = "ai" | "basic" | "example";
interface Saved {
  date: string;
  dump: string;
  dayStart: string;
  dayEnd: string;
  plan: Plan | null;
  source: Source;
  done: string[];
}

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const blockKey = (b: Block) => `${b.start}|${b.title}`;
const duration = (b: Block) => toMinutes(b.end)! - toMinutes(b.start)!;
const hm = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ""}` : `${min}m`);

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

/** Unfinished work from an earlier day becomes the start of today's brain dump. */
function carryOver(saved: Saved): string[] {
  if (!saved.plan) return splitDump(saved.dump);
  const undone = saved.plan.blocks.filter((b) => b.kind !== "break" && b.kind !== "fixed" && !saved.done.includes(blockKey(b))).map((b) => b.title);
  return [...undone, ...saved.plan.later.map((l) => l.title)];
}

export function PlanwiseApp() {
  const [date] = useState(todayISO);
  const [dump, setDump] = useState("");
  const [dayStart, setDayStart] = useState("09:00");
  const [dayEnd, setDayEnd] = useState("17:30");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [source, setSource] = useState<Source>("example");
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ tone: "info" | "warn"; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(nowMinutes);
  const [timer, setTimer] = useState<{ key: string; title: string; endsAt: number; remaining: number; paused: boolean } | null>(null);
  const dumpRef = useRef<HTMLTextAreaElement>(null);
  const [faith, setFaith] = useFaith();

  useEffect(() => {
    const saved = load();
    if (!saved) {
      setDump(EXAMPLE_DUMP);
      setPlan(EXAMPLE_PLAN);
      setSource("example");
    } else if (saved.date !== date) {
      const items = carryOver(saved);
      setDump(items.join("\n"));
      setDayStart(saved.dayStart);
      setDayEnd(saved.dayEnd);
      if (items.length) setNotice({ tone: "info", text: `Carried over ${items.length} unfinished item${items.length === 1 ? "" : "s"} from your last plan. Add today's things and plan your day.` });
    } else {
      setDump(saved.dump);
      setDayStart(saved.dayStart);
      setDayEnd(saved.dayEnd);
      setPlan(saved.plan);
      setSource(saved.source);
      setDone(saved.done);
    }
    setReady(true);
    const tick = setInterval(() => setNow(nowMinutes()), 30_000);
    return () => clearInterval(tick);
  }, [date]);

  // Persist everything except the untouched example.
  useEffect(() => {
    if (!ready || source === "example") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date, dump, dayStart, dayEnd, plan, source, done } satisfies Saved));
    } catch {
      /* storage unavailable: the plan still works for this visit */
    }
  }, [ready, date, dump, dayStart, dayEnd, plan, source, done]);

  // A real plan for today counts as Planwise done for the day.
  useEffect(() => {
    if (ready && plan && source !== "example") markDone("planwise");
  }, [ready, plan, source]);

  // Focus timer tick.
  useEffect(() => {
    if (!timer || timer.paused) return;
    const t = setInterval(() => {
      setTimer((cur) => {
        if (!cur || cur.paused) return cur;
        const remaining = Math.max(0, Math.round((cur.endsAt - Date.now()) / 1000));
        return { ...cur, remaining };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timer?.paused, timer?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const makePlan = useCallback(
    async (text: string) => {
      setError(null);
      const s = toMinutes(dayStart), e = toMinutes(dayEnd);
      if (!text.trim()) return setError("Write down what's on your mind first, one thing per line.");
      if (s === null || e === null || e <= s) return setError("Your end time needs to be after your start time.");
      const current = nowMinutes();
      if (current >= e - 15) return setError("It's past your end time. Move the end time later to plan the rest of today.");
      setLoading(true);
      setNotice(null);
      try {
        const res = await fetch("/api/planwise/plan", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ dump: text, dayStart, dayEnd, now: fromMinutes(current), date }),
        });
        const body = (await res.json().catch(() => ({}))) as { plan?: Plan; error?: string };
        if (res.ok && body.plan) {
          setPlan(faith ? addQuietMoments(body.plan, dayStart, dayEnd, current) : body.plan);
          setSource("ai");
        } else if (res.status === 400) {
          setError(body.error ?? "Something about that request didn't work.");
          return;
        } else {
          throw new Error(body.error ?? "AI planning isn't available right now.");
        }
      } catch (err) {
        const fallback = basicPlan(text, dayStart, dayEnd, current > s! ? current : undefined);
        setPlan(faith ? addQuietMoments(fallback, dayStart, dayEnd, current) : fallback);
        setSource("basic");
        setNotice({ tone: "warn", text: `${err instanceof Error ? err.message : "AI planning isn't available right now."} Here's a basic plan in the order you wrote things.` });
      } finally {
        setDone([]);
        setTimer(null);
        setLoading(false);
        setNow(nowMinutes());
      }
    },
    [dayStart, dayEnd, date, faith],
  );

  const changeFaith = (on: boolean) => {
    setFaith(on);
    setNotice(on ? { tone: "info", text: "Faith is on. New plans include short quiet moments to pause and talk with God, and Sundays get a lighter touch." } : null);
  };

  const replanRest = () => {
    if (!plan) return;
    const rest = [...plan.blocks.filter((b) => b.kind !== "break" && !done.includes(blockKey(b)) && toMinutes(b.end)! > now).map((b) => b.title), ...plan.later.map((l) => l.title)];
    const text = rest.join("\n");
    setDump(text);
    void makePlan(text);
  };

  const toggleDone = (b: Block) => {
    const key = blockKey(b);
    setDone((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]));
    if (timer?.key === key) setTimer(null);
  };

  const startFocus = (b: Block) => {
    const minutes = Math.max(1, Math.min(duration(b), toMinutes(b.end)! - now > 0 ? toMinutes(b.end)! - now : duration(b)));
    setTimer({ key: blockKey(b), title: b.title, endsAt: Date.now() + minutes * 60_000, remaining: minutes * 60, paused: false });
  };

  const current = useMemo(() => (plan ? currentBlockIndex(plan, now) : -1), [plan, now]);
  const workBlocks = plan?.blocks.filter((b) => b.kind !== "break") ?? [];
  const doneCount = workBlocks.filter((b) => done.includes(blockKey(b))).length;

  return (
    <div className={`min-h-screen px-[max(16px,env(safe-area-inset-left))] ${timer ? "pb-32" : "pb-16"}`}>
      <header className="mx-auto flex h-[72px] max-w-6xl items-center gap-2">
        <Link href="/" className={btn.ghost} aria-label="Back to GrowDaily">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
          <span className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(92,184,230,0.15)]" style={{ background: ACCENT }} aria-hidden />
          Planwise
        </span>
        <div className="ml-auto">
          <FaithToggle on={faith} onChange={changeFaith} />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-5 lg:grid-cols-[380px_1fr]">
        {/* Brain dump */}
        <section className={`${panel} order-2 min-w-0 p-5 sm:p-6 lg:order-1 lg:sticky lg:top-6`} aria-labelledby="dump-heading">
          <h2 id="dump-heading" className="text-base font-bold">What&apos;s on your mind?</h2>
          <p className="mt-1 text-sm text-muted">One thing per line, in any order. Mention times like &ldquo;dentist at 3pm&rdquo;.</p>
          <label htmlFor="dump" className="sr-only">Brain dump</label>
          <textarea
            id="dump"
            ref={dumpRef}
            value={dump}
            onChange={(e) => {
              setDump(e.target.value);
              setError(null);
            }}
            rows={10}
            maxLength={4000}
            placeholder={"Finish the report\nCall the bank\nGym at 6pm\n…"}
            className="mt-4 block w-full resize-y rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm leading-relaxed text-fg placeholder:text-dim focus:border-[#5cb8e6] focus:outline-none focus:ring-2 focus:ring-[#5cb8e6]/30"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label htmlFor="day-start" className="mb-1 block font-mono text-xs text-muted">Start</label>
              <input id="day-start" type="time" step={900} value={dayStart} onChange={(e) => setDayStart(e.target.value)} className="block w-full min-w-0 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg [color-scheme:dark] focus:border-[#5cb8e6] focus:outline-none" />
            </div>
            <div className="min-w-0">
              <label htmlFor="day-end" className="mb-1 block font-mono text-xs text-muted">End</label>
              <input id="day-end" type="time" step={900} value={dayEnd} onChange={(e) => setDayEnd(e.target.value)} className="block w-full min-w-0 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg [color-scheme:dark] focus:border-[#5cb8e6] focus:outline-none" />
            </div>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-up">
              {error}
            </p>
          )}
          <button type="button" onClick={() => makePlan(dump)} disabled={loading || !ready} className={`${btn.primary} mt-4 w-full`}>
            <Wand2 className="h-4 w-4" aria-hidden />
            {loading ? "Planning your day…" : plan && source !== "example" ? "Re-plan my day" : "Plan my day"}
          </button>
          <p className="mt-3 text-center font-mono text-[11px] text-dim">Your list is sent to AI only when you press the button.</p>
        </section>

        {/* Plan */}
        <section className="order-1 min-w-0 space-y-5 lg:order-2" aria-live="polite">
          {source === "example" && plan && (
            <div className="flex flex-col gap-3 rounded-xl border border-[#5cb8e6]/40 bg-[#5cb8e6]/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
              <Info className="h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
              <p className="flex-1">
                This is an <strong className="text-fg">example plan</strong> made from a sample brain dump. Write your own list and press Plan my day.
              </p>
              <button
                type="button"
                className={btn.secondary}
                onClick={() => {
                  setDump("");
                  setPlan(null);
                  setSource("basic");
                  dumpRef.current?.focus();
                }}
              >
                Start my own
              </button>
            </div>
          )}
          {faith && new Date(`${date}T12:00:00`).getDay() === 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/[0.06] p-4 text-sm text-soft">
              <Sun className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden />
              <p>
                <strong className="text-fg">It&apos;s Sunday.</strong> Rest is a gift, not a reward. Keep today light: plan just what matters and leave room to breathe, worship and be with people you love.
              </p>
            </div>
          )}
          {notice && (
            <p role="status" className={`rounded-xl border p-4 text-sm ${notice.tone === "warn" ? "border-amber/40 bg-amber/10 text-soft" : "border-line bg-panel text-soft"}`}>
              {notice.text}
            </p>
          )}

          {loading ? (
            <div className={`${panel} space-y-3 p-6`} aria-busy="true" aria-label="Planning your day">
              {[70, 100, 85, 100, 60].map((w, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-raised" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : !plan ? (
            <div className={`${panel} flex flex-col items-center px-6 py-16 text-center`}>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5cb8e6]/15" style={{ color: ACCENT }}>
                <Target className="h-7 w-7" aria-hidden />
              </span>
              <h1 className="mt-4 text-lg font-bold">Your plan will appear here</h1>
              <p className="mt-1 max-w-sm text-sm text-muted">Write everything you need to do, set your hours, and press Plan my day. You&apos;ll get time blocks, your top three, and what can wait.</p>
            </div>
          ) : (
            <>
              <div className={`${panel} p-5 sm:p-6`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className={eyebrow}>
                      {new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      {source === "ai" && " · planned with AI"}
                      {source === "basic" && " · basic plan"}
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                      {hm(plannedMinutes(plan))} <span className="text-muted">planned</span>
                    </h1>
                    <p className="mt-1 font-mono text-sm text-muted">
                      {doneCount} of {workBlocks.length} done
                    </p>
                  </div>
                  {source !== "example" && (
                    <div className="flex flex-wrap gap-2">
                      {faith && !plan.blocks.some(isQuiet) && (
                        <button type="button" onClick={() => setPlan(addQuietMoments(plan, dayStart, dayEnd, now))} className={btn.secondary}>
                          <Church className="h-4 w-4 text-amber" aria-hidden /> Add quiet moments
                        </button>
                      )}
                      <button type="button" onClick={replanRest} className={btn.secondary} disabled={loading}>
                        <RotateCcw className="h-4 w-4" aria-hidden /> Re-plan from now
                      </button>
                    </div>
                  )}
                </div>
                {plan.summary && <p className="mt-4 max-w-[60ch] text-soft">{plan.summary}</p>}
                {plan.top3.length > 0 && (
                  <ol className="mt-4 flex flex-wrap gap-2">
                    {plan.top3.map((t, i) => (
                      <li key={t} className="flex items-center gap-2 rounded-full border border-line bg-sunken px-3 py-1.5 text-sm">
                        <span className="font-mono text-xs" style={{ color: ACCENT }}>{i + 1}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <ol className={`${panel} divide-y divide-hairline overflow-hidden`} aria-label="Today's schedule">
                {plan.blocks.map((b, i) => {
                  const key = blockKey(b);
                  const isDone = done.includes(key);
                  const isNow = i === current && toMinutes(b.start)! <= now;
                  const isNext = i === current && !isNow;
                  const past = toMinutes(b.end)! <= now;
                  const quiet = isQuiet(b);
                  const kind = quiet ? { label: "Pause, breathe, and talk with God", color: "#f2b54b" } : KIND[b.kind];
                  const isBreak = b.kind === "break";
                  return (
                    <li key={key} className={`relative flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 ${isNow ? "bg-[#5cb8e6]/[0.07]" : ""} ${past && !isNow ? "opacity-55" : ""}`}>
                      {isNow && <span className="absolute inset-y-0 left-0 w-1" style={{ background: ACCENT }} aria-hidden />}
                      <div className="w-[76px] shrink-0 font-mono text-xs text-muted sm:w-24">
                        <span className="block text-fg">{formatTime(b.start)}</span>
                        {hm(duration(b))}
                      </div>
                      <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: kind.color }} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate font-semibold ${isDone ? "text-muted line-through decoration-2" : ""}`}>
                          {quiet ? (
                            <Church className="mr-1.5 inline h-4 w-4 align-[-2px] text-amber" aria-hidden />
                          ) : (
                            isBreak && <Coffee className="mr-1.5 inline h-4 w-4 align-[-2px] text-down" aria-hidden />
                          )}
                          {b.title}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-xs" style={{ color: kind.color }}>
                          {kind.label}
                          {isNow && <span className="rounded-full bg-[#5cb8e6] px-2 text-[10px] font-semibold uppercase tracking-wider text-[#04202e]">Now</span>}
                          {isNext && <span className="text-muted">· up next</span>}
                        </p>
                      </div>
                      {(isNow || isNext) && !isBreak && !isDone && timer?.key !== key && source !== "example" && (
                        <button type="button" onClick={() => startFocus(b)} className={`${btn.secondary} hidden px-3 py-2 sm:inline-flex`}>
                          <Play className="h-3.5 w-3.5" aria-hidden /> Focus
                        </button>
                      )}
                      {!isBreak && (
                        <button
                          type="button"
                          onClick={() => toggleDone(b)}
                          aria-pressed={isDone}
                          aria-label={`${isDone ? "Mark not done" : "Mark done"}: ${b.title}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-95"
                          style={{ borderColor: isDone ? ACCENT : "#2b3a50", background: isDone ? ACCENT : "transparent", color: "#04202e" }}
                        >
                          {isDone && <Check className="h-5 w-5" strokeWidth={3} aria-hidden />}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>

              {isMobileFocusTarget(plan, current, now, done, source) && (
                <button type="button" onClick={() => startFocus(plan.blocks[current])} className={`${btn.primary} w-full sm:hidden`}>
                  <Play className="h-4 w-4" aria-hidden /> Focus on &ldquo;{plan.blocks[current].title}&rdquo;
                </button>
              )}

              {plan.later.length > 0 && (
                <div className={`${panel} p-5 sm:p-6`}>
                  <h2 className="text-base font-bold">Later</h2>
                  <p className="mt-1 text-sm text-muted">These move to tomorrow&apos;s list automatically.</p>
                  <ul className="mt-3 space-y-2.5">
                    {plan.later.map((l) => (
                      <li key={l.title} className="text-sm">
                        <span className="font-semibold">{l.title}</span>
                        <span className="text-muted"> · {l.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {source !== "example" && <NextUp current="planwise" />}
            </>
          )}
          {ready && (
            <FaithPanel on={faith} onChange={changeFaith}>
              Adds short quiet moments to your plan, and a lighter Sunday.
            </FaithPanel>
          )}
        </section>
      </main>

      {timer && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 px-[max(16px,env(safe-area-inset-left))] pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur" role="region" aria-label="Focus timer">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <Sparkles className="hidden h-5 w-5 shrink-0 sm:block" style={{ color: ACCENT }} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-muted">{timer.remaining === 0 ? "Time's up" : "Focusing on"}</p>
              <p className="truncate font-semibold">{timer.title}</p>
            </div>
            <p className="font-mono text-3xl font-medium tabular-nums" aria-live="off">
              {String(Math.floor(timer.remaining / 60)).padStart(2, "0")}:{String(timer.remaining % 60).padStart(2, "0")}
            </p>
            <button
              type="button"
              className={btn.ghost}
              aria-label={timer.paused ? "Resume" : "Pause"}
              onClick={() => setTimer((t) => (t ? (t.paused ? { ...t, paused: false, endsAt: Date.now() + t.remaining * 1000 } : { ...t, paused: true }) : t))}
            >
              {timer.paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </button>
            <button
              type="button"
              className={btn.primary}
              onClick={() => {
                const b = plan?.blocks.find((x) => blockKey(x) === timer.key);
                if (b && !done.includes(timer.key)) setDone((d) => [...d, timer.key]);
                setTimer(null);
              }}
            >
              <Check className="h-4 w-4" aria-hidden /> Done
            </button>
            <button type="button" className={btn.ghost} aria-label="Stop timer" onClick={() => setTimer(null)}>
              <Square className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function isMobileFocusTarget(plan: Plan, current: number, now: number, done: string[], source: Source): boolean {
  if (current < 0 || source === "example") return false;
  const b = plan.blocks[current];
  return b.kind !== "break" && !done.includes(blockKey(b)) && toMinutes(b.start)! - now <= 60;
}
