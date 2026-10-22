import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { PilotwiseApp } from "./PilotwiseApp";
import { ACCENT } from "./ui";

const about = ABOUT.pilotwise;

export const metadata: Metadata = pageMetadata({
  title: "Pilotwise: Free AI Pilot Planner, from Pilot to Production · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Pilotwise", "Get your AI pilot into production", ACCENT),
});

export default function Page() {
  return (
    <>
      <PilotwiseApp />
      <AppAbout content={about} accent={ACCENT} />
    </>
  );
}
