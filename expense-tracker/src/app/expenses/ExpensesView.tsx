"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Receipt, SearchX, Sparkles, Trash } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useExpenseDialogs } from "@/components/ExpenseDialogProvider";
import { ExpenseList } from "@/components/ExpenseList";
import { FiltersBar } from "@/components/FiltersBar";
import { Modal } from "@/components/Modal";
import { PageHeader } from "@/components/PageHeader";
import { ListSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import { buttonStyles } from "@/components/ui";
import { useExpenses } from "@/hooks/useExpenses";
import { sumCents } from "@/lib/analytics";
import { downloadCsv, expensesToCsv } from "@/lib/csv";
import { todayISO } from "@/lib/dates";
import { EMPTY_FILTERS, filterExpenses, hasActiveFilters, sortExpenses } from "@/lib/filters";
import { formatCurrency } from "@/lib/money";
import type { ExpenseFilters, SortKey } from "@/lib/types";

const PAGE_SIZE = 25;

export function ExpensesView() {
  const { expenses, status, loadSampleData, clearAll } = useExpenses();
  const { openCreate } = useExpenseDialogs();
  const { toast } = useToast();
  const [filters, setFilters] = useState<ExpenseFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [confirmClear, setConfirmClear] = useState(false);

  const rangeError = filters.from && filters.to && filters.from > filters.to ? "The start date must be before the end date." : null;

  const results = useMemo(
    () => (rangeError ? [] : sortExpenses(filterExpenses(expenses, filters), sort)),
    [expenses, filters, sort, rangeError],
  );
  const filteredTotal = useMemo(() => sumCents(results), [results]);

  const updateFilters = (next: ExpenseFilters) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast("info", "There are no expenses to export.");
      return;
    }
    try {
      downloadCsv(expensesToCsv(results), `expenses-${todayISO()}.csv`);
      toast("success", `Exported ${results.length} ${results.length === 1 ? "expense" : "expenses"} to CSV.`);
    } catch {
      toast("error", "Export failed. Please try again.");
    }
  };

  const actions = (
    <>
      <button type="button" onClick={handleExport} disabled={status === "loading"} className={buttonStyles.secondary}>
        <Download className="h-4 w-4" aria-hidden />
        Export CSV
      </button>
      <button type="button" onClick={openCreate} className={`${buttonStyles.primary} hidden sm:inline-flex`}>
        <Plus className="h-4 w-4" aria-hidden />
        Add expense
      </button>
    </>
  );

  const header = <PageHeader title="Expenses" description="Search, filter, edit and export your expenses." actions={actions} />;

  if (status === "loading") {
    return (
      <>
        {header}
        <ListSkeleton />
      </>
    );
  }

  if (expenses.length === 0) {
    return (
      <>
        {header}
        <EmptyState icon={Receipt} title="No expenses yet" description="Expenses you add will appear here, ready to search, filter and export.">
          <button type="button" onClick={openCreate} className={buttonStyles.primary}>
            <Plus className="h-4 w-4" aria-hidden />
            Add expense
          </button>
          <button type="button" onClick={loadSampleData} className={buttonStyles.secondary}>
            <Sparkles className="h-4 w-4" aria-hidden />
            Load sample data
          </button>
        </EmptyState>
      </>
    );
  }

  return (
    <div className="space-y-4">
      {header}
      <FiltersBar filters={filters} onChange={updateFilters} sort={sort} onSortChange={setSort} rangeError={rangeError} />

      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 text-sm" aria-live="polite">
        <p className="text-slate-600">
          <span className="font-semibold text-slate-900">{results.length}</span>{" "}
          {results.length === 1 ? "expense" : "expenses"}
          {hasActiveFilters(filters) && <> of {expenses.length}</>}
        </p>
        <p className="text-slate-600">
          Total: <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(filteredTotal)}</span>
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState icon={SearchX} title="No matching expenses" description="Try a different search term, category or date range.">
          <button type="button" onClick={() => updateFilters(EMPTY_FILTERS)} className={buttonStyles.secondary}>
            Clear filters
          </button>
        </EmptyState>
      ) : (
        <>
          <ExpenseList expenses={results.slice(0, visible)} />
          {visible < results.length && (
            <div className="flex justify-center">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={buttonStyles.secondary}>
                Show more ({results.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center pt-6">
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash className="h-3.5 w-3.5" aria-hidden />
          Delete all data
        </button>
      </div>

      <Modal
        open={confirmClear}
        title="Delete all expenses?"
        description={`This permanently removes all ${expenses.length} expenses from this browser. Consider exporting a CSV first.`}
        onClose={() => setConfirmClear(false)}
        size="sm"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setConfirmClear(false)} className={buttonStyles.secondary}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              clearAll();
              setConfirmClear(false);
              updateFilters(EMPTY_FILTERS);
            }}
            className={buttonStyles.danger}
          >
            Delete everything
          </button>
        </div>
      </Modal>
    </div>
  );
}
