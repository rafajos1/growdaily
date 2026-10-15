"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export const ACCENT = "#53cfa0";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-down";
export const btn = {
  primary: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-down px-4 py-2.5 text-sm font-bold text-[#06231a] transition hover:brightness-110 disabled:opacity-60 ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] ${focus}`,
  danger: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-up px-4 py-2.5 text-sm font-bold text-[#2a0d06] transition hover:brightness-110 ${focus}`,
  ghost: `inline-flex items-center justify-center rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg ${focus}`,
};
export const panel = "rounded-2xl border border-line bg-panel";
export const eyebrow = "font-mono text-xs uppercase tracking-[0.14em] text-muted";

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-panel p-6 shadow-2xl shadow-black/50 sm:max-w-md sm:rounded-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} className={btn.ghost} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
