import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTHOR } from "../../lib/author";
import { ogImage, pageMetadata, SITE_URL } from "../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, eyebrow } from "../build/parts";
import { JsonLd } from "../components/JsonLd";

const DESCRIPTION =
  "GrowDaily is run by Rafael, a former pastor of 14 years (Manna Church, Life.Church) with 25+ years of experience leading enterprise data, analytics and AI transformation, and a passion for technology that helps people and serves faith communities.";

export const metadata: Metadata = pageMetadata({
  title: "About GrowDaily · Rafael, AI & Data Transformation Leader",
  description: DESCRIPTION,
  path: "/about",
  image: ogImage("About GrowDaily", "Technology that helps people grow"),
});

const PLAN = [
  { title: "A free 20-minute call", text: "Tell me what you need, and I'll say honestly whether AI is a good fit." },
  { title: "Your content and data first", text: "AI is only as good as your data, so we start by looking at what you have." },
  { title: "We build it together, or I build it for you", text: "Either way, you own what we make." },
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
        <p className="mt-6 text-lg leading-relaxed text-soft">
          If you lead a church, a nonprofit or a business, AI probably feels like one more thing you&apos;re expected to figure out, with no extra time and no one you&apos;re sure you can trust. I&apos;ve been there.
        </p>

        <section className="mt-12" aria-labelledby="from-heading">
          <h2 id="from-heading" className="text-2xl font-extrabold tracking-tight">
            Where I come from
          </h2>
          <p className="mt-4 leading-relaxed text-soft">
            For 14 years I served as a pastor. I started and led the first Spanish service at Manna Church in Fayetteville, North Carolina. Later I led the Church Online team at Life.Church, where more than 400 people a week said yes to following Jesus online. Those years taught me what it&apos;s like to have big needs and limited time. They also taught me that technology is at its best when it gives people time back for each other.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="bring-heading">
          <h2 id="bring-heading" className="text-2xl font-extrabold tracking-tight">
            What I bring
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-soft">
            <p>
              With 25+ years of professional experience, I specialize in leading enterprise-scale data, analytics and AI-driven transformation. Today I guide cross-functional engineering and delivery teams at an energy company. We modernize data platforms, implement AI solutions and drive digital transformation aligned with key business outcomes. My expertise includes scaled agile delivery leadership, cloud data platforms and GenAI enablement, backed by certifications from Databricks, Google, SAFe and more.
            </p>
            <p>
              Working with executives, architects and product leaders has taught me to focus on high-performing teams and measurable results through value-first product practices, with governance and quality built in. GrowDaily brings those same practices to churches, nonprofits and businesses of every size.
            </p>
          </div>
        </section>

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
            Not sure your data is ready? Start with our{" "}
            <Link href="/learn/is-your-data-ready-for-ai" className={link}>
              data readiness checklist
            </Link>
            .
          </p>
        </section>

        <section className="mt-12" aria-labelledby="drives-heading">
          <h2 id="drives-heading" className="text-2xl font-extrabold tracking-tight">
            What drives me
          </h2>
          <p className="mt-4 leading-relaxed text-soft">
            My mission is to help organizations unlock innovation through technology while upholding governance and quality, so you can spend more time on people and less on process. My faith shapes how I work: people over tools, honesty over hype, and care for the person on the other side of every screen. I&apos;m writing a book about it, <em>Wise with AI</em>.{" "}
            <Link href="/learn/what-the-bible-teaches-about-technology-and-ai" className={link}>
              Read chapter one
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Let&apos;s talk</h2>
          <p className="mt-2 max-w-[56ch] text-muted">
            Tell me what you&apos;re hoping AI could do for you. The first 20-minute call is free, or email{" "}
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
              <Link href="/" className={link}>
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
                Guided builds, training, consulting and custom AI apps
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
