"use client";

import clsx from "clsx";
import { Church, HandHeart, Plus } from "lucide-react";
import { useExpenseDialogs } from "./ExpenseDialogProvider";
import { buttonStyles, eyebrowStyles, panelStyles } from "./ui";
import { CATEGORY_META } from "@/lib/categories";
import { generosity, generosityEncouragement, passageUrl } from "@/lib/generosity";
import { formatCurrency, formatCurrencyWhole } from "@/lib/money";
import type { Expense } from "@/lib/types";

const GIVING = CATEGORY_META.Giving.color;
const shortMonth = (key: string) => new Date(Number(key.slice(0, 4)), Number(key.slice(5)) - 1, 1).toLocaleString("en-US", { month: "short" });

/** Shown on the This month screen when Faith is on. */
export function GenerosityCard({ expenses }: { expenses: Expense[] }) {
  const { openCreateWith } = useExpenseDialogs();
  const now = new Date();
  const g = generosity(expenses, 6, now);
  const word = generosityEncouragement(now);
  const month = now.toLocaleString("en-US", { month: "long" });
  const max = Math.max(...g.months.map((m) => m.totalCents), 1);
  const logGift = () => openCreateWith({ category: "Giving" });

  return (
    <section className={clsx(panelStyles, "relative overflow-hidden p-5 sm:p-6")} aria-labelledby="giving-heading">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1" style={{ background: GIVING }} aria-hidden />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p id="giving-heading" className={clsx(eyebrowStyles, "flex items-center gap-1.5")}>
            <HandHeart className="h-3.5 w-3.5" style={{ color: GIVING }} aria-hidden /> Generosity
          </p>
          {g.thisMonthCents > 0 ? (
            <>
              <p className="mt-3 text-4xl font-extrabold tracking-[-0.03em]">
                {formatCurrency(g.thisMonthCents)}
                <span className="ml-2 font-mono text-base font-medium tracking-normal text-muted">given in {month}</span>
              </p>
              <p className="mt-1 text-soft">
                {g.giftsThisMonth === 1 ? "One gift" : `${g.giftsThisMonth} gifts`} so far. Every one of them counts.
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-2xl font-extrabold tracking-[-0.02em]">Give first this month?</p>
              <p className="mt-1 max-w-[46ch] text-soft">
                Some people start each month by giving before anything else: to a church, a cause, or a neighbor who needs it. Any amount counts.
              </p>
            </>
          )}
          <button type="button" onClick={logGift} className={clsx(g.thisMonthCents > 0 ? buttonStyles.secondary : buttonStyles.primary, "mt-4")}>
            <Plus className="h-4 w-4" aria-hidden /> Log a gift
          </button>
        </div>

        <div>
          <div className="flex h-24 items-end gap-2" role="img" aria-label={`Giving over the last six months: ${g.months.map((m) => `${shortMonth(m.month)} ${formatCurrencyWhole(m.totalCents)}`).join(", ")}`}>
            {g.months.map((m, i) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted">{m.totalCents ? formatCurrencyWhole(m.totalCents) : ""}</span>
                <div className="w-full rounded-md" style={{ height: `${Math.max((m.totalCents / max) * 56, 3)}px`, background: m.totalCents ? GIVING : "#22324a", opacity: i === g.months.length - 1 ? 1 : 0.55 }} />
                <span className={clsx("font-mono text-[11px]", i === g.months.length - 1 ? "text-fg" : "text-muted")}>{shortMonth(m.month)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-hairline pt-4 text-[15px] leading-relaxed text-soft">{word.text}</p>
          <p className="mt-1.5 font-mono text-xs text-muted">
            Inspired by {word.ref} ·{" "}
            <a href={passageUrl(word)} target="_blank" rel="noopener noreferrer" className="text-amber underline-offset-2 hover:underline">
              Read it
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/** The on/off control for GrowDaily's Faith setting. */
export function FaithPanel({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <section className={clsx(panelStyles, "flex items-center gap-4 p-4 sm:p-5")}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber">
        <Church className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p id="faith-label" className="text-sm font-semibold">Faith</p>
        <p className="mt-0.5 text-xs text-muted">
          Adds a generosity view: what you&apos;ve given, and a gentle nudge to give first each month. No rules, no percentages.{" "}
          {/* A plain link: /faith is a GrowDaily page, outside Spendwise. */}
          <a href="/faith/ask" className="font-semibold text-amber underline-offset-2 hover:underline">Ask a question</a>
          {" · "}
          <a href="/faith" className="text-amber underline-offset-2 hover:underline">More about Faith</a>
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="faith-label"
        onClick={() => onChange(!on)}
        className={clsx(
          "relative h-7 w-12 shrink-0 rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
          on ? "border-amber bg-amber" : "border-line bg-sunken",
        )}
      >
        <span className={clsx("absolute top-0.5 h-[22px] w-[22px] rounded-full shadow transition-all", on ? "left-[22px] bg-[#2a1c05]" : "left-0.5 bg-muted")} />
      </button>
    </section>
  );
}
