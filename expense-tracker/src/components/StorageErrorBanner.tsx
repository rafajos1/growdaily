"use client";

import { AlertTriangle } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";

export function StorageErrorBanner() {
  const { error } = useExpenses();
  if (!error) return null;
  return (
    <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-up/40 bg-up/10 p-4 text-sm text-soft">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-up" aria-hidden />
      <div>
        <p className="font-bold text-fg">There&apos;s a problem with saved data</p>
        <p className="mt-0.5">{error}</p>
      </div>
    </div>
  );
}
