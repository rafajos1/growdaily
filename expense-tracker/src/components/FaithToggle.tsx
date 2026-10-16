"use client";

import clsx from "clsx";
import { Church } from "lucide-react";

/**
 * The always-visible Faith toggle in the header (a copy of the main site's
 * app/components/FaithToggle.tsx; Spendwise is built separately).
 */
export function FaithToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Faith"
      title={on ? "Faith is on. Tap to turn it off." : "Turn on Faith: a little room for God in your day"}
      onClick={() => onChange(!on)}
      className={clsx(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber sm:px-3",
        on ? "border-amber/60 bg-amber/15 text-amber" : "border-line text-muted hover:border-[#2c4060] hover:text-fg",
      )}
    >
      <Church className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Faith</span>
      <span className={clsx("h-1.5 w-1.5 rounded-full", on ? "bg-amber" : "bg-[#3a4c66]")} aria-hidden />
    </button>
  );
}
