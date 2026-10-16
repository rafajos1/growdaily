"use client";

import Link from "next/link";
import { useMemo } from "react";
import clsx from "clsx";
import { ArrowRight, Plus, Sparkles, Wallet } from "lucide-react";
import { CalendarHeatmap, CategoryStack, PaceChart } from "@/components/Charts";
import { EmptyState } from "@/components/EmptyState";
import { FaithPanel, GenerosityCard } from "@/components/Generosity";
import { NextUp } from "@/components/NextUp";
import { useExpenseDialogs } from "@/components/ExpenseDialogProvider";
import { LatestList } from "@/components/ExpenseList";
import { DashboardSkeleton } from "@/components/Skeleton";
import { buttonStyles, eyebrowStyles, panelStyles } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import { useFaith } from "@/hooks/useFaith";
import { computePace, dailyTotalsForMonth, totalsByCategory, type Pace } from "@/lib/analytics";
import { monthKey, todayISO } from "@/lib/dates";
import { sortExpenses } from "@/lib/filters";
import { formatCurrency, formatCurrencyWhole } from "@/lib/money";

const monthName = (d: Date) => d.toLocaleString("en-US", { month: "long" });

function Verdict({ pace, month }: { pace: Pace; month: string }) {
  const projected = <b className="text-heat-4">{formatCurrencyWhole(pace.projectedCents)}</b>;
  if (pace.spentCents === 0) {
    return <>Nothing spent yet this month.</>;
  }
  if (pace.lastMonthTotalCents === 0) {
    return <>No spending recorded last month to compare with. At this pace {month} ends near {projected}.</>;
  }
  const diff = pace.lastMonthAtDayCents - pace.spentCents;
  return (
    <>
      You&apos;ve spent{" "}
      <b className={diff >= 0 ? "text-down" : "text-up"}>
        {formatCurrencyWhole(Math.abs(diff))} {diff >= 0 ? "less" : "more"}
      </b>{" "}
      than by this point last month. At this pace {month} ends near {projected}, against{" "}
      {formatCurrencyWhole(pace.lastMonthTotalCents)} last month.
    </>
  );
}

export default function ThisMonthPage() {
  const { expenses, status, loadSampleData } = useExpenses();
  const { openCreate } = useExpenseDialogs();
  const [faith, setFaith] = useFaith();

  const view = useMemo(() => {
    const now = new Date();
    const thisMonth = monthKey(todayISO());
    const monthExpenses = expenses.filter((e) => monthKey(e.date) === thisMonth);
    return {
      now,
      pace: computePace(expenses, now),
      daily: dailyTotalsForMonth(expenses, now),
      categories: totalsByCategory(monthExpenses.length ? monthExpenses : expenses),
      categoriesScope: monthExpenses.length ? "this month" : "all time",
      latest: sortExpenses(expenses, "date-desc").slice(0, 6),
    };
  }, [expenses]);

  if (status === "loading") return <DashboardSkeleton />;

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="Start tracking your spending"
        description="Add your first expense to see your pace for the month, a daily calendar and where your money goes. Or load some example data to look around."
      >
        <button type="button" onClick={openCreate} className={buttonStyles.primary}>
          <Plus className="h-4 w-4" aria-hidden />
          Add your first expense
        </button>
        <button type="button" onClick={loadSampleData} className={buttonStyles.secondary}>
          <Sparkles className="h-4 w-4" aria-hidden />
          Load example data
        </button>
      </EmptyState>
    );
  }

  const { now, pace } = view;
  const month = monthName(now);

  return (
    <div className="space-y-6">
      <h1 className="sr-only">This month</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
        <section className={clsx(panelStyles, "p-5 sm:p-6")} aria-labelledby="pace-heading">
          <p id="pace-heading" className={eyebrowStyles}>
            {month} · day {pace.day} of {pace.daysInMonth}
          </p>
          <p className="mb-2 mt-3 text-5xl font-extrabold tracking-[-0.035em] sm:text-6xl">
            {formatCurrency(pace.spentCents)}
            <span className="ml-2.5 font-mono text-lg font-medium tracking-normal text-muted">spent</span>
          </p>
          <p className="max-w-[46ch] text-base text-soft">
            <Verdict pace={pace} month={month} />
          </p>
          <div className="mt-4">
            <PaceChart thisCumulative={pace.thisCumulative} lastCumulative={pace.lastCumulative} daysInMonth={pace.daysInMonth} projectedCents={pace.projectedCents} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted" aria-hidden>
            <span><i className="mr-1.5 inline-block w-[18px] border-t-2 border-amber align-middle" />{month} so far</span>
            <span><i className="mr-1.5 inline-block w-[18px] border-t-2 border-dotted border-amber align-middle" />Projected</span>
            <span><i className="mr-1.5 inline-block w-[18px] border-t-2 border-[#4c6584] align-middle" />Last month</span>
          </div>
        </section>

        <section className={clsx(panelStyles, "p-5 sm:p-6")} aria-labelledby="cal-heading">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="cal-heading" className="text-base font-bold">
              {month} {now.getFullYear()}
            </h2>
            <span className="font-mono text-xs text-muted">daily spend</span>
          </div>
          <CalendarHeatmap year={now.getFullYear()} month={now.getMonth()} daily={view.daily} today={pace.day} />
        </section>
      </div>

      <NextUp />

      {faith && <GenerosityCard expenses={expenses} />}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <section className={clsx(panelStyles, "p-5 sm:p-6")} aria-labelledby="where-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="where-heading" className="text-base font-bold">Where it went</h2>
            <span className="font-mono text-xs text-muted">{view.categoriesScope}</span>
          </div>
          <CategoryStack data={view.categories} />
        </section>

        <section className={clsx(panelStyles, "p-5 sm:p-6")} aria-labelledby="latest-heading">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 id="latest-heading" className="text-base font-bold">Latest</h2>
            <Link href="/expenses" className="inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-hover">
              All expenses <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <LatestList expenses={view.latest} />
        </section>
      </div>

      <FaithPanel on={faith} onChange={setFaith} />
    </div>
  );
}
