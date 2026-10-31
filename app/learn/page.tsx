import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES, guideBySlug, guidesIn, TOPICS } from "../../lib/learn";
import { ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, eyebrow } from "../build/parts";
import { JsonLd } from "../components/JsonLd";

const DESCRIPTION =
  "Free, plain-English guides to AI governance and using AI at work: AI policies, AI registers, shadow AI, board briefings, data privacy, AI agents and team training, for businesses, nonprofits and churches.";

export const metadata: Metadata = pageMetadata({
  title: "Learn AI Governance & AI at Work: Free Guides · GrowDaily",
  description: DESCRIPTION,
  path: "/learn",
  image: ogImage("Learn AI governance and AI at work", "Free plain-English guides: governance, policies, training"),
});

const START_HERE = ["what-is-ai-governance", "ai-policy-template", "what-is-shadow-ai"];

export default function LearnPage() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn AI at work",
    description: DESCRIPTION,
    url: `${SITE_URL}/learn`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/learn/${g.slug}`, name: g.title })),
    },
  };

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={collection} />
      <BuildHeader />
      <main className="mx-auto max-w-6xl">
        <section className="pb-14 pt-10 lg:pt-16">
          <p className={eyebrow}>Free guides</p>
          <h1 className="mt-4 max-w-[18ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            Use <span className="text-amber">AI at work</span>, safely.
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-soft">
            Plain-English answers to what teams are asking right now: how to govern AI, which tools are safe, how to write a policy, what AI agents really are, and where to start. Written for businesses, nonprofits and churches, with no hype. Want it organized for you? Try <a href="/apps/governwise" className="underline underline-offset-2 hover:text-fg">the free AI governance kit</a>. Plus simple, research-backed guides for <a href="#everyday" className="underline underline-offset-2 hover:text-fg">everyday life</a>.
          </p>
        </section>

        <section aria-labelledby="start-heading" className="pb-16">
          <h2 id="start-heading" className={eyebrow}>
            Start here
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {START_HERE.map((slug) => {
              const g = guideBySlug(slug)!;
              return (
                <Link key={slug} href={`/learn/${slug}`} className="group flex flex-col rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 transition hover:border-amber/60">
                  <span className="text-lg font-extrabold leading-snug">{g.title}</span>
                  <span className="mt-2 flex-1 text-sm text-muted">{g.description}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber group-hover:underline">
                    Read the guide <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {TOPICS.map((t) => (
          <section key={t.id} id={t.id} aria-labelledby={`${t.id}-heading`} className="scroll-mt-8 pb-14">
            <h2 id={`${t.id}-heading`} className="text-3xl font-extrabold tracking-tight">
              {t.title}
            </h2>
            <p className="mt-1 text-muted">{t.blurb}</p>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {guidesIn(t.id).map((g) => (
                <li key={g.slug}>
                  <Link href={`/learn/${g.slug}`} className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-[#35507a]">
                    <span>
                      <span className="block font-bold">{g.title}</span>
                      <span className="mt-1 block text-sm text-muted">{g.shortAnswer.split(/(?<=[.!?])\s/)[0]}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-amber" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="pb-24">
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight">Rather have someone walk your team through it?</h2>
            <p className="mt-2 max-w-[60ch] text-muted">We run hands-on AI training, build simple AI plans, and set up AI agents for businesses, nonprofits and churches.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/build/ai-training" className={btnPrimary}>
                AI training <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/build#services" className="inline-flex min-h-12 items-center rounded-[10px] border border-line bg-raised px-5 font-semibold hover:bg-[#24364f]">
                All services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BuildFooter />
    </div>
  );
}
