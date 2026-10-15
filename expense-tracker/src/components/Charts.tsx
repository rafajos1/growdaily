"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryTotal, MonthTotal } from "@/lib/analytics";
import { CATEGORY_META } from "@/lib/categories";
import { formatMonthLong, formatMonthShort } from "@/lib/dates";
import { formatCurrency, formatCurrencyCompact } from "@/lib/money";

const AXIS = { fontSize: 12, fill: "#64748b" };

function TooltipBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-500">{title}</p>
      <p className="mt-0.5 font-semibold text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}

export function MonthlyBarChart({ data }: { data: MonthTotal[] }) {
  const lastIndex = data.length - 1;
  return (
    <div className="h-64 w-full lg:h-full" role="img" aria-label="Bar chart of total spending per month">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={formatMonthShort} tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: number) => formatCurrencyCompact(v)} tick={AXIS} axisLine={false} tickLine={false} width={56} />
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <TooltipBox
                  title={formatMonthLong(String(payload[0].payload.month))}
                  value={formatCurrency(Number(payload[0].value))}
                />
              ) : null
            }
          />
          <Bar dataKey="totalCents" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((d, i) => (
              <Cell key={d.month} fill={i === lastIndex ? "#4f46e5" : "#c7d2fe"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyAreaChart({ data }: { data: { day: number; totalCents: number }[] }) {
  return (
    <div className="h-64 w-full lg:h-full" role="img" aria-label="Area chart of daily spending this month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={16} />
          <YAxis tickFormatter={(v: number) => formatCurrencyCompact(v)} tick={AXIS} axisLine={false} tickLine={false} width={56} />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <TooltipBox title={`Day ${payload[0].payload.day}`} value={formatCurrency(Number(payload[0].value))} />
              ) : null
            }
          />
          <Area type="monotone" dataKey="totalCents" stroke="#4f46e5" strokeWidth={2} fill="url(#dailyFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonut({ data, totalCents }: { data: CategoryTotal[]; totalCents: number }) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
      <div className="relative h-48 w-48 shrink-0" role="img" aria-label="Donut chart of spending by category">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalCents"
              nameKey="category"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={data.length > 1 ? 2 : 0}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.category} fill={CATEGORY_META[d.category].color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <TooltipBox title={String(payload[0].name)} value={formatCurrency(Number(payload[0].value))} />
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500">Total</span>
          <span className="text-lg font-semibold text-slate-900 tabular-nums">{formatCurrencyCompact(totalCents)}</span>
        </div>
      </div>
      <ul className="w-full min-w-0 space-y-2.5 sm:flex-1 lg:flex-none">
        {data.map((d) => (
          <li key={d.category} className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_META[d.category].color }} />
            <span className="flex-1 text-slate-700">{d.category}</span>
            <span className="text-xs text-slate-400 tabular-nums">{(d.share * 100).toFixed(0)}%</span>
            <span className="min-w-[5rem] text-right font-medium text-slate-900 tabular-nums">{formatCurrency(d.totalCents)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
