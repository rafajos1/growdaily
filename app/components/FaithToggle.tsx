"use client";

import { Church } from "lucide-react";

/**
 * The always-visible Faith toggle in each app's header: off by default, so the
 * apps work without it, and one tap for anyone curious. It's the same setting
 * as the switch at the bottom of each app and on the homepage.
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
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber sm:px-3 ${
        on ? "border-amber/60 bg-amber/15 text-amber" : "border-line text-muted hover:border-[#2c4060] hover:text-fg"
      }`}
    >
      <Church className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Faith</span>
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-amber" : "bg-[#3a4c66]"}`} aria-hidden />
    </button>
  );
}
