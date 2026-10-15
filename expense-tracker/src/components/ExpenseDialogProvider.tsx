"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { formatCurrency } from "@/lib/money";
import type { Expense, ExpenseInput } from "@/lib/types";
import { ExpenseForm } from "./ExpenseForm";
import { Modal } from "./Modal";
import { useToast } from "./ToastProvider";
import { buttonStyles } from "./ui";

interface DialogContextValue {
  openCreate: () => void;
  openEdit: (expense: Expense) => void;
  confirmDelete: (expense: Expense) => void;
}

type DialogState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; expense: Expense }
  | { kind: "delete"; expense: Expense };

const DialogContext = createContext<DialogContextValue | null>(null);

export function ExpenseDialogProvider({ children }: { children: ReactNode }) {
  const { addExpense, updateExpense, deleteExpense } = useExpenses();
  const { toast } = useToast();
  const [state, setState] = useState<DialogState>({ kind: "closed" });
  // Incremented on every open so the form remounts with fresh state.
  const [formKey, setFormKey] = useState(0);

  const close = useCallback(() => setState({ kind: "closed" }), []);
  const openCreate = useCallback(() => {
    setFormKey((k) => k + 1);
    setState({ kind: "create" });
  }, []);
  const openEdit = useCallback((expense: Expense) => {
    setFormKey((k) => k + 1);
    setState({ kind: "edit", expense });
  }, []);
  const confirmDelete = useCallback((expense: Expense) => setState({ kind: "delete", expense }), []);

  const handleSubmit = (input: ExpenseInput): boolean => {
    let ok = false;
    if (state.kind === "create") {
      ok = addExpense(input);
      if (ok) toast("success", `Added ${formatCurrency(input.amountCents)} for ${input.description}.`);
    } else if (state.kind === "edit") {
      ok = updateExpense(state.expense.id, input);
      if (ok) toast("success", "Expense updated.");
    }
    if (ok) close();
    return ok;
  };

  const value = useMemo(() => ({ openCreate, openEdit, confirmDelete }), [openCreate, openEdit, confirmDelete]);

  return (
    <DialogContext.Provider value={value}>
      {children}

      <Modal
        open={state.kind === "create" || state.kind === "edit"}
        title={state.kind === "edit" ? "Edit expense" : "Add expense"}
        description={state.kind === "edit" ? "Update the details of this expense." : "Record a new expense to track your spending."}
        onClose={close}
      >
        <ExpenseForm
          key={formKey}
          initial={state.kind === "edit" ? state.expense : undefined}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>

      <Modal
        open={state.kind === "delete"}
        title="Delete expense?"
        description={
          state.kind === "delete"
            ? `"${state.expense.description}" (${formatCurrency(state.expense.amountCents)}) will be removed.`
            : undefined
        }
        onClose={close}
        size="sm"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className={buttonStyles.secondary}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (state.kind === "delete") deleteExpense(state.expense.id);
              close();
            }}
            className={buttonStyles.danger}
          >
            Delete
          </button>
        </div>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useExpenseDialogs(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useExpenseDialogs must be used inside <ExpenseDialogProvider>");
  return ctx;
}
