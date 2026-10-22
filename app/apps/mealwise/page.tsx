import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { ProblemLine } from "../../components/ProblemLine";
import { MealwiseApp } from "./MealwiseApp";

const about = ABOUT.mealwise;

export const metadata: Metadata = pageMetadata({
  title: "Mealwise: What Can I Cook With What I Have? · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Mealwise", "What Can I Cook With What I Have?", "#ef7fa8"),
});

export default function Page() {
  return (
    <>
      <MealwiseApp intro={<ProblemLine content={about} />} />
      <AppAbout content={about} accent="#ef7fa8" />
    </>
  );
}
