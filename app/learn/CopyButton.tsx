"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies a template or code sample to the clipboard. */
export function CopyButton({ text, label = "Copy template" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          /* clipboard blocked: the text is still selectable */
        }
      }}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line bg-raised px-3 text-sm font-semibold text-fg transition hover:bg-[#24364f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
    >
      {copied ? <Check className="h-4 w-4 text-down" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}
