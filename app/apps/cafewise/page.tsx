import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { CafewiseApp } from "./CafewiseApp";
import { ACCENT } from "./ui";

const about = ABOUT.cafewise;

export const metadata: Metadata = pageMetadata({
  title: "Cafewise: Free Coffee Shop Inventory & Drink Cost App · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Cafewise", "Free coffee shop inventory & drink costs", ACCENT),
});

export default function Page() {
  return (
    <>
      <CafewiseApp />
      <AppAbout content={about} accent={ACCENT} />
    </>
  );
}
