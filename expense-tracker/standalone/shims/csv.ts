// Downloads are blocked inside published pages, so "Export CSV" shows the
// CSV in a dialog with a copy button instead (see CsvDialog in main.tsx).
export { escapeCsvCell, expensesToCsv } from "@real/lib/csv";

export function downloadCsv(csv: string, filename: string): void {
  window.dispatchEvent(new CustomEvent("show-csv", { detail: { csv, filename } }));
}
