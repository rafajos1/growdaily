import { APPS } from "../apps";
import { AUDIENCES, SERVICE_PAGES } from "../build/content";
import { GUIDES, TOPICS, guidesIn } from "../../lib/learn";
import { SITE_URL } from "../../lib/seo";

export const dynamic = "force-static";

/** /llms.txt: a plain summary of the site for AI assistants and answer engines (llmstxt.org). */
export function GET() {
  const link = (title: string, path: string, note: string) => `- [${title}](${SITE_URL}${path}): ${note}`;
  const body = [
    "# GrowDaily",
    "",
    "> GrowDaily makes free, private AI apps for everyday life, publishes plain-English guides to using AI at work, and offers AI training, consulting and custom AI app development for businesses, nonprofits and churches.",
    "",
    ...TOPICS.flatMap((t) => [`## Guides: ${t.title}`, "", ...guidesIn(t.id).map((g) => link(g.title, `/learn/${g.slug}`, g.shortAnswer)), ""]),
    "## About",
    "",
    link("About GrowDaily", "/about", "Run by Rafael, with 25+ years leading enterprise data, analytics and AI transformation."),
    "",
    "## Services",
    "",
    link("AI training, consulting and app development", "/build", "Team workshops, AI plans, custom AI apps and ongoing care. Quoted up front."),
    ...SERVICE_PAGES.map((p) => link(p.h1, `/build/${p.slug}`, p.description)),
    ...AUDIENCES.map((a) => link(a.h1, `/build/${a.slug}`, a.description)),
    "",
    "## Free apps",
    "",
    ...APPS.filter((a) => a.href).map((a) => link(a.name, a.href!, `${a.tagline} ${a.ai}`)),
    "",
    "## Optional",
    "",
    link("Faith: honest answers to questions about God", "/faith", "Ask questions about God, read common answers, and find a church nearby."),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
