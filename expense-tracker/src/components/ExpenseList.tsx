"use client";

import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import { CATEGORY_META } from "@/lib/categories";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/money";
import type { Expense } from "@/lib/types";
import { CategoryBadge, CategoryIcon } from "./CategoryBadge";
import { useExpenseDialogs } from "./ExpenseDialogProvider";
import { buttonStyles, panelStyles } from "./ui";

/** Full list for the Expenses page. */
export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <ul className={clsx(panelStyles, "divide-y divide-hairline overflow-hidden")}>
      {expenses.map((e) => (
        <li key={e.id} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-raised/40 sm:gap-4">
          <CategoryIcon category={e.category} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{e.description}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
              <time dateTime={e.date}>{formatDate(e.date)}</time>
              <span aria-hidden>·</span>
              <CategoryBadge category={e.category} />
            </div>
          </div>
          <p className="shrink-0 font-mono text-sm font-medium tabular-nums">{formatCurrency(e.amountCents)}</p>
          <RowActions expense={e} />
        </li>
      ))}
    </ul>
  );
}

/** Compact rows for the "Latest" panel. */
export function LatestList({ expenses }: { expenses: Expense[] }) {
  return (
    <ul className="divide-y divide-hairline">
      {expenses.map((e) => (
        <li key={e.id} className="group grid grid-cols-[64px_1fr_auto_auto] items-center gap-x-3 py-2.5">
          <time dateTime={e.date} className="font-mono text-xs text-muted">
            {formatDate(e.date).replace(/, \d{4}$/, "")}
          </time>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{e.description}</p>
            <p className="text-xs font-semibold" style={{ color: CATEGORY_META[e.category].color }}>
              {e.category}
            </p>
          </div>
          <p className="font-mono text-sm font-medium tabular-nums">{formatCurrency(e.amountCents)}</p>
          <RowActions expense={e} />
        </li>
      ))}
    </ul>
  );
}

function RowActions({ expense }: { expense: Expense }) {
  const { openEdit, confirmDelete } = useExpenseDialogs();
  return (
    <div className="flex shrink-0 items-center sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
      <button type="button" onClick={() => openEdit(expense)} className={buttonStyles.ghost} aria-label={`Edit ${expense.description}`} title="Edit">
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => confirmDelete(expense)}
        className={clsx(buttonStyles.ghost, "hover:bg-up/10 hover:text-up")}
        aria-label={`Delete ${expense.description}`}
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
