"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Bell, Check, Church, Compass, ShieldCheck, Sparkles, Wrench, X } from "lucide-react";
import { getSupabase } from "../lib/supabase";
import { APPS, type GrowApp } from "./apps";
import { CafeArt, HabitArt, MealArt, MoodArt, PilotArt, PlanArt, QuoteArt, RoomArt, SpendArt } from "./components/AppArt";
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
  { name: "Quotewise", Art: QuoteArt, href: "/apps/quotewise", color: "#8fb3ff", who: "Trades & services", problem: "Writing quotes by hand after a long day.", text: "Describe the job and AI drafts the quote. Print, PDF or email it, then turn it into an invoice." },
  { name: "Cafewise", Art: CafeArt, href: "/apps/cafewise", color: "#d9965b", who: "Coffee shops", problem: "Counting stock and guessing what to order.", text: "Count stock on your phone, get an order list from your par levels, and see what each drink costs you." },
  { name: "Roomwise", Art: RoomArt, href: "/apps/roomwise", color: "#4fc7b8", who: "Churches, offices & spaces", problem: "Double-booked rooms and a messy shared calendar.", text: "Book rooms on a map of your building, with no double bookings, weekly repeats and requests to confirm." },
  { name: "Pilotwise", Art: PilotArt, href: "/apps/pilotwise", color: "#f2b54b", who: "Teams starting with AI", problem: "An AI idea with no clear first step.", text: "Describe an AI idea and get what to fix first, a go/no-go test and a one-page brief for your sponsor." },
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
  { value: "business", label: "A tool for my business" },
  { value: "nonprofit", label: "A tool for my nonprofit" },
  { value: "personal", label: "Something for my own life" },
  { value: "learning", label: "Just learning for now" },
];

function Updates() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !interest) {
      setResult({ ok: false, text: "Enter your email and pick what you want to build." });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      // The users table's `niche` column holds what the person wants to build.
      const { error } = await getSupabase()
        .from("users")
        .insert([{ email, niche: interest, created_at: new Date().toISOString() }])
        .select();
      if (error) {
        setResult({ ok: false, text: `Couldn't sign you up: ${error.message}` });
      } else {
        setResult({ ok: true, text: "You're on the list. We'll email you when we publish a new example or build guide." });
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
      <label htmlFor="interest" className="sr-only">What do you want to build?</label>
      <select
        id="interest"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        className="rounded-[10px] border border-line bg-sunken px-4 py-3 text-sm text-fg focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
      >
        <option value="">I want to build…</option>
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

const PAINS = [
  { icon: Compass, title: "Not sure where to start", text: "You can picture the tool, but a blank chat box isn't a plan." },
  { icon: Wrench, title: "Stuck halfway", text: "It worked yesterday. Now something's broken and you're not sure what changed." },
  { icon: ShieldCheck, title: "Not sure it's safe", text: "Customer data, accuracy, cost. You don't want to guess on the things that matter." },
];

const STEPS = [
  { title: "Bring your idea", text: "Tell us the job you want done, in your own words. A free 20-minute call is enough to start." },
  { title: "Build it together", text: "We turn the idea into a simple plan, then walk you through building it with Claude, step by step, until it works." },
  { title: "Own it", text: "You leave with a tool that fits how you work, and the know-how to build the next one yourself." },
];

const WITH_GUIDE = [
  "A tool your team actually uses every week",
  "You understand how it works and can change it",
  "The confidence to build the next one",
];

const WITHOUT_GUIDE = [
  "A half-built project lost in an old chat",
  "Deciding \"AI just isn't for me\"",
  "Paying someone every time you need a change",
];

export function HomePage() {
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
          <a href="#examples" className="rounded-lg px-3 py-2 hover:text-fg">Examples</a>
          <a href="#how" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">How it works</a>
          <Link href="/learn" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">Learn AI</Link>
          <Link href="/build" className="rounded-lg px-3 py-2 text-amber hover:text-fg">Start building</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl">
        <YourDay />
        <section className="grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-down" aria-hidden />
              For non-technical builders
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
              You know the tool you need. <span className="text-amber">Let&apos;s build it together.</span>
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg text-soft">
              You don&apos;t have to be a developer to build your own apps with Claude. GrowDaily guides business owners and nonprofit leaders from idea to a working tool, in plain English, one step at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/build" className={btnPrimary}>
                Start your build <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href="#examples" className={btnSecondary}>
                See what&apos;s possible
              </a>
            </div>
            <p className="mt-5 max-w-[46ch] text-sm text-muted">
              <span className="font-semibold text-soft">Every app on this site was built with Claude.</span> Try them free, then picture yours.
            </p>
          </div>
          <a href="/apps/spendwise" className="group block min-w-0" aria-label="Open Spendwise, an example app built with Claude">
            <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl shadow-black/50 transition group-hover:border-[#35507a] lg:[transform:perspective(1600px)_rotateY(-6deg)]">
              <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden>
                <i className="h-2.5 w-2.5 rounded-full bg-[#2b3a50]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#2b3a50]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#2b3a50]" />
                <span className="ml-3 font-mono text-xs text-dim">growdaily.ai/apps/spendwise</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apps/spendwise/preview.png" alt="Spendwise, an example app built with Claude, showing a month's spending pace" className="block w-full" width={1320} height={1043} />
            </div>
          </a>
        </section>

        <section id="examples" aria-labelledby="examples-heading" className="scroll-mt-8 pb-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">What you could build</p>
              <h2 id="examples-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Real apps, built with Claude</h2>
            </div>
            <p className="max-w-[42ch] text-sm text-muted">Each one started as a simple problem. All free to try, no account, and your data stays on your device.</p>
          </div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">For businesses &amp; nonprofits</p>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_TOOLS.map((t) => (
              <li key={t.name}>
                <Link href={t.href} className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition hover:border-[#35507a]">
                  <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: t.color }}>
                    {t.who}
                  </span>
                  <span className="mt-2 text-2xl font-extrabold tracking-tight">{t.name}</span>
                  <span className="my-4 block">
                    <t.Art color={t.color} />
                  </span>
                  <span className="mt-2 text-sm text-muted">
                    <span className="font-semibold text-soft">The problem:</span> {t.problem}
                  </span>
                  <span className="mt-2 flex-1 text-soft">{t.text}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: t.color }}>
                    Try {t.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="apps" aria-labelledby="apps-heading" className="scroll-mt-8 pb-20">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">For everyday life</p>
          <h3 id="apps-heading" className="sr-only">Everyday apps</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {APPS.map((app, i) => (
              <AppCard key={app.slug} app={app} index={i} featured={i === 0} faith={faith} />
            ))}
          </div>
        </section>

        <section id="stuck" aria-labelledby="stuck-heading" className="scroll-mt-8 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Sound familiar?</p>
          <h2 id="stuck-heading" className="mt-2 max-w-[26ch] text-3xl font-extrabold tracking-tight">Most good ideas stall before they&apos;re built</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PAINS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line bg-panel p-6">
                <Icon className="h-5 w-5 text-amber" aria-hidden />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" aria-labelledby="how-heading" className="scroll-mt-8 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-extrabold tracking-tight">You&apos;re the builder. We&apos;re the guide.</h2>
          <p className="mt-3 max-w-[62ch] text-soft">
            You know your business and your problem better than anyone. We bring experience leading AI products from idea to launch, in plain English: what to ask Claude, how to check the work, and how to avoid the mistakes that stall most first builds.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-panel p-6">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-amber">Step {i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/build" className={`${btnPrimary} mt-6`}>
            Start your build <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section id="stakes" aria-labelledby="stakes-heading" className="scroll-mt-8 pb-20">
          <h2 id="stakes-heading" className="text-3xl font-extrabold tracking-tight">Where your idea ends up</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-down/40 bg-down/[0.05] p-6">
              <h3 className="text-lg font-bold">With a guide</h3>
              <ul className="mt-3 grid gap-2 text-sm text-soft">
                {WITH_GUIDE.map((t) => (
                  <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-down" aria-hidden />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-panel p-6">
              <h3 className="text-lg font-bold">On your own</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {WITHOUT_GUIDE.map((t) => (
                  <li key={t} className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-up" aria-hidden />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="build" aria-labelledby="build-heading" className="scroll-mt-8 pb-20">
          <div className="grid gap-6 rounded-2xl border border-line bg-panel p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Ready to build?</p>
              <h2 id="build-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Start with a free 20-minute call</h2>
              <p className="mt-2 max-w-[52ch] text-muted">
                Tell us what you want to build. We&apos;ll guide you through building it yourself, train your team to build, or build it for you if you&apos;d rather. For-profit or nonprofit, any size.
              </p>
              <Link href="/build" className={`${btnPrimary} mt-5`}>
                Start your build <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-2 text-sm font-semibold">
              <li><Link href="/learn" className="flex items-center justify-between rounded-xl border border-amber/40 bg-amber/[0.06] px-4 py-3 hover:border-amber/70">Free guides: learn to build with AI <ArrowRight className="h-4 w-4 text-amber" aria-hidden /></Link></li>
              <li><Link href="/build/ai-training" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">AI training for your team <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
              <li><Link href="/build/ai-consulting" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">AI consulting and planning <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
              <li><Link href="/build/businesses" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">Ideas for businesses <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
              <li><Link href="/build/nonprofits" className="flex items-center justify-between rounded-xl border border-line px-4 py-3 hover:border-[#35507a]">Ideas for nonprofits <ArrowRight className="h-4 w-4 text-muted" aria-hidden /></Link></li>
            </ul>
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

        <section id="updates" className="scroll-mt-8 pb-24">
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Get new examples first</h2>
                <p className="mt-2 text-muted">One email when we launch a new app or build guide. Nothing else.</p>
              </div>
              <Updates />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-hairline py-8 font-mono text-xs text-dim">
        <span>© {new Date().getFullYear()} GrowDaily</span>
        <span>Public beta · Guided AI app building · <Link href="/build" className="hover:text-fg">Start building</Link> · <Link href="/about" className="hover:text-fg">About</Link> · <Link href="/privacy" className="hover:text-fg">Privacy</Link></span>
      </footer>
    </div>
  );
}
