import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTHOR } from "../../lib/author";
import { ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, eyebrow } from "../build/parts";
import { JsonLd } from "../components/JsonLd";

const DESCRIPTION =
  "GrowDaily helps businesses and nonprofits use AI with confidence. It's run by Rafael, who brings 25+ years of data, analytics and AI leadership in large organizations.";

export const metadata: Metadata = pageMetadata({
  title: "About GrowDaily · Rafael, AI Governance & Data Leader",
  description: DESCRIPTION,
  path: "/about",
  image: ogImage("About GrowDaily", "AI with confidence, people at the center"),
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
            I help businesses and nonprofits, including churches, use AI with confidence: knowing which AI tools their people use, setting clear rules for them, and keeping a person responsible for the results.
          </p>
          <p>
            My background is in governance. For more than 25 years I&apos;ve led data, analytics and AI work in large organizations: modernizing data platforms, launching AI products, moving AI from pilots into everyday use, and putting in place the governance that makes it safe to grow.
          </p>
          <p>
            I started GrowDaily because the pressure to launch AI fast is real, and so are the consequences of launching without proper governance: private information exposed, confident wrong answers, and trust that&apos;s hard to win back. AI-powered scams, attacks and data breaches are rising too, and most organizations don&apos;t yet know which AI tools their people use or what information goes into them.
          </p>
          <p>
            Your AI is only as good as your data, and only as safe as the rules around it. I want to help you launch AI without regret. My approach is practical and plain-English: a list of what&apos;s really in use, a short policy people will actually follow, training on real work, and a one-page summary for your leaders.
          </p>
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
