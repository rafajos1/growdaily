import { addDays } from "../habitwise/dates";
import { newId } from "../habitwise/storage";
import type { Doc, Line, QuoteData } from "./types";

const line = (description: string, qty: number, unit: string, price: number, kind: Line["kind"]): Line => ({ id: newId(), description, qty, unit, price, kind });

/** An example handyman business with a sent quote and an invoice, so people see how it works. */
export function sampleData(today: string): QuoteData {
  const fence: Doc = {
    id: newId(),
    kind: "quote",
    number: "Q-1002",
    status: "sent",
    title: "Replace 40 ft of backyard fence",
    client: { name: "Jordan Lee", contact: "jordan@example.com", address: "214 Maple St" },
    date: addDays(today, -2),
    until: addDays(today, 28),
    lines: [
      line("Remove and haul away old fence", 4, "hr", 75, "labor"),
      line("Cedar fence pickets, 6 ft", 90, "each", 4.25, "material"),
      line("Pressure-treated posts, 4×4×8", 6, "each", 14.5, "material"),
      line("Rails, 2×4×8", 15, "each", 6.75, "material"),
      line("Concrete mix for posts, 50 lb", 6, "bag", 6.5, "material"),
      line("Install posts, rails and pickets", 14, "hr", 75, "labor"),
    ],
    taxRate: 8,
    discount: 0,
    notes: "Includes setting posts in concrete and cleanup. Gate not included.",
  };
  const fan: Doc = {
    id: newId(),
    kind: "quote",
    number: "Q-1001",
    status: "accepted",
    title: "Replace bathroom exhaust fan",
    client: { name: "Sam Rivera", contact: "(555) 010-4477", address: "88 Cedar Ave" },
    date: addDays(today, -9),
    until: addDays(today, 21),
    lines: [line("Bathroom exhaust fan, 80 CFM", 1, "each", 89, "material"), line("Remove old fan, install and wire new fan, patch ceiling", 2.5, "hr", 75, "labor")],
    taxRate: 8,
    discount: 0,
    notes: "",
  };
  const invoice: Doc = { ...fan, id: newId(), kind: "invoice", number: "INV-1001", status: "sent", date: addDays(today, -3), until: addDays(today, 11), fromId: fan.id, lines: fan.lines.map((l) => ({ ...l, id: newId() })) };
  return {
    profile: { business: "Oak & Pine Handyman", trade: "handyman and small repairs", contact: "(555) 010-2299 · hello@oakandpine.example", address: "Springfield", rate: 75, taxRate: 8, terms: "Quote valid for 30 days. Payment due within 14 days of invoice. Thank you for your business!" },
    docs: [fence, invoice, fan],
    nextQuote: 1003,
    nextInvoice: 1002,
  };
}
