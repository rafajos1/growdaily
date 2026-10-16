"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Annoyed, ArrowLeft, BookOpen, Church, Frown, HeartHandshake, Info, Laugh, Meh, Minus, Moon, Pencil, Plus, Smile, Sparkles, type LucideIcon } from "lucide-react";
import { addDays, fromISO, todayISO, weekday } from "../../../lib/habitwise/dates";
import { buildInsightInput, inRange, moodLabel, needsSupport, parseEntries, sleepVsMood, streak, tagImpact, upsert } from "../../../lib/moodwise/logic";
import { passageUrl } from "../../../lib/habitwise/faith";
import { comfortFor, isHardDay, recentGifts } from "../../../lib/moodwise/examen";
import { sampleEntries } from "../../../lib/moodwise/sample";
import { FaithSwitch } from "../../components/FaithSwitch";
import { useFaith } from "../../components/useFaith";
import { ENERGY_LABELS, MOOD_LABELS, TAGS, type Entry, type Tag } from "../../../lib/moodwise/types";

const ACCENT = "#b48cf2";
const STORAGE_KEY = "moodwise:v1";
const EXAMPLES_KEY = "moodwise:examples";
const INSIGHT_KEY = "moodwise:insight";
const FACES: LucideIcon[] = [Frown, Annoyed, Meh, Smile, Laugh];
const MOOD_COLORS = ["#f2846b", "#e8a35c", "#8a9bb2", "#a98ae6", "#cdb2f7"];
const HEAT = ["#3b2347", "#4d2f66", "#6a4794", "#9171cf", "#cdb2f7"];
const TAG_LABEL: Record<Tag, string> = { exercise: "Exercise", outdoors: "Outdoors", friends: "Friends", "work stress": "Work stress", caffeine: "Caffeine", alcohol: "Alcohol", "late screens": "Late screens" };
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b48cf2]";
const btn = {
  primary: `inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#b48cf2] px-4 py-2.5 text-sm font-bold text-[#1d0b33] transition hover:brightness-110 disabled:opacity-60 ${focus}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] disabled:opacity-60 ${focus}`,
  ghost: `inline-flex items-center justify-center rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg ${focus}`,
};
const panel = "rounded-2xl border border-line bg-panel";
const eyebrow = "font-mono text-xs uppercase tracking-[0.14em] text-muted";

function safeGet(k: string) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function safeSet(k: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* storage unavailable */
  }
}

type Tab = "today" | "insights";

export function MoodwiseApp() {
  const today = todayISO();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [examples, setExamples] = useState(false);
  const [tab, setTab] = useState<Tab>("today");
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [faith, setFaith] = useFaith();

  useEffect(() => {
    let loaded: Entry[] = [];
    try {
      loaded = parseEntries(safeGet(STORAGE_KEY));
    } catch {
      loaded = [];
    }
    if (loaded.length === 0 && safeGet(EXAMPLES_KEY) === null) {
      loaded = sampleEntries(todayISO());
      safeSet(EXAMPLES_KEY, "1");
      safeSet(STORAGE_KEY, JSON.stringify({ version: 1, entries: loaded }));
    }
    setEntries(loaded);
    setExamples(safeGet(EXAMPLES_KEY) === "1" && loaded.length > 0);
    if (location.hash === "#insights") setTab("insights");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const save = (next: Entry[]) => {
    setEntries(next);
    safeSet(STORAGE_KEY, JSON.stringify({ version: 1, entries: next }));
  };
  const switchTab = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "insights" ? "#insights" : location.pathname);
  };

  const todayEntry = entries.find((e) => e.date === today);
  const support = useMemo(() => needsSupport(entries, today), [entries, today]);

  return (
    <div className="min-h-screen px-[max(16px,env(safe-area-inset-left))] pb-16">
      <header className="mx-auto flex h-[72px] max-w-5xl items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/" className={btn.ghost} aria-label="Back to GrowDaily">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <span className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(180,140,242,0.15)]" style={{ background: ACCENT }} aria-hidden />
            Moodwise
          </span>
        </div>
        <nav aria-label="Moodwise" className="flex gap-1 rounded-[10px] border border-line bg-panel p-1">
          {(["today", "insights"] as const).map((t) => (
            <button key={t} type="button" aria-current={tab === t ? "page" : undefined} onClick={() => switchTab(t)} className={`rounded-[7px] px-3 py-1.5 text-sm font-semibold capitalize transition ${tab === t ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-5">
        {support && (
          <section role="note" aria-label="Support" className="flex flex-col gap-3 rounded-2xl border border-up/40 bg-up/10 p-5 sm:flex-row">
            <HeartHandshake className="h-6 w-6 shrink-0 text-up" aria-hidden />
            <div className="text-sm text-soft">
              <p className="text-base font-bold text-fg">It sounds like a hard few days</p>
              <p className="mt-1">
                You don&apos;t have to handle it alone. Talking to someone you trust{faith ? ", a pastor," : ""} or a doctor or counselor can really help.
              </p>
              <p className="mt-2">
                If you&apos;re in crisis or thinking about harming yourself, call or text <strong className="text-fg">988</strong> in the US, or find a free helpline in your country at{" "}
                <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline">findahelpline.com</a>.
              </p>
            </div>
          </section>
        )}
        {examples && (
          <div className="flex flex-col gap-3 rounded-xl border border-[#b48cf2]/40 bg-[#b48cf2]/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
            <Info className="h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
            <p className="flex-1">These are <strong className="text-fg">example check-ins</strong> from five weeks, so you can see what Moodwise finds. Your real ones stay on this device.</p>
            <div className="flex gap-2">
              <button type="button" className={btn.secondary} onClick={() => { safeSet(EXAMPLES_KEY, "0"); setExamples(false); }}>Keep them</button>
              <button type="button" className={btn.primary} onClick={() => { save([]); safeSet(EXAMPLES_KEY, "0"); safeSet(INSIGHT_KEY, null); setExamples(false); setToast("Examples cleared. Check in to start."); }}>Start fresh</button>
            </div>
          </div>
        )}

        {!ready ? (
          <div className={`${panel} h-72 animate-pulse`} aria-busy="true" aria-label="Loading" />
        ) : tab === "today" ? (
          todayEntry && !editing ? (
            <TodayDone entry={todayEntry} entries={entries} today={today} faith={faith} onEdit={() => setEditing(true)} />
          ) : (
            <CheckIn
              key={todayEntry?.date ?? "new"}
              initial={todayEntry}
              today={today}
              faith={faith}
              onCancel={todayEntry ? () => setEditing(false) : undefined}
              onSave={(entry) => {
                save(upsert(entries, entry));
                setEditing(false);
                setToast(todayEntry ? "Check-in updated." : `Checked in: ${MOOD_LABELS[entry.mood - 1]}.`);
              }}
            />
          )
        ) : (
          <Insights entries={entries} today={today} faith={faith} />
        )}
        {ready && (
          <section className={`${panel} mx-auto flex max-w-2xl items-center gap-4 p-4 sm:p-5 ${tab === "insights" ? "lg:max-w-none" : ""}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber">
              <Church className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p id="faith-label" className="text-sm font-semibold">Faith</p>
              <p className="mt-0.5 text-xs text-muted">
                Adds a short evening reflection to your check-in, an old Christian practice for noticing God in your day. Questions welcome.{" "}
                <Link href="/faith" className="text-amber underline-offset-2 hover:underline">More about Faith</Link>
              </p>
            </div>
            <FaithSwitch
              on={faith}
              onChange={(on) => {
                setFaith(on);
                setToast(on ? "Faith is on across GrowDaily." : "Faith is off.");
              }}
              labelledBy="faith-label"
            />
          </section>
        )}
      </main>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {toast && <p role="status" className="pointer-events-auto rounded-xl border border-line bg-raised px-4 py-3 text-sm shadow-xl shadow-black/40">{toast}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Scale({ label, value, onChange, labels, faces }: { label: string; value: number; onChange: (v: number) => void; labels: readonly string[]; faces?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-soft">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {labels.map((l, i) => {
          const v = i + 1;
          const on = value === v;
          const Face = FACES[i];
          return (
            <button
              key={l}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(v)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-1 py-3 text-xs font-semibold transition ${on ? "border-[#b48cf2] bg-[#b48cf2]/15 text-fg" : "border-line bg-sunken text-muted hover:border-[#2c4060]"}`}
            >
              {faces ? <Face className="h-7 w-7" style={{ color: on ? MOOD_COLORS[i] : undefined }} aria-hidden /> : <span className="font-mono text-lg" style={{ color: on ? ACCENT : undefined }}>{v}</span>}
              {l}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function CheckIn({ initial, today, faith, onSave, onCancel }: { initial?: Entry; today: string; faith: boolean; onSave: (e: Entry) => void; onCancel?: () => void }) {
  const [mood, setMood] = useState(initial?.mood ?? 0);
  const [energy, setEnergy] = useState(initial?.energy ?? 0);
  const [sleep, setSleep] = useState<number | null>(initial ? initial.sleep : 7);
  const [tags, setTags] = useState<Tag[]>(initial?.tags ?? []);
  const [note, setNote] = useState(initial?.note ?? "");
  const [gift, setGift] = useState(initial?.gift ?? "");
  const [heavy, setHeavy] = useState(initial?.heavy ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!mood) return setError("Pick how you're feeling first.");
    if (!energy) return setError("Pick your energy level.");
    // Reflections typed earlier are kept even if Faith has since been turned off.
    const g = (faith ? gift : (initial?.gift ?? "")).trim().slice(0, 200);
    const h = (faith ? heavy : (initial?.heavy ?? "")).trim().slice(0, 200);
    onSave({ date: today, mood, energy, sleep, tags, note: note.trim().slice(0, 200), ...(g ? { gift: g } : {}), ...(h ? { heavy: h } : {}) });
  };

  return (
    <section className={`${panel} mx-auto max-w-2xl space-y-6 p-5 sm:p-7`} aria-labelledby="checkin-heading">
      <div>
        <p className={eyebrow}>{fromISO(today).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 id="checkin-heading" className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">How are you today?</h1>
      </div>
      <Scale label="Mood" value={mood} onChange={(v) => { setMood(v); setError(null); }} labels={MOOD_LABELS} faces />
      <Scale label="Energy" value={energy} onChange={(v) => { setEnergy(v); setError(null); }} labels={ENERGY_LABELS} />
      <div>
        <p className="mb-2 text-sm font-semibold text-soft">Sleep last night</p>
        <div className="flex items-center gap-3">
          <button type="button" className={btn.secondary} aria-label="Less sleep" onClick={() => setSleep((s) => Math.max(0, (s ?? 7) - 0.5))}><Minus className="h-4 w-4" /></button>
          <p className="min-w-[96px] text-center font-mono text-2xl" aria-live="polite">{sleep === null ? "–" : `${sleep}h`}</p>
          <button type="button" className={btn.secondary} aria-label="More sleep" onClick={() => setSleep((s) => Math.min(16, (s ?? 7) + 0.5))}><Plus className="h-4 w-4" /></button>
          <button type="button" className="ml-1 text-xs font-semibold text-muted underline-offset-2 hover:underline" onClick={() => setSleep(sleep === null ? 7 : null)}>
            {sleep === null ? "Add sleep" : "Skip"}
          </button>
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-soft">Today included… <span className="font-normal text-muted">(optional)</span></legend>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <button key={t} type="button" aria-pressed={on} onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t])} className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${on ? "border-[#b48cf2] bg-[#b48cf2]/15 text-fg" : "border-line text-soft hover:border-[#2c4060]"}`}>
                {TAG_LABEL[t]}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div>
        <label htmlFor="note" className="mb-2 block text-sm font-semibold text-soft">One line about today <span className="font-normal text-muted">(optional, stays on this device)</span></label>
        <input id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="e.g. Long walk with Sam, felt lighter after" className="block w-full rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-[#b48cf2] focus:outline-none focus:ring-2 focus:ring-[#b48cf2]/30" />
      </div>
      {faith && (
        <fieldset className="rounded-xl border border-amber/30 bg-amber/[0.06] p-4 sm:p-5">
          <legend className="sr-only">Look back with God</legend>
          <p className="flex items-center gap-2 text-sm font-bold text-fg" aria-hidden>
            <Church className="h-4 w-4 text-amber" /> Look back with God <span className="font-normal text-muted">(optional)</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Christians have prayed this way for 500 years. It&apos;s called the Examen: notice where good showed up, name what was hard, and hand both to God. You don&apos;t need the right words.
          </p>
          <label htmlFor="gift" className="mb-1.5 mt-4 block text-sm font-semibold text-soft">Where did you notice something good today?</label>
          <input id="gift" value={gift} onChange={(e) => setGift(e.target.value)} maxLength={200} placeholder="e.g. A kind word from a coworker" className="block w-full rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30" />
          <label htmlFor="heavy" className="mb-1.5 mt-3 block text-sm font-semibold text-soft">What felt heavy, or pulled you away from peace?</label>
          <input id="heavy" value={heavy} onChange={(e) => setHeavy(e.target.value)} maxLength={200} placeholder="e.g. Worrying about money all afternoon" className="block w-full rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30" />
          <p className="mt-2 font-mono text-[11px] text-dim">Stays on this device. Never sent anywhere, including to AI.</p>
        </fieldset>
      )}
      {error && <p role="alert" className="text-sm font-semibold text-up">{error}</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && <button type="button" onClick={onCancel} className={btn.secondary}>Cancel</button>}
        <button type="button" onClick={submit} className={btn.primary}>{initial ? "Save changes" : "Save check-in"}</button>
      </div>
    </section>
  );
}

function Tonight({ entry, today, onEdit }: { entry: Entry; today: string; onEdit: () => void }) {
  const comfort = comfortFor(today);
  const reflected = Boolean(entry.gift || entry.heavy);
  return (
    <section className={`${panel} relative overflow-hidden p-5 sm:p-7`} aria-labelledby="tonight-heading">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden />
      <p id="tonight-heading" className={`${eyebrow} flex items-center gap-1.5`}>
        <Church className="h-3.5 w-3.5 text-amber" aria-hidden /> Look back with God
      </p>
      {reflected ? (
        <dl className="mt-3 space-y-3">
          {entry.gift && (
            <div>
              <dt className="text-xs font-semibold text-muted">Something good</dt>
              <dd className="mt-0.5 text-soft">{entry.gift}</dd>
            </div>
          )}
          {entry.heavy && (
            <div>
              <dt className="text-xs font-semibold text-muted">Something heavy</dt>
              <dd className="mt-0.5 text-soft">{entry.heavy}</dd>
            </div>
          )}
        </dl>
      ) : (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Take a minute: where did good show up today, and what felt heavy?</p>
          <button type="button" onClick={onEdit} className={btn.secondary}>Add a reflection</button>
        </div>
      )}
      {isHardDay(entry) && (
        <figure className="mt-5 rounded-xl border border-line bg-sunken p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted"><BookOpen className="h-3.5 w-3.5 text-amber" aria-hidden /> For a hard day</p>
          <p className="mt-2 text-[17px] leading-relaxed text-fg">{comfort.text}</p>
          <figcaption className="mt-2 font-mono text-xs text-muted">
            Inspired by {comfort.ref} ·{" "}
            <a href={passageUrl(comfort)} target="_blank" rel="noopener noreferrer" className="text-amber underline-offset-2 hover:underline">Read it</a>
          </figcaption>
        </figure>
      )}
      <p className="mt-5 text-[15px] italic leading-relaxed text-soft">
        A prayer, if you&apos;d like: God, thank you for what was good today. I give you what was heavy. Help me rest, and meet me again tomorrow.
      </p>
    </section>
  );
}

function TodayDone({ entry, entries, today, faith, onEdit }: { entry: Entry; entries: Entry[]; today: string; faith: boolean; onEdit: () => void }) {
  const Face = FACES[entry.mood - 1];
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const s = streak(entries, today);
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className={`${panel} p-5 sm:p-7`}>
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${MOOD_COLORS[entry.mood - 1]}22`, color: MOOD_COLORS[entry.mood - 1] }}>
            <Face className="h-9 w-9" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className={eyebrow}>Checked in today</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em]">Feeling {MOOD_LABELS[entry.mood - 1].toLowerCase()}</h1>
            <p className="mt-1 font-mono text-sm text-muted">
              Energy: {ENERGY_LABELS[entry.energy - 1].toLowerCase()}
              {entry.sleep !== null && <> · <Moon className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden /> {entry.sleep}h sleep</>}
            </p>
          </div>
          <button type="button" onClick={onEdit} className={btn.ghost} aria-label="Edit today's check-in"><Pencil className="h-4 w-4" /></button>
        </div>
        {entry.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">{entry.tags.map((t) => <li key={t} className="rounded-full bg-[#b48cf2]/15 px-2.5 py-1 text-xs font-semibold text-[#d8c4fa]">{TAG_LABEL[t]}</li>)}</ul>
        )}
        {entry.note && <p className="mt-4 border-l-2 border-[#b48cf2]/50 pl-3 text-soft">{entry.note}</p>}
      </section>
      {faith && <Tonight entry={entry} today={today} onEdit={onEdit} />}
      <section className={`${panel} p-5 sm:p-6`}>
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-bold">This week</h2>
          <span className="font-mono text-xs text-muted">{s} day streak</span>
        </div>
        <ol className="mt-4 grid grid-cols-7 gap-2">
          {days.map((d) => {
            const e = entries.find((x) => x.date === d);
            const F = e ? FACES[e.mood - 1] : null;
            return (
              <li key={d} className="flex flex-col items-center gap-1.5" aria-label={`${DAY_SHORT[weekday(d)]}: ${e ? MOOD_LABELS[e.mood - 1] : "no check-in"}`}>
                <span className="flex aspect-square w-full max-w-[52px] items-center justify-center rounded-xl" style={e ? { background: `${MOOD_COLORS[e.mood - 1]}22`, color: MOOD_COLORS[e.mood - 1] } : { border: "1px dashed #22324a" }}>
                  {F && <F className="h-6 w-6" aria-hidden />}
                </span>
                <span className={`font-mono text-[11px] ${d === today ? "text-fg" : "text-dim"}`}>{DAY_SHORT[weekday(d)]}</span>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Insights({ entries, today, faith }: { entries: Entry[]; today: string; faith: boolean }) {
  const gifts = useMemo(() => (faith ? recentGifts(entries) : []), [entries, faith]);
  const last30 = useMemo(() => inRange(entries, today, 30), [entries, today]);
  const impacts = useMemo(() => tagImpact(last30), [last30]);
  const sleep = useMemo(() => sleepVsMood(last30), [last30]);
  const avgMood = last30.length ? last30.reduce((a, e) => a + e.mood, 0) / last30.length : null;
  const sleeps = last30.map((e) => e.sleep).filter((s): s is number => s !== null);
  const avgSleep = sleeps.length ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : null;
  // Calendar: the last 5 weeks, rows are weeks (oldest first), columns Sun..Sat.
  const start = addDays(addDays(today, -weekday(today)), -28);

  return (
    <>
      <h1 className="sr-only">Insights</h1>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["30-day mood", avgMood === null ? "–" : moodLabel(avgMood), avgMood === null ? "" : `${avgMood.toFixed(1)} of 5`],
          ["Check-ins", String(last30.length), "in 30 days"],
          ["Streak", `${streak(entries, today)}`, "days in a row"],
          ["Sleep", avgSleep === null ? "–" : `${avgSleep.toFixed(1)}h`, "average"],
        ].map(([label, value, sub]) => (
          <div key={label} className={`${panel} p-4`}>
            <p className={eyebrow}>{label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
            <p className="font-mono text-xs text-muted">{sub}</p>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="text-base font-bold">Last 5 weeks</h2>
          <div className="mt-4 grid grid-cols-7 gap-1.5" role="img" aria-label="Mood calendar for the last five weeks">
            {DAY_SHORT.map((d) => <span key={d} className="text-center font-mono text-[10px] text-dim">{d[0]}</span>)}
            {Array.from({ length: 35 }, (_, i) => {
              const d = addDays(start, i);
              if (d > today) return <span key={d} />;
              const e = entries.find((x) => x.date === d);
              return (
                <span key={d} title={`${d}: ${e ? MOOD_LABELS[e.mood - 1] : "no check-in"}`} className={`flex aspect-square items-center justify-center rounded-lg font-mono text-[11px] ${d === today ? "outline outline-1 outline-offset-1 outline-[#b48cf2]" : ""}`} style={e ? { background: HEAT[e.mood - 1], color: e.mood === 5 ? "#1d0b33" : "#e8eef5" } : { border: "1px dashed #22324a", color: "#4b5d75" }}>
                  {Number(d.slice(8))}
                </span>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted" aria-hidden>
            awful {HEAT.map((c) => <i key={c} className="inline-block h-2.5 w-[18px] rounded-[3px]" style={{ background: c }} />)} great
          </div>
        </section>

        <InsightPanel entries={entries} today={today} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="text-base font-bold">What goes with your better days</h2>
          <p className="mt-1 text-sm text-muted">Average mood on days with each tag, compared with days without it. Patterns, not causes.</p>
          {impacts.length === 0 ? (
            <p className="mt-4 text-sm text-soft">Tag a few more days to see what goes with your good and hard days.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {impacts.map((t) => {
                const pos = t.diff > 0;
                const width = Math.min(Math.abs(t.diff) / 2, 1) * 50;
                return (
                  <li key={t.tag}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{TAG_LABEL[t.tag]}</span>
                      <span className={`font-mono ${pos ? "text-[#cdb2f7]" : "text-up"}`}>{pos ? "+" : ""}{t.diff.toFixed(1)}</span>
                    </div>
                    <div className="relative mt-1.5 h-2 rounded-full bg-raised">
                      <span className="absolute inset-y-0 left-1/2 w-px bg-line" aria-hidden />
                      <span className="absolute inset-y-0 rounded-full" style={{ background: pos ? ACCENT : "#f2846b", width: `${width}%`, left: pos ? "50%" : `${50 - width}%` }} />
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-dim">{t.withMood} with · {t.withoutMood} without · {t.days} days</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="text-base font-bold">Sleep and mood</h2>
          <p className="mt-1 text-sm text-muted">Average mood after each amount of sleep.</p>
          <div className="mt-5 flex h-40 items-end gap-3" role="img" aria-label="Average mood by hours of sleep">
            {sleep.map((b) => (
              <div key={b.label} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="font-mono text-xs text-soft">{b.mood === null ? "–" : b.mood.toFixed(1)}</span>
                <div className="w-full rounded-md" style={{ height: `${b.mood === null ? 4 : (b.mood / 5) * 110}px`, background: b.mood === null ? "#22324a" : HEAT[Math.round(b.mood) - 1] }} />
                <span className="text-center font-mono text-[11px] text-muted">{b.label}</span>
                <span className="font-mono text-[10px] text-dim">{b.days}d</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {gifts.length > 0 && (
        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="flex items-center gap-2 text-base font-bold"><Church className="h-4 w-4 text-amber" aria-hidden /> Good things you noticed</h2>
          <p className="mt-1 text-sm text-muted">From your evening reflections. Looking back on these is part of the practice.</p>
          <ul className="mt-4 divide-y divide-hairline">
            {gifts.map((g) => (
              <li key={g.date} className="flex gap-4 py-2.5">
                <span className="w-14 shrink-0 font-mono text-xs leading-6 text-dim">{fromISO(g.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="text-sm text-soft">{g.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function InsightPanel({ entries, today }: { entries: Entry[]; today: string }) {
  const [state, setState] = useState<{ status: "idle" | "loading" | "done" | "error"; text?: string; date?: string }>({ status: "idle" });
  const days = inRange(entries, today, 30).length;

  useEffect(() => {
    try {
      const saved = JSON.parse(safeGet(INSIGHT_KEY) ?? "null") as { text: string; date: string } | null;
      if (saved?.text) setState({ status: "done", text: saved.text, date: saved.date });
    } catch {
      /* ignore */
    }
  }, []);

  const request = async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/moodwise/insights", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildInsightInput(entries, today)) });
      const body = (await res.json().catch(() => ({}))) as { insight?: string; error?: string };
      if (!res.ok || !body.insight) throw new Error(body.error ?? "Your insights couldn't be written right now.");
      safeSet(INSIGHT_KEY, JSON.stringify({ text: body.insight, date: today }));
      setState({ status: "done", text: body.insight, date: today });
    } catch (err) {
      setState({ status: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  const fresh = state.status === "done" && state.date === today;
  return (
    <section className={`${panel} p-5 sm:p-6`} aria-labelledby="insight-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="insight-heading" className="flex items-center gap-2 text-base font-bold"><Sparkles className="h-4 w-4" style={{ color: ACCENT }} aria-hidden /> Your patterns</h2>
        <button type="button" onClick={request} disabled={days < 7 || state.status === "loading" || fresh} className={state.status === "done" ? btn.secondary : btn.primary}>
          {state.status === "loading" ? "Reading your check-ins…" : fresh ? "Updated today" : state.status === "done" ? "Refresh" : "Find my patterns"}
        </button>
      </div>
      {state.status === "idle" && (
        <p className="mt-3 text-sm text-muted">
          {days < 7 ? `Check in on ${7 - days} more day${7 - days === 1 ? "" : "s"} to unlock this.` : "AI reads your last 30 days and points out what seems to go with your better and harder days."}{" "}
          Only numbers and tag names are sent. Your notes never leave this device.
        </p>
      )}
      {state.status === "loading" && <div className="mt-4 space-y-2" aria-busy="true">{[92, 80, 64].map((w) => <div key={w} className="h-3.5 animate-pulse rounded bg-raised" style={{ width: `${w}%` }} />)}</div>}
      {state.status === "error" && <p role="alert" className="mt-3 text-sm font-semibold text-up">{state.text}</p>}
      {state.status === "done" && (
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-soft">
          {state.text!.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          <p className="font-mono text-xs text-dim">Written {state.date === today ? "today" : fromISO(state.date!).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · not medical advice</p>
        </div>
      )}
    </section>
  );
}
