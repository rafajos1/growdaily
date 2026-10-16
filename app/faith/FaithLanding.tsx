"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Church, MapPin, MessageCircleQuestion } from "lucide-react";
import { APPS } from "../apps";
import { FaithSwitch } from "../components/FaithSwitch";
import { useFaith } from "../components/useFaith";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-sm font-bold text-amber-ink transition hover:bg-amber-hover ${focus}`;

/** What Faith adds to each app. Apps not listed here are still on the way. */
const ADDS: Record<string, { live: boolean; text: string }> = {
  habitwise: { live: true, text: "A word of encouragement each day, drawn from the Bible, and one-tap habits like prayer, gratitude and rest." },
  moodwise: { live: true, text: "A two-minute evening reflection: notice where good showed up, name what was hard, and hand both to God." },
  spendwise: { live: true, text: "Generosity: see what you've given each month, with a gentle nudge to give first. No rules, no percentages." },
  planwise: { live: true, text: "Rhythms for your soul: short quiet moments built into your plan, and a lighter Sunday." },
  mealwise: { live: true, text: "The table: a simple grace before meals, and a nudge to make room for one more." },
};

const NEXT_STEPS = [
  { icon: BookOpen, title: "Read about Jesus", text: "Start with the Gospel of John, one short chapter a day, in plain modern English.", href: "https://www.biblegateway.com/passage/?search=John%201&version=NLT", cta: "Read John 1" },
  { icon: MessageCircleQuestion, title: "Ask your questions", text: "A calm place to ask anything about God, with honest answers. Coming soon.", href: null, cta: null },
  { icon: MapPin, title: "Find a church near you", text: "Help finding a welcoming church, and what to expect on your first visit. Coming soon.", href: null, cta: null },
];

export function FaithLanding() {
  const [faith, setFaith] = useFaith();
  const turnedOn = useRef(false);

  // Opening this page is how people (or a church sharing the link) switch Faith on.
  useEffect(() => {
    if (turnedOn.current) return;
    turnedOn.current = true;
    setFaith(true);
  }, [setFaith]);

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          GrowDaily
        </Link>
      </header>

      <main className="mx-auto max-w-5xl pb-24">
        <section className="pb-14 pt-8 sm:pt-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-xs text-amber">
            <Church className="h-3.5 w-3.5" aria-hidden /> Faith on GrowDaily
          </p>
          <h1 className="mt-6 max-w-[18ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            Questions about God are <span className="text-amber">welcome here</span>.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-soft">
            Turn on Faith and the same free apps leave a little room for God in your day. No church background needed, nothing to sign up for, and you can turn it off any time.
          </p>

          <div className="mt-8 flex max-w-xl items-center gap-4 rounded-2xl border border-line bg-panel p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <p id="faith-label" className="font-semibold">Faith {faith ? "is on" : "is off"}</p>
              <p className="mt-0.5 text-sm text-muted">{faith ? "It's on in every GrowDaily app on this device." : "Turn it on to add faith to every app."}</p>
            </div>
            <FaithSwitch on={faith} onChange={setFaith} labelledBy="faith-label" />
          </div>
        </section>

        <section className="pb-16" aria-labelledby="adds-heading">
          <h2 id="adds-heading" className="text-2xl font-extrabold tracking-tight">What Faith adds</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {APPS.map((app) => {
              const add = ADDS[app.slug];
              if (!add) return null;
              return (
                <li key={app.slug} className="flex flex-col rounded-2xl border border-line bg-panel p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 font-bold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: app.color }} aria-hidden /> {app.name}
                    </p>
                    {add.live ? (
                      <span className="rounded-full bg-down/15 px-2.5 py-0.5 font-mono text-xs text-down">Ready</span>
                    ) : (
                      <span className="rounded-full bg-muted/15 px-2.5 py-0.5 font-mono text-xs text-muted">Coming soon</span>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-soft">{add.text}</p>
                  {add.live && app.href && (
                    <a href={app.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
                      Open {app.name} <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="pb-16" aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="text-2xl font-extrabold tracking-tight">Exploring faith?</h2>
          <p className="mt-2 max-w-[56ch] text-muted">If you&apos;re curious about Jesus but not sure where to start, here are a few gentle first steps.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {NEXT_STEPS.map(({ icon: Icon, title, text, href, cta }) => (
              <li key={title} className="rounded-2xl border border-line bg-panel p-5">
                <Icon className="h-5 w-5 text-amber" aria-hidden />
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
                {href && (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
                    {cta} <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-xl font-bold">Our promise</h2>
          <ul className="mt-3 space-y-2 text-sm text-soft">
            <li>· Your reflections and notes stay on your device. They&apos;re never sent anywhere, including to AI.</li>
            <li>· Every encouragement is drawn from the Bible and names where it comes from, so you can read it for yourself.</li>
            <li>· Grace, not guilt. A missed day is just a missed day.</li>
          </ul>
          <a href="/apps/moodwise" className={`${btnPrimary} mt-6`}>
            Try tonight&apos;s reflection <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </section>

        <p className="mt-10 font-mono text-xs text-dim">GrowDaily is independent and isn&apos;t affiliated with any church.</p>
      </main>
    </div>
  );
}
