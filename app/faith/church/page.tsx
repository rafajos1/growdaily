import type { Metadata } from "next";
import { ChurchApp } from "./ChurchApp";

export const metadata: Metadata = {
  title: "Find a church near you · GrowDaily",
  description: "Find Christian churches near you, and know what to expect on your first visit. No pressure, no sign-up.",
};

export default function ChurchPage() {
  return <ChurchApp />;
}
