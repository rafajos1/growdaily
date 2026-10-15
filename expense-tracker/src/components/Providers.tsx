"use client";

import type { ReactNode } from "react";
import { ExpensesProvider } from "@/hooks/useExpenses";
import { AppShell } from "./AppShell";
import { ExpenseDialogProvider } from "./ExpenseDialogProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ExpensesProvider>
        <ExpenseDialogProvider>
          <AppShell>{children}</AppShell>
        </ExpenseDialogProvider>
      </ExpensesProvider>
    </ToastProvider>
  );
}
