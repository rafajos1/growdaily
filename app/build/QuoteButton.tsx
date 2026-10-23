"use client";

import { ArrowRight } from "lucide-react";
import type { Interest } from "../../lib/build/idea";
import { INTEREST_EVENT } from "./IdeaForm";

/** Jumps to the start-your-build form on this page with the matching service picked. */
export function QuoteButton({ interest, className }: { interest: Interest; className: string }) {
  return (
    <a
      href="#idea"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(INTEREST_EVENT, { detail: interest }));
        setTimeout(() => document.getElementById("idea-text")?.focus({ preventScroll: true }), 400);
      }}
      className={className}
    >
      Get started <ArrowRight className="h-4 w-4" aria-hidden />
    </a>
  );
}
