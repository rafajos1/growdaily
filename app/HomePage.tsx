import Link from "next/link";
import { ArrowRight, ClipboardCheck, EyeOff, FileText } from "lucide-react";
import { LogoMark } from "./components/LogoMark";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-sm font-bold text-amber-ink transition hover:bg-amber-hover ${focus}`;
const CALL = "/build#idea";

/** Where to start: the free kit, then the two questions leaders ask first. */
const START = [
  { label: "Free tool", name: "AI governance kit", Icon: ClipboardCheck, href: "/apps/governwise", cta: "Build your kit", text: "List the AI tools your team uses and get an AI register, a ready-to-adopt policy and a one-page summary for your leaders, in about 15 minutes." },
  { label: "Free guide", name: "AI policy template", Icon: FileText, href: "/learn/ai-policy-template", cta: "Read the guide", text: "What a simple AI policy should cover, with a template you can copy and adapt for your team." },
  { label: "Free guide", name: "What is shadow AI?", Icon: EyeOff, href: "/learn/what-is-shadow-ai", cta: "Read the guide", text: "Why your people are already using AI you don't know about, and how to bring it into the open without banning it." },
];

const STEPS = [
  { title: "A free 20-minute call", text: "Tell us how your team uses AI today. We'll say honestly what needs attention and what doesn't." },
  { title: "Find every AI tool in use", text: "We build your AI register together, including the free tools on personal phones, and rate each one with reasons." },
  { title: "Clear rules, a trained team", text: "A tailored AI policy, a short training so people actually know it, and a briefing for your leaders." },
];

export function HomePage() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <LogoMark className="h-8 w-8" />
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
            AI governance for businesses and nonprofits, including churches
          </p>
          <h1 className="mt-6 max-w-[18ch] text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl lg:text-7xl">
            Use AI with confidence. <span className="text-amber">Stay in control.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-soft sm:text-xl">
            Your people are already using AI, often on free personal accounts, with information you&apos;d rather keep in house. We help you see which tools are in use, set clear rules and train your team, so AI saves time without putting your people or your data at risk.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={CALL} className={btnPrimary}>
              Book a free 20-minute call <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/apps/governwise" className="text-sm font-semibold text-soft underline-offset-4 hover:text-fg hover:underline">
              Try the free AI governance kit
            </Link>
          </div>
        </section>

        <section id="start" aria-labelledby="start-heading" className="scroll-mt-8 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Start here</p>
          <h2 id="start-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Get your AI house in order, free</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {START.map((e) => (
              <li key={e.name}>
                <Link href={e.href} className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 transition hover:border-[#35507a]">
                  <e.Icon className="h-6 w-6 text-amber" aria-hidden />
                  <span className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">{e.label}</span>
                  <span className="mt-1 text-2xl font-extrabold tracking-tight">{e.name}</span>
                  <span className="mt-3 flex-1 text-soft">{e.text}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber">
                    {e.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Hi, I&apos;m Rafael</p>
            <h2 id="me-heading" className="mt-2 text-3xl font-extrabold tracking-tight">Stretched thin? I&apos;ve been there.</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-soft">
              <p>
                Most leaders I talk to have the same problem: too much busywork, too little time, and no idea which AI tools are worth trusting with their people or their data.
              </p>
              <p>
                My background is in governance. I have extensive experience leading complex data platform projects, including enterprise AI, and moving new technology out of pilots and into everyday use.
              </p>
              <p>
                So we start with what&apos;s really happening: the AI tools your people already use and the information that goes into them. Then we set simple rules your team will actually follow, so you can launch AI without regret and focus on what matters most.
              </p>
            </div>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
              More about me <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="pb-24">
          <div className="rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Start with a free 20-minute call</h2>
            <p className="mt-2 max-w-[56ch] text-muted">Tell us how your team uses AI today. No cost, no pressure, and an honest answer about what needs attention.</p>
            <Link href={CALL} className={`${btnPrimary} mt-6`}>
              Book a free 20-minute call <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl border-t border-hairline py-8 text-sm text-muted">
        <nav aria-label="More from GrowDaily" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/apps/governwise" className="hover:text-fg">Free AI governance kit</Link>
          <Link href="/build/ai-governance" className="hover:text-fg">AI governance</Link>
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
