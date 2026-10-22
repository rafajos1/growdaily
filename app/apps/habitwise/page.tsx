import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { ProblemLine } from "../../components/ProblemLine";
import { HabitwiseApp } from "./HabitwiseApp";

const about = ABOUT.habitwise;

export const metadata: Metadata = pageMetadata({
  title: "Habitwise: Free Habit Tracker with Streaks · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Habitwise", "Free Habit Tracker with Streaks", "#53cfa0"),
});

export default function Page() {
  return (
    <>
      <HabitwiseApp intro={<ProblemLine content={about} />} />
      <AppAbout content={about} accent="#53cfa0" />
    </>
  );
}
