"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useToast } from "@/components/ToastProvider";
import { generateSampleExpenses } from "@/lib/sample-data";
import { STORAGE_KEY, StorageError, createId, loadExpenses, saveExpenses } from "@/lib/storage";
import type { Expense, ExpenseInput } from "@/lib/types";

type Status = "loading" | "ready";

interface ExpensesContextValue {
  expenses: Expense[];
  status: Status;
  /** Persistent problem with storage (e.g. unavailable or corrupt). */
  error: string | null;
  addExpense: (input: ExpenseInput) => boolean;
  updateExpense: (id: string, input: ExpenseInput) => boolean;
  deleteExpense: (id: string) => boolean;
  loadSampleData: () => boolean;
  clearAll: () => boolean;
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

function describe(err: unknown): string {
  return err instanceof StorageError ? err.message : "Something went wrong while saving.";
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  // Mirror of state so actions always see the latest list without re-creating callbacks.
  const latest = useRef<Expense[]>([]);

  const apply = useCallback((next: Expense[]) => {
    latest.current = next;
    setExpenses(next);
  }, []);

  const reload = useCallback(() => {
    try {
      const { expenses: loaded, dropped } = loadExpenses();
      apply(loaded);
      setError(null);
      if (dropped > 0) {
        toast("info", `Skipped ${dropped} invalid saved ${dropped === 1 ? "entry" : "entries"}.`);
      }
    } catch (err) {
      setError(describe(err));
    } finally {
      setStatus("ready");
    }
  }, [apply, toast]);

  useEffect(() => {
    reload();
    // Keep multiple open tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  /** Persists first, then updates state, so the UI never shows unsaved data as saved. */
  const commit = useCallback(
    (next: Expense[]): boolean => {
      try {
        saveExpenses(next);
      } catch (err) {
        toast("error", describe(err));
        return false;
      }
      apply(next);
      return true;
    },
    [apply, toast],
  );

  const addExpense = useCallback(
    (input: ExpenseInput) => {
      const now = new Date().toISOString();
      return commit([...latest.current, { ...input, id: createId(), createdAt: now, updatedAt: now }]);
    },
    [commit],
  );

  const updateExpense = useCallback(
    (id: string, input: ExpenseInput) => {
      const now = new Date().toISOString();
      return commit(latest.current.map((e) => (e.id === id ? { ...e, ...input, updatedAt: now } : e)));
    },
    [commit],
  );

  const deleteExpense = useCallback(
    (id: string) => {
      const index = latest.current.findIndex((e) => e.id === id);
      if (index === -1) return false;
      const removed = latest.current[index];
      const ok = commit(latest.current.filter((e) => e.id !== id));
      if (ok) {
        toast("success", "Expense deleted.", {
          label: "Undo",
          onClick: () => {
            if (latest.current.some((e) => e.id === removed.id)) return;
            const restored = [...latest.current];
            restored.splice(Math.min(index, restored.length), 0, removed);
            if (commit(restored)) toast("success", "Expense restored.");
          },
        });
      }
      return ok;
    },
    [commit, toast],
  );

  const loadSampleData = useCallback(() => {
    const ok = commit([...latest.current, ...generateSampleExpenses()]);
    if (ok) toast("success", "Sample expenses added.");
    return ok;
  }, [commit, toast]);

  const clearAll = useCallback(() => {
    const ok = commit([]);
    if (ok) toast("success", "All expenses cleared.");
    return ok;
  }, [commit, toast]);

  const value = useMemo<ExpensesContextValue>(
    () => ({ expenses, status, error, addExpense, updateExpense, deleteExpense, loadSampleData, clearAll }),
    [expenses, status, error, addExpense, updateExpense, deleteExpense, loadSampleData, clearAll],
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses(): ExpensesContextValue {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used inside <ExpensesProvider>");
  return ctx;
}
