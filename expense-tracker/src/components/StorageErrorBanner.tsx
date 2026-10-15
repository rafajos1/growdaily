"use client";

import { AlertTriangle } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";

export function StorageErrorBanner() {
  const { error } = useExpenses();
  if (!error) return null;
  return (
    <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
      <div>
        <p className="font-semibold">There&apos;s a problem with saved data</p>
        <p className="mt-0.5">{error}</p>
      </div>
    </div>
  );
}
