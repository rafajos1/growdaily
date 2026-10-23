import type { Metadata } from "next";
import { ogImage, pageMetadata, SITE_NAME, SITE_URL } from "../lib/seo";
import { JsonLd } from "./components/JsonLd";
import { HomePage } from "./HomePage";

export const metadata: Metadata = pageMetadata({
  title: "GrowDaily: Build Your Own AI Apps with Claude, With a Guide",
  description: "You don't have to be a developer to build your own apps with Claude. GrowDaily guides business owners and nonprofit leaders from idea to a working tool, in plain English. See real examples and try them free.",
  path: "/",
  image: ogImage("You know the tool you need. Let's build it together.", "Guided AI app building for non-technical builders"),
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
