import type { Metadata } from "next";
import { ogImage, pageMetadata, SITE_NAME, SITE_URL } from "../lib/seo";
import { JsonLd } from "./components/JsonLd";
import { HomePage } from "./HomePage";

export const metadata: Metadata = pageMetadata({
  title: "GrowDaily: Free AI Apps for Money, Habits, Time, Food & Mood",
  description: "Free, private apps to run your life better: an expense tracker, habit tracker, AI day planner, meal ideas from your fridge and a mood tracker. No sign-up, and your data stays on your device.",
  path: "/",
  image: ogImage("Free AI apps to run your life better", "Money, habits, time, food and mood. No sign-up."),
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
