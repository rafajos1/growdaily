import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { JsonLd } from "../components/JsonLd";
import { AUDIENCES, BUILD_FAQS, CASES, SERVICES } from "./content";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, CaseCard, eyebrow, Faqs, HowItWorks, IdeaSection, ServicesSection } from "./parts";

const DESCRIPTION =
  "AI training, consulting and custom AI apps for businesses of any size and nonprofits. Try seven of our AI apps live, then ask for a quote: team workshops, an AI plan, a custom app, or ongoing care.";

export const metadata: Metadata = pageMetadata({
  title: "AI Training, Consulting & App Development for Businesses & Nonprofits · GrowDaily",
  description: DESCRIPTION,
  path: "/build",
  image: ogImage("We help teams put AI to work", "Training · Consulting · Custom AI apps"),
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GrowDaily",
  url: `${SITE_URL}/build`,
  description: DESCRIPTION,
  serviceType: ["AI training", "AI consulting", "AI app development", "AI app maintenance"],
  knowsAbout: ["AI training for teams", "AI consulting", "AI app development", "AI chatbots for websites", "AI tools for nonprofits", "Custom web apps"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: SERVICES.map((sv) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: sv.name, description: sv.tagline, ...(sv.href ? { url: `${SITE_URL}${sv.href}` } : {}) } })),
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
          <p className={eyebrow}>AI training · consulting · custom apps</p>
          <h1 className="mt-4 max-w-[20ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            We help teams put <span className="text-amber">AI</span> to work.
          </h1>
          <p className="mt-6 max-w-[54ch] text-lg text-soft">
            Training for your team, a plain-English AI plan, custom AI apps, and care to keep them running. You don&apos;t have to imagine what we make: every app on GrowDaily is our work, and you can try them right now.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#idea" className={btnPrimary}>
              Ask for a quote <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#work" className={btnSecondary}>
              See our work
            </a>
          </div>
        </section>

        <ServicesSection />

        <section aria-labelledby="who-heading" className="pb-20">
          <p className={eyebrow}>Who we build for</p>
          <h2 id="who-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Teams of any size, one clear job at a time
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

        <section aria-labelledby="me-heading" className="pb-20">
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <p className={eyebrow}>Who you&apos;ll work with</p>
            <h2 id="me-heading" className="mt-2 text-2xl font-extrabold tracking-tight">
              Rafael, founder of GrowDaily
            </h2>
            <p className="mt-2 max-w-[62ch] text-muted">
              25+ years leading enterprise data, analytics and AI transformation, now bringing the same practices to businesses, nonprofits and churches of every size: value first, with governance and quality built in.
            </p>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
              More about me <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
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
