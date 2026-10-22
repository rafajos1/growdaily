import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { ProblemLine } from "../../components/ProblemLine";
import { MoodwiseApp } from "./MoodwiseApp";

const about = ABOUT.moodwise;

export const metadata: Metadata = pageMetadata({
  title: "Moodwise: Free Private Mood Tracker · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Moodwise", "Free Private Mood Tracker", "#b48cf2"),
});

export default function Page() {
  return (
    <>
      <MoodwiseApp intro={<ProblemLine content={about} />} />
      <AppAbout content={about} accent="#b48cf2" />
    </>
  );
}
