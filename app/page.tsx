import type { Metadata } from "next";
import { ogImage, pageMetadata, SITE_NAME, SITE_URL } from "../lib/seo";
import { JsonLd } from "./components/JsonLd";
import { HomePage } from "./HomePage";

export const metadata: Metadata = pageMetadata({
  title: "GrowDaily: Simple AI Tools for Businesses & Nonprofits, Built With You",
  description: "Simple AI tools that save your team hours every week. GrowDaily guides businesses and nonprofits, including churches, from idea to a working tool, or builds it for you. Start with a free 20-minute call.",
  path: "/",
  image: ogImage("You know the tool you need. Let's build it together.", "Simple AI tools for businesses and nonprofits"),
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
