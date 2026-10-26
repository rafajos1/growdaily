import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChurchArt, HabitArt, QuoteArt } from "./components/AppArt";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-sm font-bold text-amber-ink transition hover:bg-amber-hover ${focus}`;
const CALL = "/build#idea";

/** One example for each kind of visitor: their life, their nonprofit, their business. */
const EXAMPLES = [
  { label: "Your life", name: "Habitwise", Art: HabitArt, href: "/apps/habitwise", color: "#53cfa0", text: "Build habits that stick, with streaks, a 15-week calendar and a short weekly review." },
  { label: "Your nonprofit", name: "Church AI assistant", Art: ChurchArt, href: "/demo/church-assistant", color: "#b48cf2", text: "Answers questions only from your own content, with a source for every answer." },
  { label: "Your business", name: "Quotewise", Art: QuoteArt, href: "/apps/quotewise", color: "#8fb3ff", text: "Describe the job and get a professional quote in minutes, then turn it into an invoice." },
];

const STEPS = [
  { title: "A free 20-minute call", text: "Tell us what you need. We'll say honestly whether AI is a good fit." },
  { title: "Your content and data first", text: "AI is only as good as your data, so we start by looking at what you have." },
  { title: "We build it with you, or for you", text: "Either way, you own the tool and understand how it works." },
];

export function HomePage() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          GrowDaily
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold text-muted">
          <Link href="/learn" className="rounded-lg px-3 py-2 hover:text-fg">Learn</Link>
          <Link href="/about" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">About</Link>
          <Link href={CALL} className="ml-1 rounded-lg bg-amber/15 px-3 py-2 text-amber hover:bg-amber/25">Free call</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl">
        <section className="pb-20 pt-10 lg:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-down" aria-hidden />
            For businesses and nonprofits, including churches
          </p>
          <h1 className="mt-6 max-w-[18ch] text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl lg:text-7xl">
            You know the tool you need. <span className="text-amber">Let&apos;s build it together.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-soft sm:text-xl">
            Simple AI tools that save your team hours every week, so you can spend more time on what matters most. You don&apos;t need to be a developer: we&apos;ll guide you from idea to a working tool, or build it for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={CALL} className={btnPrimary}>
              Book a free 20-minute call <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#examples" className="text-sm font-semibold text-soft underline-offset-4 hover:text-fg hover:underline">
              See live examples
            </a>
          </div>
        </section>

        <section id="examples" aria-labelledby="examples-heading" className="scroll-mt-8 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">See what&apos;s possible</p>
          <h2 id="examples-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Real tools you can try right now</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {EXAMPLES.map((e) => (
              <li key={e.name}>
                <a href={e.href} className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition hover:border-[#35507a]">
                  <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: e.color }}>
                    {e.label}
                  </span>
                  <span className="mt-2 text-2xl font-extrabold tracking-tight">{e.name}</span>
                  <span className="my-5 block">
                    <e.Art color={e.color} />
                  </span>
                  <span className="flex-1 text-soft">{e.text}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: e.color }}>
                    Try it free <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <Link href="/build#work" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg">
            See all examples <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section aria-labelledby="how-heading" className="pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Three simple steps</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-panel p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber/15 font-mono text-sm font-bold text-amber">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="me-heading" className="pb-20">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Who you&apos;ll work with</p>
            <h2 id="me-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Hi, I&apos;m Rafael.</h2>
            <p className="mt-4 text-lg leading-relaxed text-soft">
              I&apos;ve spent 25+ years leading data, analytics and AI transformation, and 14 years serving large, mission-driven nonprofits. I believe technology is at its best when it gives people time back for each other.
            </p>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
              More about me <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="pb-24">
          <div className="rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Start with a free 20-minute call</h2>
            <p className="mt-2 max-w-[56ch] text-muted">Tell us what you&apos;d like to build. No cost, no pressure, and an honest answer about whether AI is a good fit.</p>
            <Link href={CALL} className={`${btnPrimary} mt-6`}>
              Book a free 20-minute call <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl border-t border-hairline py-8 text-sm text-muted">
        <nav aria-label="More from GrowDaily" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/build#work" className="hover:text-fg">All examples</Link>
          <Link href="/learn" className="hover:text-fg">Free guides</Link>
          <Link href="/build" className="hover:text-fg">Services</Link>
          <Link href="/build/businesses" className="hover:text-fg">For businesses</Link>
          <Link href="/build/nonprofits" className="hover:text-fg">For nonprofits</Link>
          <Link href="/build/churches" className="hover:text-fg">For churches</Link>
          <Link href="/faith" className="hover:text-fg">Faith</Link>
          <Link href="/about" className="hover:text-fg">About</Link>
          <Link href="/privacy" className="hover:text-fg">Privacy</Link>
        </nav>
        <p className="mt-4 font-mono text-xs text-dim">© {new Date().getFullYear()} GrowDaily</p>
      </footer>
    </div>
  );
}
