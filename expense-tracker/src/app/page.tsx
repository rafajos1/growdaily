"use client";

import Link from "next/link";
import { useMemo } from "react";
import clsx from "clsx";
import { ArrowRight, Plus, Sparkles, Wallet } from "lucide-react";
import { CategoryDonut, DailyAreaChart, MonthlyBarChart } from "@/components/Charts";
import { EmptyState } from "@/components/EmptyState";
import { useExpenseDialogs } from "@/components/ExpenseDialogProvider";
import { ExpenseList } from "@/components/ExpenseList";
import { PageHeader } from "@/components/PageHeader";
import { DashboardSkeleton } from "@/components/Skeleton";
import { SummaryCards } from "@/components/SummaryCards";
import { buttonStyles, cardStyles } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import { computeSummary, dailyTotalsThisMonth, monthlyTotals, sumCents, totalsByCategory } from "@/lib/analytics";
import { formatMonthLong, monthKey, todayISO } from "@/lib/dates";
import { sortExpenses } from "@/lib/filters";
import { formatCurrency } from "@/lib/money";

export default function DashboardPage() {
  const { expenses, status, loadSampleData } = useExpenses();
  const { openCreate } = useExpenseDialogs();

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = monthKey(todayISO());
    const thisMonthExpenses = expenses.filter((e) => monthKey(e.date) === thisMonth);
    return {
      summary: computeSummary(expenses, now),
      monthly: monthlyTotals(expenses, 6, now),
      daily: dailyTotalsThisMonth(expenses, now),
      allCategories: totalsByCategory(expenses),
      allTotal: sumCents(expenses),
      thisMonthLabel: formatMonthLong(thisMonth),
      thisMonthCount: thisMonthExpenses.length,
      recent: sortExpenses(expenses, "date-desc").slice(0, 5),
    };
  }, [expenses]);

  const header = (
    <PageHeader title="Dashboard" description="An overview of where your money is going." />
  );

  if (status === "loading") {
    return (
      <>
        {header}
        <DashboardSkeleton />
      </>
    );
  }

  if (expenses.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={Wallet}
          title="Start tracking your spending"
          description="Add your first expense to see summaries, trends and category breakdowns here. Or load some sample data to explore."
        >
          <button type="button" onClick={openCreate} className={buttonStyles.primary}>
            <Plus className="h-4 w-4" aria-hidden />
            Add your first expense
          </button>
          <button type="button" onClick={loadSampleData} className={buttonStyles.secondary}>
            <Sparkles className="h-4 w-4" aria-hidden />
            Load sample data
          </button>
        </EmptyState>
      </>
    );
  }

  const { summary } = stats;

  return (
    <div className="space-y-6">
      {header}
      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className={clsx(cardStyles, "flex flex-col p-5 sm:p-6 lg:col-span-3")} aria-labelledby="monthly-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="monthly-heading" className="text-base font-semibold text-slate-900">
              Monthly spending
            </h2>
            <span className="text-xs text-slate-500">Last 6 months</span>
          </div>
          <div className="min-h-64 flex-1">
            <MonthlyBarChart data={stats.monthly} />
          </div>
        </section>

        <section className={clsx(cardStyles, "p-5 sm:p-6 lg:col-span-2")} aria-labelledby="category-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="category-heading" className="text-base font-semibold text-slate-900">
              By category
            </h2>
            <span className="text-xs text-slate-500">All time</span>
          </div>
          <CategoryDonut data={stats.allCategories} totalCents={stats.allTotal} />
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className={clsx(cardStyles, "flex flex-col p-5 sm:p-6 lg:col-span-3")} aria-labelledby="daily-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="daily-heading" className="text-base font-semibold text-slate-900">
              Daily spending
            </h2>
            <span className="text-xs text-slate-500">{stats.thisMonthLabel}</span>
          </div>
          {stats.thisMonthCount > 0 ? (
            <div className="min-h-64 flex-1">
              <DailyAreaChart data={stats.daily} />
            </div>
          ) : (
            <p className="flex h-64 items-center justify-center text-sm text-slate-500">No expenses recorded this month yet.</p>
          )}
        </section>

        <section className={clsx(cardStyles, "overflow-hidden lg:col-span-2")} aria-labelledby="recent-heading">
          <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
            <h2 id="recent-heading" className="text-base font-semibold text-slate-900">
              Recent expenses
            </h2>
            <Link href="/expenses" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ExpenseList expenses={stats.recent} compact />
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:px-6">
            {summary.count} expenses · {formatCurrency(summary.totalCents)} total
          </p>
        </section>
      </div>
    </div>
  );
}
