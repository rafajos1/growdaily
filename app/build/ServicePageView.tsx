import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { JsonLd } from "../components/JsonLd";
import { GovScorecard } from "./GovScorecard";
import { CASES, SERVICE_PAGES, type ServicePage } from "./content";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, CaseCard, eyebrow, Faqs, HowItWorks, IdeaSection, ServicesSection } from "./parts";

export const servicePage = (slug: ServicePage["slug"]) => SERVICE_PAGES.find((p) => p.slug === slug)!;

export function serviceMetadata(p: ServicePage): Metadata {
  return pageMetadata({ title: p.title, description: p.description, path: `/build/${p.slug}`, image: ogImage(p.h1, "Businesses & nonprofits · Ask for a quote") });
}

/** /build/ai-training and /build/ai-consulting. */
export function ServicePageView({ page: p }: { page: ServicePage }) {
  const path = `/build/${p.slug}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.label,
    serviceType: p.label,
    description: p.description,
    url: `${SITE_URL}${path}`,
    audience: { "@type": "Audience", audienceType: "Businesses and nonprofits" },
    provider: { "@type": "Organization", name: "GrowDaily", url: SITE_URL },
    ...(p.price ? { offers: { "@type": "Offer", price: p.price.pilot, priceCurrency: "USD", description: p.price.pilotLabel } } : {}),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI services", item: `${SITE_URL}/build` },
      { "@type": "ListItem", position: 2, name: p.label, item: `${SITE_URL}${path}` },
    ],
  };
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={service} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqSchema(p.faqs)} />
      <BuildHeader />
      <main className="mx-auto max-w-6xl">
        <section className="pb-20 pt-10 lg:pt-16">
          <p className={eyebrow}>{p.label} · businesses &amp; nonprofits</p>
          <h1 className="mt-4 max-w-[22ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">{p.h1}</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-soft">{p.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#idea" className={btnPrimary}>
              Ask for a quote <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#work" className={btnSecondary}>
              See what we&apos;ve built
            </a>
          </div>
        </section>

        <section aria-labelledby="what-heading" className="pb-20">
          <p className={eyebrow}>What&apos;s included</p>
          <h2 id="what-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Practical from the first minute
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {p.sections.map((x) => (
              <div key={x.title} className="rounded-2xl border border-line bg-panel p-6">
                <h3 className="text-lg font-bold">{x.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{x.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            <strong className="text-soft">Great for:</strong> {p.forWho.join(" · ")}
          </p>
        </section>

        {p.price && (
          <section aria-labelledby="price-heading" className="pb-20">
            <p className={eyebrow}>Pricing</p>
            <h2 id="price-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
              One clear price
            </h2>
            <div className="mt-8 grid gap-6 rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
              <div>
                <p className="text-sm font-semibold text-amber">{p.price.pilotLabel}</p>
                <p className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold tracking-tight">${p.price.pilot.toLocaleString("en-US")}</span>
                  <span className="text-lg text-muted">
                    <span className="sr-only">Regular price </span>
                    <s>${p.price.regular.toLocaleString("en-US")}</s>
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted">Per workshop, not per person.</p>
                <a href="#idea" className={`${btnPrimary} mt-6`}>
                  Claim a pilot spot <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <ul className="space-y-3 text-sm text-soft">
                {p.price.terms.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {p.slug === "ai-governance" && <GovScorecard />}

        {p.different && (
          <section aria-labelledby="diff-heading" className="pb-20">
            <p className={eyebrow}>Why GrowDaily</p>
            <h2 id="diff-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
              What makes our approach different
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {p.different.map((x) => (
                <div key={x.title} className="rounded-2xl border border-line bg-panel p-6">
                  <h3 className="text-lg font-bold">{x.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{x.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="work" aria-labelledby="work-heading" className="scroll-mt-8 pb-20">
          <p className={eyebrow}>Our work</p>
          <h2 id="work-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            We build with AI every day
          </h2>
          <p className="mt-2 max-w-[60ch] text-muted">Every app on GrowDaily is ours, so what we teach and recommend comes from real use. Try a few.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CASES.slice(0, 3).map((c) => (
              <CaseCard key={c.name} c={c} />
            ))}
          </div>
        </section>

        <ServicesSection heading="And when you're ready for more" />
        <HowItWorks />
        <Faqs faqs={p.faqs} />
        <IdeaSection defaultInterest={p.interest} page={path} />
      </main>
      <BuildFooter />
    </div>
  );
}
