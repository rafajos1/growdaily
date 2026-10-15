"use client";

import clsx from "clsx";
import { Search, X } from "lucide-react";
import { daysAgoISO, endOfMonthISO, startOfMonthISO, todayISO, addMonths } from "@/lib/dates";
import { EMPTY_FILTERS, hasActiveFilters } from "@/lib/filters";
import { CATEGORIES, type ExpenseFilters, type SortKey } from "@/lib/types";
import { inputStyles, panelStyles } from "./ui";

interface Preset {
  label: string;
  range: () => { from: string; to: string };
}

const PRESETS: Preset[] = [
  { label: "This month", range: () => ({ from: startOfMonthISO(), to: todayISO() }) },
  {
    label: "Last month",
    range: () => {
      const prev = addMonths(new Date(), -1);
      return { from: startOfMonthISO(prev), to: endOfMonthISO(prev) };
    },
  },
  { label: "Last 30 days", range: () => ({ from: daysAgoISO(29), to: todayISO() }) },
  { label: "This year", range: () => ({ from: `${new Date().getFullYear()}-01-01`, to: todayISO() }) },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
];

interface FiltersBarProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  rangeError: string | null;
}

export function FiltersBar({ filters, onChange, sort, onSortChange, rangeError }: FiltersBarProps) {
  const set = <K extends keyof ExpenseFilters>(key: K, value: ExpenseFilters[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className={clsx(panelStyles, "space-y-4 p-4 sm:p-5")}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <label htmlFor="search" className="sr-only">
            Search expenses
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" aria-hidden />
          <input
            id="search"
            type="search"
            placeholder="Search descriptions…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className={clsx(inputStyles(), "pl-9")}
          />
        </div>
        <div className="md:col-span-4">
          <label htmlFor="category" className="sr-only">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => set("category", e.target.value as ExpenseFilters["category"])}
            className={inputStyles()}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value as SortKey)} className={inputStyles()}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-md">
          <div>
            <label htmlFor="from" className="mb-1 block font-mono text-xs text-muted">
              From
            </label>
            <input
              id="from"
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => set("from", e.target.value)}
              aria-invalid={Boolean(rangeError)}
              className={inputStyles(Boolean(rangeError))}
            />
          </div>
          <div>
            <label htmlFor="to" className="mb-1 block font-mono text-xs text-muted">
              To
            </label>
            <input
              id="to"
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => set("to", e.target.value)}
              aria-invalid={Boolean(rangeError)}
              className={inputStyles(Boolean(rangeError))}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick date ranges">
          {PRESETS.map((p) => {
            const r = p.range();
            const active = filters.from === r.from && filters.to === r.to;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, ...r })}
                className={clsx(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active ? "border-amber bg-amber text-amber-ink" : "border-line bg-sunken text-soft hover:border-[#2c4060]",
                )}
              >
                {p.label}
              </button>
            );
          })}
          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-muted hover:bg-raised hover:text-fg"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear filters
            </button>
          )}
        </div>
      </div>
      {rangeError && (
        <p role="alert" className="text-xs font-semibold text-up">
          {rangeError}
        </p>
      )}
    </div>
  );
}
