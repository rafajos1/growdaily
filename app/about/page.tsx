import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTHOR } from "../../lib/author";
import { ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, eyebrow } from "../build/parts";
import { JsonLd } from "../components/JsonLd";

const DESCRIPTION =
  "GrowDaily is run by Rafael, a guide for non-technical builders. He brings 25+ years leading enterprise data, analytics and AI transformation to people who want to build their own AI tools.";

export const metadata: Metadata = pageMetadata({
  title: "About GrowDaily · Rafael, Your Guide to Building with AI",
  description: DESCRIPTION,
  path: "/about",
  image: ogImage("About GrowDaily", "You're the builder. I'm the guide."),
});

const EXPERIENCE = [
  "25+ years of professional experience, leading enterprise-scale data, analytics and AI transformation.",
  "In consulting, led teams of engineers, architects, and product and project managers to take complex data modernization and AI projects from requirements (PRD) to live in production, for small and large well-known organizations across the US.",
  "Scaled agile delivery, cloud data platforms and generative AI enablement.",
];

const CREDENTIALS = [
  "IBM AI Product Manager Specialization",
  "Databricks Certified Generative AI Engineer Associate",
  "Databricks Certified Data Engineer Associate",
  "Azure Databricks Platform Architect (Databricks Academy)",
  "Google Cloud Gemini for Application Developers",
  "Google Cloud Digital Leader",
  "Google Cloud Cybersecurity Certificate",
  "Certified SAFe® 6 Agilist",
  "Professional Scrum Master™ I (PSM I)",
  "EQ-i 2.0 / EQ 360 Certified Coach",
  "AI governance and AI security (LinkedIn Learning)",
];

const PRINCIPLES = [
  { title: "Your goal first", text: "We start with the outcome that matters to you, and you build the smallest thing that delivers it." },
  { title: "Governance and quality", text: "Clear guardrails, careful testing and honest limits, so AI earns trust instead of creating risk." },
  { title: "People over tools", text: "Technology should give people time back for each other, not replace the human parts of the work." },
];

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About GrowDaily",
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
    mainEntity: { "@type": "Organization", name: "GrowDaily", url: SITE_URL, founder: AUTHOR.schema },
  };

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={schema} />
      <BuildHeader />
      <main className="mx-auto max-w-3xl pb-20">
        <p className={`${eyebrow} pt-8`}>About</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          Hi, I&apos;m <span className="text-amber">Rafael</span>. I help people build their own AI apps.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-soft">
          I started GrowDaily because I keep meeting capable people with a clear idea for a tool that would make their work easier, who stop because they don&apos;t think of themselves as technical. You don&apos;t need to be a developer to build it. You need someone who&apos;s been there to show you the way. You&apos;re the builder; I want to be your guide. I&apos;m especially drawn to where technology and faith meet: helping churches, ministries and people exploring faith use new tools wisely, without losing what matters most.
        </p>

        <section className="mt-12" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="text-2xl font-extrabold tracking-tight">
            Why you can trust your guide
          </h2>
          <p className="mt-4 leading-relaxed text-soft">
            By day, I lead enterprise data and AI transformation at an energy company, working alongside executives, architects and product leaders to build high-performing teams and deliver measurable results.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-soft marker:text-amber">
            {EXPERIENCE.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-soft">
            Now I bring that same discipline to you, sized for one person or a small team: a clear first version, careful testing, and a path from idea to something you actually use.
          </p>
          <h3 className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">Credentials</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CREDENTIALS.map((c) => (
              <li key={c} className="rounded-full border border-line bg-panel px-3 py-1.5 text-sm font-semibold text-soft">
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-extrabold tracking-tight">
            Why GrowDaily
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-soft">
            <p>
              Big companies have whole teams to figure out AI. Most small businesses, nonprofits and churches don&apos;t. GrowDaily brings the same practices I use at enterprise scale to you, so you can build the tools you need yourself instead of waiting on a developer.
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-amber">
              <li>
                <Link href="/" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Example apps
                </Link>{" "}
                built with Claude, free to try, so you can see what&apos;s possible.
              </li>
              <li>
                <Link href="/learn" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Plain-English guides
                </Link>{" "}
                to using and building with AI, grounded in facts, with no hype.
              </li>
              <li>
                <Link href="/faith" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Faith tools
                </Link>{" "}
                for honest questions about God and finding a church nearby.
              </li>
              <li>
                <Link href="/build" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Guided builds, training and custom apps
                </Link>{" "}
                for businesses, nonprofits and churches.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-extrabold tracking-tight">
            How I guide
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="rounded-2xl border border-line bg-panel p-5">
                <p className="font-bold text-fg">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">What do you want to build?</h2>
          <p className="mt-2 max-w-[56ch] text-muted">
            Tell me your idea and we&apos;ll set up a free 20-minute call. Or email{" "}
            <a href="mailto:hello@growdaily.ai" className="font-semibold text-amber underline-offset-2 hover:underline">
              hello@growdaily.ai
            </a>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/build#idea" className={btnPrimary}>
              Start your build <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/learn" className={btnSecondary}>
              Read the free guides
            </Link>
          </div>
        </section>
      </main>
      <BuildFooter />
    </div>
  );
}
