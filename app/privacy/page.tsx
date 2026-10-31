import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { pageMetadata } from "../../lib/seo";
import { BuildFooter, BuildHeader, eyebrow } from "../build/parts";

const UPDATED = "2026-10-19";
const CONTACT = "hello@growdaily.ai";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy · GrowDaily",
  description: "What GrowDaily collects, why, who helps us run the site, and your choices. Most of what you do in our apps stays on your device.",
  path: "/privacy",
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <section id={id} className="mt-10 scroll-mt-6">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-soft">{children}</div>
    </section>
  );
}

const mail = (
  <a href={`mailto:${CONTACT}`} className="font-semibold text-amber underline-offset-2 hover:underline">
    {CONTACT}
  </a>
);

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-amber underline-offset-2 hover:underline">
    {label}
  </a>
);

export default function PrivacyPage() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <BuildHeader />
      <main className="mx-auto max-w-3xl pb-20">
        <p className={`${eyebrow} pt-8`}>Privacy</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">Privacy policy</h1>
        <p className="mt-4 text-sm text-muted">
          Last updated <time dateTime={UPDATED}>October 19, 2026</time>
        </p>

        <div className="mt-8 rounded-2xl border border-amber/30 bg-amber/[0.06] p-5 sm:p-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber">The short version</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-fg marker:text-amber">
            <li>You don&apos;t need an account. What you enter in our apps is saved in your own browser, on your device.</li>
            <li>When you use an AI feature, only what that feature needs is sent to be answered, and we don&apos;t keep it.</li>
            <li>We store your details only if you ask for a quote or choose &quot;Save my progress&quot;.</li>
            <li>We use Google Analytics to see how the site is used. We don&apos;t sell your information or show ads.</li>
          </ul>
        </div>

        <Section title="Who we are">
          <p>
            GrowDaily (growdaily.ai) makes free AI apps for everyday life, publishes guides to using AI at work, and offers AI training, consulting and app development. Questions about this policy or your information: {mail}.
          </p>
        </Section>

        <Section title="What stays on your device">
          <p>
            Spendwise, Habitwise, Planwise, Mealwise, Moodwise, Cafewise, Quotewise, Roomwise and Pilotwise save what you enter (expenses, habits, plans, meals, check-ins, notes, café stock, quotes, invoices, room bookings and AI pilot plans) in your browser&apos;s local storage. So do your settings, like the Faith toggle, and your recent questions in Ask. We can&apos;t see any of it. Clearing your browser&apos;s site data deletes it.
          </p>
        </Section>

        <Section title="AI features">
          <p>When you choose to use an AI feature, our server sends only what that feature needs to Anthropic&apos;s Claude API and returns the answer to you:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-amber">
            <li>Ask: the question you type.</li>
            <li>Habitwise weekly review: a summary of your habits and check-offs.</li>
            <li>Moodwise insights: a summary of your mood, energy, sleep and tags. Your notes are never sent.</li>
            <li>Planwise: the to-do list you type and your day&apos;s start and end times.</li>
            <li>Mealwise: your ingredients, diet choices, time, servings and what you&apos;re in the mood for.</li>
            <li>Pilotwise AI planning: the use case details you type in the form (the use case, organization size, industry, who builds it, data notes and timeline).</li>
            <li>Quotewise AI drafting: the job description you type, what your business does and your hourly rate. Client details aren&apos;t sent.</li>
            <li>Roomwise AI search: your room request, today&apos;s date and the names of your rooms&apos; features. Bookings and contacts aren&apos;t sent.</li>
            <li>Cafewise ordering review: your item and drink names with their numbers (par levels, counts, use, waste and costs).</li>
            <li>Quote form: the idea you describe, if you ask for an AI sketch.</li>
          </ul>
          <p>
            We don&apos;t save these requests or answers on our servers, apart from quote requests (below). Anthropic processes them under its commercial terms, which say it does not train its models on this data. See {ext("https://www.anthropic.com/legal/privacy", "Anthropic's privacy policy")}.
          </p>
          <p>Please don&apos;t include sensitive personal details, like health information or other people&apos;s names, in what you send to AI features.</p>
        </Section>

        <Section title="Quote requests">
          <p>
            When you ask for a quote, we collect your name, email, type of organization, what you&apos;re interested in, your idea, and the page you sent it from. We save it in our database (Supabase) and email it to ourselves (through Resend) so we can reply. We use it only to respond and to discuss working together, and we don&apos;t add you to a mailing list.
          </p>
        </Section>

        <Section title="Save my progress (optional)">
          <p>
            If you sign in with your email to save your progress, we store your email address (to send sign-in codes) and a copy of your app data, so it can sync across your devices. This is stored with Supabase, and only you can read it once signed in. Sign-in emails are sent through Resend.
          </p>
          <p>
            You can delete the saved copy at any time from the &quot;Your saved progress&quot; menu; progress on your device stays. To delete your account entirely, email {mail}.
          </p>
        </Section>

        <Section title="Find a church">
          <p>
            To find churches near you, the place you type or your location (only if you allow it in your browser) is sent to map services built on OpenStreetMap: Overpass, Photon (by Komoot) and Nominatim. If those services are busy, the search goes through our server, which forwards the place or coordinates. We don&apos;t store your searches or location.
          </p>
        </Section>

        <Section title="Analytics and cookies">
          <p>
            We use Google Analytics to understand which pages people visit and how they find us. It uses cookies and collects information like pages viewed, device and browser type, and approximate location. We don&apos;t use advertising cookies. You can opt out with the {ext("https://tools.google.com/dlpage/gaoptout", "Google Analytics opt-out add-on")} or by blocking cookies in your browser. See {ext("https://policies.google.com/technologies/partner-sites", "how Google uses data from sites that use its services")}.
          </p>
        </Section>

        <Section title="YouTube Shorts">
          <p>
            Some guides may include YouTube Shorts made by other creators. A Short only loads when you press play, using YouTube&apos;s privacy-enhanced mode. Once it plays, YouTube (Google) may set cookies and collect information as described in {ext("https://policies.google.com/privacy", "Google's privacy policy")}.
          </p>
        </Section>

        <Section title="Service providers and server logs">
          <p>
            These companies help us run GrowDaily and process information on our behalf: Vercel (hosting), Supabase (database and sign-in), Resend (email), Anthropic (AI features), Google (analytics) and Cloudflare (domain and DNS). Like most websites, our host keeps short-term technical logs, such as IP addresses and errors, to run and secure the site. To keep free AI features fair, we count requests per IP address for the day in temporary memory.
          </p>
          <p>We don&apos;t sell or rent your personal information, and we don&apos;t share it for advertising.</p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep quote requests as long as we need them to talk with you about your project and keep basic business records. Saved progress stays until you delete it or ask us to delete your account. Information on your device stays until you clear it.
          </p>
        </Section>

        <Section title="Your choices and rights">
          <p>
            You can ask us to see, correct or delete the information we hold about you by emailing {mail}. Depending on where you live, for example in California or the European Union, you may have additional rights, and we&apos;ll honor them. We&apos;ll reply within 30 days.
          </p>
        </Section>

        <Section title="Children">
          <p>GrowDaily isn&apos;t directed to children under 13, and we don&apos;t knowingly collect their personal information. If you believe a child has sent us information, email us and we&apos;ll delete it.</p>
        </Section>

        <Section title="Security">
          <p>
            Our site uses HTTPS, database access is restricted so people can only read their own saved progress, and secret keys stay on the server. No system is perfectly secure, so please keep sensitive information out of the apps and forms.
          </p>
        </Section>

        <Section title="Changes">
          <p>If we change this policy, we&apos;ll update it here and change the date at the top. For significant changes, we&apos;ll make that clear on the site.</p>
        </Section>

        <p className="mt-12 border-t border-hairline pt-6 text-sm text-muted">
          Questions? Email {mail}, or go back to the <Link href="/" className="underline underline-offset-2 hover:text-fg">GrowDaily home page</Link>.
        </p>
      </main>
      <BuildFooter />
    </div>
  );
}
