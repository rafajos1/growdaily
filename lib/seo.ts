import type { Metadata } from "next";

export const SITE_URL = "https://www.growdaily.ai";
export const SITE_NAME = "GrowDaily";

/** A social preview image in GrowDaily's own style, drawn by /og. */
export function ogImage(title: string, subtitle = "", color = "#f2b54b"): string {
  return `/og?${new URLSearchParams({ title, subtitle, color })}`;
}

/**
 * Search and social metadata for one page: title, description, canonical
 * address, Open Graph and Twitter cards with a matching preview image.
 */
export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const img = image ?? ogImage(title.split(" · ")[0], description.split(". ")[0]);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_US", images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

/** Structured data for a free web app, so search engines know what it is. */
export function webAppSchema({ name, path, description, category }: { name: string; path: string; description: string; category: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: category,
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
