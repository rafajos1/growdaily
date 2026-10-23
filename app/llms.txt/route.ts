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
    "> GrowDaily guides non-technical builders (business owners, nonprofit leaders, church teams and anyone curious) to build their own AI apps with Claude. It publishes free example apps built with Claude, plain-English guides to using and building with AI, and offers guided builds, AI training, AI plans and custom apps.",
    "",
    ...TOPICS.flatMap((t) => [`## Guides: ${t.title}`, "", ...guidesIn(t.id).map((g) => link(g.title, `/learn/${g.slug}`, g.shortAnswer)), ""]),
    "## About",
    "",
    link("About GrowDaily", "/about", "Run by Rafael, a guide for non-technical builders, with 25+ years leading enterprise data, analytics and AI transformation."),
    "",
    "## Services",
    "",
    link("Build your own AI apps, with a guide", "/build", "Guided builds where you build your own app with Claude, plus team training, AI plans, custom apps and ongoing care. Quoted up front."),
    ...SERVICE_PAGES.map((p) => link(p.h1, `/build/${p.slug}`, p.description)),
    ...AUDIENCES.map((a) => link(a.h1, `/build/${a.slug}`, a.description)),
    "",
    "## Example apps built with Claude (free)",
    "",
    ...APPS.filter((a) => a.href).map((a) => link(a.name, a.href!, `${a.tagline} ${a.ai}`)),
    "",
    "## Example tools for businesses (free)",
    "",
    link("Pilotwise: free AI pilot planner", "/apps/pilotwise", "Turn an AI use case into a pilot-to-production plan: readiness score, go/no-go exit criteria, agile phases, ROAM risks and an executive brief."),
    link("Cafewise: free coffee shop inventory app", "/apps/cafewise", "Quick stock counts, order lists from par levels, cost per drink and margin, a waste log and an AI ordering review."),
    link("Quotewise: free quote, estimate and invoice maker", "/apps/quotewise", "Describe a job and AI drafts the line items; print, save as PDF or email it, and turn it into an invoice."),
    link("Roomwise: free room booking for churches, offices and shared spaces", "/apps/roomwise", "A floor-plan map of your building, conflict-free bookings with weekly repeats, requests to confirm, and AI room search."),
    "",
    "## Optional",
    "",
    link("Faith: honest answers to questions about God", "/faith", "Ask questions about God, read common answers, and find a church nearby."),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
