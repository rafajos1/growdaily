import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Check } from "lucide-react";
import type { Interest, OrgType } from "../../lib/build/idea";
import { AUDIENCES, PRINCIPLES, PROCESS, SERVICE_PAGES, SERVICES, type CaseStudy } from "./content";
import { IdeaForm } from "./IdeaForm";
import { QuoteButton } from "./QuoteButton";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
export const btnPrimary = `inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-amber px-5 text-base font-bold text-[#2a1c05] transition hover:brightness-110 ${focus}`;
export const btnSecondary = `inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-5 text-base font-semibold text-fg transition hover:bg-[#24364f] ${focus}`;
export const eyebrow = "font-mono text-xs uppercase tracking-[0.14em] text-muted";

export function BuildHeader() {
  return (
    <header className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-2 py-3">
      <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
        <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
        GrowDaily
      </Link>
      <nav aria-label="Build with GrowDaily" className="flex items-center gap-1 text-sm font-semibold text-muted">
        <Link href="/learn" className="rounded-lg px-3 py-2 hover:text-fg">
          Learn
        </Link>
        <Link href="/build#services" className="rounded-lg px-3 py-2 hover:text-fg">
          Services
        </Link>
        <Link href="/build#work" className="hidden rounded-lg px-3 py-2 hover:text-fg sm:block">
          Our work
        </Link>
        <Link href="/build#idea" className="rounded-lg bg-amber/15 px-3 py-2 text-amber hover:bg-amber/25">
          Get a quote
        </Link>
      </nav>
    </header>
  );
}

export function BuildFooter() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-hairline py-8 text-sm text-muted">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/learn" className="hover:text-fg">
          Learn AI at work
        </Link>
        <Link href="/learn/what-is-an-ai-agent" className="hover:text-fg">
          What is an AI agent?
        </Link>
        <Link href="/learn/ai-policy-template" className="hover:text-fg">
          AI policy template
        </Link>
        <Link href="/build" className="hover:text-fg">
          AI app development
        </Link>
        {SERVICE_PAGES.map((p) => (
          <Link key={p.slug} href={`/build/${p.slug}`} className="hover:text-fg">
            {p.label}
          </Link>
        ))}
        {AUDIENCES.map((a) => (
          <Link key={a.slug} href={`/build/${a.slug}`} className="hover:text-fg">
            For {a.label.toLowerCase()}
          </Link>
        ))}
        <Link href="/" className="hover:text-fg">
          Try the free apps
        </Link>
        <Link href="/about" className="hover:text-fg">
          About
        </Link>
        <Link href="/privacy" className="hover:text-fg">
          Privacy
        </Link>
      </div>
      <p className="mt-4 font-mono text-xs text-dim">© {new Date().getFullYear()} GrowDaily</p>
    </footer>
  );
}

export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-panel p-6">
      <h3 className="flex items-center gap-2.5 text-lg font-extrabold">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} aria-hidden />
        {c.name}
      </h3>
      <dl className="mt-4 flex-1 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-soft">The problem</dt>
          <dd className="mt-0.5 text-muted">{c.problem}</dd>
        </div>
        <div>
          <dt className="font-semibold text-soft">What the AI does</dt>
          <dd className="mt-0.5 text-muted">{c.ai}</dd>
        </div>
        <div>
          <dt className="font-semibold text-soft">Built for you, it could be</dt>
          <dd className="mt-0.5 text-muted">{c.forYou}</dd>
        </div>
      </dl>
      <a href={c.href} className={`mt-5 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-semibold text-amber hover:underline ${focus}`}>
        Try {c.name} live <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </article>
  );
}

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="pb-20">
      <p className={eyebrow}>How it works</p>
      <h2 id="how-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
        Small first, then better together
      </h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {PROCESS.map((p, i) => (
          <li key={p.title} className="rounded-2xl border border-line bg-panel p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber/15 font-mono text-sm font-bold text-amber">{i + 1}</span>
            <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{p.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-xl border border-hairline p-4">
            <p className="font-semibold">{p.title}</p>
            <p className="mt-1 text-sm text-muted">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faqs({ faqs, heading = "Questions people ask" }: { faqs: { q: string; a: string }[]; heading?: string }) {
  return (
    <section aria-labelledby="faq-heading" className="pb-20">
      <p className={eyebrow}>FAQ</p>
      <h2 id="faq-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
        {heading}
      </h2>
      <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-semibold">{q}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ServicesSection({ heading = "Learn it, plan it, build it, keep it running" }: { heading?: string }) {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-8 pb-20">
      <p className={eyebrow}>Services</p>
      <h2 id="services-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
        {heading}
      </h2>
      <p className="mt-2 max-w-[60ch] text-muted">Start wherever you are. Every service is quoted up front for what you actually need.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((sv) => (
          <article key={sv.name} className="flex flex-col rounded-2xl border border-line bg-panel p-6">
            <h3 className="text-lg font-extrabold">{sv.name}</h3>
            <p className="mt-1.5 text-sm text-soft">{sv.tagline}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
              {sv.includes.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <QuoteButton interest={sv.interest} className={`inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-amber hover:underline ${focus}`} />
              {sv.href && (
                <Link href={sv.href} className={`rounded-md text-sm font-semibold text-soft hover:text-fg hover:underline ${focus}`}>
                  Learn more
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function IdeaSection({ defaultOrg, defaultInterest, page }: { defaultOrg?: OrgType; defaultInterest?: Interest; page: string }) {
  return (
    <section id="idea" aria-labelledby="idea-heading" className="scroll-mt-8 pb-24">
      <div className="grid gap-8 rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber">Get started</p>
          <h2 id="idea-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Ask for a quote
          </h2>
          <p className="mt-3 text-muted">Tell us what you need in your own words, and we&apos;ll email you to set up a free 20-minute call and a quote. Thinking about an app? You&apos;ll also see an instant AI sketch of a first version.</p>
        </div>
        <IdeaForm defaultOrg={defaultOrg} defaultInterest={defaultInterest} page={page} />
      </div>
    </section>
  );
}
