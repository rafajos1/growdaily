"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, ChevronDown, Church, HeartHandshake, Quote, Send, ShieldCheck } from "lucide-react";
import { MAX_QUESTION, STARTERS, type ChurchAnswer } from "../../../lib/church-demo/ask";
import { CHURCH_NAME, LIBRARY } from "../../../lib/church-demo/library";
import { btnPrimary, btnSecondary, eyebrow } from "../../build/parts";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const chip = `rounded-full border border-line px-3 py-1.5 text-left text-sm text-soft transition hover:border-amber/50 hover:text-fg disabled:opacity-60 ${focus}`;
const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function ChurchAssistantDemo() {
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<ChurchAnswer[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const reveal = () => requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  const ask = async (q: string) => {
    const text = q.replace(/\s+/g, " ").trim();
    if (text.length < 3 || pending) return;
    setPending(text);
    setError(null);
    setQuestion("");
    reveal();
    try {
      const res = await fetch("/api/church-demo/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: text }) });
      const body = (await res.json().catch(() => ({}))) as { answer?: ChurchAnswer; error?: string };
      if (!res.ok || !body.answer) throw new Error(body.error || "We couldn't answer that right now. Please try again in a moment.");
      setAnswers((a) => [body.answer!, ...a].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setQuestion(text);
    } finally {
      setPending(null);
      reveal();
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(question);
  };

  return (
    <main className="mx-auto max-w-3xl pb-20">
      <section className="pt-6 sm:pt-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-xs text-amber">
          <Church className="h-3.5 w-3.5" aria-hidden /> Church assistant demo
        </p>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          Ask <span className="text-amber">{CHURCH_NAME}</span> anything.
        </h1>
        <p className="mt-4 max-w-[56ch] text-lg text-soft">Every answer comes only from this church&apos;s own sermons and pages, with the source shown. If it isn&apos;t in the library, it won&apos;t guess.</p>

        <form onSubmit={submit} className="mt-7 rounded-2xl border border-amber/30 bg-panel p-3 shadow-xl shadow-black/30 sm:p-4">
          <label htmlFor="church-q" className="sr-only">
            Your question
          </label>
          <textarea
            id="church-q"
            value={question}
            maxLength={MAX_QUESTION}
            rows={3}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(question);
              }
            }}
            placeholder="e.g. What happens with my kids on Sunday?"
            className="block w-full resize-none rounded-xl bg-transparent px-2 py-1.5 text-lg text-fg placeholder:text-dim focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-hairline pt-3">
            <p className="pl-2 font-mono text-[11px] text-dim">
              Answers only from {CHURCH_NAME}&apos;s library · {question.length}/{MAX_QUESTION}
            </p>
            <button type="submit" disabled={!!pending || question.trim().length < 3} className={`${btnPrimary} shrink-0 disabled:opacity-60`}>
              <Send className="h-4 w-4" aria-hidden /> Ask
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Try a question it can answer, and one it can&apos;t</p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Example questions">
            {STARTERS.map((s) => (
              <button key={s} type="button" disabled={!!pending} onClick={() => void ask(s)} className={chip}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div ref={resultRef} className="scroll-mt-6 space-y-5 pt-8" aria-live="polite">
        {pending && (
          <section className="rounded-2xl border border-line bg-panel p-6" aria-busy="true" aria-label="Searching the church's library">
            <p className="text-lg font-bold">{pending}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber" aria-hidden /> Searching the church&apos;s library…
            </p>
            <div className="mt-4 space-y-2.5">
              {[92, 84, 70].map((w) => (
                <div key={w} className="h-3.5 animate-pulse rounded bg-raised" style={{ width: `${w}%` }} />
              ))}
            </div>
          </section>
        )}
        {error && (
          <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm font-semibold text-up">
            {error}
          </p>
        )}
        {answers.map((a, i) => (
          <AnswerCard key={`${a.question}-${answers.length - i}`} answer={a} />
        ))}
      </div>

      <p className="mt-6 font-mono text-xs text-dim">{CHURCH_NAME} is a made-up church with a small sample library, built to show how this works.</p>

      <section aria-labelledby="why-heading" className="mt-14">
        <p className={eyebrow}>Why pastors trust it</p>
        <h2 id="why-heading" className="mt-2 text-2xl font-extrabold tracking-tight">
          It speaks only from the church&apos;s own teaching
        </h2>
        <p className="mt-2 max-w-[62ch] text-muted">A pastor put it simply: he&apos;d invite his church to use AI only if it answered from the church&apos;s own teaching. So that&apos;s all this does.</p>
        <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          {[
            ["Only your library", "Sermons, beliefs and church information you choose. Nothing from the wider internet."],
            ["A source for every answer", "Each answer quotes the sermon or page it came from, checked word for word."],
            ["No guessing", "If the library doesn't cover it, it says so and points to a pastor."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-xl border border-line bg-panel p-4">
              <p className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-amber" aria-hidden /> {t}
              </p>
              <p className="mt-1 text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <details className="group mt-5 rounded-2xl border border-line bg-panel">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 font-bold">
            <BookOpen className="h-4 w-4 text-amber" aria-hidden /> See everything it can answer from ({LIBRARY.length} documents)
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
        </summary>
        <ul className="divide-y divide-hairline border-t border-hairline">
          {LIBRARY.map((d) => (
            <li key={d.id} className="p-5">
              <p className="font-semibold">
                {d.title}{" "}
                <span className="font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-muted">
                  {d.kind}
                  {d.date ? ` · ${shortDate(d.date)}` : ""}
                </span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d.text}</p>
            </li>
          ))}
        </ul>
      </details>

      <section className="mt-12 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Want this for your church?</h2>
        <p className="mt-2 max-w-[62ch] text-muted">
          We&apos;ll set it up with your sermons, statement of faith and church information, with your pastors deciding what goes in. Remember, it&apos;s only as good as the library behind it, so we start by looking at your content together.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/build/church-ai-assistant" className={btnPrimary}>
            Get this for your church <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/learn/church-ai-assistant-from-your-own-content" className={btnSecondary}>
            Build it yourself: the guide
          </Link>
        </div>
      </section>
    </main>
  );
}

function AnswerCard({ answer: a }: { answer: ChurchAnswer }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-panel">
      {a.crisis && (
        <div role="note" className="flex gap-3 border-b border-up/40 bg-up/10 p-5 text-sm text-soft">
          <HeartHandshake className="h-5 w-5 shrink-0 text-up" aria-hidden />
          <p>
            <strong className="text-fg">You don&apos;t have to carry this alone.</strong> If you&apos;re in crisis or thinking about suicide, in the US call or text <strong className="text-fg">988</strong> now. If someone&apos;s life is in immediate danger, call 911.
          </p>
        </div>
      )}
      <div className="relative p-6 sm:p-7">
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1 ${a.found ? "bg-amber" : "bg-line"}`} aria-hidden />
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{a.question}</h2>
        <p className={`mt-4 text-[16px] leading-relaxed ${a.found ? "text-soft" : "text-muted"}`}>{a.answer}</p>
      </div>
      {a.found ? (
        <div className="border-t border-hairline p-6 sm:px-7">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <Quote className="h-4 w-4 text-amber" aria-hidden /> Where this comes from
          </h3>
          <ul className="mt-3 space-y-3">
            {a.citations.map((c) => (
              <li key={`${c.docId}-${c.quote}`} className="rounded-xl bg-sunken p-4 text-sm">
                <p className="flex flex-wrap items-baseline gap-x-2 font-semibold">
                  {c.title}
                  <span className="font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-muted">
                    {c.kind}
                    {c.date ? ` · ${shortDate(c.date)}` : ""}
                  </span>
                </p>
                <p className="mt-1.5 text-soft">&ldquo;{c.quote}&rdquo;</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="border-t border-hairline px-6 py-3 font-mono text-[11px] text-dim sm:px-7">{a.found ? "Answered from the church's library · source checked word for word" : "Not in the church's library · no answer given"}</p>
    </article>
  );
}
