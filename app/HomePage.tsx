"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Bell, Church, Lock, Sparkles, UserX } from "lucide-react";
import { getSupabase } from "../lib/supabase";
import { APPS, type GrowApp } from "./apps";
import { HabitArt, MealArt, MoodArt, PlanArt, SpendArt } from "./components/AppArt";
import { FaithSwitch } from "./components/FaithSwitch";
import { YourDay } from "./components/NextUp";
import { useFaith } from "./components/useFaith";

const ART: Record<string, (p: { color: string }) => React.ReactElement> = {
  spendwise: SpendArt,
  habitwise: HabitArt,
  planwise: PlanArt,
  mealwise: MealArt,
  moodwise: MoodArt,
};

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-sm font-bold text-amber-ink transition hover:bg-amber-hover ${focus}`;
const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-5 py-3 text-sm font-semibold text-fg transition hover:bg-[#24364f] ${focus}`;

/** What Faith adds to each app today, shown on the cards when it's on. */
const FAITH_NOTES: Record<string, string> = {
  spendwise: "With Faith: a generosity view, with a gentle nudge to give first each month.",
  planwise: "With Faith: short quiet moments built into your plan, and a lighter Sunday.",
  mealwise: "With Faith: a simple grace before meals, and room at the table for one more.",
  habitwise: "With Faith: a daily word of encouragement and habits like prayer and gratitude.",
  moodwise: "With Faith: a short evening reflection with God.",
};

const BUSINESS_TOOLS = [
  { name: "Quotewise", href: "/apps/quotewise", color: "#8fb3ff", who: "Trades & services", text: "Describe the job and AI drafts the quote. Print, PDF or email it, then turn it into an invoice." },
  { name: "Cafewise", href: "/apps/cafewise", color: "#d9965b", who: "Coffee shops", text: "Count stock on your phone, get an order list from your par levels, and see what each drink costs you." },
  { name: "Roomwise", href: "/apps/roomwise", color: "#4fc7b8", who: "Churches, offices & spaces", text: "Book rooms on a map of your building, with no double bookings, weekly repeats and requests to confirm." },
  { name: "Pilotwise", href: "/apps/pilotwise", color: "#f2b54b", who: "Teams starting with AI", text: "Describe an AI idea and get what to fix first, a go/no-go test and a one-page brief for your sponsor." },
];

function AppCard({ app, index, featured, faith }: { app: GrowApp; index: number; featured?: boolean; faith: boolean }) {
  const Art = ART[app.slug];
  const live = app.status === "live";
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-line bg-panel p-6 transition ${live ? "hover:border-[#35507a]" : ""} ${featured ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: app.color }}>
          {String(index + 1).padStart(2, "0")} · {app.area}
        </p>
        {live ? (
          <span className="rounded-full bg-down/15 px-2.5 py-0.5 font-mono text-xs text-down">Live</span>
        ) : (
          <span className="rounded-full bg-muted/15 px-2.5 py-0.5 font-mono text-xs text-muted">Coming soon</span>
        )}
      </div>
      <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{app.name}</h3>
      <p className="mt-2 max-w-[52ch] text-soft">{app.tagline}</p>
      <div className={`my-5 ${live ? "" : "opacity-70"}`}>
        <Art color={app.color} />
      </div>
      <p className="mt-auto flex gap-2 border-t border-hairline pt-4 text-sm text-muted">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: app.color }} aria-hidden />
        {app.ai}
      </p>
      {faith && FAITH_NOTES[app.slug] && (
        <p className="mt-2 flex gap-2 text-sm text-soft">
          <Church className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
          {FAITH_NOTES[app.slug]}
        </p>
      )}
      {live && app.href && (
        <a href={app.href} className={`${btnPrimary} mt-5 self-start`}>
          Open {app.name} <ArrowRight className="h-4 w-4" aria-hidden />
          <span className="absolute inset-0" aria-hidden />
        </a>
      )}
    </article>
  );
}

const INTERESTS = [
  { value: "money", label: "Money" },
  { value: "habits", label: "Habits" },
  { value: "time", label: "Time" },
  { value: "food", label: "Food" },
  { value: "mood", label: "Mood" },
];

function Updates() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !interest) {
      setResult({ ok: false, text: "Enter your email and pick what you want to improve first." });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      // The users table's `niche` column holds the area the person wants to improve first.
      const { error } = await getSupabase()
        .from("users")
        .insert([{ email, niche: interest, created_at: new Date().toISOString() }])
        .select();
      if (error) {
        setResult({ ok: false, text: `Couldn't sign you up: ${error.message}` });
      } else {
        setResult({ ok: true, text: "You're on the list. We'll email you when the next app launches." });
        setEmail("");
        setInterest("");
        try {
          localStorage.setItem("userEmail", email);
        } catch {
          /* storage unavailable */
        }
      }
    } catch (err) {
      console.error(err);
      setResult({ ok: false, text: "Something went wrong. Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
      <label htmlFor="email" className="sr-only">Email address</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 rounded-[10px] border border-line bg-sunken px-4 py-3 text-sm text-fg placeholder:text-dim focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      />
      <label htmlFor="interest" className="sr-only">What do you want to improve first?</label>
      <select
        id="interest"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        className="rounded-[10px] border border-line bg-sunken px-4 py-3 text-sm text-fg focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      >
        <option value="">Improve first…</option>
        {INTERESTS.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading} className={`${btnPrimary} disabled:opacity-60`}>
        <Bell className="h-4 w-4" aria-hidden />
        {loading ? "Signing up…" : "Notify me"}
      </button>
      {result && (
        <p role="status" className={`basis-full text-sm font-semibold sm:order-last ${result.ok ? "text-down" : "text-up"}`}>
          {result.text}
        </p>
      )}
    </form>
  );
}

export function HomePage() {
  const live = APPS.filter((a) => a.status === "live").length;
  const [faith, setFaith] = useFaith();
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          GrowDaily
          <span className="rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-amber">Beta</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold text-muted">
          <a href="#apps" className="rounded-lg px-3 py-2 hover:text-fg">Apps</a>
          <a href="#why" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">Why it&apos;s free</a>
          <a href="#updates" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">Get updates</a>
          <Link href="/learn" className="rounded-lg px-3 py-2 hover:text-fg">Learn AI</Link>
          <Link href="/build" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">Build with us</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl">
        <YourDay />
        <section className="grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-down" aria-hidden />
              {live === APPS.length ? `${APPS.length} free apps · public beta` : `${APPS.length} apps · ${live} live now`}
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
              Free AI apps to run your life <span className="text-amber">better</span>.
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg text-soft">
              Small, focused tools for your money, habits, time, food and mood. No account needed, and your data stays on your device unless you choose to save it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/apps/spendwise" className={btnPrimary}>
                Open Spendwise <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="#apps" className={btnSecondary}>
                See all apps
              </a>
            </div>
            <p className="mt-5 max-w-[46ch] text-sm text-muted">
              <span className="font-semibold text-soft">GrowDaily is in beta.</span> AI is now live in every app, with a free daily allowance, and the apps still work without it.
            </p>
          </div>
          <a href="/apps/spendwise" className="group block min-w-0" aria-label="Open Spendwise">
            <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl shadow-black/50 transition group-hover:border-[#35507a] lg:[transform:perspective(1600px)_rotateY(-6deg)]">
              <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden>
                <i className="h-2.5 w-2.5 rounded-full bg-[#2b3a50]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#2b3a50]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#2b3a50]" />
                <span className="ml-3 font-mono text-xs text-dim">growdaily.ai/apps/spendwise</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apps/spendwise/preview.png" alt="Spendwise showing a month's spending pace and a daily calendar" className="block w-full" width={1320} height={1043} />
            </div>
          </a>
        </section>

        <section id="apps" className="scroll-mt-8 pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">For everyday life</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">One app for each part of your day</h2>
            </div>
            <p className="max-w-[40ch] text-sm text-muted">Each one does one job well, and they all work on your phone.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {APPS.map((app, i) => (
              <AppCard key={app.slug} app={app} index={i} featured={i === 0} faith={faith} />
            ))}
          </div>
        </section>

        <section id="business" aria-labelledby="business-heading" className="scroll-mt-8 pb-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">For your business</p>
              <h2 id="business-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Free tools for small businesses and churches</h2>
            </div>
            <p className="max-w-[40ch] text-sm text-muted">Same idea: one job done well, free, no account. Want one built around your business? We do that too.</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_TOOLS.map((t) => (
              <li key={t.name}>
                <Link href={t.href} className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition hover:border-[#35507a]">
                  <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: t.color }}>
                    {t.who}
                  </span>
                  <span className="mt-2 text-2xl font-extrabold tracking-tight">{t.name}</span>
                  <span className="mt-2 flex-1 text-soft">{t.text}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: t.color }}>
                    Open {t.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/build" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-soft hover:text-fg">
            More coming. Want a tool built for your business? <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section id="why" className="scroll-mt-8 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Why it&apos;s free</p>
          <h2 className="mt-2 max-w-[24ch] text-3xl font-extrabold tracking-tight">Built to be cheap to run, so it can stay free</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Lock, title: "Private by default", text: "What you enter is saved in your own browser, not on our servers. Export it any time." },
              { icon: UserX, title: "No account needed", text: "Open an app and start. No sign-up, no password, no trial that runs out." },
              { icon: Sparkles, title: "AI where it helps", text: "Each app uses AI for one job it's genuinely good at, with a generous free daily allowance." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line bg-panel p-6">
                <Icon className="h-5 w-5 text-amber" aria-hidden />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faith" className="scroll-mt-8 pb-20">
          <div className="grid gap-6 rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-amber">
                <Church className="h-4 w-4" aria-hidden /> Faith
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Room for your soul, too</h2>
              <p className="mt-2 max-w-[52ch] text-muted">
                Curious about God? Turn on Faith and the apps leave a little room for him in your day: a word of encouragement each morning, an evening reflection, habits like prayer and gratitude. Questions welcome, no church background needed.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <a href="/faith/ask" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
                  Ask a question about God <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href="/faith" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soft hover:text-fg hover:underline">
                  What Faith adds
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-line bg-panel p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <p id="home-faith-label" className="font-semibold">Faith {faith ? "is on" : "is off"}</p>
                <p className="mt-0.5 text-sm text-muted">{faith ? "On in every app on this device." : "Off by default. Turn it on any time."}</p>
              </div>
              <FaithSwitch on={faith} onChange={setFaith} labelledBy="home-faith-label" />
            </div>
          </div>
        </section>

        <section id="build" aria-labelledby="build-heading" className="scroll-mt-8 pb-20">
          <div className="grid gap-6 rounded-2xl border border-line bg-panel p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Build with us</p>
              <h2 id="build-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Want AI working for your team?</h2>
              <p className="mt-2 max-w-[52ch] text-muted">
                We help businesses and nonprofits of any size put AI to work: team training, a plain-English AI plan, custom apps like these, and care to keep them running.
              </p>
              <Link href="/build" className={`${btnPrimary} mt-5`}>
                Ask for a quote <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-2 text-sm font-semibold">
              <li><Link href="/learn" className="flex items-center justify-between rounded-xl border border-amber/40 bg-amber/[0.06] px-4 py-3 hover:border-amber/70">Free guides: learn AI at work <ArrowRight className="h-4 w-4 text-amber" aria-hidden /></Link></li>
              <li><Link href="/build/ai-training" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">AI training for your team <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
              <li><Link href="/build/ai-consulting" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">AI consulting and planning <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
              <li><Link href="/build/businesses" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">AI apps for businesses <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
              <li><Link href="/build/nonprofits" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">AI tools for nonprofits <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
            </ul>
          </div>
        </section>

        <section id="updates" className="scroll-mt-8 pb-24">
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Get new apps first</h2>
                <p className="mt-2 text-muted">One email when we launch something new. Nothing else.</p>
              </div>
              <Updates />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-hairline py-8 font-mono text-xs text-dim">
        <span>© {new Date().getFullYear()} GrowDaily</span>
        <span>Public beta · Free apps · <Link href="/build" className="hover:text-fg">AI app development</Link> · <Link href="/about" className="hover:text-fg">About</Link> · <Link href="/privacy" className="hover:text-fg">Privacy</Link></span>
      </footer>
    </div>
  );
}
