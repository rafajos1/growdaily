import type { Metadata } from "next";
import { PlanwiseApp } from "./PlanwiseApp";

export const metadata: Metadata = {
  title: "Planwise · GrowDaily",
  description: "Free AI day planner: dump everything on your mind and get a realistic, time-blocked plan for today, with a focus timer.",
};

export default function PlanwisePage() {
  return <PlanwiseApp />;
}
