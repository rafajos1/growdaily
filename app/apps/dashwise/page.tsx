import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { ProblemLine } from "../../components/ProblemLine";
import { ACCENT } from "./accent";
import { DashwiseApp } from "./DashwiseApp";

const about = ABOUT.dashwise;

export const metadata: Metadata = pageMetadata({
  title: "Dashwise: Free AI Dashboard Demo (Beta) · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Dashwise", "AI dashboard demo · new, in beta", ACCENT),
});

export default function Page() {
  return (
    <>
      <DashwiseApp intro={<ProblemLine content={about} />} />
      <AppAbout content={about} accent={ACCENT} />
    </>
  );
}
