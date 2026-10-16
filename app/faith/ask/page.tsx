import type { Metadata } from "next";
import { AskApp } from "./AskApp";

export const metadata: Metadata = {
  title: "Ask your questions · GrowDaily",
  description: "Ask anything about God, Jesus or the Bible and get an honest answer in plain words, with passages to read for yourself. Doubts welcome.",
};

export default function AskPage() {
  return <AskApp />;
}
