"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Check, ChefHat, ChevronDown, Church, Clock, Copy, Heart, Info, Plus, ShoppingBasket, Sparkles, UserPlus, Users, X } from "lucide-react";
import { localISO, markDone } from "../../../lib/journey";
import { graceFor } from "../../../lib/mealwise/grace";
import { FaithPanel } from "../../components/FaithPanel";
import { NextUp } from "../../components/NextUp";
import { useDay } from "../../components/useDay";
import { useFaith } from "../../components/useFaith";
import { addToGrocery, groceryText, normalizeItem, parsePantry, suggestFromLibrary, type GroceryItem } from "../../../lib/mealwise/match";
import { DIETS, TIMES, type Diet, type Meal } from "../../../lib/mealwise/types";

const ACCENT = "#ef7fa8";
const INK = "#2a0a17";
const STORAGE_KEY = "mealwise:v1";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef7fa8]";
const btn = {
  primary: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#ef7fa8] px-4 py-2.5 text-sm font-bold text-[#2a0a17] transition hover:brightness-110 disabled:opacity-60 ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] disabled:opacity-60 ${focus}`,
  ghost: `inline-flex items-center justify-center rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg ${focus}`,
};
const panel = "rounded-2xl border border-line bg-panel";
const COMMON = ["egg", "rice", "pasta", "onion", "garlic", "tomato", "cheese", "chicken", "beans", "spinach", "potato", "bell pepper"];
const SERVING_OPTIONS = [1, 2, 3, 4, 5, 6, 8];
const DIET_LABEL: Record<Diet, string> = { vegetarian: "Vegetarian", vegan: "Vegan", "gluten-free": "Gluten-free", "dairy-free": "Dairy-free" };
const EXAMPLE_PANTRY = ["egg", "rice", "spinach", "cheese", "tomato", "garlic", "pasta", "onion", "peas", "soy sauce"];

type Tab = "ideas" | "grocery" | "favorites";
type Source = "ai" | "basic" | "example";
interface Saved {
  pantry: string[];
  diets: Diet[];
  maxMinutes: number;
  servings: number;
  staples: boolean;
  craving: string;
  meals: Meal[];
  source: Source;
  grocery: GroceryItem[];
  favorites: Meal[];
}

export function MealwiseApp() {
  const [tab, setTab] = useState<Tab>("ideas");
  const [pantry, setPantry] = useState<string[]>([]);
  const [entry, setEntry] = useState("");
  const [diets, setDiets] = useState<Diet[]>([]);
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [servings, setServings] = useState(2);
  const [staples, setStaples] = useState(true);
  const [craving, setCraving] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [source, setSource] = useState<Source>("example");
  const [grocery, setGrocery] = useState<GroceryItem[]>([]);
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [faith, setFaith] = useFaith();
  const dayDone = useDay();

  useEffect(() => {
    let saved: Saved | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      saved = raw ? (JSON.parse(raw) as Saved) : null;
    } catch {
      saved = null;
    }
    if (saved) {
      setPantry(saved.pantry ?? []);
      setDiets(saved.diets ?? []);
      setMaxMinutes(saved.maxMinutes ?? 30);
      setServings(saved.servings ?? 2);
      setStaples(saved.staples ?? true);
      setCraving(saved.craving ?? "");
      setMeals(saved.meals ?? []);
      setSource(saved.source ?? "basic");
      setGrocery(saved.grocery ?? []);
      setFavorites(saved.favorites ?? []);
    } else {
      setPantry(EXAMPLE_PANTRY);
      setMeals(suggestFromLibrary({ pantry: EXAMPLE_PANTRY, diets: [], maxMinutes: 30, servings: 2, craving: "", staples: true }));
      setSource("example");
    }
    const hash = location.hash.slice(1);
    if (hash === "grocery" || hash === "favorites") setTab(hash);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pantry, diets, maxMinutes, servings, staples, craving, meals, source, grocery, favorites } satisfies Saved));
    } catch {
      /* storage unavailable */
    }
  }, [ready, pantry, diets, maxMinutes, servings, staples, craving, meals, source, grocery, favorites]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const switchTab = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "ideas" ? location.pathname : `#${t}`);
  };

  const addEntry = (e?: FormEvent) => {
    e?.preventDefault();
    const items = parsePantry(entry);
    if (items.length) setPantry((p) => [...new Set([...p, ...items])]);
    setEntry("");
    setError(null);
  };

  const suggest = async () => {
    setError(null);
    setNotice(null);
    const list = entry.trim() ? [...new Set([...pantry, ...parsePantry(entry)])] : pantry;
    if (entry.trim()) {
      setPantry(list);
      setEntry("");
    }
    if (list.length === 0) return setError("Add at least one ingredient you have.");
    setLoading(true);
    const request = { pantry: list, diets, maxMinutes, servings, craving, staples };
    try {
      const res = await fetch("/api/mealwise/meals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(request) });
      const body = (await res.json().catch(() => ({}))) as { meals?: Meal[]; error?: string };
      if (res.ok && body.meals?.length) {
        setMeals(body.meals);
        setSource("ai");
        markDone("mealwise");
      } else if (res.status === 400) {
        setError(body.error ?? "Something about that request didn't work.");
      } else {
        throw new Error(body.error ?? "AI meal ideas aren't available right now.");
      }
    } catch (err) {
      const fallback = suggestFromLibrary(request);
      setMeals(fallback);
      setSource("basic");
      if (fallback.length) markDone("mealwise");
      setNotice(`${err instanceof Error ? err.message : "AI meal ideas aren't available right now."} Here are the closest matches from our recipe book instead.`);
    } finally {
      setLoading(false);
    }
  };

  const addMissing = (meal: Meal) => {
    setGrocery((g) => addToGrocery(g, meal));
    setToast(`Added ${meal.missing.length} item${meal.missing.length === 1 ? "" : "s"} to your grocery list.`);
  };
  const isFavorite = (meal: Meal) => favorites.some((f) => f.name === meal.name);
  const toggleFavorite = (meal: Meal) => {
    setFavorites((f) => (isFavorite(meal) ? f.filter((x) => x.name !== meal.name) : [meal, ...f]));
    setToast(isFavorite(meal) ? "Removed from favorites." : "Saved to favorites.");
  };
  const onList = (meal: Meal) => meal.missing.length > 0 && meal.missing.every((m) => grocery.some((g) => normalizeItem(g.item) === normalizeItem(m.item) && g.meals.includes(meal.name)));
  const openGrocery = grocery.filter((g) => !g.checked).length;

  const copyList = async () => {
    const text = groceryText(grocery);
    try {
      await navigator.clipboard.writeText(text);
      setToast("Grocery list copied.");
    } catch {
      setToast("Couldn't copy automatically. Select the list and copy it.");
    }
  };

  return (
    <div className="min-h-screen px-[max(16px,env(safe-area-inset-left))] pb-16">
      <header className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/" className={btn.ghost} aria-label="Back to GrowDaily">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <span className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(239,127,168,0.15)]" style={{ background: ACCENT }} aria-hidden />
            Mealwise
          </span>
        </div>
        <nav aria-label="Mealwise" className="flex gap-1 rounded-[10px] border border-line bg-panel p-1">
          {([
            ["ideas", "Ideas", 0],
            ["grocery", "List", openGrocery],
            ["favorites", "Saved", favorites.length],
          ] as const).map(([t, label, count]) => (
            <button
              key={t}
              type="button"
              aria-current={tab === t ? "page" : undefined}
              onClick={() => switchTab(t)}
              className={`flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-sm font-semibold transition sm:px-3.5 ${tab === t ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}
            >
              {label}
              {count > 0 && <span className="rounded-full px-1.5 font-mono text-[11px]" style={{ background: `${ACCENT}26`, color: ACCENT }}>{count}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl">
        {tab === "ideas" && (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[380px_1fr]">
            <section className={`${panel} min-w-0 p-5 sm:p-6 lg:sticky lg:top-6`} aria-labelledby="pantry-heading">
              <h1 id="pantry-heading" className="text-base font-bold">What do you have?</h1>
              <p className="mt-1 text-sm text-muted">Add what&apos;s in your fridge and cupboards. Paste a list or add one at a time.</p>
              <form onSubmit={addEntry} className="mt-4 flex gap-2">
                <label htmlFor="pantry-entry" className="sr-only">Add an ingredient</label>
                <input
                  id="pantry-entry"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  onPaste={(e) => {
                    // Inputs flatten pasted line breaks into spaces, so split pasted lists ourselves.
                    const text = e.clipboardData.getData("text");
                    if (!/[\n,;]/.test(text)) return;
                    e.preventDefault();
                    const items = parsePantry(`${entry}\n${text}`);
                    if (items.length) setPantry((cur) => [...new Set([...cur, ...items])]);
                    setEntry("");
                    setError(null);
                  }}
                  placeholder="e.g. eggs, spinach"
                  maxLength={300}
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-[#ef7fa8] focus:outline-none focus:ring-2 focus:ring-[#ef7fa8]/30"
                />
                <button type="submit" className={btn.secondary} aria-label="Add ingredient">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
              {pantry.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Your ingredients">
                  {pantry.map((p) => (
                    <li key={p} className="flex items-center gap-1 rounded-full py-1 pl-3 pr-1 text-sm" style={{ background: `${ACCENT}1f`, color: "#f6c1d6" }}>
                      {p}
                      <button type="button" onClick={() => setPantry((x) => x.filter((i) => i !== p))} className="rounded-full p-0.5 hover:bg-white/10" aria-label={`Remove ${p}`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {COMMON.some((c) => !pantry.includes(c)) && (
                <div className="mt-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Quick add</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {COMMON.filter((c) => !pantry.includes(c)).map((c) => (
                      <button key={c} type="button" onClick={() => setPantry((p) => [...p, c])} className="rounded-full border border-line px-2.5 py-1 text-xs text-soft hover:border-[#2c4060]">
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label htmlFor="max-time" className="mb-1 block font-mono text-xs text-muted">Time</label>
                  <select id="max-time" value={maxMinutes} onChange={(e) => setMaxMinutes(Number(e.target.value))} className="block w-full min-w-0 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg">
                    {TIMES.map((t) => <option key={t} value={t}>Up to {t} min</option>)}
                  </select>
                </div>
                <div className="min-w-0">
                  <label htmlFor="servings" className="mb-1 block font-mono text-xs text-muted">Servings</label>
                  <select id="servings" value={servings} onChange={(e) => setServings(Number(e.target.value))} className="block w-full min-w-0 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg">
                    {SERVING_OPTIONS.map((s) => <option key={s} value={s}>{s} {s === 1 ? "person" : "people"}</option>)}
                  </select>
                </div>
              </div>
              <fieldset className="mt-4">
                <legend className="mb-1.5 font-mono text-xs text-muted">Diet</legend>
                <div className="flex flex-wrap gap-1.5">
                  {DIETS.map((d) => {
                    const on = diets.includes(d);
                    return (
                      <button key={d} type="button" aria-pressed={on} onClick={() => setDiets(on ? diets.filter((x) => x !== d) : [...diets, d])} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${on ? "border-[#ef7fa8] bg-[#ef7fa8]/15 text-fg" : "border-line text-soft hover:border-[#2c4060]"}`}>
                        {DIET_LABEL[d]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label htmlFor="craving" className="mb-1 mt-4 block font-mono text-xs text-muted">Craving something? (optional)</label>
              <input id="craving" value={craving} onChange={(e) => setCraving(e.target.value)} maxLength={80} placeholder="e.g. something spicy" className="block w-full rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-[#ef7fa8] focus:outline-none" />
              <label className="mt-4 flex items-center gap-2.5 text-sm text-soft">
                <input type="checkbox" checked={staples} onChange={(e) => setStaples(e.target.checked)} className="h-4 w-4 accent-[#ef7fa8]" />
                I have salt, pepper and oil
              </label>
              {error && <p role="alert" className="mt-3 text-sm font-semibold text-up">{error}</p>}
              <button type="button" onClick={suggest} disabled={loading || !ready} className={`${btn.primary} mt-5 w-full`}>
                <Sparkles className="h-4 w-4" aria-hidden />
                {loading ? "Finding meals…" : "Suggest 3 meals"}
              </button>
            </section>

            <section className="min-w-0 space-y-4" aria-live="polite">
              {source === "example" && meals.length > 0 && (
                <p className="flex items-start gap-3 rounded-xl border border-[#ef7fa8]/40 bg-[#ef7fa8]/10 p-4 text-sm text-soft">
                  <Info className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
                  <span>These are <strong className="text-fg">example ideas</strong> for a sample fridge. Change the ingredients to yours and press Suggest 3 meals.</span>
                </p>
              )}
              {notice && <p role="status" className="rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-soft">{notice}</p>}
              {faith && meals.length > 0 && !loading && (
                <div className={`${panel} relative overflow-hidden p-5`} aria-labelledby="grace-heading">
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden />
                  <p id="grace-heading" className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    <Church className="h-3.5 w-3.5 text-amber" aria-hidden /> Before you eat
                  </p>
                  <p className="mt-2 text-[17px] leading-relaxed text-fg">{graceFor(localISO())}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                    <p className="text-sm text-muted">Know someone eating alone tonight? There&apos;s room at the table.</p>
                    {SERVING_OPTIONS.some((o) => o > servings) && (
                      <button
                        type="button"
                        className={btn.secondary}
                        onClick={() => {
                          const next = SERVING_OPTIONS.find((o) => o > servings) ?? servings;
                          setServings(next);
                          setToast(`Cooking for ${next}. Press Suggest 3 meals to size the recipes.`);
                        }}
                      >
                        <UserPlus className="h-4 w-4" aria-hidden /> Cook for one more
                      </button>
                    )}
                  </div>
                </div>
              )}
              {loading ? (
                [0, 1, 2].map((i) => <div key={i} className={`${panel} h-40 animate-pulse`} aria-hidden />)
              ) : meals.length === 0 ? (
                <div className={`${panel} flex flex-col items-center px-6 py-16 text-center`}>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${ACCENT}26`, color: ACCENT }}>
                    <ChefHat className="h-7 w-7" aria-hidden />
                  </span>
                  <h2 className="mt-4 text-lg font-bold">Your meal ideas will appear here</h2>
                  <p className="mt-1 max-w-sm text-sm text-muted">Add a few ingredients and press Suggest 3 meals.</p>
                </div>
              ) : (
                meals.map((m) => (
                  <MealCard key={m.name} meal={m} favorite={isFavorite(m)} onList={onList(m)} onFavorite={() => toggleFavorite(m)} onAddMissing={() => addMissing(m)} badge={source === "ai" ? "AI idea" : source === "basic" ? "From our recipe book" : "Example"} />
                ))
              )}
              <p className="text-center font-mono text-[11px] text-dim">Check labels if you have allergies. Suggestions can make mistakes.</p>
              {source !== "example" && dayDone.includes("mealwise") && <NextUp current="mealwise" />}
            </section>
          </div>
        )}

        {tab === "grocery" && (
          <section className={`${panel} mx-auto max-w-2xl p-5 sm:p-6`} aria-labelledby="grocery-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 id="grocery-heading" className="text-lg font-bold">Grocery list</h1>
              {grocery.length > 0 && (
                <div className="flex gap-2">
                  <button type="button" onClick={copyList} className={btn.secondary} disabled={openGrocery === 0}>
                    <Copy className="h-4 w-4" aria-hidden /> Copy
                  </button>
                  <button type="button" onClick={() => setGrocery((g) => g.filter((i) => !i.checked))} className={btn.secondary} disabled={grocery.every((g) => !g.checked)}>
                    Clear checked
                  </button>
                </div>
              )}
            </div>
            {grocery.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <ShoppingBasket className="h-8 w-8" style={{ color: ACCENT }} aria-hidden />
                <p className="mt-3 font-semibold">Your list is empty</p>
                <p className="mt-1 max-w-xs text-sm text-muted">On any meal idea, press &ldquo;Add to list&rdquo; to collect what you need to buy.</p>
                <button type="button" onClick={() => switchTab("ideas")} className={`${btn.primary} mt-5`}>See meal ideas</button>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-hairline">
                {grocery.map((g) => (
                  <li key={g.item} className="flex items-center gap-3 py-3">
                    <button
                      type="button"
                      aria-pressed={g.checked}
                      aria-label={`${g.checked ? "Uncheck" : "Check"} ${g.item}`}
                      onClick={() => setGrocery((list) => list.map((x) => (x.item === g.item ? { ...x, checked: !x.checked } : x)))}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition"
                      style={{ borderColor: g.checked ? ACCENT : "#2b3a50", background: g.checked ? ACCENT : "transparent", color: INK }}
                    >
                      {g.checked && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold ${g.checked ? "text-muted line-through" : ""}`}>
                        {g.item}
                        {g.quantities.length > 0 && <span className="ml-2 font-mono text-xs font-normal text-muted">{g.quantities.join(" + ")}</span>}
                      </p>
                      <p className="truncate font-mono text-xs text-dim">for {g.meals.join(", ")}</p>
                    </div>
                    <button type="button" onClick={() => setGrocery((list) => list.filter((x) => x.item !== g.item))} className={btn.ghost} aria-label={`Remove ${g.item}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "favorites" && (
          <section className="mx-auto max-w-3xl space-y-4" aria-labelledby="fav-heading">
            <h1 id="fav-heading" className="text-lg font-bold">Saved meals</h1>
            {favorites.length === 0 ? (
              <div className={`${panel} flex flex-col items-center px-6 py-12 text-center`}>
                <Heart className="h-8 w-8" style={{ color: ACCENT }} aria-hidden />
                <p className="mt-3 font-semibold">Nothing saved yet</p>
                <p className="mt-1 max-w-xs text-sm text-muted">Tap the heart on a meal you liked to keep its recipe here.</p>
              </div>
            ) : (
              favorites.map((m) => <MealCard key={m.name} meal={m} favorite onList={onList(m)} onFavorite={() => toggleFavorite(m)} onAddMissing={() => addMissing(m)} />)
            )}
          </section>
        )}
        {ready && (
          <FaithPanel on={faith} onChange={setFaith} className="mx-auto mt-5 max-w-6xl">
            Adds a simple grace before meals, and a nudge to make room at the table.
          </FaithPanel>
        )}
      </main>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {toast && <p role="status" className="pointer-events-auto rounded-xl border border-line bg-raised px-4 py-3 text-sm shadow-xl shadow-black/40">{toast}</p>}
      </div>
    </div>
  );
}

function MealCard({ meal, favorite, onList, onFavorite, onAddMissing, badge }: { meal: Meal; favorite: boolean; onList: boolean; onFavorite: () => void; onAddMissing: () => void; badge?: string }) {
  const [open, setOpen] = useState(false);
  const id = `recipe-${meal.name.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <article className={`${panel} p-5 sm:p-6`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {badge && <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: ACCENT }}>{badge}</p>}
          <h2 className="mt-1 text-xl font-extrabold tracking-tight">{meal.name}</h2>
          <p className="mt-1 text-soft">{meal.description}</p>
        </div>
        <button type="button" onClick={onFavorite} aria-pressed={favorite} aria-label={favorite ? `Remove ${meal.name} from saved` : `Save ${meal.name}`} className={btn.ghost}>
          <Heart className="h-5 w-5" style={favorite ? { fill: ACCENT, color: ACCENT } : undefined} />
        </button>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {meal.minutes} min</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden /> serves {meal.servings}</span>
        {meal.uses.length > 0 && <span>uses {meal.uses.length} of yours</span>}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        {meal.missing.length === 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-down/15 px-2.5 py-1 font-semibold text-down"><Check className="h-3.5 w-3.5" aria-hidden /> You have everything</span>
        ) : (
          <>
            <span className="font-mono text-muted">Need:</span>
            {meal.missing.map((m) => <span key={m.item} className="rounded-full border border-line px-2.5 py-1 text-soft">{m.item}</span>)}
          </>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className={btn.secondary}>
          {open ? "Hide recipe" : "Show recipe"} <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {meal.missing.length > 0 && (
          <button type="button" onClick={onAddMissing} disabled={onList} className={onList ? btn.secondary : btn.primary}>
            {onList ? <><Check className="h-4 w-4" aria-hidden /> On your list</> : <><ShoppingBasket className="h-4 w-4" aria-hidden /> Add {meal.missing.length} to list</>}
          </button>
        )}
      </div>
      {open && (
        <div id={id} className="mt-5 grid gap-6 border-t border-hairline pt-5 sm:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Ingredients</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              {meal.ingredients.map((i) => (
                <li key={i.item} className="flex justify-between gap-3">
                  <span>{i.item}</span>
                  <span className="text-right font-mono text-xs text-muted">{i.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Steps</h3>
            <ol className="mt-2 space-y-2.5 text-sm text-soft">
              {meal.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-xs" style={{ color: ACCENT }}>{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </article>
  );
}
