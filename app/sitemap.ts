import type { MetadataRoute } from "next";
import { slugFor, STARTERS } from "../lib/faith/ask";
import { SITE_URL } from "../lib/seo";
import { APPS } from "./apps";
import { AUDIENCES, SERVICE_PAGES } from "./build/content";
import { GUIDES } from "../lib/learn";

/** Every public page, for search engines. Served at /sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({ url: `${SITE_URL}${path}`, changeFrequency, priority });
  return [
    page("", 1, "weekly"),
    ...APPS.filter((a) => a.href).map((a) => page(a.href!, 0.9)),
    page("/faith", 0.8),
    page("/faith/ask", 0.8),
    page("/demo/church-assistant", 0.8),
    page("/faith/church", 0.7),
    page("/faith/questions", 0.7),
    ...STARTERS.map((s) => page(`/faith/questions/${slugFor(s.question)}`, 0.6)),
    page("/apps/pilotwise", 0.9),
    page("/apps/cafewise", 0.8),
    page("/apps/quotewise", 0.8),
    page("/apps/roomwise", 0.8),
    page("/learn", 0.9, "weekly"),
    ...GUIDES.map((g) => ({ url: `${SITE_URL}/learn/${g.slug}`, lastModified: g.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    page("/build", 0.8),
    ...SERVICE_PAGES.map((p) => page(`/build/${p.slug}`, 0.7)),
    ...AUDIENCES.map((a) => page(`/build/${a.slug}`, 0.7)),
    page("/about", 0.5),
    page("/privacy", 0.2),
  ];
}
