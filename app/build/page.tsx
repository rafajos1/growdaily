import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { JsonLd } from "../components/JsonLd";
import { AUDIENCES, BUILD_FAQS, CASES } from "./content";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, CaseCard, eyebrow, Faqs, HowItWorks, IdeaSection } from "./parts";

const DESCRIPTION =
  "We build simple, useful AI apps and website assistants for small businesses, nonprofits and other organizations. Try seven of our AI apps live, then tell us your idea for a free call and a fixed quote.";

export const metadata: Metadata = pageMetadata({
  title: "Custom AI App Development for Small Businesses & Nonprofits · GrowDaily",
  description: DESCRIPTION,
  path: "/build",
  image: ogImage("We build simple, useful AI apps", "Try our work live, then tell us your idea"),
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GrowDaily",
  url: `${SITE_URL}/build`,
  description: DESCRIPTION,
  serviceType: "AI app development",
  knowsAbout: ["AI app development", "AI chatbots for websites", "AI assistants for churches", "AI tools for nonprofits", "Custom web apps"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI apps we build",
    itemListElement: AUDIENCES.map((a) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: a.h1, url: `${SITE_URL}/build/${a.slug}` } })),
  },
};

export default function BuildPage() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema(BUILD_FAQS)} />
      <BuildHeader />
      <main className="mx-auto max-w-6xl">
        <section className="pb-20 pt-10 lg:pt-16">
          <p className={eyebrow}>AI app development</p>
          <h1 className="mt-4 max-w-[20ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            We build simple, useful <span className="text-amber">AI apps</span>.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-soft">
            You don&apos;t have to imagine what we make. Every app on GrowDaily is our work, and you can try them right now. Then tell us what you wish an app did for your business or nonprofit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#idea" className={btnPrimary}>
              Tell us your idea <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#work" className={btnSecondary}>
              See our work
            </a>
          </div>
        </section>

        <section aria-labelledby="who-heading" className="pb-20">
          <p className={eyebrow}>Who we build for</p>
          <h2 id="who-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Small teams with big jobs to do
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <Link key={a.slug} href={`/build/${a.slug}`} className="group rounded-2xl border border-line bg-panel p-6 transition hover:border-[#35507a]">
                <h3 className="text-lg font-bold">{a.label}</h3>
                <p className="mt-1.5 text-sm text-muted">{a.short}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber group-hover:underline">
                  Ideas for {a.label.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="work" aria-labelledby="work-heading" className="scroll-mt-8 pb-20">
          <p className={eyebrow}>Our work</p>
          <h2 id="work-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Seven AI apps you can try right now
          </h2>
          <p className="mt-2 max-w-[60ch] text-muted">Each one does one job well, works on any phone, and is free to use. Here&apos;s the problem each solves, and what the same idea could do for you.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CASES.map((c) => (
              <CaseCard key={c.name} c={c} />
            ))}
          </div>
        </section>

        <HowItWorks />
        <Faqs faqs={BUILD_FAQS} />
        <IdeaSection page="/build" />
      </main>
      <BuildFooter />
    </div>
  );
}
