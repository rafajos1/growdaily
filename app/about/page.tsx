import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTHOR } from "../../lib/author";
import { ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, eyebrow } from "../build/parts";
import { JsonLd } from "../components/JsonLd";

const DESCRIPTION =
  "GrowDaily is run by Rafael, who has 25+ years of experience leading enterprise data, analytics and AI transformation, and a passion for technology that helps people and serves faith communities.";

export const metadata: Metadata = pageMetadata({
  title: "About GrowDaily · Rafael, AI & Data Transformation Leader",
  description: DESCRIPTION,
  path: "/about",
  image: ogImage("About GrowDaily", "Technology that helps people grow"),
});

const EXPERIENCE = [
  "25+ years of professional experience, leading enterprise-scale data, analytics and AI transformation.",
  "Guiding cross-functional engineering and delivery teams to modernize data platforms and put AI solutions into real use.",
  "Scaled agile delivery, cloud data platforms and generative AI enablement.",
  "Certifications from Databricks, Google and SAFe, among others.",
];

const PRINCIPLES = [
  { title: "Value first", text: "Start with the outcome that matters to you, and build the smallest thing that delivers it." },
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
          Hi, I&apos;m <span className="text-amber">Rafael</span>.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-soft">
          I started GrowDaily because I have a passion for equipping people with technology that makes their lives better. I&apos;m especially drawn to where technology and faith meet: helping churches, ministries and people exploring faith use new tools wisely, without losing what matters most.
        </p>

        <section className="mt-12" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="text-2xl font-extrabold tracking-tight">
            My background
          </h2>
          <p className="mt-4 leading-relaxed text-soft">
            By day, I lead enterprise data and AI transformation at an energy company, working alongside executives, architects and product leaders to build high-performing teams and deliver measurable results.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-soft marker:text-amber">
            {EXPERIENCE.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-extrabold tracking-tight">
            Why GrowDaily
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-soft">
            <p>
              Big companies have whole teams to figure out AI. Most people and organizations don&apos;t. GrowDaily brings the same practices I use at enterprise scale to everyday life and to organizations of every size.
            </p>
            <p>
              One lesson from 25 years of data and analytics work: AI is only as good as your data. Before anything gets built, we look at what you have, and we&apos;ll tell you honestly if it isn&apos;t ready yet. Our{" "}
              <Link href="/learn/is-your-data-ready-for-ai" className="font-semibold text-amber underline-offset-2 hover:underline">
                data readiness checklist
              </Link>{" "}
              is a good place to start.
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-amber">
              <li>
                <Link href="/" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Free apps
                </Link>{" "}
                for money, habits, time, meals and mood, private by default.
              </li>
              <li>
                <Link href="/learn" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Plain-English guides
                </Link>{" "}
                to using AI at work, grounded in facts, with no hype.
              </li>
              <li>
                <Link href="/faith" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Faith tools
                </Link>{" "}
                for honest questions about God and finding a church nearby.
              </li>
              <li>
                <Link href="/build" className="font-semibold text-amber underline-offset-2 hover:underline">
                  Training, consulting and custom AI apps
                </Link>{" "}
                for businesses, nonprofits and churches.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-extrabold tracking-tight">
            How I work
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
          <h2 className="text-2xl font-extrabold tracking-tight">Let&apos;s talk</h2>
          <p className="mt-2 max-w-[56ch] text-muted">
            Have an idea for an AI app, or want your team trained? Ask for a free quote, or email{" "}
            <a href="mailto:hello@growdaily.ai" className="font-semibold text-amber underline-offset-2 hover:underline">
              hello@growdaily.ai
            </a>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/build#idea" className={btnPrimary}>
              Ask for a quote <ArrowRight className="h-4 w-4" aria-hidden />
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
