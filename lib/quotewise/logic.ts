import { addDays } from "../habitwise/dates";
import type { Doc, Line, Profile, QuoteData } from "./types";

const round2 = (n: number) => Math.round(n * 100) / 100;

export function lineTotal(l: Line): number {
  return round2(l.qty * l.price);
}

export function totals(doc: Doc): { subtotal: number; discount: number; tax: number; total: number } {
  const subtotal = round2(doc.lines.reduce((s, l) => s + lineTotal(l), 0));
  const discount = round2(Math.min(Math.max(0, doc.discount), subtotal));
  const tax = round2(((subtotal - discount) * Math.max(0, doc.taxRate)) / 100);
  return { subtotal, discount, tax, total: round2(subtotal - discount + tax) };
}

export const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** A blank quote numbered and dated, with the business's tax rate. */
export function newQuote(data: QuoteData, id: string, today: string): { doc: Doc; data: QuoteData } {
  const doc: Doc = {
    id,
    kind: "quote",
    number: `Q-${data.nextQuote}`,
    status: "draft",
    title: "",
    client: { name: "", contact: "", address: "" },
    date: today,
    until: addDays(today, 30),
    lines: [],
    taxRate: data.profile.taxRate,
    discount: 0,
    notes: "",
  };
  return { doc, data: { ...data, docs: [doc, ...data.docs], nextQuote: data.nextQuote + 1 } };
}

/** Turns an accepted quote into an invoice due in 14 days, keeping its lines. */
export function toInvoice(data: QuoteData, quoteId: string, id: string, today: string): { invoice: Doc; data: QuoteData } {
  const quote = data.docs.find((d) => d.id === quoteId)!;
  const invoice: Doc = { ...quote, id, kind: "invoice", number: `INV-${data.nextInvoice}`, status: "draft", date: today, until: addDays(today, 14), fromId: quote.id, lines: quote.lines.map((l) => ({ ...l })) };
  return {
    invoice,
    data: { ...data, docs: [invoice, ...data.docs.map((d) => (d.id === quoteId ? { ...d, status: "accepted" as const } : d))], nextInvoice: data.nextInvoice + 1 },
  };
}

const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** The document as plain text, for an email or a text message. */
export function docText(doc: Doc, profile: Profile): string {
  const t = totals(doc);
  const label = doc.kind === "quote" ? "Quote" : "Invoice";
  return [
    `${label} ${doc.number}${doc.title ? `: ${doc.title}` : ""}`,
    profile.business ? `From ${profile.business}` : "",
    doc.client.name ? `For ${doc.client.name}` : "",
    `Date: ${longDate(doc.date)}`,
    `${doc.kind === "quote" ? "Valid until" : "Due"}: ${longDate(doc.until)}`,
    "",
    ...doc.lines.map((l) => `- ${l.description}: ${l.qty} ${l.unit} × ${money(l.price)} = ${money(lineTotal(l))}`),
    "",
    `Subtotal: ${money(t.subtotal)}`,
    t.discount ? `Discount: −${money(t.discount)}` : "",
    doc.taxRate ? `Tax (${doc.taxRate}%): ${money(t.tax)}` : "",
    `Total: ${money(t.total)}`,
    doc.notes ? `\n${doc.notes}` : "",
    profile.terms ? `\n${profile.terms}` : "",
    profile.contact ? `\n${profile.contact}` : "",
  ]
    .filter((s, i, all) => s !== "" || (all[i - 1] ?? "") !== "")
    .join("\n")
    .trim();
}

export interface DraftLine {
  description: string;
  qty: number;
  unit: string;
  price: number;
  kind: "labor" | "material" | "other";
}

/** Cleans up AI-drafted lines: sensible numbers, short text, at most 20 lines. */
export function cleanDraft(lines: unknown): DraftLine[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .slice(0, 20)
    .map((l) => l as Partial<DraftLine>)
    .filter((l) => typeof l.description === "string" && l.description.trim())
    .map((l) => ({
      description: String(l.description).trim().slice(0, 120),
      qty: Number.isFinite(l.qty) && l.qty! > 0 ? Math.round(l.qty! * 100) / 100 : 1,
      unit: typeof l.unit === "string" && l.unit.trim() ? l.unit.trim().slice(0, 12) : "each",
      price: Number.isFinite(l.price) && l.price! >= 0 ? Math.round(l.price! * 100) / 100 : 0,
      kind: l.kind === "labor" || l.kind === "material" ? l.kind : "other",
    }));
}
