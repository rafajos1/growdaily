"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ArrowRight, Check, Moon } from "lucide-react";
import { panelStyles } from "./ui";
import { useFaith } from "@/hooks/useFaith";
import { DAY_EVENT, DAY_KEY, DAY_ORDER, nextApps, readDone, type AppSlug } from "@/lib/journey";

// The GrowDaily apps, as on the main site (app/apps.ts and app/components/NextUp.tsx).
const APPS: Record<AppSlug, { name: string; color: string; href: string; step: string; faithStep?: string }> = {
  planwise: { name: "Planwise", color: "#5cb8e6", href: "/apps/planwise", step: "Plan your day", faithStep: "Plan your day, with quiet moments built in" },
  habitwise: { name: "Habitwise", color: "#53cfa0", href: "/apps/habitwise", step: "Check off today's habits" },
  spendwise: { name: "Spendwise", color: "#f2b54b", href: "/apps/spendwise", step: "Log today's spending" },
  mealwise: { name: "Mealwise", color: "#ef7fa8", href: "/apps/mealwise", step: "Find tonight's dinner" },
  moodwise: { name: "Moodwise", color: "#b48cf2", href: "/apps/moodwise", step: "Check in on your day", faithStep: "Look back on your day with God" },
};

export function useDay(): AppSlug[] {
  const [done, setDone] = useState<AppSlug[]>([]);
  useEffect(() => {
    const refresh = () => setDone(readDone());
    refresh();
    const onStorage = (e: StorageEvent) => e.key === DAY_KEY && refresh();
    window.addEventListener(DAY_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(DAY_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return done;
}

/** After logging today's spending: the next GrowDaily apps, one tap away. */
export function NextUp() {
  const done = useDay();
  const [faith] = useFaith();
  if (!done.includes("spendwise")) return null;
  const upcoming = nextApps("spendwise", done);

  return (
    <section className={clsx(panelStyles, "p-5 sm:p-6")} aria-labelledby="next-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="next-heading" className="text-base font-bold">
          {upcoming.length === 0 ? (faith ? "That's your whole day. Rest well." : "That's your whole day. Nice work.") : "Nice work. What's next?"}
        </h2>
        <ol className="flex items-center gap-1.5" aria-label={`${done.length} of ${DAY_ORDER.length} apps done today`}>
          {DAY_ORDER.map((s) => (
            <li key={s} title={`${APPS[s].name}${done.includes(s) ? ": done today" : ""}`} className="flex h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: APPS[s].color, background: done.includes(s) ? APPS[s].color : "transparent" }}>
              {done.includes(s) && <Check className="h-3 w-3 text-[#0d1520]" strokeWidth={3.5} aria-hidden />}
            </li>
          ))}
          <li className="ml-1 font-mono text-xs text-muted" aria-hidden>
            {done.length}/{DAY_ORDER.length}
          </li>
        </ol>
      </div>
      {upcoming.length === 0 ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Moon className="h-4 w-4 text-amber" aria-hidden /> Everything&apos;s done for today. See you tomorrow.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {upcoming.map((s) => (
            <li key={s}>
              {/* Plain links: the other apps live outside Spendwise. */}
              <a href={APPS[s].href} className="group flex items-center gap-3 rounded-xl border border-line bg-sunken p-3.5 transition hover:border-[#35507a]">
                <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: APPS[s].color }} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{APPS[s].name}</span>
                  <span className="block text-sm text-muted">{(faith && APPS[s].faithStep) || APPS[s].step}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      )}
      {/* GrowDaily's homepage, not Spendwise's: a <Link> here would stay inside Spendwise. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className="mt-4 inline-block text-xs font-semibold text-muted hover:text-fg">
        All apps
      </a>
    </section>
  );
}
