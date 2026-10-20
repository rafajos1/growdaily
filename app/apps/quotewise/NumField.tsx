"use client";

import { useEffect, useState } from "react";
import { input } from "./ui";

/** A number field that keeps what's typed and saves a valid number when it loses focus. */
export function NumField({ id, value, onCommit, className = "", ariaLabel, placeholder }: { id?: string; value: number; onCommit: (n: number) => void; className?: string; ariaLabel?: string; placeholder?: string }) {
  const [text, setText] = useState(value ? String(value) : "");
  useEffect(() => setText(value ? String(value) : ""), [value]);
  const commit = () => {
    const n = Number(text.replace(/[$,\s%]/g, "") || "0");
    if (Number.isFinite(n) && n >= 0) {
      if (n !== value) onCommit(Math.round(n * 100) / 100);
    } else setText(value ? String(value) : "");
  };
  return (
    <input
      id={id}
      aria-label={ariaLabel}
      inputMode="decimal"
      placeholder={placeholder ?? "0"}
      className={`${input} ${className}`}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
    />
  );
}
