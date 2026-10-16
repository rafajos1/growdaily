import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Footprints, MapPin, MessageCircleQuestion, Scale } from "lucide-react";
import { slugFor, starterBySlug, STARTERS } from "../../../../lib/faith/ask";
import { chapterLink } from "../../../../lib/faith/bible";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../../../lib/seo";
import { JsonLd } from "../../../components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return STARTERS.map((s) => ({ slug: slugFor(s.question) }));
}

const summary = (text: string) => {
  const flat = text.replace(/\n+/g, " ");
  return flat.length > 155 ? `${flat.slice(0, 152).replace(/\s\S*$/, "")}…` : flat;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = starterBySlug((await params).slug);
  if (!s) return {};
  return pageMetadata({
    title: `${s.question} An Honest Answer · GrowDaily`,
    description: summary(s.answer),
    path: `/faith/questions/${slugFor(s.question)}`,
    image: ogImage(s.question, "An honest answer, in plain words"),
  });
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = starterBySlug((await params).slug);
  if (!s) notFound();
  const path = `/faith/questions/${slugFor(s.question)}`;

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={{ ...faqSchema([{ q: s.question, a: s.answer.replace(/\n+/g, " ") }]), url: `${SITE_URL}${path}` }} />
      <header className="mx-auto flex h-20 max-w-3xl items-center">
        <Link href="/faith/questions" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          Questions
        </Link>
      </header>
      <main className="mx-auto max-w-3xl pb-24">
        <article>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">{s.question}</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-soft">
            {s.answer.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {s.differ && (
            <div className="mt-6 flex gap-3 rounded-xl border border-line bg-panel p-4 text-soft">
              <Scale className="mt-1 h-4 w-4 shrink-0 text-amber" aria-hidden />
              <p>
                <strong className="text-fg">Where Christians differ: </strong>
                {s.differ}
              </p>
            </div>
          )}
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <BookOpen className="h-5 w-5 text-amber" aria-hidden /> Read it for yourself
            </h2>
            <ul className="mt-3 space-y-2.5">
              {s.passages.map((p) => (
                <li key={p.ref}>
                  <a href={chapterLink(p)} target="_blank" rel="noopener noreferrer" className="font-semibold text-amber underline-offset-2 hover:underline">
                    {p.ref}
                  </a>
                  <span className="text-muted"> · {p.why}</span>
                </li>
              ))}
            </ul>
          </section>
          <p className="mt-8 flex gap-3 rounded-xl border border-amber/30 bg-amber/[0.06] p-4 text-soft">
            <Footprints className="mt-1 h-4 w-4 shrink-0 text-amber" aria-hidden />
            <span>
              <strong className="text-fg">A next step: </strong>
              {s.nextStep}
            </span>
          </p>
        </article>

        <section className="mt-10">
          <h2 className="text-lg font-bold">You might also ask</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {s.followUps.map((f) => (
              <li key={f}>
                <Link href={`/faith/questions/${slugFor(f)}`} className="inline-block rounded-full border border-line px-3 py-1.5 text-sm text-soft transition hover:border-amber/50 hover:text-fg">
                  {f}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link href="/faith/ask" className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-5 transition hover:border-amber/50">
            <MessageCircleQuestion className="h-5 w-5 shrink-0 text-amber" aria-hidden />
            <span className="text-sm">
              <strong className="text-fg">Ask your own question</strong>
              <span className="block text-muted">In your own words, any time.</span>
            </span>
          </Link>
          <Link href="/faith/church" className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-5 transition hover:border-amber/50">
            <MapPin className="h-5 w-5 shrink-0 text-amber" aria-hidden />
            <span className="text-sm">
              <strong className="text-fg">Find a church near you</strong>
              <span className="block text-muted">And what to expect on a first visit.</span>
            </span>
          </Link>
        </div>
        <p className="mt-10 font-mono text-xs text-dim">Written from a Christian perspective by GrowDaily. Passages link to the New Living Translation.</p>
      </main>
    </div>
  );
}
