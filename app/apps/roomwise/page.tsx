import type { Metadata } from "next";
import { ogImage, pageMetadata } from "../../../lib/seo";
import { ABOUT } from "../../about";
import { AppAbout } from "../../components/AppAbout";
import { RoomwiseApp } from "./RoomwiseApp";
import { ACCENT } from "./ui";

const about = ABOUT.roomwise;

export const metadata: Metadata = pageMetadata({
  title: "Roomwise: Free Room Booking for Churches, Offices & Spaces · GrowDaily",
  description: about.description,
  path: about.path,
  image: ogImage("Roomwise", "Free room booking with a floor plan", ACCENT),
});

export default function Page() {
  return (
    <>
      <RoomwiseApp />
      <AppAbout content={about} accent={ACCENT} />
    </>
  );
}
