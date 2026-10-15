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
