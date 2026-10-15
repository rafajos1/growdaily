"use client";

import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/money";
import type { Expense } from "@/lib/types";
import { CategoryBadge, CategoryIcon } from "./CategoryBadge";
import { useExpenseDialogs } from "./ExpenseDialogProvider";
import { buttonStyles, cardStyles } from "./ui";

export function ExpenseList({ expenses, compact = false }: { expenses: Expense[]; compact?: boolean }) {
  const { openEdit, confirmDelete } = useExpenseDialogs();

  return (
    <ul className={clsx(!compact && cardStyles, "divide-y divide-slate-100")}>
      {expenses.map((e) => (
        <li key={e.id} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50/70 sm:gap-4">
          <CategoryIcon category={e.category} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{e.description}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <time dateTime={e.date}>{formatDate(e.date)}</time>
              {!compact && (
                <>
                  <span aria-hidden>·</span>
                  <CategoryBadge category={e.category} />
                </>
              )}
            </div>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(e.amountCents)}</p>
          <div className="flex shrink-0 items-center sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              type="button"
              onClick={() => openEdit(e)}
              className={buttonStyles.ghost}
              aria-label={`Edit ${e.description}`}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => confirmDelete(e)}
              className={clsx(buttonStyles.ghost, "hover:bg-rose-50 hover:text-rose-600")}
              aria-label={`Delete ${e.description}`}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
