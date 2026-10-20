import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { QuotewiseApp } from "./QuotewiseApp";
import { ACCENT } from "./ui";

const about = ABOUT.quotewise;

export const metadata: Metadata = pageMetadata({
  title: "Quotewise: Free Quote, Estimate & Invoice Maker with AI · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Quotewise", "Free quote, estimate & invoice maker", ACCENT),
});

export default function Page() {
  return (
    <>
      <QuotewiseApp />
      <AppAbout content={about} accent={ACCENT} />
    </>
  );
}
