import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/seo";
import { BuildFooter, BuildHeader } from "../../build/parts";
import { ChurchAssistantDemo } from "./ChurchAssistantDemo";

export const metadata: Metadata = pageMetadata({
  title: "Church AI Assistant That Answers Only From Your Content · GrowDaily",
  description: "Try a church website assistant that answers only from the church's own sermons, beliefs and information, shows its source for every answer, and won't guess when it doesn't know.",
  path: "/demo/church-assistant",
});

export default function Page() {
  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <BuildHeader />
      <ChurchAssistantDemo />
      <BuildFooter />
    </div>
  );
}
