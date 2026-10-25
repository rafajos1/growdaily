import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/seo";
import { BarnabasApp } from "./BarnabasApp";

// Test build: kept out of search and the sitemap, and not linked from the site yet.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Barnabas · A Friend Who Checks In on You · GrowDaily",
    description: "Barnabas is an AI accountability companion for Christians. He texts like a friend, checks in at the moments you said are hardest, and real people pray with you.",
    path: "/faith/barnabas",
  }),
  robots: { index: false, follow: false },
};

export default function BarnabasPage() {
  return <BarnabasApp />;
}
