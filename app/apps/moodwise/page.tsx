import type { Metadata } from "next";
import { MoodwiseApp } from "./MoodwiseApp";

export const metadata: Metadata = {
  title: "Moodwise · GrowDaily",
  description: "Free two-minute daily mood check-in. See what goes with your best days, with private notes that never leave your device.",
};

export default function MoodwisePage() {
  return <MoodwiseApp />;
}
