"use client";

import Link from "next/link";
import { ArrowRight, Check, Moon } from "lucide-react";
import { DAY_ORDER, nextApps, type AppSlug } from "../../lib/journey";
import { APPS } from "../apps";
import { useDay } from "./useDay";
import { useFaith } from "./useFaith";

/** What each app helps with, phrased as the next thing to do. */
export const NEXT_STEP: Record<AppSlug, { plain: string; faith?: string }> = {
  planwise: { plain: "Plan your day", faith: "Plan your day, with quiet moments built in" },
  habitwise: { plain: "Check off today's habits" },
  spendwise: { plain: "Log today's spending" },
  mealwise: { plain: "Find tonight's dinner" },
  moodwise: { plain: "Check in on your day", faith: "Look back on your day with God" },
};

const app = (slug: AppSlug) => APPS.find((a) => a.slug === slug)!;

/** Shown when someone finishes an app's main thing, so the next app is one tap away. */
export function NextUp({ current, className = "" }: { current: AppSlug; className?: string }) {
  const done = useDay();
  const [faith] = useFaith();
  const finished = done.includes(current) ? done : [...done, current];
  const upcoming = nextApps(current, finished);
  const all = upcoming.length === 0;

  return (
    <section className={`rounded-2xl border border-line bg-panel p-5 sm:p-6 ${className}`} aria-labelledby="next-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="next-heading" className="text-base font-bold">
          {all ? (faith ? "That's your whole day. Rest well." : "That's your whole day. Nice work.") : `Nice work. What's next?`}
        </h2>
        <ol className="flex items-center gap-1.5" aria-label={`${finished.length} of ${DAY_ORDER.length} apps done today`}>
          {DAY_ORDER.map((s) => {
            const a = app(s);
            const isDone = finished.includes(s);
            return (
              <li key={s} title={`${a.name}${isDone ? ": done today" : ""}`} className="flex h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: a.color, background: isDone ? a.color : "transparent" }}>
                {isDone && <Check className="h-3 w-3 text-[#0d1520]" strokeWidth={3.5} aria-hidden />}
              </li>
            );
          })}
          <li className="ml-1 font-mono text-xs text-muted" aria-hidden>
            {finished.length}/{DAY_ORDER.length}
          </li>
        </ol>
      </div>

      {all ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Moon className="h-4 w-4 text-amber" aria-hidden /> Everything&apos;s done for today. See you tomorrow.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {upcoming.map((s) => {
            const a = app(s);
            const step = NEXT_STEP[s];
            return (
              <li key={s}>
                {/* A full page load: Spendwise is a static page outside the Next.js router. */}
                <a href={a.href} className="group flex items-center gap-3 rounded-xl border border-line bg-sunken p-3.5 transition hover:border-[#35507a]">
                  <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: a.color }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{a.name}</span>
                    <span className="block text-sm text-muted">{(faith && step.faith) || step.plain}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/" className="mt-4 inline-block text-xs font-semibold text-muted hover:text-fg">
        All apps
      </Link>
    </section>
  );
}

/** On the homepage: where today stands and the one app to open next. Hidden until something is done. */
export function YourDay() {
  const done = useDay();
  const [faith] = useFaith();
  if (done.length === 0) return null;
  const next = DAY_ORDER.find((s) => !done.includes(s));
  const a = next ? app(next) : null;
  return (
    <section aria-label="Your day" className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex items-center gap-3">
        <ol className="flex items-center gap-1.5">
          {DAY_ORDER.map((s) => {
            const x = app(s);
            const isDone = done.includes(s);
            return (
              <li key={s} title={`${x.name}${isDone ? ": done today" : ""}`}>
                <a href={x.href} aria-label={`${x.name}${isDone ? ", done today" : ""}`} className="flex h-6 w-6 items-center justify-center rounded-full border" style={{ borderColor: x.color, background: isDone ? x.color : "transparent" }}>
                  {isDone && <Check className="h-3.5 w-3.5 text-[#0d1520]" strokeWidth={3.5} aria-hidden />}
                </a>
              </li>
            );
          })}
        </ol>
        <p className="text-sm font-semibold">
          Your day <span className="font-mono font-normal text-muted">· {done.length} of {DAY_ORDER.length}</span>
        </p>
      </div>
      {a && next ? (
        <a href={a.href} className="group flex flex-1 items-center gap-2 text-sm text-soft hover:text-fg sm:justify-end">
          <span className="text-muted">Next:</span> <b style={{ color: a.color }}>{a.name}</b> · {(faith && NEXT_STEP[next].faith) || NEXT_STEP[next].plain}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </a>
      ) : (
        <p className="flex-1 text-sm text-muted sm:text-right">{faith ? "Your whole day is done. Rest well." : "Your whole day is done. See you tomorrow."}</p>
      )}
    </section>
  );
}
