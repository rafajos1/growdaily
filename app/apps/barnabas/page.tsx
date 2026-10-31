import type { Metadata } from "next";
import { CalendarClock, HeartHandshake, Lock, MessageCircle } from "lucide-react";
import { faqSchema, ogImage, pageMetadata, webAppSchema } from "../../../lib/seo";
import { BuildFooter, BuildHeader, eyebrow, Faqs } from "../../build/parts";
import { JsonLd } from "../../components/JsonLd";
import { BarnabasApp } from "./BarnabasApp";

const PATH = "/apps/barnabas";
const DESCRIPTION =
  "Barnabas is a private AI accountability friend. It checks in first, asks the honest questions, remembers when things get hard, and meets every slip with grace. Free preview, no sign-up.";

export const metadata: Metadata = pageMetadata({
  title: "Barnabas: An AI Accountability Friend in Your Pocket · GrowDaily",
  description: DESCRIPTION,
  path: PATH,
  image: ogImage("Barnabas", "An accountability friend in your pocket"),
});

const HOW = [
  { Icon: MessageCircle, title: "Tell it what you're working on", text: "Your name, one thing you want to grow in or break free from, what makes it hard, and when it's hardest." },
  { Icon: CalendarClock, title: "It checks in first", text: "Honest accountability questions, a word of encouragement, a verse for the moment, and a nudge just before your hard time." },
  { Icon: HeartHandshake, title: "Grace, not shame", text: "Tell the truth about a slip and you get thanks for your honesty, grace, and one small next step. Wins get celebrated." },
];

const FAQS = [
  { q: "Is Barnabas a real person?", a: "No. Barnabas is an AI, and it says so from the first message. It never pretends to be human." },
  { q: "Is it private?", a: "Yes. There's no account, and your conversation is saved only in your own browser on this device. Your messages are sent to an AI model to write each reply, but GrowDaily doesn't store them. You can erase everything anytime." },
  { q: "Can it help with porn or other addictions?", a: "It was made with struggles like that in mind: a private place to be honest, answer the hard questions, and get encouragement at the moments that matter. It's an accountability friend, not treatment, and it doesn't replace a counselor." },
  { q: "Is it Christian?", a: "Yes. Barnabas speaks as a Christian friend and sometimes shares a verse of encouragement. You don't have to have it all together to use it." },
  { q: "What if I'm in crisis?", a: "If you mention suicide or self-harm, Barnabas stops and points you to the 988 Suicide & Crisis Lifeline (call or text 988), the Crisis Text Line (text HOME to 741741) and 911. Please reach out to them." },
  { q: "Does it really text me?", a: "This preview runs in your browser, so you skip ahead to see the check-ins Barnabas would send. Real text-message check-ins are in development." },
  { q: "Who is it for?", a: "Adults 18 and over who want someone to ask them the honest questions and keep them on track." },
];

export default function Page() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={webAppSchema({ name: "Barnabas", path: PATH, description: DESCRIPTION, category: "LifestyleApplication" })} />
      <JsonLd data={faqSchema(FAQS)} />
      <BuildHeader />
      <main className="mx-auto max-w-6xl">
        <section className="pb-10 pt-8 lg:pt-12">
          <p className={eyebrow}>Barnabas · free preview</p>
          <h1 className="mt-4 max-w-[18ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            An accountability friend <span className="text-amber">in your pocket</span>.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-soft">
            Some struggles are hard to say out loud. Barnabas is a private, AI-powered accountability friend: it checks in on you, asks the honest questions, and meets you with grace, especially when you slip. Try it below. No sign-up.
          </p>
          <p className="mt-3 max-w-[60ch] text-sm text-muted">Barnabas means &ldquo;son of encouragement&rdquo; (Acts 4:36).</p>
        </section>

        <section aria-label="Try Barnabas" className="pb-20">
          <BarnabasApp />
        </section>

        <section aria-labelledby="how-heading" className="pb-20">
          <p className={eyebrow}>How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
            Honest questions, at the moments that matter
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {HOW.map(({ Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-line bg-panel p-6">
                <Icon className="h-5 w-5 text-amber" aria-hidden />
                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="trust-heading" className="pb-20">
          <div className="grid gap-6 rounded-2xl border border-line bg-panel p-6 sm:p-8 md:grid-cols-2">
            <div>
              <Lock className="h-5 w-5 text-down" aria-hidden />
              <h2 id="trust-heading" className="mt-3 text-2xl font-extrabold tracking-tight">
                Private by design
              </h2>
              <p className="mt-2 text-muted">No account, no email, no name required. Your conversation stays in your browser, and you can erase it with one tap.</p>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Honest about what it is</h2>
              <ul className="mt-2 space-y-1.5 text-muted">
                <li>It&apos;s an AI, and it always says so.</li>
                <li>It&apos;s an accountability friend, not a counselor or therapist.</li>
                <li>In a crisis, it points you to 988 and 911 right away.</li>
                <li>It&apos;s for adults 18 and over.</li>
              </ul>
            </div>
          </div>
        </section>

        <Faqs faqs={FAQS} />
      </main>
      <BuildFooter />
    </div>
  );
}
