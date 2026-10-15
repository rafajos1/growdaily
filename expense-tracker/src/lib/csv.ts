import type { Expense } from "./types";

const HEADERS = ["Date", "Description", "Category", "Amount"];

/**
 * Escapes a CSV cell per RFC 4180 and neutralises spreadsheet formula
 * injection (cells beginning with = + - @ are prefixed with a quote).
 */
export function escapeCsvCell(value: string): string {
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  if (/[",\r\n]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function expensesToCsv(expenses: Expense[]): string {
  const rows = expenses.map((e) =>
    [e.date, e.description, e.category, (e.amountCents / 100).toFixed(2)].map(escapeCsvCell).join(","),
  );
  return [HEADERS.join(","), ...rows].join("\r\n");
}

export function downloadCsv(csv: string, filename: string): void {
  // BOM so Excel detects UTF-8 correctly.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
