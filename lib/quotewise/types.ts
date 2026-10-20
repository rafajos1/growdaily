export type LineKind = "labor" | "material" | "other";

export interface Line {
  id: string;
  description: string;
  qty: number;
  /** e.g. "hr", "ft", "each". */
  unit: string;
  price: number;
  kind: LineKind;
}

export type DocKind = "quote" | "invoice";
export type Status = "draft" | "sent" | "accepted" | "declined" | "paid";

export interface Doc {
  id: string;
  kind: DocKind;
  number: string;
  status: Status;
  title: string;
  client: { name: string; contact: string; address: string };
  date: string;
  /** Valid-until for a quote, due date for an invoice. */
  until: string;
  lines: Line[];
  /** Percent, e.g. 8.25. */
  taxRate: number;
  discount: number;
  notes: string;
  /** The quote an invoice was made from. */
  fromId?: string;
}

export interface Profile {
  business: string;
  /** What the business does, e.g. "handyman" or "wedding florist"; helps the AI draft. */
  trade: string;
  contact: string;
  address: string;
  /** Hourly labor rate. */
  rate: number;
  taxRate: number;
  terms: string;
}

export interface QuoteData {
  profile: Profile;
  docs: Doc[];
  nextQuote: number;
  nextInvoice: number;
}

export const EMPTY_PROFILE: Profile = { business: "", trade: "", contact: "", address: "", rate: 0, taxRate: 0, terms: "Quote valid for 30 days. Payment due within 14 days of invoice." };
export const EMPTY: QuoteData = { profile: EMPTY_PROFILE, docs: [], nextQuote: 1001, nextInvoice: 1001 };
