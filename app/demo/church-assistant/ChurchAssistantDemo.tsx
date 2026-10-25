"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, ChevronDown, Loader2, Quote, Send, ShieldCheck } from "lucide-react";
import { MAX_QUESTION, STARTERS, type ChurchAnswer } from "../../../lib/church-demo/ask";
import { CHURCH_NAME, LIBRARY } from "../../../lib/church-demo/library";
import { btnPrimary, btnSecondary, eyebrow } from "../../build/parts";

const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function ChurchAssistantDemo() {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<ChurchAnswer[]>([]);

  const ask = async (q: string) => {
    const text = q.trim();
    if (text.length < 3 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/church-demo/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: text }) });
      const body = (await res.json().catch(() => ({}))) as { answer?: ChurchAnswer; error?: string };
      if (!res.ok || !body.answer) throw new Error(body.error || "We couldn't answer that right now. Please try again in a moment.");
      setAnswers((a) => [body.answer!, ...a].slice(0, 10));
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  return (
    <main className="mx-auto max-w-5xl pb-20">
      <section className="pb-10 pt-10">
        <p className={eyebrow}>Demo · church website assistant</p>
        <h1 className="mt-4 max-w-[22ch] text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          An AI that answers only from <span className="text-amber">your church&apos;s</span> content.
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg text-soft">
          A pastor put it simply: he&apos;d invite his church to use AI only if it answered from the church&apos;s own teaching. This assistant uses nothing but one church&apos;s library, shows its source for every answer, and says so when it doesn&apos;t know.
        </p>
        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
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

      <section aria-labelledby="try-heading" className="rounded-2xl border border-amber/30 bg-amber/[0.04] p-5 sm:p-7">
        <h2 id="try-heading" className="text-xl font-extrabold tracking-tight">
          Ask {CHURCH_NAME}
        </h2>
        <p className="mt-1 text-sm text-muted">{CHURCH_NAME} is a made-up church with a small sample library. Try a question it can answer, and one it can&apos;t.</p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="church-q" className="sr-only">
            Your question
          </label>
          <input
            id="church-q"
            value={question}
            maxLength={MAX_QUESTION}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What happens with my kids on Sunday?"
            className="min-h-12 w-full rounded-[10px] border border-line bg-sunken px-4 text-base text-fg placeholder:text-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          />
          <button type="submit" disabled={busy || question.trim().length < 3} className={`${btnPrimary} shrink-0 disabled:opacity-60`}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />} Ask
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example questions">
          {STARTERS.map((s) => (
            <button key={s} type="button" disabled={busy} onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1 text-left text-xs text-soft transition hover:border-amber/50 hover:text-fg disabled:opacity-60">
              {s}
            </button>
          ))}
        </div>
        {busy && (
          <p className="mt-4 flex items-center gap-2 text-sm text-soft" aria-live="polite">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber" aria-hidden /> Searching the church&apos;s library…
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-up">
            {error}
          </p>
        )}

        <ol className="mt-5 space-y-4" aria-live="polite">
          {answers.map((a, i) => (
            <li key={`${a.question}-${answers.length - i}`} className="rounded-xl border border-line bg-panel p-4 sm:p-5">
              <p className="text-sm font-semibold text-muted">{a.question}</p>
              {a.crisis && (
                <p role="alert" className="mt-3 rounded-lg border border-up/50 bg-up/10 p-3 text-sm text-fg">
                  If you&apos;re in crisis or thinking about suicide, in the US call or text <strong>988</strong> now. If someone&apos;s life is in immediate danger, call 911.
                </p>
              )}
              <p className={`mt-2 leading-relaxed ${a.found ? "text-fg" : "text-soft"}`}>{a.answer}</p>
              {a.found ? (
                <ul className="mt-3 space-y-2">
                  {a.citations.map((c) => (
                    <li key={`${c.docId}-${c.quote}`} className="rounded-lg bg-sunken p-3 text-sm">
                      <p className="flex flex-wrap items-center gap-x-2 font-semibold">
                        <Quote className="h-3.5 w-3.5 text-amber" aria-hidden />
                        {c.title}
                        <span className="font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-muted">
                          {c.kind}
                          {c.date ? ` · ${shortDate(c.date)}` : ""}
                        </span>
                      </p>
                      <p className="mt-1 text-soft">&ldquo;{c.quote}&rdquo;</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Not in the library · no answer given</p>
              )}
            </li>
          ))}
        </ol>
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
