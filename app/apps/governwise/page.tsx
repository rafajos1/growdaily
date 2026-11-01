import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ClipboardList, FileText, Gauge } from "lucide-react";
import { faqSchema, ogImage, pageMetadata, webAppSchema } from "../../../lib/seo";
import { BuildFooter, BuildHeader, btnPrimary, eyebrow, Faqs } from "../../build/parts";
import { JsonLd } from "../../components/JsonLd";
import { GovernwiseApp } from "./GovernwiseApp";

const PATH = "/apps/governwise";
const DESCRIPTION =
  "Free AI governance starter kit for businesses and nonprofits: list the AI tools your team uses, get each one rated approved, limited or not allowed with the reasons, and download a ready-to-adopt AI policy and AI register.";

export const metadata: Metadata = pageMetadata({
  title: "Free AI Governance Kit: AI Policy, Register & Risk Check · GrowDaily",
  description: DESCRIPTION,
  path: PATH,
  image: ogImage("Governwise", "Free AI governance starter kit"),
});

const OUTPUTS = [
  { Icon: ClipboardList, title: "An AI register", text: "Every AI tool your people use, what it's for, what information goes in, and its rating with the reasons." },
  { Icon: FileText, title: "An AI policy", text: "A plain-English policy built from your answers: approved tools, data rules, human review and who to ask." },
  { Icon: Gauge, title: "A leadership summary", text: "A readiness score, the riskiest uses first, and the next steps, on one page for your leaders or board." },
];

const FAQS = [
  { q: "What is AI governance?", a: "The simple rules for how your organization uses AI: which tools are allowed, what information can go into them, who reviews the results, and who is responsible. For most organizations it starts with a list of tools and a short policy." },
  { q: "How are tools rated?", a: "By fixed, readable rules, not AI. For example, personal details in a free personal account are not allowed; sensitive information on a business plan is allowed only with the right agreement; and anything that informs decisions about people always needs a person to decide. You can see the reasons for every rating." },
  { q: "Is my information private?", a: "Your organization details and list of AI tools stay in your browser on this device and are never sent to us or to an AI. When you sign up for your kit, only your name, email and organization name are sent to GrowDaily." },
  { q: "Why do I need to sign up?", a: "So we can follow up with help if you want it, and occasionally share practical AI governance tips. It takes a few seconds, and you can unsubscribe anytime." },
  { q: "Is this legal advice?", a: "No. It's practical guidance to get you organized. Laws differ by industry and location, so check anything regulated, like health or children's information, with a qualified advisor." },
  { q: "Can you help us put it in place?", a: "Yes. Our AI governance service reviews your tools with you, tailors the policy, trains your team and briefs your leadership. The first 20-minute call is free." },
];

export default function Page() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <JsonLd data={webAppSchema({ name: "Governwise", path: PATH, description: DESCRIPTION, category: "BusinessApplication" })} />
      <JsonLd data={faqSchema(FAQS)} />
      <div className="print:hidden">
        <BuildHeader />
      </div>
      <main className="mx-auto max-w-6xl">
        <section className="pb-10 pt-8 lg:pt-12 print:hidden">
          <p className={eyebrow}>Governwise · free AI governance kit</p>
          <h1 className="mt-4 max-w-[20ch] text-5xl font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-6xl">
            Know which AI tools your team uses, and <span className="text-amber">set the rules</span>.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-soft">
            Your people are already using AI, often on free personal accounts. In about 15 minutes, list your tools and get an AI register, a ready-to-adopt AI policy and a one-page summary for your leaders. Free with a quick sign-up, and your tool list stays private.
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

        <section aria-label="Build your AI governance kit" className="pb-20">
          <GovernwiseApp />
        </section>

        <section className="pb-20 print:hidden">
          <div className="rounded-2xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10">
            <p className={eyebrow}>Want help putting it in place?</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">AI governance, done with you</h2>
            <p className="mt-2 max-w-[60ch] text-muted">We review your tools with your team, tailor the policy to your work and your data, train your people, and brief your leadership or board. Practical, plain-English and sized for your organization.</p>
            <Link href="/build/ai-governance" className={`${btnPrimary} mt-6`}>
              See the AI governance service <ArrowRight className="h-4 w-4" aria-hidden />
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
