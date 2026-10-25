import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Check, MessageCircleQuestion, Quote, ShieldCheck } from "lucide-react";
import { faqSchema, ogImage, pageMetadata, SITE_URL } from "../../../lib/seo";
import { JsonLd } from "../../components/JsonLd";
import { BuildFooter, BuildHeader, btnPrimary, btnSecondary, eyebrow, Faqs, IdeaSection } from "../parts";

const PATH = "/build/church-ai-assistant";
const DESCRIPTION =
  "An AI assistant for your church that answers only from your own sermons, statement of faith and church information, quotes its source every time, and says so when it doesn't know. Try the demo, then book a free 20-minute call.";

export const metadata: Metadata = pageMetadata({
  title: "Church AI Assistant That Answers Only From Your Teaching · GrowDaily",
  description: DESCRIPTION,
  path: PATH,
  image: ogImage("A church AI assistant that speaks only from your teaching", "Your sermons · Your beliefs · A source for every answer"),
});

const PROMISES = [
  { Icon: BookOpen, title: "Only your library", text: "It answers from the sermons, beliefs and church information your pastors choose. Nothing from the wider internet, and no other church's theology." },
  { Icon: Quote, title: "A source for every answer", text: "Every answer quotes the sermon or page it came from, checked word for word, so people can see it and go deeper in your own teaching." },
  { Icon: ShieldCheck, title: "No source, no answer", text: "If your library doesn't cover a question, it says so kindly and points to a pastor. It never guesses, counsels or takes prayer requests." },
];

const STEPS = [
  { title: "A free 20-minute call", text: "We talk about your church, who the assistant is for (staff, members or website visitors) and what content you already have." },
  { title: "Gather and tidy your library", text: "AI is only as good as your data. We help you pull together sermon transcripts or notes, your statement of faith, FAQs and visit information, and fix anything out of date." },
  { title: "Set it up and test it hard", text: "We load your library, set the guardrails, and test with real questions, hard questions and questions it should decline. Your pastors review the answers before anyone else sees it." },
  { title: "Launch small, then grow", text: "Start with staff or one page of your website. Each month we add new sermons and show your pastors the kinds of questions people ask, with no personal details." },
];

const INCLUDED = [
  "Your library set up: sermons, beliefs, FAQs, classes and events",
  "Answers checked against your content, with quoted sources",
  "Crisis guardrails (988 and your care team) and no counseling",
  "A chat box for your website, or a private page for staff",
  "Pastor review before launch",
  "Optional monthly care: new sermons added and a summary of common questions",
];

const FAQS = [
  { q: "Will it ever say something our church doesn't teach?", a: "It's built to answer only from your library, and every answer must quote a real passage from it. If it can't, the visitor gets a polite \"I couldn't find that in our teaching\" and a way to reach a pastor. Your pastors also review answers before launch." },
  { q: "Can it use our sermon videos or podcasts?", a: "Yes, through transcripts. Many churches already have them from YouTube captions or a transcription service. We'll help you choose which sermons to include, usually the most recent year first." },
  { q: "Can we start with staff only?", a: "Yes, and many churches should. A private version for staff and volunteers is a great way to test it before inviting the whole church or putting it on your website." },
  { q: "What about prayer requests and personal questions?", a: "It doesn't collect prayer requests or personal details, and it doesn't counsel. It points people to your care team, and anyone in crisis to 988 and emergency help." },
  { q: "Will it work with our website?", a: "It can usually sit on its own page or as a small chat box on the site you already have. We'll check your website platform on the first call." },
  { q: "What does it cost?", a: "The first 20-minute call is free. Setup is priced up front based on the size of your library, and running costs are a small monthly amount based on how many questions people ask. Optional monthly care is priced separately." },
  { q: "Can we build it ourselves?", a: "Yes. Our free step-by-step guide shows how, and our guided build option gives you a guide alongside you while your team builds it." },
];

export default function Page() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Church AI assistant",
    serviceType: "AI assistant for churches",
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    audience: { "@type": "Audience", audienceType: "Churches and ministries" },
    provider: { "@type": "Organization", name: "GrowDaily", url: SITE_URL },
  };
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={service} />
      <JsonLd data={faqSchema(FAQS)} />
      <BuildHeader />
      <main className="mx-auto max-w-6xl">
        <section className="pb-16 pt-10 lg:pt-16">
          <p className={eyebrow}>For churches &amp; ministries</p>
          <h1 className="mt-4 max-w-[20ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            A church AI assistant that speaks only from <span className="text-amber">your teaching</span>.
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-soft">
            People have questions at midnight: about Sunday, about baptism, about what your church believes, about last week&apos;s sermon. This assistant answers them from your own sermons and church information, shows where each answer came from, and hands everything else to a real person.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo/church-assistant" className={btnPrimary}>
              Try the live demo <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#idea" className={btnSecondary}>
              Book a free 20-minute call
            </a>
          </div>
        </section>

        <section aria-labelledby="promise-heading" className="pb-20">
          <h2 id="promise-heading" className="sr-only">
            What makes it trustworthy
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROMISES.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line bg-panel p-6">
                <Icon className="h-5 w-5 text-amber" aria-hidden />
                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="questions-heading" className="pb-20">
          <p className={eyebrow}>What people ask it</p>
          <h2 id="questions-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            The questions your office answers every week, and the ones people never ask out loud
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {[
              "What time is service, and what should I wear?",
              "Is there something for my kids?",
              "How do I get baptized?",
              "What does your church believe about Jesus?",
              "What was Sunday's sermon about?",
              "How do I join a small group?",
              "Where can I serve?",
            ].map((q) => (
              <li key={q} className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-soft">
                <MessageCircleQuestion className="h-4 w-4 shrink-0 text-amber" aria-hidden /> {q}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-heading" className="pb-20">
          <p className={eyebrow}>How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Your content first, your pastors in charge
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-panel p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber/15 font-mono text-sm font-bold text-amber">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="included-heading" className="pb-20">
          <div className="grid gap-8 rounded-2xl border border-line bg-panel p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className={eyebrow}>What&apos;s included</p>
              <h2 id="included-heading" className="mt-2 text-2xl font-extrabold tracking-tight">
                Everything to launch with confidence
              </h2>
              <ul className="mt-5 space-y-2.5 text-sm text-soft">
                {INCLUDED.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={eyebrow}>Two ways to get it</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-amber/40 bg-amber/[0.05] p-5">
                  <h3 className="font-bold">We set it up for you</h3>
                  <p className="mt-1 text-sm text-muted">We do the setup, testing and launch with your pastors, then keep it current with optional monthly care.</p>
                </div>
                <div className="rounded-xl border border-line p-5">
                  <h3 className="font-bold">Your team builds it, with a guide</h3>
                  <p className="mt-1 text-sm text-muted">
                    Follow our{" "}
                    <Link href="/learn/church-ai-assistant-from-your-own-content" className="font-semibold text-amber underline-offset-2 hover:underline">
                      free step-by-step guide
                    </Link>
                    , with paid working sessions when you want help.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">The first 20-minute call is free. Everything after that is priced up front.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="me-heading" className="pb-20">
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <p className={eyebrow}>Who you&apos;ll work with</p>
            <h2 id="me-heading" className="mt-2 text-2xl font-extrabold tracking-tight">
              Rafael, a former pastor who builds with AI
            </h2>
            <p className="mt-2 max-w-[62ch] text-muted">
              I served as a pastor for 14 years, so I know what it means to guard what your church teaches and to care for the people asking. I also have 25+ years of experience in data, analytics and AI, and I build every tool on GrowDaily myself.
            </p>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline">
              More about me <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <Faqs faqs={FAQS} />
        <IdeaSection defaultOrg="Church or ministry" defaultInterest="Build an app" page={PATH} />
      </main>
      <BuildFooter />
    </div>
  );
}
