import clsx from "clsx";
import { CalendarDays, Gauge, TrendingDown, TrendingUp, Trophy, Wallet, type LucideIcon } from "lucide-react";
import type { Summary } from "@/lib/analytics";
import { formatCurrency } from "@/lib/money";
import { CATEGORY_META } from "@/lib/categories";
import { cardStyles } from "./ui";

function Card({
  label,
  value,
  icon: Icon,
  iconClass,
  children,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={clsx(cardStyles, "p-5")}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={clsx("flex h-9 w-9 items-center justify-center rounded-lg", iconClass)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
      <div className="mt-1 min-h-[1.25rem] text-xs text-slate-500">{children}</div>
    </div>
  );
}

export function SummaryCards({ summary }: { summary: Summary }) {
  const change = summary.monthChangePct;
  const top = summary.topCategories[0];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Total spending" value={formatCurrency(summary.totalCents)} icon={Wallet} iconClass="bg-brand-50 text-brand-600">
        across {summary.count} {summary.count === 1 ? "expense" : "expenses"}
      </Card>

      <Card label="This month" value={formatCurrency(summary.thisMonthCents)} icon={CalendarDays} iconClass="bg-sky-50 text-sky-600">
        {change === null ? (
          "No spending last month to compare"
        ) : (
          <span className="inline-flex items-center gap-1">
            <span
              className={clsx(
                "inline-flex items-center gap-0.5 font-semibold",
                change > 0 ? "text-rose-600" : "text-emerald-600",
              )}
            >
              {change > 0 ? <TrendingUp className="h-3.5 w-3.5" aria-hidden /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden />}
              {Math.abs(change).toFixed(0)}%
            </span>
            vs. last month ({formatCurrency(summary.lastMonthCents)})
          </span>
        )}
      </Card>

      <Card
        label="Daily average"
        value={formatCurrency(summary.avgPerDayThisMonthCents)}
        icon={Gauge}
        iconClass="bg-amber-50 text-amber-600"
      >
        per day this month
      </Card>

      <Card
        label="Top category"
        value={top ? top.category : "—"}
        icon={top ? CATEGORY_META[top.category].icon : Trophy}
        iconClass="bg-emerald-50 text-emerald-600"
      >
        {top && `${formatCurrency(top.totalCents)} · ${(top.share * 100).toFixed(0)}% of ${summary.thisMonthCents > 0 ? "this month" : "all time"}`}
      </Card>
    </div>
  );
}
