import type { Metadata } from "next";
import { MealwiseApp } from "./MealwiseApp";

export const metadata: Metadata = {
  title: "Mealwise · GrowDaily",
  description: "Free AI meal ideas: tell it what's in your fridge and get three meals you can make tonight, plus a grocery list for what's missing.",
};

export default function MealwisePage() {
  return <MealwiseApp />;
}
