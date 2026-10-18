import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { JsonLd } from "../components/JsonLd";
import { CASES, SERVICE_PAGES, type ServicePage } from "./content";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, CaseCard, eyebrow, Faqs, HowItWorks, IdeaSection, ServicesSection } from "./parts";

export const servicePage = (slug: ServicePage["slug"]) => SERVICE_PAGES.find((p) => p.slug === slug)!;

export function serviceMetadata(p: ServicePage): Metadata {
  return pageMetadata({ title: p.title, description: p.description, path: `/build/${p.slug}`, image: ogImage(p.h1, "Small businesses & nonprofits · Ask for a quote") });
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
    audience: { "@type": "Audience", audienceType: "Small businesses and nonprofits" },
    provider: { "@type": "Organization", name: "GrowDaily", url: SITE_URL },
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
          <p className={eyebrow}>{p.label} · small businesses &amp; nonprofits</p>
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
