import type { Metadata } from "next";
import { FaithLanding } from "./FaithLanding";

export const metadata: Metadata = {
  title: "Faith · GrowDaily",
  description: "Questions about God are welcome here. Turn on Faith and GrowDaily's free apps leave room for God in your day: a daily verse, prayer and gratitude habits, and an evening reflection.",
};

export default function FaithPage() {
  return <FaithLanding />;
}
