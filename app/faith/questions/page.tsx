import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircleQuestion } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { slugFor, STARTERS } from "../../../lib/faith/ask";
import { faqSchema, pageMetadata } from "../../../lib/seo";
import { JsonLd } from "../../components/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Common Questions About God, Answered Honestly · GrowDaily",
  description: "Is God real? Why is there suffering? Who was Jesus? Honest, plain-language answers to the questions people ask most, with Bible passages to read for yourself.",
  path: "/faith/questions",
});

const firstSentence = (text: string) => text.split(/(?<=[.?!])\s/)[0];

export default function QuestionsPage() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={faqSchema(STARTERS.map((s) => ({ q: s.question, a: s.answer.replace(/\n+/g, " ") })))} />
      <header className="mx-auto flex h-20 max-w-3xl items-center justify-between">
        <Link href="/faith" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          Faith
        </Link>
        <HomeLink />
      </header>
      <main className="mx-auto max-w-3xl pb-24">
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          Common questions about <span className="text-amber">God</span>, answered honestly.
        </h1>
        <p className="mt-4 max-w-[56ch] text-lg text-soft">Plain-language answers to the questions people ask most, with passages to read for yourself. Doubts welcome.</p>
        <ul className="mt-8 space-y-3">
          {STARTERS.map((s) => (
            <li key={s.question}>
              <Link href={`/faith/questions/${slugFor(s.question)}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-amber/50">
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold">{s.question}</span>
                  <span className="mt-1 block text-sm text-muted">{firstSentence(s.answer)}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-amber" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/faith/ask" className="mt-8 flex items-center gap-3 rounded-2xl border border-amber/30 bg-amber/[0.06] p-5 transition hover:border-amber/60">
          <MessageCircleQuestion className="h-5 w-5 shrink-0 text-amber" aria-hidden />
          <span className="flex-1 text-sm">
            <strong className="text-fg">Have a different question?</strong> <span className="text-soft">Ask it in your own words.</span>
          </span>
        </Link>
      </main>
    </div>
  );
}
