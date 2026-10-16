"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { MAX_QUESTION, STARTERS } from "../../lib/faith/ask";

const askUrl = (q: string) => `/faith/ask?q=${encodeURIComponent(q)}`;

/** A question box that opens the Ask page with the question already answered. */
export function AskBox({ starters = 4 }: { starters?: number }) {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    router.push(q.length >= 3 ? askUrl(q) : "/faith/ask");
  };

  return (
    <div>
      <form onSubmit={submit} className="flex gap-2 rounded-2xl border border-amber/40 bg-panel p-2 shadow-[0_0_0_4px_rgba(242,181,75,0.06)] focus-within:border-amber">
        <label htmlFor="ask-box" className="sr-only">
          Ask a question about God
        </label>
        <input
          id="ask-box"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={MAX_QUESTION}
          placeholder="Ask anything about God…"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base text-fg placeholder:text-dim focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber px-4 py-2.5 text-sm font-bold text-amber-ink transition hover:bg-amber-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
        >
          <Send className="h-4 w-4" aria-hidden /> Ask
        </button>
      </form>
      {starters > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {STARTERS.slice(0, starters).map((s) => (
            <a key={s.question} href={askUrl(s.question)} className="rounded-full border border-line px-3 py-1.5 text-sm text-soft transition hover:border-amber/50 hover:text-fg">
              {s.question}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
