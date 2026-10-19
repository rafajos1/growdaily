import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lightbulb } from "lucide-react";
import { GUIDES, guideBySlug, TOPICS, type Block, type Guide, type Service } from "../../../lib/learn";
import { AUTHOR } from "../../../lib/author";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, eyebrow } from "../../build/parts";
import { JsonLd } from "../../components/JsonLd";
import { CopyButton } from "../CopyButton";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  const meta = pageMetadata({ title: `${g.seoTitle} · GrowDaily`, description: g.description, path: `/learn/${g.slug}`, image: ogImage(g.title, "A plain-English guide from GrowDaily") });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: g.published, modifiedTime: g.updated } };
}

const CTA: Record<Service, { title: string; text: string; href: string; label: string }> = {
  "ai-training": { title: "Want your team trained on this?", text: "Hands-on AI training for your staff or volunteers, live or on Zoom, using your own real work.", href: "/build/ai-training", label: "About AI training" },
  "ai-consulting": { title: "Want help choosing where to start?", text: "We'll find where AI saves your team the most time and give you a clear, one-page plan.", href: "/build/ai-consulting", label: "About AI consulting" },
  build: { title: "Want this built for you?", text: "We build focused AI assistants and agents for your organization, quoted up front, and you own them.", href: "/build#idea", label: "Ask for a quote" },
};

const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function wordsIn(g: Guide): number {
  const text = [g.shortAnswer, ...g.sections.flatMap((s) => s.blocks.map((b) => JSON.stringify(b))), ...g.faqs.map((f) => f.a)].join(" ");
  return text.split(/\s+/).length;
}

/** Renders text with inline [label](href) links: internal paths stay in the site, others open in a new tab. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (!m) return part;
        const [, label, href] = m;
        const cls = "font-semibold text-amber underline-offset-2 hover:underline";
        return href.startsWith("/") ? (
          <Link key={i} href={href} className={cls}>
            {label}
          </Link>
        ) : (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {label}
          </a>
        );
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === "string")
    return (
      <p>
        <Rich text={block} />
      </p>
    );
  if ("list" in block)
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-amber">
        {block.list.map((item) => (
          <li key={item}>
            <Rich text={item} />
          </li>
        ))}
      </ul>
    );
  if ("steps" in block)
    return (
      <ol className="space-y-4">
        {block.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/15 font-mono text-sm font-bold text-amber" aria-hidden>
              {i + 1}
            </span>
            <span>
              <strong className="block text-fg">{step.title}</strong>
              <Rich text={step.text} />
            </span>
          </li>
        ))}
      </ol>
    );
  if ("callout" in block)
    return (
      <p className="flex gap-3 rounded-xl border border-amber/30 bg-amber/[0.06] p-4">
        <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-amber" aria-hidden />
        <span>
          <Rich text={block.callout} />
        </span>
      </p>
    );
  if ("code" in block)
    return (
      <figure className="overflow-hidden rounded-2xl border border-line">
        <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-raised px-4 py-3">
          <span className="font-mono text-sm font-semibold text-fg">{block.code.title}</span>
          <CopyButton text={block.code.text} label="Copy code" />
        </figcaption>
        <pre className="max-h-[32rem] overflow-auto bg-sunken p-4 font-mono text-[13px] leading-relaxed text-soft">
          <code>{block.code.text}</code>
        </pre>
      </figure>
    );
  return (
    <figure className="overflow-hidden rounded-2xl border border-line">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-raised px-4 py-3">
        <span className="font-semibold text-fg">{block.template.title}</span>
        <CopyButton text={block.template.text} />
      </figcaption>
      <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap bg-sunken p-4 font-mono text-sm leading-relaxed text-soft">{block.template.text}</pre>
    </figure>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const path = `/learn/${g.slug}`;
  const topic = TOPICS.find((t) => t.id === g.topic)!;
  const cta = CTA[g.service];
  const minutes = Math.max(2, Math.round(wordsIn(g) / 220));

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.published,
    dateModified: g.updated,
    mainEntityOfPage: `${SITE_URL}${path}`,
    image: `${SITE_URL}${ogImage(g.title, "A plain-English guide from GrowDaily")}`,
    author: AUTHOR.schema,
    publisher: { "@type": "Organization", name: "GrowDaily", url: SITE_URL },
    about: topic.title,
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Learn", item: `${SITE_URL}/learn` },
      { "@type": "ListItem", position: 2, name: topic.title, item: `${SITE_URL}/learn#${topic.id}` },
      { "@type": "ListItem", position: 3, name: g.title, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={article} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqSchema(g.faqs)} />
      <BuildHeader />
      <main className="mx-auto max-w-3xl pb-20">
        <nav aria-label="Breadcrumb" className="pt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
          <Link href="/learn" className="hover:text-fg">
            Learn
          </Link>
          <span aria-hidden> / </span>
          <Link href={`/learn#${topic.id}`} className="hover:text-fg">
            {topic.title}
          </Link>
        </nav>
        <article>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">{g.title}</h1>
          <p className="mt-4 text-sm text-muted">
            By{" "}
            <Link href={AUTHOR.path} className="font-semibold text-soft underline-offset-2 hover:text-fg hover:underline">
              {AUTHOR.name}
            </Link>{" "}
            · Updated <time dateTime={g.updated}>{longDate(g.updated)}</time> · {minutes} min read
          </p>

          <div className="mt-8 rounded-2xl border border-amber/30 bg-amber/[0.06] p-5 sm:p-6">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber">The short answer</p>
            <p className="mt-2 text-lg leading-relaxed text-fg">{g.shortAnswer}</p>
          </div>

          <nav aria-labelledby="toc-heading" className="mt-8 rounded-2xl border border-line bg-panel p-5">
            <p id="toc-heading" className={eyebrow}>
              In this guide
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {g.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${anchor(s.heading)}`} className="text-soft hover:text-amber">
                    {s.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-soft hover:text-amber">
                  Common questions
                </a>
              </li>
            </ol>
          </nav>

          {g.sections.map((s) => (
            <section key={s.heading} id={anchor(s.heading)} className="mt-10 scroll-mt-6">
              <h2 className="text-2xl font-extrabold tracking-tight">{s.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-soft">
                {s.blocks.map((b, i) => (
                  <BlockView key={i} block={b} />
                ))}
              </div>
            </section>
          ))}

          <section id="faq" className="mt-12 scroll-mt-6" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight">
              Common questions
            </h2>
            <dl className="mt-5 space-y-5">
              {g.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-fg">{f.q}</dt>
                  <dd className="mt-1 leading-relaxed text-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>

        <aside className="mt-12 rounded-2xl border border-line bg-panel p-6">
          <p className="text-lg font-extrabold">{cta.title}</p>
          <p className="mt-1 text-soft">{cta.text}</p>
          <Link href={cta.href} className={`${btnPrimary} mt-4`}>
            {cta.label} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </aside>

        <section className="mt-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-bold">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {g.related.map((slug) => {
              const r = guideBySlug(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/learn/${slug}`} className="block h-full rounded-xl border border-line p-4 transition hover:border-amber/50">
                    <span className="font-semibold text-fg">{r.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {g.sources && g.sources.length > 0 && (
          <section className="mt-10 border-t border-hairline pt-6 text-sm text-muted" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="font-semibold text-soft">
              Sources
            </h2>
            <ul className="mt-2 space-y-1">
              {g.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <BuildFooter />
    </div>
  );
}
