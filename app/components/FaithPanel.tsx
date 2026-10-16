"use client";

import Link from "next/link";
import { Church } from "lucide-react";
import type { ReactNode } from "react";
import { FaithSwitch } from "./FaithSwitch";

/** The Faith setting as it appears at the bottom of each app, with what it adds there. */
export function FaithPanel({ on, onChange, children, className = "" }: { on: boolean; onChange: (on: boolean) => void; children: ReactNode; className?: string }) {
  return (
    <section className={`flex items-center gap-4 rounded-2xl border border-line bg-panel p-4 sm:p-5 ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber">
        <Church className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p id="faith-label" className="text-sm font-semibold">Faith</p>
        <p className="mt-0.5 text-xs text-muted">
          {children} Questions welcome.{" "}
          <Link href="/faith/ask" className="font-semibold text-amber underline-offset-2 hover:underline">Ask a question</Link>
          {" · "}
          <Link href="/faith" className="text-amber underline-offset-2 hover:underline">More about Faith</Link>
        </p>
      </div>
      <FaithSwitch on={on} onChange={onChange} labelledBy="faith-label" />
    </section>
  );
}
