import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/seo";
import { AskApp } from "./AskApp";

export const metadata: Metadata = pageMetadata({
  title: "Ask Questions About God, Jesus and the Bible · GrowDaily",
  description: "Ask anything about God, Jesus or the Bible and get an honest answer in plain words, with passages to read for yourself. Free, private, and doubts are welcome.",
  path: "/faith/ask",
});

export default function AskPage() {
  return <AskApp />;
}
