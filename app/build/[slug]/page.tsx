import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { guideBySlug } from "../../../lib/learn";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../../lib/seo";
import type { OrgType } from "../../../lib/build/idea";
import { JsonLd } from "../../components/JsonLd";
import { AUDIENCES, audienceBySlug, caseByName, type AudienceSlug } from "../content";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, CaseCard, eyebrow, Faqs, HowItWorks, IdeaSection, ServicesSection } from "../parts";

export const dynamicParams = false;

/** Free Learn guides worth reading before a call, per audience. */
const GUIDES: Record<AudienceSlug, string[]> = {
  churches: ["how-to-use-ai-to-grow-your-church", "how-to-build-a-church-chatbot-with-claude", "church-ai-policy-template"],
  businesses: ["ai-for-small-business", "what-is-an-ai-agent", "ai-implementation-plan"],
  nonprofits: ["ai-for-nonprofits", "ai-policy-template", "how-to-train-your-team-on-ai"],
};

export function generateStaticParams() {
  return AUDIENCES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = audienceBySlug((await params).slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: `/build/${a.slug}`, image: ogImage(a.h1, "Build it yourself, with a guide · Free first call") });
}

const ORG: Record<AudienceSlug, OrgType> = { churches: "Church or ministry", businesses: "Business", nonprofits: "Nonprofit" };

export default async function AudiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = audienceBySlug((await params).slug);
  if (!a) notFound();
  const path = `/build/${a.slug}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: a.h1,
    serviceType: "Guided AI app building",
    description: a.description,
    url: `${SITE_URL}${path}`,
    audience: { "@type": "Audience", audienceType: a.label },
    provider: { "@type": "Organization", name: "GrowDaily", url: SITE_URL },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Build with a guide", item: `${SITE_URL}/build` },
      { "@type": "ListItem", position: 2, name: a.label, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={service} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqSchema(a.faqs)} />
      <BuildHeader />
      <main className="mx-auto max-w-6xl">
        <section className="pb-20 pt-10 lg:pt-16">
          <p className={eyebrow}>Build with a guide · {a.label}</p>
          <h1 className="mt-4 max-w-[22ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">{a.h1}</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-soft">{a.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#idea" className={btnPrimary}>
              Start your build <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#work" className={btnSecondary}>
              See what&apos;s possible
            </a>
          </div>
        </section>

        <section aria-labelledby="ideas-heading" className="pb-20">
          <p className={eyebrow}>What you could build</p>
          <h2 id="ideas-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Ideas for {a.label.toLowerCase()}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {a.ideas.map((i) => (
              <div key={i.title} className="rounded-2xl border border-line bg-panel p-6">
                <h3 className="text-lg font-bold">{i.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{i.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="work" aria-labelledby="work-heading" className="scroll-mt-8 pb-20">
          <p className={eyebrow}>See it working</p>
          <h2 id="work-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Real apps, built with Claude
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {a.demos.map((name) => (
              <CaseCard key={name} c={caseByName(name)} />
            ))}
          </div>
        </section>

        <section aria-labelledby="guides-heading" className="pb-20">
          <p className={eyebrow}>Free guides</p>
          <h2 id="guides-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Prefer to start on your own?
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {GUIDES[a.slug].map((slug) => {
              const g = guideBySlug(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/learn/${slug}`} className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-[#35507a]">
                    <span className="font-bold">{g.title}</span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-amber" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <ServicesSection heading={`Ways we guide ${a.label.toLowerCase()}`} />
        <HowItWorks />
        <Faqs faqs={a.faqs} />
        <IdeaSection defaultOrg={ORG[a.slug]} page={path} />
      </main>
      <BuildFooter />
    </div>
  );
}
