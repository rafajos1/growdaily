import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AUDIENCES } from "../../app/build/content";
import { GUIDES, guideBySlug, TOPICS } from "./index";

describe("Learn guides", () => {
  it("have unique, URL-safe slugs", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const g of GUIDES) expect(g.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("link only to guides that exist, never to themselves", () => {
    for (const g of GUIDES) {
      for (const r of g.related) {
        expect(guideBySlug(r), `${g.slug} → ${r}`).toBeDefined();
        expect(r).not.toBe(g.slug);
      }
    }
  });

  it("fit search result limits", () => {
    for (const g of GUIDES) {
      expect(g.seoTitle.length, g.slug).toBeLessThanOrEqual(62);
      expect(g.description.length, g.slug).toBeLessThanOrEqual(200);
      expect(g.description.length, g.slug).toBeGreaterThan(80);
    }
  });

  it("answer up front and have FAQs, sections and a known topic", () => {
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const g of GUIDES) {
      expect(topics.has(g.topic)).toBe(true);
      expect(g.shortAnswer.length).toBeGreaterThan(80);
      expect(g.sections.length).toBeGreaterThanOrEqual(2);
      expect(g.faqs.length).toBeGreaterThanOrEqual(2);
      expect(g.updated >= g.published).toBe(true);
      for (const s of g.sources ?? []) expect(s.url).toMatch(/^https:\/\//);
    }
  });

  it("use inline links that point at real pages", () => {
    for (const g of GUIDES) {
      const text = g.sections.flatMap((s) => s.blocks.map((b) => JSON.stringify(b))).join(" ");
      for (const [, href] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (!href.startsWith("/")) continue;
        expect(href, g.slug).not.toBe(`/learn/${g.slug}`);
        const learn = href.match(/^\/learn\/([a-z0-9-]+)$/);
        const audience = href.match(/^\/build\/([a-z-]+)$/);
        if (learn) expect(guideBySlug(learn[1]), `${g.slug} → ${href}`).toBeDefined();
        else if (audience && AUDIENCES.some((x) => x.slug === audience[1])) continue;
        else expect(existsSync(join(process.cwd(), "app", href.split("#")[0], "page.tsx")), `${g.slug} → ${href}`).toBe(true);
      }
    }
  });
});
