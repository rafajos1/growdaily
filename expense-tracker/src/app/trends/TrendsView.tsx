"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { CategoryDot } from "@/components/CategoryBadge";
import { CategorySpark, MonthlyBars, WeekdayBars } from "@/components/Charts";
import { EmptyState } from "@/components/EmptyState";
import { useExpenseDialogs } from "@/components/ExpenseDialogProvider";
import { DashboardSkeleton } from "@/components/Skeleton";
import { buttonStyles, eyebrowStyles, panelStyles } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import {
  biggestExpenses,
  categoryTrends,
  computePace,
  detectRecurring,
  monthlyTotals,
  typicalMonth,
  weekdayTotals,
} from "@/lib/analytics";
import { CATEGORY_META } from "@/lib/categories";
import { formatDate, formatMonthShort, monthKey, toISODate, addMonths } from "@/lib/dates";
import { formatCurrency, formatCurrencyWhole } from "@/lib/money";

const RANGES = [
  { months: 3, label: "3M" },
  { months: 6, label: "6M" },
  { months: 12, label: "1Y" },
] as const;

const WEEKDAY_PLURAL = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

export function TrendsView() {
  const { expenses, status, loadSampleData } = useExpenses();
  const { openCreate } = useExpenseDialogs();
  const [months, setMonths] = useState<3 | 6 | 12>(6);

  const t = useMemo(() => {
    const now = new Date();
    const windowStart = `${monthKey(toISODate(addMonths(now, -(months - 1))))}-01`;
    const inWindow = expenses.filter((e) => e.date >= windowStart);
    const monthly = monthlyTotals(expenses, months, now);
    return {
      monthly,
      typical: typicalMonth(expenses, months - 1, now),
      projected: computePace(expenses, now).projectedCents,
      categories: categoryTrends(expenses, months, now),
      labels: monthly.map((m) => formatMonthShort(m.month)),
      lastFullLabel: monthly.length > 1 ? formatMonthShort(monthly[monthly.length - 2].month) : "",
      weekdays: weekdayTotals(inWindow),
      recurring: detectRecurring(expenses),
      biggest: biggestExpenses(inWindow, 4),
      currentMonth: now.toLocaleString("en-US", { month: "long" }),
    };
  }, [expenses, months]);

  if (status === "loading") return <DashboardSkeleton />;

  if (expenses.length === 0) {
    return (
      <EmptyState icon={TrendingUp} title="No trends yet" description="Trends show how your spending changes from month to month. Add expenses, or load example data to see how it works.">
        <button type="button" onClick={openCreate} className={buttonStyles.primary}>
          <Plus className="h-4 w-4" aria-hidden />
          Add expense
        </button>
        <button type="button" onClick={loadSampleData} className={buttonStyles.secondary}>
          <Sparkles className="h-4 w-4" aria-hidden />
          Load example data
        </button>
      </EmptyState>
    );
  }

  const { typical } = t;
  const vsTypical = typical ? ((t.projected - typical.averageCents) / typical.averageCents) * 100 : null;
  const weekdayTotal = t.weekdays.reduce((a, b) => a + b, 0);
  const topDay = t.weekdays.indexOf(Math.max(...t.weekdays));
  const secondDay = Math.max(...t.weekdays.filter((_, i) => i !== topDay));
  const topRatio = secondDay > 0 ? t.weekdays[topDay] / secondDay : null;
  const fixedTotal = t.recurring.reduce((a, r) => a + r.amountCents, 0);

  return (
    <div className="space-y-4">
      <h1 className="sr-only">Trends</h1>

      <section className={clsx(panelStyles, "grid grid-cols-1 items-center gap-8 p-5 sm:p-6 lg:grid-cols-[320px_1fr]")}>
        <div>
          <p className={eyebrowStyles}>Your typical month</p>
          {typical ? (
            <>
              <p className="mb-2.5 mt-3 text-5xl font-extrabold tracking-[-0.035em] sm:text-[56px]">{formatCurrencyWhole(typical.averageCents)}</p>
              <p className="text-base text-soft">
                {t.currentMonth} is on track for about {formatCurrencyWhole(t.projected)},{" "}
                {vsTypical !== null && Math.abs(vsTypical) < 3 ? (
                  <b className="text-heat-4">right on your typical month</b>
                ) : (
                  <>
                    <b className={vsTypical! < 0 ? "text-down" : "text-up"}>
                      {Math.abs(vsTypical!).toFixed(0)}% {vsTypical! < 0 ? "below" : "above"}
                    </b>{" "}
                    your typical month
                  </>
                )}
                .
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                <div>
                  <dt className="font-mono text-xs text-muted">Highest month</dt>
                  <dd className="mt-0.5 text-lg font-semibold">{formatMonthShort(typical.highest.month)} · {formatCurrencyWhole(typical.highest.totalCents)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs text-muted">Lowest month</dt>
                  <dd className="mt-0.5 text-lg font-semibold">{formatMonthShort(typical.lowest.month)} · {formatCurrencyWhole(typical.lowest.totalCents)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="mt-3 text-base text-soft">
              Your typical month appears once you have a full month of expenses. Until then, the chart shows what you&apos;ve recorded so far.
            </p>
          )}
        </div>
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Monthly spending</h2>
            <div className="flex gap-1" role="group" aria-label="Time range">
              {RANGES.map((r) => (
                <button
                  key={r.months}
                  type="button"
                  aria-pressed={months === r.months}
                  onClick={() => setMonths(r.months)}
                  className={clsx(
                    "rounded-md border px-2.5 py-1 font-mono text-xs transition",
                    months === r.months ? "border-[#2c4060] bg-raised text-fg" : "border-line text-muted hover:text-fg",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <MonthlyBars data={t.monthly} typicalCents={typical?.averageCents ?? null} projectedCents={t.projected} />
        </div>
      </section>

      {t.categories.length > 0 && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-0.5 pt-4">
            <h2 className="text-lg font-bold">Categories over time</h2>
            <span className="font-mono text-xs text-muted">{t.lastFullLabel} vs your average</span>
          </div>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.categories.map((c) => {
              const pct = c.changePct;
              const kind = pct === null ? "new" : Math.abs(pct) < 10 ? "flat" : pct > 0 ? "up" : "down";
              return (
                <div key={c.category} className={clsx(panelStyles, "p-5")}>
                  <div className="flex items-center gap-2.5 font-bold">
                    <CategoryDot category={c.category} />
                    {c.category}
                    <span
                      className={clsx(
                        "ml-auto rounded-full px-2 py-0.5 font-mono text-xs font-medium",
                        kind === "up" && "bg-up/15 text-up",
                        kind === "down" && "bg-down/15 text-down",
                        (kind === "flat" || kind === "new") && "bg-muted/15 text-muted",
                      )}
                    >
                      {kind === "new" ? "new" : kind === "flat" ? "steady" : `${pct! > 0 ? "↑" : "↓"} ${Math.abs(pct!).toFixed(0)}%`}
                    </span>
                  </div>
                  <CategorySpark
                    category={c.category}
                    series={c.series}
                    labels={t.labels.map((l) => l.slice(0, 1))}
                    averageCents={c.averageCents}
                    highlightIndex={c.series.length - 2}
                  />
                  <div className="mt-2.5 flex justify-between font-mono text-xs text-muted">
                    <span>
                      {t.lastFullLabel} <b className="font-medium text-fg">{formatCurrencyWhole(c.lastFullMonthCents)}</b>
                    </span>
                    <span>
                      avg <b className="font-medium text-fg">{formatCurrencyWhole(c.averageCents)}</b>/mo
                    </span>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
        <div className={clsx(panelStyles, "p-5 sm:p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold">When you spend</h2>
            <span className="font-mono text-xs text-muted">by weekday</span>
          </div>
          {weekdayTotal > 0 && (
            <p className="mb-3.5 mt-2 text-sm text-soft">
              <b className="text-amber">{WEEKDAY_PLURAL[topDay]}</b> account for {((t.weekdays[topDay] / weekdayTotal) * 100).toFixed(0)}% of your spending
              {topRatio !== null && topRatio >= 1.5 ? `, ${topRatio.toFixed(1)}× the next busiest day.` : "."}
            </p>
          )}
          <WeekdayBars totals={t.weekdays} />
        </div>

        <div className={clsx(panelStyles, "p-5 sm:p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold">Repeats every month</h2>
            <span className="font-mono text-xs text-muted">detected</span>
          </div>
          {t.recurring.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              No repeating charges yet. An expense shows up here when the same description and amount appear in two or more months.
            </p>
          ) : (
            <>
              <ul className="mt-2 divide-y divide-hairline">
                {t.recurring.slice(0, 5).map((r) => (
                  <li key={`${r.description}-${r.amountCents}`} className="grid grid-cols-[1fr_auto] gap-x-3 py-2.5">
                    <span className="truncate text-sm font-semibold">{r.description}</span>
                    <span className="text-right font-mono text-sm font-medium">{formatCurrency(r.amountCents)}</span>
                    <span className="font-mono text-xs" style={{ color: CATEGORY_META[r.category].color }}>
                      {r.category}
                    </span>
                    <span className="text-right font-mono text-xs text-muted">seen {r.months} months</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between rounded-[10px] bg-sunken px-3.5 py-3 text-sm">
                <span>Fixed costs each month</span>
                <b className="font-mono font-medium">≈ {formatCurrency(fixedTotal)}</b>
              </div>
            </>
          )}
        </div>

        <div className={clsx(panelStyles, "p-5 sm:p-6")}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold">Biggest expenses</h2>
            <span className="font-mono text-xs text-muted">{months === 12 ? "last year" : `last ${months} months`}</span>
          </div>
          <ul className="mt-2 divide-y divide-hairline">
            {t.biggest.map((e) => (
              <li key={e.id} className="grid grid-cols-[1fr_auto] gap-x-3 py-2.5">
                <span className="truncate text-sm font-semibold">{e.description}</span>
                <span className="text-right font-mono text-sm font-medium">{formatCurrency(e.amountCents)}</span>
                <span className="font-mono text-xs" style={{ color: CATEGORY_META[e.category].color }}>
                  {e.category}
                </span>
                <span className="text-right font-mono text-xs text-muted">{formatDate(e.date).replace(/, \d{4}$/, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
