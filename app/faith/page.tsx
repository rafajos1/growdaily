import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { FaithLanding } from "./FaithLanding";

export const metadata: Metadata = pageMetadata({
  title: "Questions About God Are Welcome Here · GrowDaily",
  description: "Curious about God? Ask honest questions, find a church near you, and turn on Faith in GrowDaily's free apps: daily encouragement, prayer and gratitude habits, and an evening reflection.",
  path: "/faith",
});

export default function FaithPage() {
  return <FaithLanding />;
}
