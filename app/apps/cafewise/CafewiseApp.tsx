"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ClipboardCopy, Coffee, Info, MessageSquare, Minus, Pencil, Plus, Sparkles, Trash2, Truck } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { SaveProgress } from "../../components/SaveProgress";
import { addDays, todayISO } from "../../../lib/habitwise/dates";
import { newId } from "../../../lib/habitwise/storage";
import { buildReviewInput, dailyUse, deliveryGap, drinkCost, orderList, orderText, priceForTarget, stockoutDays, suggestedPar, unitCost, wasteSince, type OrderLine } from "../../../lib/cafewise/logic";
import { sampleData } from "../../../lib/cafewise/sample";
import { loadData, saveData, STORAGE_KEY } from "../../../lib/cafewise/storage";
import { AREAS, EMPTY, type CafeData, type Item, type Recipe } from "../../../lib/cafewise/types";
import { ItemForm, RecipeForm, WasteForm, type ItemDraft, type RecipeDraft } from "./Forms";
import { ACCENT, btn, eyebrow, Modal, money, panel, qty } from "./ui";

const EXAMPLES_KEY = "cafewise:examples";
const REVIEW_KEY = "cafewise:review";
const TABS = [
  { id: "stock", label: "Stock" },
  { id: "order", label: "Order" },
  { id: "drinks", label: "Drinks" },
] as const;
type Tab = (typeof TABS)[number]["id"];
type Dialog =
  | { kind: "none" }
  | { kind: "item"; item?: Item }
  | { kind: "deleteItem"; item: Item }
  | { kind: "recipe"; recipe?: Recipe }
  | { kind: "waste"; itemId?: string };

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

const plural = (n: number, unit: string) => (n === 1 || unit.endsWith("s") ? unit : `${unit}s`);

/** Sets an item's on-hand amount and records it in today's count. */
function setOnHand(data: CafeData, itemId: string, value: number, today: string): CafeData {
  const v = Math.max(0, Math.round(value * 10) / 10);
  const existing = data.counts.find((c) => c.date === today);
  const counts = existing
    ? data.counts.map((c) => (c.date === today ? { ...c, values: { ...c.values, [itemId]: v } } : c))
    : [...data.counts, { date: today, values: { [itemId]: v } }];
  // Keep about three months of counts.
  const cutoff = addDays(today, -90);
  return { ...data, items: data.items.map((i) => (i.id === itemId ? { ...i, onHand: v } : i)), counts: counts.filter((c) => c.date >= cutoff) };
}

export function CafewiseApp() {
  const [data, setData] = useState<CafeData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [examples, setExamples] = useState(false);
  const [tab, setTab] = useState<Tab>("stock");
  const [dialog, setDialog] = useState<Dialog>({ kind: "none" });
  const [toast, setToast] = useState<string | null>(null);
  const today = todayISO();

  // Load once; seed an example café on the very first visit so the app opens in a working state.
  useEffect(() => {
    try {
      let loaded = loadData();
      if (loaded.items.length === 0 && safeGet(EXAMPLES_KEY) === null) {
        loaded = sampleData(todayISO());
        saveData(loaded);
        safeSet(EXAMPLES_KEY, "1");
      }
      setData(loaded);
      setExamples(safeGet(EXAMPLES_KEY) === "1" && loaded.items.length > 0);
    } catch {
      setStorageError("Your browser isn't letting Cafewise save. Changes will be lost when you close the page.");
    }
    setReady(true);
    const hash = location.hash.slice(1);
    if (TABS.some((t) => t.id === hash)) setTab(hash as Tab);
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

  const commit = useCallback((next: CafeData, message?: string) => {
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
    history.replaceState(null, "", t === "stock" ? location.pathname : `#${t}`);
  };

  const saveItem = (draft: ItemDraft) => {
    if (dialog.kind === "item" && dialog.item) {
      const id = dialog.item.id;
      const next = { ...data, items: data.items.map((i) => (i.id === id ? { ...i, ...draft, onHand: i.onHand } : i)) };
      commit(draft.onHand !== dialog.item.onHand ? setOnHand(next, id, draft.onHand, today) : next, "Item updated.");
    } else {
      const item: Item = { id: newId(), ...draft };
      commit(setOnHand({ ...data, items: [...data.items, item] }, item.id, draft.onHand, today), `Added “${draft.name}”.`);
    }
    setDialog({ kind: "none" });
  };

  const deleteItem = (item: Item) => {
    commit(
      {
        ...data,
        items: data.items.filter((i) => i.id !== item.id),
        recipes: data.recipes.map((r) => ({ ...r, lines: r.lines.filter((l) => l.itemId !== item.id) })),
        receipts: data.receipts.filter((r) => r.itemId !== item.id),
        waste: data.waste.filter((w) => w.itemId !== item.id),
      },
      `Deleted “${item.name}”.`,
    );
    setDialog({ kind: "none" });
  };

  const saveRecipe = (draft: RecipeDraft) => {
    if (dialog.kind === "recipe" && dialog.recipe) {
      const id = dialog.recipe.id;
      commit({ ...data, recipes: data.recipes.map((r) => (r.id === id ? { ...r, ...draft } : r)) }, "Drink updated.");
    } else {
      commit({ ...data, recipes: [...data.recipes, { id: newId(), ...draft }] }, `Added “${draft.name}”.`);
    }
    setDialog({ kind: "none" });
  };

  const logWaste = ({ itemId, qty: amount, reason }: { itemId: string; qty: number; reason: "expired" | "unsold" | "spilled" | "other" }) => {
    const item = data.items.find((i) => i.id === itemId)!;
    const next = { ...data, waste: [...data.waste, { id: newId(), date: today, itemId, qty: amount, reason }].filter((w) => w.date >= addDays(today, -90)) };
    commit(setOnHand(next, itemId, item.onHand - amount, today), `Logged ${qty(amount)} ${plural(amount, item.buyUnit)} of ${item.name}.`);
    setDialog({ kind: "none" });
  };

  const receive = (supplier: string, lines: OrderLine[]) => {
    let next: CafeData = { ...data, receipts: [...data.receipts, ...lines.map((l) => ({ date: today, itemId: l.item.id, qty: l.qty }))].filter((r) => r.date >= addDays(today, -90)) };
    for (const l of lines) next = setOnHand(next, l.item.id, l.item.onHand + l.qty, today);
    commit(next, `${supplier} order received. Stock updated.`);
  };

  const clearExamples = () => {
    commit({ ...EMPTY }, "Examples cleared. Add your first item.");
    safeSet(EXAMPLES_KEY, "0");
    safeSet(REVIEW_KEY, null);
    setExamples(false);
  };

  const add = () => setDialog(tab === "drinks" && data.items.length > 0 ? { kind: "recipe" } : { kind: "item" });

  return (
    <div className="min-h-screen pb-28 px-[max(16px,env(safe-area-inset-left))] sm:pb-16">
      <header className="mx-auto flex min-h-[72px] max-w-5xl flex-wrap items-center justify-between gap-2 py-3 sm:py-0">
        <div className="flex items-center gap-1 sm:gap-3">
          <HomeLink />
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <span className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(217,150,91,0.15)]" style={{ background: ACCENT }} aria-hidden />
            Cafewise
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label="Cafewise" className="flex gap-1 rounded-[10px] border border-line bg-panel p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => switchTab(t.id)}
                className={`rounded-[7px] px-3 py-1.5 text-sm font-semibold transition ${tab === t.id ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="hidden sm:block">
            <button type="button" onClick={add} className={btn.primary}>
              <Plus className="h-4 w-4" aria-hidden /> {tab === "drinks" ? "New drink" : "New item"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto mb-5 max-w-5xl">
        <SaveProgress />
      </div>

      <main className="mx-auto max-w-5xl space-y-5">
        <h1 className="sr-only">Cafewise: stock, ordering and drink costs for your coffee shop</h1>
        {storageError && (
          <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm text-soft">
            {storageError}
          </p>
        )}
        {examples && (
          <div className="flex flex-col gap-3 rounded-xl border border-[#d9965b]/40 bg-[#d9965b]/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
            <Info className="h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
            <p className="flex-1">
              This is an <strong className="text-fg">example café</strong> with three weeks of counts, deliveries and waste, so you can see how Cafewise works. Prices are illustrative.
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
                Start my café
              </button>
            </div>
          </div>
        )}

        {!ready ? (
          <div className={`${panel} h-64 animate-pulse`} aria-busy="true" aria-label="Loading" />
        ) : data.items.length === 0 ? (
          <div className={`${panel} flex flex-col items-center px-6 py-16 text-center`}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d9965b]/15" style={{ color: ACCENT }}>
              <Coffee className="h-7 w-7" aria-hidden />
            </span>
            <h2 className="mt-4 text-lg font-bold">Add what you keep in stock</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">Start with the items you run out of or throw away most: milk, pastries, beans, cups. Cafewise turns your counts into an order list.</p>
            <button type="button" onClick={() => setDialog({ kind: "item" })} className={`${btn.primary} mt-6`}>
              <Plus className="h-4 w-4" aria-hidden /> Add your first item
            </button>
          </div>
        ) : tab === "stock" ? (
          <StockView data={data} today={today} onCount={(id, v) => commit(setOnHand(data, id, v, today))} onEdit={(item) => setDialog({ kind: "item", item })} onWaste={(itemId) => setDialog({ kind: "waste", itemId })} />
        ) : tab === "order" ? (
          <OrderView data={data} today={today} onReceive={receive} onSetPar={(item, par) => commit({ ...data, items: data.items.map((i) => (i.id === item.id ? { ...i, par } : i)) }, `${item.name} par set to ${par}.`)} onCopied={setToast} />
        ) : (
          <DrinksView data={data} onEdit={(recipe) => setDialog({ kind: "recipe", recipe })} onAdd={() => setDialog({ kind: "recipe" })} onTarget={(t) => commit({ ...data, targetCost: t })} />
        )}

        {ready && (
          <aside className={`${panel} flex flex-col gap-3 p-5 sm:flex-row sm:items-center`}>
            <p className="flex-1 text-sm text-soft">
              <strong className="text-fg">Want this built for your café?</strong> A custom version can connect to your point of sale, handle more than one location, and give each staff member their own login.
            </p>
            <Link href="/learn/coffee-shop-inventory-management" className={btn.secondary}>
              How it works
            </Link>
          </aside>
        )}
      </main>

      {/* Mobile add button */}
      <button
        type="button"
        onClick={add}
        aria-label={tab === "drinks" ? "New drink" : "New item"}
        className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] right-[max(20px,env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-[#2a1606] shadow-lg shadow-black/40 sm:hidden"
        style={{ background: ACCENT }}
      >
        <Plus className="h-6 w-6" aria-hidden />
      </button>

      <Modal open={dialog.kind === "item"} title={dialog.kind === "item" && dialog.item ? "Edit item" : "New item"} onClose={() => setDialog({ kind: "none" })}>
        {dialog.kind === "item" && (
          <ItemForm key={dialog.item?.id ?? "new"} initial={dialog.item} onSubmit={saveItem} onCancel={() => setDialog({ kind: "none" })} onDelete={dialog.item ? () => setDialog({ kind: "deleteItem", item: dialog.item! }) : undefined} />
        )}
      </Modal>
      <Modal open={dialog.kind === "deleteItem"} title="Delete item?" onClose={() => setDialog({ kind: "none" })}>
        {dialog.kind === "deleteItem" && (
          <>
            <p className="text-sm text-soft">“{dialog.item.name}” and its history will be removed, and it will be taken out of any drink recipes. This can&apos;t be undone.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className={btn.secondary} onClick={() => setDialog({ kind: "none" })}>
                Cancel
              </button>
              <button type="button" className={btn.danger} onClick={() => deleteItem(dialog.item)}>
                Delete item
              </button>
            </div>
          </>
        )}
      </Modal>
      <Modal open={dialog.kind === "recipe"} title={dialog.kind === "recipe" && dialog.recipe ? "Edit drink" : "New drink"} onClose={() => setDialog({ kind: "none" })}>
        {dialog.kind === "recipe" && (
          <RecipeForm
            key={dialog.recipe?.id ?? "new"}
            initial={dialog.recipe}
            items={data.items}
            onSubmit={saveRecipe}
            onCancel={() => setDialog({ kind: "none" })}
            onDelete={
              dialog.recipe
                ? () => {
                    const id = dialog.recipe!.id;
                    commit({ ...data, recipes: data.recipes.filter((r) => r.id !== id) }, "Drink deleted.");
                    setDialog({ kind: "none" });
                  }
                : undefined
            }
          />
        )}
      </Modal>
      <Modal open={dialog.kind === "waste"} title="Log waste" onClose={() => setDialog({ kind: "none" })}>
        {dialog.kind === "waste" && <WasteForm items={data.items} initialItemId={dialog.itemId} onSubmit={logWaste} onCancel={() => setDialog({ kind: "none" })} />}
      </Modal>

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

function StockView({ data, today, onCount, onEdit, onWaste }: { data: CafeData; today: string; onCount: (id: string, v: number) => void; onEdit: (item: Item) => void; onWaste: (itemId?: string) => void }) {
  const below = data.items.filter((i) => i.onHand < i.par);
  const out = data.items.filter((i) => i.onHand === 0);
  const weekWaste = wasteSince(data, addDays(today, -7));
  const wasteTotal = weekWaste.reduce((s, w) => s + w.cost, 0);
  const countedToday = data.counts.some((c) => c.date === today);

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Summary">
        <div className={`${panel} p-4`}>
          <p className={eyebrow}>Below par</p>
          <p className="mt-1 text-2xl font-extrabold">{below.length}</p>
          <p className="text-xs text-muted">{out.length ? `${out.length} out: ${out.map((i) => i.name).join(", ")}` : "Nothing out of stock"}</p>
        </div>
        <div className={`${panel} p-4`}>
          <p className={eyebrow}>Waste, last 7 days</p>
          <p className="mt-1 text-2xl font-extrabold">{money(wasteTotal)}</p>
          <p className="text-xs text-muted">{weekWaste[0] ? `Most: ${weekWaste[0].item.name}` : "Nothing logged"}</p>
        </div>
        <div className={`${panel} flex flex-col justify-between gap-3 p-4`}>
          <p className="text-sm text-soft">{countedToday ? "Counted today. Nice." : "Count after deliveries and at close: tap − and + below."}</p>
          <button type="button" onClick={() => onWaste()} className={`${btn.secondary} px-3 py-2`}>
            <Trash2 className="h-4 w-4" aria-hidden /> Log waste
          </button>
        </div>
      </section>

      {AREAS.map((area) => {
        const items = data.items.filter((i) => i.area === area.id);
        if (items.length === 0) return null;
        return (
          <section key={area.id} className={`${panel} p-4 sm:p-5`} aria-labelledby={`area-${area.id}`}>
            <h2 id={`area-${area.id}`} className={eyebrow}>
              {area.label}
            </h2>
            <ul className="mt-2 divide-y divide-hairline">
              {items.map((item) => {
                const status = item.onHand === 0 ? "Out" : item.onHand < item.par ? "Below par" : "OK";
                const step = item.perBuyUnit === 1 ? 1 : 0.5;
                return (
                  <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted">
                        Par {qty(item.par)} {plural(item.par, item.buyUnit)} ·{" "}
                        <span className={status === "OK" ? "text-down" : status === "Out" ? "text-up" : ""} style={status === "Below par" ? { color: ACCENT } : undefined}>
                          {status}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button type="button" aria-label={`One less ${item.name}`} onClick={() => onCount(item.id, item.onHand - step)} className={`${btn.secondary} h-10 w-10 p-0`}>
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <label className="sr-only" htmlFor={`count-${item.id}`}>
                        {item.name} on hand, in {plural(2, item.buyUnit)}
                      </label>
                      <CountInput id={`count-${item.id}`} value={item.onHand} onCommit={(n) => onCount(item.id, n)} />
                      <button type="button" aria-label={`One more ${item.name}`} onClick={() => onCount(item.id, item.onHand + step)} className={`${btn.secondary} h-10 w-10 p-0`}>
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                      <button type="button" aria-label={`Log waste for ${item.name}`} onClick={() => onWaste(item.id)} className={btn.ghost}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                      <button type="button" aria-label={`Edit ${item.name}`} onClick={() => onEdit(item)} className={btn.ghost}>
                        <Pencil className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}

/** A typed count, saved when the field loses focus or Enter is pressed, so decimals can be typed. */
function CountInput({ id, value, onCommit }: { id: string; value: number; onCommit: (n: number) => void }) {
  const [text, setText] = useState(qty(value));
  useEffect(() => setText(qty(value)), [value]);
  const commit = () => {
    const n = Number(text.replace(",", "."));
    if (text.trim() !== "" && Number.isFinite(n) && n >= 0 && n !== value) onCommit(n);
    else setText(qty(value));
  };
  return (
    <input
      id={id}
      inputMode="decimal"
      className="h-10 w-16 rounded-[10px] border border-line bg-sunken text-center font-mono text-base text-fg"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
    />
  );
}

function OrderView({ data, today, onReceive, onSetPar, onCopied }: { data: CafeData; today: string; onReceive: (supplier: string, lines: OrderLine[]) => void; onSetPar: (item: Item, par: number) => void; onCopied: (m: string) => void }) {
  const groups = orderList(data.items);
  const since = addDays(today, -28);
  const parTips = useMemo(
    () =>
      data.items
        .map((item) => {
          const perDay = dailyUse(data, item.id);
          if (perDay === null) return null;
          const suggested = suggestedPar(perDay, deliveryGap(data, item), item.area);
          const ranOut = stockoutDays(data, item.id, since);
          return Math.abs(suggested - item.par) >= Math.max(1, item.par * 0.15) ? { item, perDay, suggested, ranOut } : null;
        })
        .filter((t): t is NonNullable<typeof t> => t !== null),
    [data, since],
  );

  const copy = async (supplier: string, lines: OrderLine[]) => {
    try {
      await navigator.clipboard.writeText(orderText(supplier, lines));
      onCopied(`${supplier} order copied. Paste it into a text or email.`);
    } catch {
      onCopied("Couldn't copy. Select the order and copy it yourself.");
    }
  };

  return (
    <>
      {groups.length === 0 ? (
        <section className={`${panel} flex items-center gap-3 p-5`}>
          <Check className="h-5 w-5 text-down" aria-hidden />
          <p className="text-sm text-soft">Everything is at or above par. Nothing to order right now.</p>
        </section>
      ) : (
        groups.map((g) => (
          <section key={g.supplier} className={`${panel} p-4 sm:p-5`} aria-labelledby={`sup-${g.supplier}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`sup-${g.supplier}`} className="text-lg font-bold">
                {g.supplier}
              </h2>
              <p className="font-mono text-sm text-muted">about {money(g.total)}</p>
            </div>
            <ul className="mt-2 divide-y divide-hairline text-sm">
              {g.lines.map((l) => (
                <li key={l.item.id} className="flex items-center justify-between gap-3 py-2">
                  <span>
                    <strong className="font-mono text-fg">{l.qty}</strong> × {l.item.name} <span className="text-muted">({plural(l.qty, l.item.buyUnit)})</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    have {qty(l.item.onHand)}, par {qty(l.item.par)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => copy(g.supplier, g.lines)} className={`${btn.secondary} px-3 py-2`}>
                <ClipboardCopy className="h-4 w-4" aria-hidden /> Copy order
              </button>
              <a href={`sms:?&body=${encodeURIComponent(orderText(g.supplier, g.lines))}`} className={`${btn.secondary} px-3 py-2`}>
                <MessageSquare className="h-4 w-4" aria-hidden /> Text it
              </a>
              <button type="button" onClick={() => onReceive(g.supplier, g.lines)} className={`${btn.secondary} px-3 py-2`}>
                <Truck className="h-4 w-4" aria-hidden /> Mark received
              </button>
            </div>
          </section>
        ))
      )}

      {parTips.length > 0 && (
        <section className={`${panel} p-4 sm:p-5`} aria-labelledby="par-heading">
          <h2 id="par-heading" className="text-base font-bold">
            Par level check
          </h2>
          <p className="mt-1 text-xs text-muted">From your counts and deliveries: enough to last the longest wait between deliveries (like Friday to Monday), plus a 25% buffer (10% for pastries). Waste isn&apos;t counted as demand.</p>
          <ul className="mt-2 divide-y divide-hairline text-sm">
            {parTips.map(({ item, perDay, suggested, ranOut }) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 flex-1 basis-48">
                  <strong className="text-fg">{item.name}</strong>: uses about {qty(perDay)} {plural(perDay, item.buyUnit)} a day
                  {ranOut.length > 0 && <span className="text-up"> · ran out {ranOut.length}× ({[...new Set(ranOut)].join(", ")})</span>}
                </span>
                <button type="button" onClick={() => onSetPar(item, suggested)} className={`${btn.secondary} px-3 py-1.5`}>
                  Par {qty(item.par)} → {suggested}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ReviewPanel data={data} today={today} />
    </>
  );
}

function ReviewPanel({ data, today }: { data: CafeData; today: string }) {
  const [state, setState] = useState<{ status: "idle" | "loading" | "done" | "error"; text?: string; date?: string }>({ status: "idle" });
  useEffect(() => {
    try {
      const saved = JSON.parse(safeGet(REVIEW_KEY) ?? "null") as { text?: string; date?: string } | null;
      if (saved?.text && saved.date) setState({ status: "done", text: saved.text, date: saved.date });
    } catch {
      /* ignore */
    }
  }, []);

  const request = async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/cafewise/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildReviewInput(data, today)) });
      const body = (await res.json().catch(() => ({}))) as { review?: string; error?: string };
      if (!res.ok || !body.review) throw new Error(body.error || "The review couldn't be written right now. Please try again.");
      safeSet(REVIEW_KEY, JSON.stringify({ text: body.review, date: today }));
      setState({ status: "done", text: body.review, date: today });
    } catch (err) {
      setState({ status: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  const fresh = state.status === "done" && state.date === today;
  return (
    <section className={`${panel} p-5 sm:p-6`} aria-labelledby="review-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="review-heading" className="flex items-center gap-2 text-base font-bold">
          <Sparkles className="h-4 w-4" style={{ color: ACCENT }} aria-hidden /> Ordering review
        </h2>
        <button type="button" onClick={request} disabled={state.status === "loading" || fresh} className={state.status === "done" ? btn.secondary : btn.primary}>
          {state.status === "loading" ? "Reviewing your café…" : fresh ? "Updated today" : state.status === "done" ? "Refresh review" : "Get my review"}
        </button>
      </div>
      {state.status === "idle" && <p className="mt-3 text-sm text-muted">AI looks at four weeks of counts, deliveries, waste and drink costs, and suggests what to order more or less of. Only item names and numbers are sent.</p>}
      {state.status === "loading" && (
        <div className="mt-4 space-y-2" aria-busy="true">
          {[90, 75, 60].map((w) => (
            <div key={w} className="h-3.5 animate-pulse rounded bg-raised" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm font-semibold text-up">
          {state.text}
        </p>
      )}
      {state.status === "done" && (
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-soft">
          {state.text!.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </section>
  );
}

const TARGETS = [0.25, 0.28, 0.3, 0.32, 0.35];

function DrinksView({ data, onEdit, onAdd, onTarget }: { data: CafeData; onEdit: (r: Recipe) => void; onAdd: () => void; onTarget: (t: number) => void }) {
  const byId = new Map(data.items.map((i) => [i.id, i]));
  return (
    <>
      <section className={`${panel} flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5`}>
        <p className="text-sm text-soft">
          Target ingredient cost: a common rule of thumb is <strong className="text-fg">30–35%</strong> of the price. Rent and wages come on top.
        </p>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Target
          <select value={data.targetCost} onChange={(e) => onTarget(Number(e.target.value))} className="rounded-[10px] border border-line bg-sunken px-2 py-1.5 text-fg">
            {TARGETS.map((t) => (
              <option key={t} value={t}>
                {Math.round(t * 100)}%
              </option>
            ))}
          </select>
        </label>
      </section>

      {data.recipes.length === 0 ? (
        <section className={`${panel} flex flex-col items-center px-6 py-12 text-center`}>
          <h2 className="text-lg font-bold">What does each drink cost you?</h2>
          <p className="mt-1 max-w-sm text-sm text-muted">Add a drink with its ingredients, cup and lid. Cafewise works out the cost and your margin, and updates when prices change.</p>
          <button type="button" onClick={onAdd} className={`${btn.primary} mt-5`}>
            <Plus className="h-4 w-4" aria-hidden /> Add a drink
          </button>
        </section>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {data.recipes.map((r) => {
            const d = drinkCost(r, data.items, data.targetCost);
            const pct = Math.round(d.costShare * 100);
            return (
              <li key={r.id} className={`${panel} p-4 sm:p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{r.name}</h3>
                    <p className="text-sm text-muted">Menu price {money(r.price)}</p>
                  </div>
                  <button type="button" aria-label={`Edit ${r.name}`} onClick={() => onEdit(r)} className={btn.ghost}>
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-sunken p-2">
                    <dt className="text-xs text-muted">Costs you</dt>
                    <dd className="font-mono font-bold">{money(d.cost)}</dd>
                  </div>
                  <div className="rounded-xl bg-sunken p-2">
                    <dt className="text-xs text-muted">Margin</dt>
                    <dd className="font-mono font-bold">{money(d.margin)}</dd>
                  </div>
                  <div className="rounded-xl bg-sunken p-2">
                    <dt className="text-xs text-muted">Cost share</dt>
                    <dd className={`font-mono font-bold ${d.overTarget ? "text-up" : "text-down"}`}>{pct}%</dd>
                  </div>
                </dl>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-raised" aria-hidden>
                  <div className={`h-full rounded-full ${d.overTarget ? "bg-up" : "bg-down"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                {d.overTarget && <p className="mt-2 text-sm text-soft">Over your {Math.round(data.targetCost * 100)}% target. At {money(priceForTarget(d.cost, data.targetCost))} it would meet it, or look at the priciest ingredient below.</p>}
                {d.missing > 0 && <p className="mt-2 text-xs text-up">An ingredient in this drink was deleted from Stock.</p>}
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer text-muted hover:text-fg">What goes into it</summary>
                  <ul className="mt-2 space-y-1">
                    {r.lines
                      .map((l) => ({ l, item: byId.get(l.itemId) }))
                      .filter((x): x is { l: Recipe["lines"][number]; item: Item } => !!x.item)
                      .sort((a, b) => unitCost(b.item) * b.l.qty - unitCost(a.item) * a.l.qty)
                      .map(({ l, item }) => (
                        <li key={l.itemId} className="flex justify-between gap-3 text-soft">
                          <span>
                            {qty(l.qty)} {item.useUnit === "each" ? "×" : item.useUnit} {item.name}
                          </span>
                          <span className="font-mono">{money(unitCost(item) * l.qty)}</span>
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
