import { describe, expect, it } from "vitest";
import { cleanDraft, docText, newQuote, toInvoice, totals } from "./logic";
import { sampleData } from "./sample";
import { parseData } from "./storage";
import { EMPTY, type Doc } from "./types";

const doc: Doc = {
  id: "q",
  kind: "quote",
  number: "Q-1001",
  status: "draft",
  title: "Fence",
  client: { name: "Jo", contact: "", address: "" },
  date: "2026-10-20",
  until: "2026-11-19",
  lines: [
    { id: "a", description: "Labor", qty: 2.5, unit: "hr", price: 80, kind: "labor" },
    { id: "b", description: "Boards", qty: 10, unit: "each", price: 4.25, kind: "material" },
  ],
  taxRate: 8,
  discount: 12.5,
  notes: "",
};

describe("totals", () => {
  it("adds lines, takes off the discount, then adds tax", () => {
    expect(totals(doc)).toEqual({ subtotal: 242.5, discount: 12.5, tax: 18.4, total: 248.4 });
  });
  it("never discounts below zero", () => {
    expect(totals({ ...doc, discount: 999 }).total).toBe(0);
  });
});

describe("quotes and invoices", () => {
  it("numbers new quotes and dates them 30 days out", () => {
    const { doc: q, data } = newQuote({ ...EMPTY, profile: { ...EMPTY.profile, taxRate: 6 } }, "x", "2026-10-20");
    expect(q).toMatchObject({ number: "Q-1001", until: "2026-11-19", taxRate: 6, status: "draft" });
    expect(data.nextQuote).toBe(1002);
  });

  it("turns a quote into an invoice due in 14 days and marks the quote accepted", () => {
    const { invoice, data } = toInvoice({ ...EMPTY, docs: [doc] }, "q", "inv", "2026-10-20");
    expect(invoice).toMatchObject({ kind: "invoice", number: "INV-1001", until: "2026-11-03", fromId: "q" });
    expect(totals(invoice).total).toBe(totals(doc).total);
    expect(data.docs.find((d) => d.id === "q")!.status).toBe("accepted");
  });

  it("writes the document as text", () => {
    const text = docText(doc, { ...EMPTY.profile, business: "Oak & Pine", terms: "" });
    expect(text).toContain("Quote Q-1001: Fence");
    expect(text).toContain("- Labor: 2.5 hr × $80.00 = $200.00");
    expect(text).toContain("Total: $248.40");
  });
});

describe("AI drafts", () => {
  it("keeps sensible lines and fixes bad numbers", () => {
    const lines = cleanDraft([
      { description: "Paint", qty: 2, unit: "gal", price: 45.123, kind: "material" },
      { description: "  ", qty: 1, unit: "x", price: 1, kind: "labor" },
      { description: "Prep", qty: -3, unit: "", price: "nope", kind: "weird" },
    ]);
    expect(lines).toEqual([
      { description: "Paint", qty: 2, unit: "gal", price: 45.12, kind: "material" },
      { description: "Prep", qty: 1, unit: "each", price: 0, kind: "other" },
    ]);
    expect(cleanDraft("nope")).toEqual([]);
  });
});

describe("storage", () => {
  it("round-trips the example business", () => {
    const sample = sampleData("2026-10-20");
    const loaded = parseData(JSON.stringify(sample));
    expect(loaded.docs).toHaveLength(3);
    expect(loaded.profile.business).toBe("Oak & Pine Handyman");
    expect(totals(loaded.docs[0]).total).toBeGreaterThan(0);
  });
  it("drops malformed documents", () => {
    expect(parseData(JSON.stringify({ docs: [{ id: 1 }], nextQuote: -4 }))).toMatchObject({ docs: [], nextQuote: 1001 });
  });
});
