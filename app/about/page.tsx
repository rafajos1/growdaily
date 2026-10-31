import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTHOR } from "../../lib/author";
import { ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, eyebrow } from "../build/parts";
import { JsonLd } from "../components/JsonLd";

const DESCRIPTION =
  "GrowDaily is run by Rafael, who has 25+ years of experience leading enterprise data, analytics and AI transformation, and 14 years of serving large, global, mission-driven nonprofit organizations.";

export const metadata: Metadata = pageMetadata({
  title: "About GrowDaily · Rafael, AI & Data Transformation Leader",
  description: DESCRIPTION,
  path: "/about",
  image: ogImage("About GrowDaily", "Technology that helps people grow"),
});

const PLAN = [
  { title: "A free 20-minute call", text: "Tell me how your team uses AI today, and I'll say honestly what needs attention." },
  { title: "See what's really in use", text: "We list every AI tool your people use and the information that goes into it." },
  { title: "Clear rules, a trained team", text: "A tailored AI policy, practical training and a briefing for your leaders. When you're ready to build, we do that too." },
];

const link = "font-semibold text-amber underline-offset-2 hover:underline";

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
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-soft">
          <p>
            With over 25 years of professional experience, I specialize in leading enterprise-scale data, analytics and AI-driven transformation initiatives. At an energy company, I guide cross-functional engineering and delivery teams to modernize data platforms, implement AI solutions and drive digital transformation aligned with key business outcomes. My expertise includes scaled agile delivery leadership, cloud data platforms and GenAI enablement, supported by certifications from Databricks, Google, SAFe and more.
          </p>
          <p>
            I&apos;ve also spent 14 years serving large, mission-driven nonprofit organizations with a global reach, leading cross-cultural teams that served people around the world. I&apos;m fluent in English and Spanish, and I know the realities of mission-driven work: big goals, tight budgets and people at the center of everything.
          </p>
          <p>
            I also know how to reach people online. I built a growth and productivity community on Instagram from the ground up, from zero to 205,000 followers.
          </p>
          <p>
            By collaborating with executives, architects and product leaders, I focus on fostering high-performing teams and delivering measurable results through value-first product practices. My mission is to empower organizations, from enterprises to churches and nonprofits, to unlock innovation through cutting-edge technology while upholding governance and quality.
          </p>
          <p>I believe technology is at its best when it gives people time back for each other.</p>
        </div>

        <section className="mt-12" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-extrabold tracking-tight">
            How we&apos;ll work together
          </h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {PLAN.map((p, i) => (
              <li key={p.title} className="rounded-2xl border border-line bg-panel p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/15 font-mono text-sm font-bold text-amber">{i + 1}</span>
                <p className="mt-3 font-bold text-fg">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Want to start on your own? Try the{" "}
            <Link href="/apps/governwise" className={link}>
              free AI governance kit
            </Link>{" "}
            or read{" "}
            <Link href="/learn/what-is-ai-governance" className={link}>
              what AI governance is
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Let&apos;s talk</h2>
          <p className="mt-2 max-w-[56ch] text-muted">
            Tell me how your team uses AI today and what you&apos;re hoping it could do. The first 20-minute call is free, or email{" "}
            <a href="mailto:hello@growdaily.ai" className={link}>
              hello@growdaily.ai
            </a>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/build#idea" className={btnPrimary}>
              Book a free 20-minute call <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/learn" className={btnSecondary}>
              Read the free guides
            </Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="text-lg font-bold">
            Explore GrowDaily
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-soft marker:text-amber">
            <li>
              <Link href="/build/ai-governance" className={link}>
                AI governance
              </Link>{" "}
              for businesses and nonprofits, with a{" "}
              <Link href="/apps/governwise" className={link}>
                free AI governance kit
              </Link>
              .
            </li>
            <li>
              <Link href="/apps/habitwise" className={link}>
                Free apps
              </Link>{" "}
              for money, habits, time, meals and mood, private by default.
            </li>
            <li>
              <Link href="/learn" className={link}>
                Plain-English guides
              </Link>{" "}
              to using AI well, grounded in facts, with no hype.
            </li>
            <li>
              <Link href="/faith" className={link}>
                Faith tools
              </Link>{" "}
              for honest questions about God and finding a church nearby.
            </li>
            <li>
              <Link href="/build" className={link}>
                Training, consulting, guided builds and custom AI apps
              </Link>{" "}
              for churches, nonprofits and businesses.
            </li>
          </ul>
        </section>
      </main>
      <BuildFooter />
    </div>
  );
}
