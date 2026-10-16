import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
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
      <PlanwiseApp />
      <AppAbout content={about} accent="#5cb8e6" />
    </>
  );
}
