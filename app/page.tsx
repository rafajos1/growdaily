import type { Metadata } from "next";
import { ogImage, pageMetadata, SITE_NAME, SITE_URL } from "../lib/seo";
import { JsonLd } from "./components/JsonLd";
import { HomePage } from "./HomePage";

export const metadata: Metadata = pageMetadata({
  title: "GrowDaily: AI Governance for Businesses & Nonprofits",
  description: "Practical AI governance for businesses and nonprofits: find the AI tools your people use, set clear rules, and train your team. Free AI governance kit and a free 20-minute call.",
  path: "/",
  image: ogImage("Use AI with confidence. Stay in control.", "AI governance for businesses and nonprofits"),
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL },
            { "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: SITE_NAME, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: "en-US" },
          ],
        }}
      />
      <HomePage />
    </>
  );
}
