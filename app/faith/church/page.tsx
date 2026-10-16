import type { Metadata } from "next";
import { FIRST_VISIT } from "../../../lib/faith/firstVisit";
import { faqSchema, pageMetadata } from "../../../lib/seo";
import { JsonLd } from "../../components/JsonLd";
import { ChurchApp } from "./ChurchApp";

export const metadata: Metadata = pageMetadata({
  title: "Find a Church Near You, and What to Expect · GrowDaily",
  description: "Find Christian churches near you, with directions and websites, and know what to expect on your first visit: how long it lasts, what to wear, kids and more. No pressure, no sign-up.",
  path: "/faith/church",
});

export default function ChurchPage() {
  return (
    <>
      <JsonLd data={faqSchema(FIRST_VISIT)} />
      <ChurchApp />
    </>
  );
}
