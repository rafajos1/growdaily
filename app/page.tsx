import type { Metadata } from "next";
import { ogImage, pageMetadata, SITE_NAME, SITE_URL } from "../lib/seo";
import { JsonLd } from "./components/JsonLd";
import { HomePage } from "./HomePage";

export const metadata: Metadata = pageMetadata({
  title: "GrowDaily: Get AI From Pilot to Production + Free AI Tools",
  description: "Pilotwise, a free AI pilot planner: readiness check, go/no-go exit criteria, phases, risks and a one-page sponsor brief. Plus free AI guides and business tools. No sign-up.",
  path: "/",
  image: ogImage("Get your AI pilot into production", "Free AI pilot planner, guides and tools. No sign-up."),
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
