"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Copy, FileText, Info, Mail, Plus, Printer, Receipt, Sparkles, Trash2, X } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { SaveProgress } from "../../components/SaveProgress";
import { todayISO } from "../../../lib/habitwise/dates";
import { newId } from "../../../lib/habitwise/storage";
import { printArea } from "../../../lib/print/printArea";
import { docText, lineTotal, money, newQuote, toInvoice, totals, type DraftLine } from "../../../lib/quotewise/logic";
import { sampleData } from "../../../lib/quotewise/sample";
import { loadData, saveData, STORAGE_KEY } from "../../../lib/quotewise/storage";
import { EMPTY, type Doc, type Line, type Profile, type QuoteData, type Status } from "../../../lib/quotewise/types";
import { NumField } from "./NumField";
import { ACCENT, btn, eyebrow, input, label, Modal, panel } from "./ui";

const EXAMPLES_KEY = "quotewise:examples";
type Tab = "docs" | "business";
type Filter = "all" | "quote" | "invoice" | "unpaid";

const STATUS: Record<Status, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-muted/15 text-muted" },
  sent: { label: "Sent", cls: "bg-[#8fb3ff]/15 text-[#8fb3ff]" },
  accepted: { label: "Accepted", cls: "bg-down/15 text-down" },
  declined: { label: "Declined", cls: "bg-up/15 text-up" },
  paid: { label: "Paid", cls: "bg-down/15 text-down" },
};

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function QuotewiseApp({ intro }: { intro?: ReactNode } = {}) {
  const [data, setData] = useState<QuoteData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [examples, setExamples] = useState(false);
  const [tab, setTab] = useState<Tab>("docs");
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const today = todayISO();

  useEffect(() => {
    try {
      let loaded = loadData();
      if (loaded.docs.length === 0 && !loaded.profile.business && safeGet(EXAMPLES_KEY) === null) {
        loaded = sampleData(todayISO());
        saveData(loaded);
        safeSet(EXAMPLES_KEY, "1");
      }
      setData(loaded);
      setExamples(safeGet(EXAMPLES_KEY) === "1" && loaded.docs.length > 0);
    } catch {
      setStorageError("Your browser isn't letting Quotewise save. Changes will be lost when you close the page.");
    }
    setReady(true);
    if (location.hash === "#business") setTab("business");
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setData(loadData());
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = useCallback((next: QuoteData, message?: string) => {
    setData(next);
    try {
      saveData(next);
      setStorageError(null);
    } catch {
      setStorageError("Couldn't save your last change. Your browser storage may be full or blocked.");
    }
    if (message) setToast(message);
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    setOpenId(null);
    history.replaceState(null, "", t === "business" ? "#business" : location.pathname);
  };

  const create = () => {
    const { doc, data: next } = newQuote(data, newId(), today);
    commit(next);
    setTab("docs");
    setOpenId(doc.id);
    window.scrollTo(0, 0);
  };

  const clearExamples = () => {
    commit({ ...EMPTY }, "Examples cleared. Add your business details, then your first quote.");
    safeSet(EXAMPLES_KEY, "0");
    setExamples(false);
    setOpenId(null);
    setTab("business");
  };

  const open = data.docs.find((d) => d.id === openId) ?? null;
  const shown = data.docs.filter((d) => (filter === "all" ? true : filter === "unpaid" ? d.kind === "invoice" && d.status !== "paid" : d.kind === filter));
  const unpaid = data.docs.filter((d) => d.kind === "invoice" && d.status !== "paid").reduce((s, d) => s + totals(d).total, 0);
  const openQuotes = data.docs.filter((d) => d.kind === "quote" && (d.status === "draft" || d.status === "sent")).reduce((s, d) => s + totals(d).total, 0);

  return (
    <div className="min-h-screen pb-28 px-[max(16px,env(safe-area-inset-left))] sm:pb-16">
      <header className="mx-auto flex min-h-[72px] max-w-5xl flex-wrap items-center justify-between gap-2 py-3 sm:py-0">
        <div className="flex items-center gap-1 sm:gap-3">
          <HomeLink />
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <span className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(143,179,255,0.15)]" style={{ background: ACCENT }} aria-hidden />
            Quotewise
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label="Quotewise" className="flex gap-1 rounded-[10px] border border-line bg-panel p-1">
            {(
              [
                ["docs", "Quotes"],
                ["business", "Business"],
              ] as const
            ).map(([id, name]) => (
              <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => switchTab(id)} className={`rounded-[7px] px-3 py-1.5 text-sm font-semibold transition ${tab === id ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}>
                {name}
              </button>
            ))}
          </nav>
          <div className="hidden sm:block">
            <button type="button" onClick={create} className={btn.primary}>
              <Plus className="h-4 w-4" aria-hidden /> New quote
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto mb-5 max-w-5xl">
        {intro}
        <SaveProgress />
      </div>

      <main className="mx-auto max-w-5xl space-y-5">
        <h1 className="sr-only">Quotewise: free quote, estimate and invoice maker</h1>
        {storageError && (
          <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm text-soft">
            {storageError}
          </p>
        )}
        {examples && !open && (
          <div className="flex flex-col gap-3 rounded-xl border border-[#8fb3ff]/40 bg-[#8fb3ff]/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
            <Info className="h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
            <p className="flex-1">
              This is an <strong className="text-fg">example handyman business</strong> with a quote and an invoice, so you can see how Quotewise works.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={btn.secondary}
                onClick={() => {
                  safeSet(EXAMPLES_KEY, "0");
                  setExamples(false);
                }}
              >
                Keep exploring
              </button>
              <button type="button" className={btn.primary} onClick={clearExamples}>
                Start mine
              </button>
            </div>
          </div>
        )}

        {!ready ? (
          <div className={`${panel} h-64 animate-pulse`} aria-busy="true" aria-label="Loading" />
        ) : tab === "business" ? (
          <BusinessView profile={data.profile} onChange={(profile) => commit({ ...data, profile })} onDone={() => switchTab("docs")} />
        ) : open ? (
          <Editor
            doc={open}
            profile={data.profile}
            onBack={() => setOpenId(null)}
            onChange={(patch) => commit({ ...data, docs: data.docs.map((d) => (d.id === open.id ? { ...d, ...patch } : d)) })}
            onInvoice={() => {
              const { invoice, data: next } = toInvoice(data, open.id, newId(), today);
              commit(next, `Invoice ${invoice.number} created from ${open.number}.`);
              setOpenId(invoice.id);
              window.scrollTo(0, 0);
            }}
            onDelete={() => {
              commit({ ...data, docs: data.docs.filter((d) => d.id !== open.id) }, `${open.number} deleted.`);
              setOpenId(null);
            }}
            onToast={setToast}
          />
        ) : (
          <>
            {(!data.profile.business || !data.profile.rate) && (
              <button type="button" onClick={() => switchTab("business")} className={`${panel} flex w-full items-center gap-3 p-4 text-left text-sm hover:border-[#35507a]`}>
                <Info className="h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
                <span className="flex-1 text-soft">
                  <strong className="text-fg">Add your business name and hourly rate.</strong> They go on every quote, and the AI uses your rate for labor.
                </span>
              </button>
            )}
            <section className="grid grid-cols-2 gap-3" aria-label="Summary">
              <div className={`${panel} p-4`}>
                <p className={eyebrow}>Open quotes</p>
                <p className="mt-1 text-2xl font-extrabold">{money(openQuotes)}</p>
              </div>
              <div className={`${panel} p-4`}>
                <p className={eyebrow}>Unpaid invoices</p>
                <p className="mt-1 text-2xl font-extrabold">{money(unpaid)}</p>
              </div>
            </section>
            {data.docs.length === 0 ? (
              <div className={`${panel} flex flex-col items-center px-6 py-16 text-center`}>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8fb3ff]/15" style={{ color: ACCENT }}>
                  <FileText className="h-7 w-7" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold">Make your first quote</h2>
                <p className="mt-1 max-w-sm text-sm text-muted">Describe the job in plain words and AI drafts the line items. Check the prices, then print, save as PDF or email it.</p>
                <button type="button" onClick={create} className={`${btn.primary} mt-6`}>
                  <Plus className="h-4 w-4" aria-hidden /> New quote
                </button>
              </div>
            ) : (
              <section className={`${panel} p-4 sm:p-5`} aria-label="Quotes and invoices">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Show">
                  {(
                    [
                      ["all", "All"],
                      ["quote", "Quotes"],
                      ["invoice", "Invoices"],
                      ["unpaid", "Unpaid"],
                    ] as const
                  ).map(([id, name]) => (
                    <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === id ? "border-[#8fb3ff] bg-[#8fb3ff]/15 text-fg" : "border-line text-soft hover:border-[#8fb3ff]/50"}`}>
                      {name}
                    </button>
                  ))}
                </div>
                <ul className="mt-3 divide-y divide-hairline">
                  {shown.map((d) => (
                    <li key={d.id}>
                      <button type="button" onClick={() => setOpenId(d.id)} className="flex w-full items-center gap-3 py-3 text-left hover:bg-raised/40">
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted">{d.number}</span>
                            <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${STATUS[d.status].cls}`}>{STATUS[d.status].label}</span>
                          </span>
                          <span className="mt-0.5 block truncate font-semibold">{d.title || "Untitled"}</span>
                          <span className="block truncate text-xs text-muted">
                            {d.client.name || "No client yet"} · {longDate(d.date)}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono font-bold">{money(totals(d).total)}</span>
                      </button>
                    </li>
                  ))}
                  {shown.length === 0 && <li className="py-6 text-center text-sm text-muted">Nothing here yet.</li>}
                </ul>
              </section>
            )}
          </>
        )}

        {ready && !open && (
          <aside className={`${panel} flex flex-col gap-3 p-5 sm:flex-row sm:items-center`}>
            <p className="flex-1 text-sm text-soft">
              <strong className="text-fg">Want this built for your business?</strong> A custom version can use your price list, take online payments, and connect to your accounting software.
            </p>
            <Link href="/learn/how-to-write-a-quote-for-a-job" className={btn.secondary}>
              How it works
            </Link>
          </aside>
        )}
      </main>

      {!open && tab === "docs" && (
        <button type="button" onClick={create} aria-label="New quote" className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] right-[max(20px,env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-[#0b1730] shadow-lg shadow-black/40 sm:hidden" style={{ background: ACCENT }}>
          <Plus className="h-6 w-6" aria-hidden />
        </button>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6">
        {toast && (
          <p role="status" className="pointer-events-auto rounded-xl border border-line bg-raised px-4 py-3 text-sm shadow-xl shadow-black/40">
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function BusinessView({ profile, onChange, onDone }: { profile: Profile; onChange: (p: Profile) => void; onDone: () => void }) {
  const set = (patch: Partial<Profile>) => onChange({ ...profile, ...patch });
  return (
    <section className={`${panel} space-y-4 p-5 sm:p-6`} aria-labelledby="biz-heading">
      <div>
        <h2 id="biz-heading" className="text-lg font-bold">
          Your business
        </h2>
        <p className="text-sm text-muted">This goes on every quote and invoice. It&apos;s saved on this device.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="biz-name" className={label}>
            Business name
          </label>
          <input id="biz-name" className={`${input} mt-1.5`} value={profile.business} maxLength={80} onChange={(e) => set({ business: e.target.value })} placeholder="Oak & Pine Handyman" />
        </div>
        <div>
          <label htmlFor="biz-trade" className={label}>
            What you do
          </label>
          <input id="biz-trade" className={`${input} mt-1.5`} value={profile.trade} maxLength={60} onChange={(e) => set({ trade: e.target.value })} placeholder="Handyman, house cleaning, wedding florist…" />
        </div>
        <div>
          <label htmlFor="biz-contact" className={label}>
            Phone, email or website
          </label>
          <input id="biz-contact" className={`${input} mt-1.5`} value={profile.contact} maxLength={200} onChange={(e) => set({ contact: e.target.value })} />
        </div>
        <div>
          <label htmlFor="biz-address" className={label}>
            Address or service area
          </label>
          <input id="biz-address" className={`${input} mt-1.5`} value={profile.address} maxLength={200} onChange={(e) => set({ address: e.target.value })} />
        </div>
        <div>
          <label htmlFor="biz-rate" className={label}>
            Hourly labor rate ($)
          </label>
          <NumField id="biz-rate" className="mt-1.5" value={profile.rate} onCommit={(rate) => set({ rate })} placeholder="75" />
        </div>
        <div>
          <label htmlFor="biz-tax" className={label}>
            Default sales tax (%)
          </label>
          <NumField id="biz-tax" className="mt-1.5" value={profile.taxRate} onCommit={(taxRate) => set({ taxRate })} placeholder="0" />
          <p className="mt-1 text-xs text-muted">Tax rules vary by state and by service. Check what applies to your work.</p>
        </div>
      </div>
      <div>
        <label htmlFor="biz-terms" className={label}>
          Terms shown on every quote and invoice
        </label>
        <textarea id="biz-terms" rows={3} className={`${input} mt-1.5`} value={profile.terms} maxLength={500} onChange={(e) => set({ terms: e.target.value })} />
      </div>
      <button type="button" onClick={onDone} className={btn.primary}>
        Done
      </button>
    </section>
  );
}

function Editor({ doc, profile, onBack, onChange, onInvoice, onDelete, onToast }: { doc: Doc; profile: Profile; onBack: () => void; onChange: (patch: Partial<Doc>) => void; onInvoice: () => void; onDelete: () => void; onToast: (m: string) => void }) {
  const [preview, setPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const t = totals(doc);
  const isQuote = doc.kind === "quote";
  const setLine = (id: string, patch: Partial<Line>) => onChange({ lines: doc.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  const addLine = (kind: Line["kind"]) => onChange({ lines: [...doc.lines, { id: newId(), description: "", qty: 1, unit: kind === "labor" ? "hr" : "each", price: kind === "labor" ? profile.rate : 0, kind }] });
  const statuses: Status[] = isQuote ? ["draft", "sent", "accepted", "declined"] : ["draft", "sent", "paid"];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(docText(doc, profile));
      onToast("Copied. Paste it into an email or text.");
    } catch {
      onToast("Couldn't copy on this browser.");
    }
  };
  const mailto = `mailto:${/@/.test(doc.client.contact) ? encodeURIComponent(doc.client.contact.trim()) : ""}?subject=${encodeURIComponent(`${isQuote ? "Quote" : "Invoice"} ${doc.number}${doc.title ? `: ${doc.title}` : ""}`)}&body=${encodeURIComponent(docText(doc, profile))}`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onBack} className={`${btn.ghost} gap-1.5 text-sm`}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> All quotes
        </button>
        <span className="ml-auto font-mono text-sm text-muted">
          {isQuote ? "Quote" : "Invoice"} {doc.number}
        </span>
        <label className="sr-only" htmlFor="doc-status">
          Status
        </label>
        <select id="doc-status" value={doc.status} onChange={(e) => onChange({ status: e.target.value as Status })} className="rounded-[10px] border border-line bg-sunken px-2 py-1.5 text-sm text-fg">
          {statuses.map((s) => (
            <option key={s} value={s}>
              {STATUS[s].label}
            </option>
          ))}
        </select>
      </div>

      <section className={`${panel} grid gap-4 p-5 sm:grid-cols-2 sm:p-6`} aria-label="Client and job">
        <div className="sm:col-span-2">
          <label htmlFor="doc-title" className={label}>
            Job
          </label>
          <input id="doc-title" className={`${input} mt-1.5`} value={doc.title} maxLength={120} onChange={(e) => onChange({ title: e.target.value })} placeholder="Replace 40 ft of backyard fence" />
        </div>
        <div>
          <label htmlFor="doc-client" className={label}>
            Client
          </label>
          <input id="doc-client" className={`${input} mt-1.5`} value={doc.client.name} maxLength={80} onChange={(e) => onChange({ client: { ...doc.client, name: e.target.value } })} placeholder="Name" />
        </div>
        <div>
          <label htmlFor="doc-contact" className={label}>
            Client email or phone
          </label>
          <input id="doc-contact" className={`${input} mt-1.5`} value={doc.client.contact} maxLength={160} onChange={(e) => onChange({ client: { ...doc.client, contact: e.target.value } })} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="doc-address" className={label}>
            Job address
          </label>
          <input id="doc-address" className={`${input} mt-1.5`} value={doc.client.address} maxLength={200} onChange={(e) => onChange({ client: { ...doc.client, address: e.target.value } })} />
        </div>
        <div>
          <label htmlFor="doc-date" className={label}>
            Date
          </label>
          <input id="doc-date" type="date" className={`${input} mt-1.5`} value={doc.date} onChange={(e) => e.target.value && onChange({ date: e.target.value })} />
        </div>
        <div>
          <label htmlFor="doc-until" className={label}>
            {isQuote ? "Valid until" : "Due"}
          </label>
          <input id="doc-until" type="date" className={`${input} mt-1.5`} value={doc.until} onChange={(e) => e.target.value && onChange({ until: e.target.value })} />
        </div>
      </section>

      {isQuote && <AiDraft profile={profile} onDraft={(d) => onChange({ title: doc.title || d.title, notes: doc.notes || d.notes, lines: [...doc.lines, ...d.lines.map((l) => ({ ...l, id: newId() }))] })} />}

      <section className={`${panel} p-5 sm:p-6`} aria-labelledby="lines-heading">
        <h2 id="lines-heading" className="text-base font-bold">
          Line items
        </h2>
        {doc.lines.length === 0 && <p className="mt-2 text-sm text-muted">No lines yet. Draft them with AI above, or add them yourself.</p>}
        <ul className="mt-3 space-y-3">
          {doc.lines.map((l, i) => (
            <li key={l.id} className="rounded-xl border border-hairline p-3">
              <div className="flex items-start gap-2">
                <label className="sr-only" htmlFor={`desc-${l.id}`}>
                  Line {i + 1} description
                </label>
                <input id={`desc-${l.id}`} className={input} value={l.description} maxLength={120} onChange={(e) => setLine(l.id, { description: e.target.value })} placeholder={l.kind === "labor" ? "Labor: what you'll do" : "Material or item"} />
                <button type="button" aria-label={`Remove line ${i + 1}`} onClick={() => onChange({ lines: doc.lines.filter((x) => x.id !== l.id) })} className={`${btn.ghost} mt-1`}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-[1fr_1fr_1.3fr] items-end gap-2 sm:grid-cols-[6rem_6rem_8rem_8rem_1fr]">
                <div>
                  <span className="text-xs text-muted">Qty</span>
                  <NumField ariaLabel={`Line ${i + 1} quantity`} value={l.qty} onCommit={(qty) => setLine(l.id, { qty })} />
                </div>
                <div>
                  <span className="text-xs text-muted">Unit</span>
                  <input aria-label={`Line ${i + 1} unit`} className={input} value={l.unit} maxLength={12} onChange={(e) => setLine(l.id, { unit: e.target.value })} />
                </div>
                <div>
                  <span className="text-xs text-muted">Price ($)</span>
                  <NumField ariaLabel={`Line ${i + 1} price`} value={l.price} onCommit={(price) => setLine(l.id, { price })} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs text-muted">Type</span>
                  <select aria-label={`Line ${i + 1} type`} className={input} value={l.kind} onChange={(e) => setLine(l.id, { kind: e.target.value as Line["kind"] })}>
                    <option value="labor">Labor</option>
                    <option value="material">Material</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <p className="pb-2.5 text-right font-mono font-bold">{money(lineTotal(l))}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => addLine("labor")} className={`${btn.secondary} px-3 py-2`}>
            <Plus className="h-4 w-4" aria-hidden /> Labor
          </button>
          <button type="button" onClick={() => addLine("material")} className={`${btn.secondary} px-3 py-2`}>
            <Plus className="h-4 w-4" aria-hidden /> Material
          </button>
          <button type="button" onClick={() => addLine("other")} className={`${btn.secondary} px-3 py-2`}>
            <Plus className="h-4 w-4" aria-hidden /> Other
          </button>
        </div>
      </section>

      <section className={`${panel} grid gap-4 p-5 sm:grid-cols-2 sm:p-6`} aria-label="Totals">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="doc-discount" className={label}>
                Discount ($)
              </label>
              <NumField id="doc-discount" className="mt-1.5" value={doc.discount} onCommit={(discount) => onChange({ discount })} />
            </div>
            <div>
              <label htmlFor="doc-tax" className={label}>
                Tax (%)
              </label>
              <NumField id="doc-tax" className="mt-1.5" value={doc.taxRate} onCommit={(taxRate) => onChange({ taxRate })} />
            </div>
          </div>
          <div>
            <label htmlFor="doc-notes" className={label}>
              Notes for the client
            </label>
            <textarea id="doc-notes" rows={3} className={`${input} mt-1.5`} value={doc.notes} maxLength={1000} onChange={(e) => onChange({ notes: e.target.value })} placeholder="What's included, what isn't, timing…" />
          </div>
        </div>
        <dl className="space-y-1.5 self-end rounded-xl bg-sunken p-4 font-mono text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{money(t.subtotal)}</dd>
          </div>
          {t.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Discount</dt>
              <dd>−{money(t.discount)}</dd>
            </div>
          )}
          {doc.taxRate > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Tax ({doc.taxRate}%)</dt>
              <dd>{money(t.tax)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-2 text-lg font-bold">
            <dt>Total</dt>
            <dd>{money(t.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-wrap gap-2" aria-label="Send and next steps">
        <button type="button" onClick={() => setPreview(true)} className={btn.primary}>
          <Printer className="h-4 w-4" aria-hidden /> Preview, print or PDF
        </button>
        <a href={mailto} className={btn.secondary}>
          <Mail className="h-4 w-4" aria-hidden /> Email
        </a>
        <button type="button" onClick={copy} className={btn.secondary}>
          <Copy className="h-4 w-4" aria-hidden /> Copy as text
        </button>
        {isQuote ? (
          <button type="button" onClick={onInvoice} className={btn.secondary}>
            <Receipt className="h-4 w-4" aria-hidden /> Turn into invoice
          </button>
        ) : (
          doc.status !== "paid" && (
            <button type="button" onClick={() => onChange({ status: "paid" })} className={btn.secondary}>
              <Receipt className="h-4 w-4" aria-hidden /> Mark paid
            </button>
          )
        )}
        <button type="button" onClick={() => setConfirmDelete(true)} className={`${btn.ghost} gap-1.5 text-sm`}>
          <Trash2 className="h-4 w-4" aria-hidden /> Delete
        </button>
      </section>

      <Modal open={confirmDelete} title={`Delete ${doc.number}?`} onClose={() => setConfirmDelete(false)}>
        <p className="text-sm text-soft">This can&apos;t be undone.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className={btn.secondary} onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
          <button type="button" className={btn.danger} onClick={onDelete}>
            Delete
          </button>
        </div>
      </Modal>

      {preview && <Preview doc={doc} profile={profile} onClose={() => setPreview(false)} />}
    </>
  );
}

function AiDraft({ profile, onDraft }: { profile: Profile; onDraft: (d: { title: string; notes: string; lines: DraftLine[] }) => void }) {
  const [job, setJob] = useState("");
  const [state, setState] = useState<{ status: "idle" | "loading" | "error" | "done"; message?: string; assumptions?: string[] }>({ status: "idle" });

  const draft = async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/quotewise/draft", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ job, trade: profile.trade || profile.business, rate: profile.rate }) });
      const body = (await res.json().catch(() => ({}))) as { title?: string; notes?: string; lines?: DraftLine[]; assumptions?: string[]; error?: string };
      if (!res.ok || !body.lines?.length) throw new Error(body.error || "The draft couldn't be written right now. Please try again.");
      onDraft({ title: body.title ?? "", notes: body.notes ?? "", lines: body.lines });
      setState({ status: "done", assumptions: body.assumptions ?? [] });
      setJob("");
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  return (
    <section className="rounded-2xl border border-[#8fb3ff]/40 bg-[#8fb3ff]/[0.07] p-5 sm:p-6" aria-labelledby="ai-heading">
      <h2 id="ai-heading" className="flex items-center gap-2 text-base font-bold">
        <Sparkles className="h-4 w-4" style={{ color: ACCENT }} aria-hidden /> Draft line items with AI
      </h2>
      <label htmlFor="ai-job" className="mt-1 block text-sm text-muted">
        Describe the job the way you&apos;d explain it to a helper. AI uses your hourly rate{profile.rate ? ` ($${profile.rate})` : ""} for labor and estimates materials.
      </label>
      <textarea id="ai-job" rows={3} maxLength={1500} className={`${input} mt-2`} value={job} onChange={(e) => setJob(e.target.value)} placeholder="Replace 40 ft of 6 ft cedar privacy fence, remove and haul the old one, 6 posts set in concrete, no gate." />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={draft} disabled={state.status === "loading" || job.trim().length < 10} className={btn.primary}>
          {state.status === "loading" ? "Drafting…" : "Draft line items"}
        </button>
        {!profile.rate && <span className="text-xs text-muted">Tip: add your hourly rate under Business first.</span>}
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm font-semibold text-up">
          {state.message}
        </p>
      )}
      {state.status === "done" && (
        <div className="mt-3 rounded-xl border border-line bg-panel p-3 text-sm text-soft">
          <p className="font-semibold text-fg">Added below. Check every price against your own costs before you send it.</p>
          {state.assumptions && state.assumptions.length > 0 && (
            <ul className="mt-1.5 list-disc space-y-1 pl-5">
              {state.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function Preview({ doc, profile, onClose }: { doc: Doc; profile: Profile; onClose: () => void }) {
  const t = totals(doc);
  const isQuote = doc.kind === "quote";
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${isQuote ? "Quote" : "Invoice"} preview`} className="print-host fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-8">
      <div className="mx-auto mb-3 flex max-w-2xl justify-end gap-2">
        <button type="button" onClick={printArea} className={btn.primary}>
          <Printer className="h-4 w-4" aria-hidden /> Print or save as PDF
        </button>
        <button type="button" onClick={onClose} className={btn.secondary} aria-label="Close preview">
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <article className="print-area mx-auto max-w-2xl rounded-xl bg-white p-6 text-[#111827] shadow-2xl sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="text-xl font-extrabold">{profile.business || "Your business"}</p>
            {profile.address && <p className="text-sm text-gray-600">{profile.address}</p>}
            {profile.contact && <p className="text-sm text-gray-600">{profile.contact}</p>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold uppercase tracking-wide text-gray-800">{isQuote ? "Quote" : "Invoice"}</p>
            <p className="font-mono text-sm text-gray-600">{doc.number}</p>
            <p className="text-sm text-gray-600">Date: {longDate(doc.date)}</p>
            <p className="text-sm text-gray-600">
              {isQuote ? "Valid until" : "Due"}: {longDate(doc.until)}
            </p>
          </div>
        </header>
        <div className="mt-5 flex flex-wrap justify-between gap-4 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">For</p>
            <p className="font-semibold">{doc.client.name || "—"}</p>
            {doc.client.address && <p className="text-gray-600">{doc.client.address}</p>}
            {doc.client.contact && <p className="text-gray-600">{doc.client.contact}</p>}
          </div>
          {doc.title && (
            <div className="max-w-xs text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Job</p>
              <p className="font-semibold">{doc.title}</p>
            </div>
          )}
        </div>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-2 font-bold">Description</th>
              <th className="py-2 pr-2 text-right font-bold">Qty</th>
              <th className="py-2 pr-2 text-right font-bold">Price</th>
              <th className="py-2 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.lines.map((l) => (
              <tr key={l.id} className="border-b border-gray-100 align-top">
                <td className="py-2 pr-2">{l.description || "—"}</td>
                <td className="whitespace-nowrap py-2 pr-2 text-right">
                  {l.qty} {l.unit}
                </td>
                <td className="whitespace-nowrap py-2 pr-2 text-right">{money(l.price)}</td>
                <td className="whitespace-nowrap py-2 text-right font-semibold">{money(lineTotal(l))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd>{money(t.subtotal)}</dd>
          </div>
          {t.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Discount</dt>
              <dd>−{money(t.discount)}</dd>
            </div>
          )}
          {doc.taxRate > 0 && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Tax ({doc.taxRate}%)</dt>
              <dd>{money(t.tax)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-extrabold">
            <dt>Total</dt>
            <dd>{money(t.total)}</dd>
          </div>
        </dl>
        {doc.notes && <p className="mt-6 whitespace-pre-line text-sm text-gray-700">{doc.notes}</p>}
        {profile.terms && <p className="mt-4 whitespace-pre-line text-xs text-gray-500">{profile.terms}</p>}
      </article>
    </div>
  );
}
