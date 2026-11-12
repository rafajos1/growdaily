import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Compass, Map as MapIcon, Route } from "lucide-react";
import { faqSchema, ogImage, pageMetadata, webAppSchema } from "../../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, eyebrow, Faqs } from "../../build/parts";
import { JsonLd } from "../../components/JsonLd";
import { CulturewiseApp } from "./CulturewiseApp";

const PATH = "/apps/culturewise";
const DESCRIPTION =
  "Free AI culture check built on two published questionnaires, ORIC readiness for change and Edmondson's psychological safety scale: map each team and get the AI rollout style that fits it.";

export const metadata: Metadata = pageMetadata({
  title: "Free AI Culture Check: Is Your Team Ready for AI? · GrowDaily",
  description: DESCRIPTION,
  path: PATH,
  image: ogImage("Culturewise", "Free AI culture check"),
});

const OUTPUTS = [
  { Icon: MapIcon, title: "A culture map", text: "Each team placed by its readiness for AI and its psychological safety, so you can see the differences at a glance." },
  { Icon: Route, title: "A rollout style per team", text: "Explorer, Sprinter, Builder or Guarded, with what to lead with and what to watch for when you introduce AI." },
  { Icon: Compass, title: "Where to start", text: "Each team's weakest area, linked to the ADKAR stage to work on first, and a summary you can copy for your leaders." },
];

const FAQS = [
  { q: "Why check culture before rolling out AI?", a: "The same AI tool lands differently in different teams. A team that tries things quickly needs guardrails; a careful team needs proof; a team that doesn't trust the why needs to hear it first. Knowing which is which keeps you from running one plan that fits nobody." },
  { q: "What is it based on?", a: "Two published, tested questionnaires. Readiness comes from ORIC, Organizational Readiness for Implementing Change (Shea and colleagues, 2014): 12 statements on commitment to a change and confidence in carrying it out, adapted to name AI and used under its open CC BY license. Psychological safety comes from Amy Edmondson's 7-item team scale (1999), the most widely used measure of whether people feel safe to speak up, ask for help and admit mistakes." },
  { q: "What parts are GrowDaily's own?", a: "The questions and their scoring come from the published scales; we rate them 1 to 5. The culture map, the four type names, the advice for each and the link to ADKAR are our practical interpretation. The scales don't publish cutoffs, so the map splits at the neutral midpoint of the scale." },
  { q: "Who should fill it in?", a: "Both questionnaires were designed for team members to answer. A leader who knows a team well can start, but for a truer picture have several people in each team answer privately and compare. Where a leader's view and the team's differ is often the most useful finding." },
  { q: "Is my information private?", a: "Yes. Your answers stay in your browser on this device. Nothing is sent to us or to an AI, and you don't need to sign up." },
  { q: "Is this a scientific assessment?", a: "The questions are from validated research scales, but a few ratings from one leader aren't a research study. Use the results to start the right conversations, not to label people or teams." },
  { q: "Can you help us plan the rollout?", a: "Yes. We help teams introduce AI in a way that fits each department: the governance, the pilots and the people side. The first 20-minute call is free." },
];

export default function Page() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={webAppSchema({ name: "Culturewise", path: PATH, description: DESCRIPTION, category: "BusinessApplication" })} />
      <JsonLd data={faqSchema(FAQS)} />
      <div className="print:hidden">
        <BuildHeader />
      </div>
      <main className="mx-auto max-w-6xl">
        <section className="pb-10 pt-8 lg:pt-12 print:hidden">
          <p className={eyebrow}>Culturewise · free AI culture check</p>
          <h1 className="mt-4 max-w-[20ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            Know how each team will <span className="text-amber">receive AI</span>, before you roll it out.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-soft">
            Culture often differs from one department to the next, and the culture leaders describe isn&apos;t always the one people live. In about 5 minutes per team, answer two published questionnaires, see where each team sits and get the rollout style that fits it. Free, no sign-up, and your answers stay in your browser.
          </p>
        </section>

        <section className="pb-12 print:hidden" aria-label="What you get">
          <ul className="grid gap-4 md:grid-cols-3">
            {OUTPUTS.map(({ Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-line bg-panel p-5">
                <Icon className="h-5 w-5 text-amber" aria-hidden />
                <h2 className="mt-3 text-lg font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Run your AI culture check" className="pb-20">
          <CulturewiseApp />
        </section>

        <section className="pb-20 print:hidden">
          <div className="rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10">
            <p className={eyebrow}>Next step</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Set the rules, then plan each team&apos;s path</h2>
            <p className="mt-2 max-w-[60ch] text-muted">
              Every culture needs the basics: a list of the AI tools in use and a short policy. Build yours free, then read <Link href="/learn/ai-culture-assessment" className="underline underline-offset-2 hover:text-fg">how to use your culture map</Link> and <Link href="/learn/ai-lifecycle" className="underline underline-offset-2 hover:text-fg">the AI lifecycle</Link>.
            </p>
            <Link href="/apps/governwise" className={`${btnPrimary} mt-6`}>
              Build your free AI governance kit <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <div className="print:hidden">
          <Faqs faqs={FAQS} />
        </div>
      </main>
      <div className="print:hidden">
        <BuildFooter />
      </div>
    </div>
  );
}
