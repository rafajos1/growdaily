import Link from "next/link";
import { faqSchema, webAppSchema } from "../../lib/seo";
import { JsonLd } from "./JsonLd";

export interface AboutContent {
  name: string;
  path: string;
  category: string;
  description: string;
  heading: string;
  intro: string;
  faqs: { q: string; a: string }[];
}

/**
 * A short, server-rendered explainer under each app: what it does and common
 * questions, plus structured data. Search engines read this without running the app.
 */
export function AppAbout({ content, accent }: { content: AboutContent; accent: string }) {
  return (
    <section aria-labelledby="about-heading" className="mx-auto max-w-5xl px-[max(16px,env(safe-area-inset-left))] pb-20 pt-4">
      <JsonLd data={webAppSchema({ name: content.name, path: content.path, description: content.description, category: content.category })} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="border-t border-hairline pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: accent }}>
          About {content.name}
        </p>
        <h2 id="about-heading" className="mt-2 max-w-[30ch] text-2xl font-extrabold tracking-tight">
          {content.heading}
        </h2>
        <p className="mt-3 max-w-[70ch] text-soft">{content.intro}</p>
        <dl className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {content.faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold">{q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-sm text-muted">
          {content.name} is built by GrowDaily.{" "}
          <Link href="/build" className="font-semibold text-soft underline-offset-4 hover:text-fg hover:underline">
            Want an AI app like this for your business or nonprofit? →
          </Link>
        </p>
      </div>
    </section>
  );
}
