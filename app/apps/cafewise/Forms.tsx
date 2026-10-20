"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AREAS, type Area, type Item, type Recipe, type UseUnit, type WasteReason } from "../../../lib/cafewise/types";
import { btn, input, label } from "./ui";

const PRESETS: Record<UseUnit, { label: string; buyUnit: string; per: number }[]> = {
  oz: [
    { label: "Gallon (128 oz)", buyUnit: "gallon", per: 128 },
    { label: "Half gallon (64 oz)", buyUnit: "half gallon", per: 64 },
    { label: "Carton (32 oz)", buyUnit: "carton", per: 32 },
    { label: "Syrup bottle (750 ml)", buyUnit: "bottle", per: 25.4 },
  ],
  g: [
    { label: "5 lb bag (2,268 g)", buyUnit: "5 lb bag", per: 2268 },
    { label: "2 lb bag (907 g)", buyUnit: "2 lb bag", per: 907 },
    { label: "1 lb bag (454 g)", buyUnit: "1 lb bag", per: 454 },
  ],
  each: [
    { label: "Single item", buyUnit: "each", per: 1 },
    { label: "Case of 1,000", buyUnit: "case of 1,000", per: 1000 },
    { label: "Sleeve of 50", buyUnit: "sleeve of 50", per: 50 },
  ],
};
const USE_LABEL: Record<UseUnit, string> = { oz: "ounces", g: "grams", each: "items" };

const toNum = (s: string) => {
  const n = Number(s.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};

export type ItemDraft = Omit<Item, "id">;

export function ItemForm({ initial, onSubmit, onCancel, onDelete }: { initial?: Item; onSubmit: (d: ItemDraft) => void; onCancel: () => void; onDelete?: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [area, setArea] = useState<Area>(initial?.area ?? "fridge");
  const [supplier, setSupplier] = useState(initial?.supplier ?? "");
  const [useUnit, setUseUnit] = useState<UseUnit>(initial?.useUnit ?? "oz");
  const [buyUnit, setBuyUnit] = useState(initial?.buyUnit ?? "gallon");
  const [per, setPer] = useState(String(initial?.perBuyUnit ?? 128));
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [par, setPar] = useState(initial ? String(initial.par) : "");
  const [onHand, setOnHand] = useState(initial ? String(initial.onHand) : "0");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const values = { per: toNum(per), price: toNum(price), par: toNum(par), onHand: toNum(onHand) };
    if (!name.trim()) return setError("Give the item a name.");
    if (!buyUnit.trim()) return setError("Say how you buy it, like \"gallon\" or \"5 lb bag\".");
    if (!(values.per > 0)) return setError(`Enter how many ${USE_LABEL[useUnit]} are in one ${buyUnit}.`);
    if (Object.values(values).some(Number.isNaN)) return setError("Price, par and on hand need to be numbers.");
    onSubmit({ name: name.trim().slice(0, 60), area, supplier: supplier.trim().slice(0, 40), useUnit, buyUnit: buyUnit.trim().slice(0, 30), perBuyUnit: values.per, price: values.price, par: values.par, onHand: values.onHand });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="item-name" className={label}>
          Item
        </label>
        <input id="item-name" className={`${input} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Oat milk" maxLength={60} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="item-area" className={label}>
            Where it&apos;s kept
          </label>
          <select id="item-area" className={`${input} mt-1.5`} value={area} onChange={(e) => setArea(e.target.value as Area)}>
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="item-supplier" className={label}>
            Supplier
          </label>
          <input id="item-supplier" className={`${input} mt-1.5`} value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Dairy" maxLength={40} />
        </div>
      </div>

      <fieldset className="rounded-xl border border-line p-3">
        <legend className="px-1 text-sm font-semibold">How you buy it</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="item-use" className="block text-xs text-muted">
              Recipes measure it in
            </label>
            <select
              id="item-use"
              className={`${input} mt-1`}
              value={useUnit}
              onChange={(e) => {
                const u = e.target.value as UseUnit;
                setUseUnit(u);
                setBuyUnit(PRESETS[u][0].buyUnit);
                setPer(String(PRESETS[u][0].per));
              }}
            >
              <option value="oz">ounces</option>
              <option value="g">grams</option>
              <option value="each">items</option>
            </select>
          </div>
          <div>
            <label htmlFor="item-preset" className="block text-xs text-muted">
              Common sizes
            </label>
            <select
              id="item-preset"
              className={`${input} mt-1`}
              value=""
              onChange={(e) => {
                const p = PRESETS[useUnit].find((x) => x.label === e.target.value);
                if (p) {
                  setBuyUnit(p.buyUnit);
                  setPer(String(p.per));
                }
              }}
            >
              <option value="">Pick a size…</option>
              {PRESETS[useUnit].map((p) => (
                <option key={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="item-buy" className="block text-xs text-muted">
              Buy unit
            </label>
            <input id="item-buy" className={`${input} mt-1`} value={buyUnit} onChange={(e) => setBuyUnit(e.target.value)} maxLength={30} />
          </div>
          <div>
            <label htmlFor="item-per" className="block text-xs text-muted">
              {USE_LABEL[useUnit]} per {buyUnit || "unit"}
            </label>
            <input id="item-per" className={`${input} mt-1`} inputMode="decimal" value={per} onChange={(e) => setPer(e.target.value)} />
          </div>
        </div>
      </fieldset>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="item-price" className={label}>
            Price
          </label>
          <input id="item-price" className={`${input} mt-1.5`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4.50" />
        </div>
        <div>
          <label htmlFor="item-par" className={label}>
            Par
          </label>
          <input id="item-par" className={`${input} mt-1.5`} inputMode="decimal" value={par} onChange={(e) => setPar(e.target.value)} placeholder="12" />
        </div>
        <div>
          <label htmlFor="item-onhand" className={label}>
            On hand
          </label>
          <input id="item-onhand" className={`${input} mt-1.5`} inputMode="decimal" value={onHand} onChange={(e) => setOnHand(e.target.value)} />
        </div>
      </div>
      <p className="text-xs text-muted">Price, par and on hand are per {buyUnit || "buy unit"}. Par is how many you want after an order arrives.</p>

      {error && (
        <p role="alert" className="text-sm font-semibold text-up">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center">
        {onDelete && (
          <button type="button" onClick={onDelete} className={`${btn.ghost} gap-1.5 text-sm sm:mr-auto`}>
            <Trash2 className="h-4 w-4" aria-hidden /> Delete
          </button>
        )}
        <button type="button" onClick={onCancel} className={`${btn.secondary} sm:ml-auto`}>
          Cancel
        </button>
        <button type="submit" className={btn.primary}>
          {initial ? "Save item" : "Add item"}
        </button>
      </div>
    </form>
  );
}

export type RecipeDraft = Omit<Recipe, "id">;

export function RecipeForm({ initial, items, onSubmit, onCancel, onDelete }: { initial?: Recipe; items: Item[]; onSubmit: (d: RecipeDraft) => void; onCancel: () => void; onDelete?: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [lines, setLines] = useState(initial?.lines.map((l) => ({ itemId: l.itemId, qty: String(l.qty) })) ?? [{ itemId: items[0]?.id ?? "", qty: "" }]);
  const [error, setError] = useState("");
  const byId = new Map(items.map((i) => [i.id, i]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = toNum(price);
    const parsed = lines.filter((l) => l.itemId && l.qty.trim()).map((l) => ({ itemId: l.itemId, qty: toNum(l.qty) }));
    if (!name.trim()) return setError("Give the drink a name.");
    if (Number.isNaN(p) || p <= 0) return setError("Enter the menu price.");
    if (parsed.length === 0 || parsed.some((l) => Number.isNaN(l.qty))) return setError("Add at least one ingredient with an amount.");
    onSubmit({ name: name.trim().slice(0, 60), price: p, lines: parsed });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <div>
          <label htmlFor="recipe-name" className={label}>
            Drink
          </label>
          <input id="recipe-name" className={`${input} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Latte (12 oz)" maxLength={60} />
        </div>
        <div>
          <label htmlFor="recipe-price" className={label}>
            Menu price
          </label>
          <input id="recipe-price" className={`${input} mt-1.5`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4.75" />
        </div>
      </div>
      <fieldset>
        <legend className={label}>Ingredients and supplies</legend>
        <ul className="mt-1.5 space-y-2">
          {lines.map((line, i) => {
            const unit = byId.get(line.itemId)?.useUnit;
            return (
              <li key={i} className="grid grid-cols-[1fr_5.5rem_auto] items-center gap-2">
                <select aria-label={`Ingredient ${i + 1}`} className={input} value={line.itemId} onChange={(e) => setLines(lines.map((l, j) => (j === i ? { ...l, itemId: e.target.value } : l)))}>
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <input aria-label={`Amount of ingredient ${i + 1}`} className={`${input} pr-9`} inputMode="decimal" value={line.qty} onChange={(e) => setLines(lines.map((l, j) => (j === i ? { ...l, qty: e.target.value } : l)))} placeholder="0" />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">{unit === "each" ? "ea" : unit}</span>
                </div>
                <button type="button" aria-label={`Remove ingredient ${i + 1}`} onClick={() => setLines(lines.filter((_, j) => j !== i))} className={btn.ghost}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={() => setLines([...lines, { itemId: items[0]?.id ?? "", qty: "" }])} className={`${btn.secondary} mt-2 px-3 py-2`}>
          <Plus className="h-4 w-4" aria-hidden /> Add ingredient
        </button>
        <p className="mt-2 text-xs text-muted">Include cups, lids and sleeves: they add up. Missing an ingredient? Add it in Stock first.</p>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm font-semibold text-up">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center">
        {onDelete && (
          <button type="button" onClick={onDelete} className={`${btn.ghost} gap-1.5 text-sm sm:mr-auto`}>
            <Trash2 className="h-4 w-4" aria-hidden /> Delete
          </button>
        )}
        <button type="button" onClick={onCancel} className={`${btn.secondary} sm:ml-auto`}>
          Cancel
        </button>
        <button type="submit" className={btn.primary}>
          {initial ? "Save drink" : "Add drink"}
        </button>
      </div>
    </form>
  );
}

const REASONS: { id: WasteReason; label: string }[] = [
  { id: "unsold", label: "Unsold" },
  { id: "expired", label: "Expired" },
  { id: "spilled", label: "Spilled / remade" },
  { id: "other", label: "Other" },
];

export function WasteForm({ items, initialItemId, onSubmit, onCancel }: { items: Item[]; initialItemId?: string; onSubmit: (d: { itemId: string; qty: number; reason: WasteReason }) => void; onCancel: () => void }) {
  const [itemId, setItemId] = useState(initialItemId ?? items[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState<WasteReason>("unsold");
  const [error, setError] = useState("");
  const item = items.find((i) => i.id === itemId);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = toNum(amount);
    if (!item) return setError("Pick an item.");
    if (Number.isNaN(n) || n <= 0) return setError("Enter how much was thrown away.");
    onSubmit({ itemId, qty: n, reason });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="waste-item" className={label}>
          Item
        </label>
        <select id="waste-item" className={`${input} mt-1.5`} value={itemId} onChange={(e) => setItemId(e.target.value)}>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="waste-qty" className={label}>
          How much{item ? ` (${item.buyUnit}${item.buyUnit.endsWith("s") ? "" : "s"})` : ""}
        </label>
        <input id="waste-qty" className={`${input} mt-1.5`} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={item?.useUnit === "each" && item.perBuyUnit === 1 ? "4" : "0.5"} />
        {item && Number(amount) > 0 && <p className="mt-1 text-xs text-muted">That&apos;s about ${(Number(amount) * item.price).toFixed(2)}.</p>}
      </div>
      <fieldset>
        <legend className={label}>Why</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <button key={r.id} type="button" aria-pressed={reason === r.id} onClick={() => setReason(r.id)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${reason === r.id ? "border-[#d9965b] bg-[#d9965b]/15 text-fg" : "border-line text-soft hover:border-[#d9965b]/50"}`}>
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm font-semibold text-up">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={btn.secondary}>
          Cancel
        </button>
        <button type="submit" className={btn.primary}>
          Log waste
        </button>
      </div>
    </form>
  );
}
