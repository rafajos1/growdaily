export const CURRENCY = "USD";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
});

const compactFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function formatCurrencyCompact(cents: number): string {
  return compactFormatter.format(cents / 100);
}

/**
 * Parses a user-entered amount (e.g. "12", "12.5", "$1,234.56") into cents.
 * Returns null when the input is not a valid non-negative amount with at
 * most two decimal places.
 */
export function parseAmountToCents(input: string): number | null {
  const cleaned = input.trim().replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned) && !/^\.\d{1,2}$/.test(cleaned)) return null;
  const [whole = "0", fraction = ""] = cleaned.split(".");
  const cents = Number(whole || "0") * 100 + Number(fraction.padEnd(2, "0") || "0");
  return Number.isSafeInteger(cents) ? cents : null;
}

/** Formats cents as a plain editable string, e.g. 1250 -> "12.50". */
export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

const wholeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

/** Whole-dollar format for chart labels, e.g. 58493 -> "$585". */
export function formatCurrencyWhole(cents: number): string {
  return wholeFormatter.format(Math.round(cents / 100));
}

/** Picks a round axis step (1, 2, 2.5 or 5 × 10^n cents) so `ticks` steps cover `max`. */
export function niceStep(maxCents: number, ticks = 4): number {
  const raw = Math.max(maxCents, 100) / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw)!;
  return step;
}
