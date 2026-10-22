import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { ProblemLine } from "../../components/ProblemLine";
import { PlanwiseApp } from "./PlanwiseApp";

const about = ABOUT.planwise;

export const metadata: Metadata = pageMetadata({
  title: "Planwise: Free AI Day Planner · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Planwise", "Free AI Day Planner", "#5cb8e6"),
});

export default function Page() {
  return (
    <>
      <PlanwiseApp intro={<ProblemLine content={about} />} />
      <AppAbout content={about} accent="#5cb8e6" />
    </>
  );
}
