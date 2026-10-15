"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { buttonStyles } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-up/15 text-up">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-4 text-lg font-bold">Something went wrong</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">An unexpected error occurred while rendering this page. Your saved data is safe.</p>
      <button type="button" onClick={reset} className={`${buttonStyles.primary} mt-6`}>
        Try again
      </button>
    </div>
  );
}
