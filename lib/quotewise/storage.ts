import { EMPTY, EMPTY_PROFILE, type Doc, type Line, type Profile, type QuoteData } from "./types";

export const STORAGE_KEY = "quotewise:v1";
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

function isLine(v: unknown): v is Line {
  const l = v as Line;
  return !!l && typeof l.id === "string" && typeof l.description === "string" && num(l.qty) && num(l.price) && typeof l.unit === "string" && ["labor", "material", "other"].includes(l.kind);
}

function isDoc(v: unknown): v is Doc {
  const d = v as Doc;
  return (
    !!d &&
    typeof d.id === "string" &&
    (d.kind === "quote" || d.kind === "invoice") &&
    typeof d.number === "string" &&
    ["draft", "sent", "accepted", "declined", "paid"].includes(d.status) &&
    ISO.test(d.date) &&
    ISO.test(d.until) &&
    !!d.client &&
    Array.isArray(d.lines) &&
    num(d.taxRate) &&
    num(d.discount)
  );
}

function parseProfile(v: unknown): Profile {
  const p = (v ?? {}) as Partial<Profile>;
  return {
    business: str(p.business, 80),
    trade: str(p.trade, 60),
    contact: str(p.contact, 200),
    address: str(p.address, 200),
    rate: num(p.rate) ? p.rate! : 0,
    taxRate: num(p.taxRate) ? p.taxRate! : 0,
    terms: typeof p.terms === "string" ? p.terms.slice(0, 500) : EMPTY_PROFILE.terms,
  };
}

/** Parses stored data, dropping anything malformed instead of failing the whole load. */
export function parseData(raw: string | null): QuoteData {
  if (!raw) return { ...EMPTY };
  const p = JSON.parse(raw) as Partial<QuoteData> | null;
  const docs = (Array.isArray(p?.docs) ? p.docs : []).filter(isDoc).map((d) => ({
    ...d,
    title: str(d.title, 120),
    notes: str(d.notes, 1000),
    client: { name: str(d.client.name, 80), contact: str(d.client.contact, 160), address: str(d.client.address, 200) },
    lines: d.lines.filter(isLine),
  }));
  const next = (v: unknown) => (Number.isInteger(v) && (v as number) > 0 ? (v as number) : 1001);
  return { profile: parseProfile(p?.profile), docs, nextQuote: next(p?.nextQuote), nextInvoice: next(p?.nextInvoice) };
}

export function loadData(): QuoteData {
  return parseData(window.localStorage.getItem(STORAGE_KEY));
}

export function saveData(data: QuoteData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
}
