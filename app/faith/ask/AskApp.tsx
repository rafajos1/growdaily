"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Footprints, HeartHandshake, MapPin, MessageCircleQuestion, Scale, Send, X } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { MAX_QUESTION, needsCrisisHelp, STARTERS, starterFor, type AskAnswer } from "../../../lib/faith/ask";
import { chapterLink } from "../../../lib/faith/bible";
import { LogoMark } from "../../components/LogoMark";

const HISTORY_KEY = "faith:ask:history";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-sm font-bold text-amber-ink transition hover:bg-amber-hover disabled:opacity-60 ${focus}`;
const chip = `rounded-full border border-line px-3 py-1.5 text-sm text-soft transition hover:border-amber/50 hover:text-fg ${focus}`;

type View =
  | { kind: "idle" }
  | { kind: "loading"; question: string }
  | { kind: "answer"; answer: AskAnswer }
  | { kind: "unavailable"; question: string; message: string }
  | { kind: "error"; question: string; message: string };

function loadHistory(): AskAnswer[] {
  try {
    const list = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((a) => a && typeof a.question === "string" && typeof a.answer === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function AskApp() {
  const [question, setQuestion] = useState("");
  const [view, setView] = useState<View>({ kind: "idle" });
  const [history, setHistory] = useState<AskAnswer[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHistory(loadHistory()), []);

  // A question passed from elsewhere on GrowDaily (/faith/ask?q=...) is answered right away.
  const askedFromLink = useRef(false);
  useEffect(() => {
    if (askedFromLink.current) return;
    askedFromLink.current = true;
    const q = new URLSearchParams(location.search).get("q");
    if (!q) return;
    window.history.replaceState(null, "", location.pathname);
    void ask(q.slice(0, MAX_QUESTION));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on arrival
  }, []);

  const remember = (a: AskAnswer) => {
    setHistory((h) => {
      const next = [a, ...h.filter((x) => x.question.toLowerCase() !== a.question.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable: answers still show for this visit */
      }
      return next;
    });
  };

  const show = (v: View) => {
    setView(v);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const ask = async (text: string) => {
    const q = text.replace(/\s+/g, " ").trim();
    if (q.length < 3) return show({ kind: "error", question: q, message: "Type a question first." });
    setQuestion("");
    // Common questions have answers written ahead of time.
    const ready = starterFor(q);
    if (ready) {
      remember(ready);
      return show({ kind: "answer", answer: ready });
    }
    show({ kind: "loading", question: q });
    try {
      const res = await fetch("/api/faith/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q }) });
      const body = (await res.json().catch(() => ({}))) as { answer?: AskAnswer; error?: string };
      if (res.ok && body.answer) {
        remember(body.answer);
        show({ kind: "answer", answer: body.answer });
      } else if (res.status === 503) {
        show({ kind: "unavailable", question: q, message: body.error ?? "Live answers are coming soon." });
      } else {
        show({ kind: "error", question: q, message: body.error ?? "We couldn't answer that right now. Please try again in a moment." });
      }
    } catch {
      show({ kind: "error", question: q, message: "We couldn't reach GrowDaily. Check your connection and try again." });
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(question);
  };

  const shownQuestion = view.kind === "answer" ? view.answer.question : view.kind === "idle" ? "" : view.question;

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-3xl items-center justify-between">
        <Link href="/faith" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />
          <LogoMark className="h-8 w-8" />
          Faith
        </Link>
        <HomeLink />
      </header>

      <main className="mx-auto max-w-3xl pb-24">
        <section className="pt-4 sm:pt-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-xs text-amber">
            <MessageCircleQuestion className="h-3.5 w-3.5" aria-hidden /> Ask your questions
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
            Ask anything about <span className="text-amber">God</span>.
          </h1>
          <p className="mt-4 max-w-[54ch] text-lg text-soft">Honest answers in plain words. No question is too small, too big, or too full of doubt.</p>

          <form onSubmit={submit} className="mt-7 rounded-2xl border border-line bg-panel p-3 sm:p-4">
            <label htmlFor="question" className="sr-only">
              Your question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void ask(question);
              }}
              maxLength={MAX_QUESTION}
              rows={3}
              placeholder="e.g. If God is good, why did my mom get sick?"
              className="block w-full resize-none rounded-xl bg-transparent px-2 py-1.5 text-base text-fg placeholder:text-dim focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-hairline pt-3">
              <p className="pl-2 font-mono text-[11px] text-dim">GrowDaily doesn&apos;t keep your questions · {question.length}/{MAX_QUESTION}</p>
              <button type="submit" disabled={view.kind === "loading"} className={btnPrimary}>
                <Send className="h-4 w-4" aria-hidden /> Ask
              </button>
            </div>
          </form>

          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Questions people often ask</p>
              <Link href="/faith/questions" className="text-xs font-semibold text-muted hover:text-fg">
                Browse all
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button key={s.question} type="button" onClick={() => void ask(s.question)} className={chip}>
                  {s.question}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div ref={resultRef} className="scroll-mt-6 pt-8" aria-live="polite">
          {shownQuestion && needsCrisisHelp(shownQuestion) && <CrisisCard />}
          {view.kind === "loading" && (
            <section className="rounded-2xl border border-line bg-panel p-6" aria-busy="true" aria-label="Writing an answer">
              <p className="text-lg font-bold">{view.question}</p>
              <div className="mt-4 space-y-2.5">{[92, 84, 96, 70].map((w) => <div key={w} className="h-3.5 animate-pulse rounded bg-raised" style={{ width: `${w}%` }} />)}</div>
            </section>
          )}
          {view.kind === "answer" && <AnswerCard answer={view.answer} onAsk={(q) => void ask(q)} />}
          {view.kind === "unavailable" && (
            <section className="rounded-2xl border border-amber/30 bg-amber/[0.06] p-6">
              <p className="text-lg font-bold">{view.question}</p>
              <p className="mt-2 text-soft">
                {view.message} Until then, these common questions already have answers. And if your question can&apos;t wait, a pastor or a Christian friend would be glad to talk it through.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button key={s.question} type="button" onClick={() => void ask(s.question)} className={chip}>
                    {s.question}
                  </button>
                ))}
              </div>
            </section>
          )}
          {view.kind === "error" && (
            <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm font-semibold text-up">
              {view.message}
            </p>
          )}
        </div>

        {history.length > 0 && (
          <section className="mt-10" aria-labelledby="history-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="history-heading" className="text-base font-bold">
                Your questions
              </h2>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-fg"
                onClick={() => {
                  setHistory([]);
                  try {
                    localStorage.removeItem(HISTORY_KEY);
                  } catch {
                    /* ignore */
                  }
                }}
              >
                <X className="h-3.5 w-3.5" aria-hidden /> Clear
              </button>
            </div>
            <ul className="mt-3 divide-y divide-hairline rounded-2xl border border-line bg-panel">
              {history.map((h) => (
                <li key={h.question}>
                  <button type="button" onClick={() => show({ kind: "answer", answer: h })} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-raised/50">
                    <span className="min-w-0 flex-1 truncate">{h.question}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link href="/faith/church" className="mt-10 flex items-center gap-3 rounded-2xl border border-line bg-panel p-5 transition hover:border-amber/50">
          <MapPin className="h-5 w-5 shrink-0 text-amber" aria-hidden />
          <span className="flex-1 text-sm">
            <strong className="text-fg">Want to talk to someone in person?</strong> <span className="text-soft">Find a church near you.</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        </Link>

        <p className="mt-10 font-mono text-xs text-dim">
          Answers come from a Christian perspective and can make mistakes, so read the passages for yourself. GrowDaily isn&apos;t affiliated with any church.
        </p>
        <p className="mt-3 text-xs text-dim">
          Church leader?{" "}
          <Link href="/learn/how-to-build-a-church-chatbot-with-claude" className="underline underline-offset-2 hover:text-fg">
            Learn how to build an assistant like this for your church
          </Link>
          .
        </p>
      </main>
    </div>
  );
}

function CrisisCard() {
  return (
    <section role="note" aria-label="Support" className="mb-5 flex flex-col gap-3 rounded-2xl border border-up/40 bg-up/10 p-5 sm:flex-row">
      <HeartHandshake className="h-6 w-6 shrink-0 text-up" aria-hidden />
      <div className="text-sm text-soft">
        <p className="text-base font-bold text-fg">You matter, and you don&apos;t have to carry this alone.</p>
        <p className="mt-1">
          If you&apos;re thinking about harming yourself, please reach out right now. In the US, call or text <strong className="text-fg">988</strong>. Elsewhere, find a free helpline at{" "}
          <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline">
            findahelpline.com
          </a>
          . Talking to someone you trust can help too.
        </p>
      </div>
    </section>
  );
}

function AnswerCard({ answer, onAsk }: { answer: AskAnswer; onAsk: (q: string) => void }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative p-6 sm:p-7">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-amber" aria-hidden />
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{answer.question}</h2>
        <div className="mt-4 space-y-3.5 text-[16px] leading-relaxed text-soft">
          {answer.answer.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {answer.differ && (
          <div className="mt-5 flex gap-3 rounded-xl border border-line bg-sunken p-4 text-sm text-soft">
            <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
            <p>
              <strong className="text-fg">Where Christians differ: </strong>
              {answer.differ}
            </p>
          </div>
        )}
      </div>

      {answer.passages.length > 0 && (
        <div className="border-t border-hairline p-6 sm:px-7">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <BookOpen className="h-4 w-4 text-amber" aria-hidden /> Read it for yourself
          </h3>
          <ul className="mt-3 space-y-3">
            {answer.passages.map((p) => (
              <li key={p.ref} className="text-sm">
                <a href={chapterLink(p)} target="_blank" rel="noopener noreferrer" className="font-semibold text-amber underline-offset-2 hover:underline">
                  {p.ref}
                </a>
                {p.why && <span className="text-muted"> · {p.why}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {answer.nextStep && (
        <div className="border-t border-hairline p-6 sm:px-7">
          <p className="flex gap-3 text-sm text-soft">
            <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
            <span>
              <strong className="text-fg">A next step: </strong>
              {answer.nextStep}
            </span>
          </p>
        </div>
      )}

      {answer.followUps.length > 0 && (
        <div className="border-t border-hairline p-6 sm:px-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">You might also ask</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {answer.followUps.map((f) => (
              <button key={f} type="button" onClick={() => onAsk(f)} className={chip}>
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="border-t border-hairline px-6 py-3 font-mono text-[11px] text-dim sm:px-7">{answer.source === "ai" ? "Answered with AI · can make mistakes" : "A ready answer from GrowDaily"}</p>
    </article>
  );
}
