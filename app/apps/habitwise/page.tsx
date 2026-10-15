import type { Metadata } from "next";
import { HabitwiseApp } from "./HabitwiseApp";

export const metadata: Metadata = {
  title: "Habitwise · GrowDaily",
  description: "Free habit tracker: check off daily habits, build streaks, and get a short AI review each week. Your data stays in your browser.",
};

export default function HabitwisePage() {
  return <HabitwiseApp />;
}
