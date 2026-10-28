/** Guides in the Learn section: plain-English answers to what teams search about using AI at work. */

export type Block =
  | string
  | { list: string[] }
  | { steps: { title: string; text: string }[] }
  | { template: { title: string; text: string } }
  | { code: { title: string; text: string } }
  | { callout: string };

export type TopicId = "delivery" | "agents" | "workplace" | "security" | "churches" | "organizations" | "everyday" | "build";

export type Service = "ai-training" | "ai-consulting" | "build" | "guided-build" | "church-assistant";

export interface Guide {
  slug: string;
  topic: TopicId;
  /** The page's H1, phrased the way people search. */
  title: string;
  /** <title> tag; kept under ~60 characters before the site name where possible. */
  seoTitle: string;
  description: string;
  /** Two or three sentences that answer the question on their own. */
  shortAnswer: string;
  sections: { heading: string; blocks: Block[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
  /** The service this guide naturally leads to. */
  service: Service;
  /** A featured YouTube video, credited to its creator. Only add one we've watched and approved. */
  video?: { id: string; title: string; creator: string; channelUrl: string };
  /** Our own commentary on the featured video, shown at the end of the guide. */
  ourTake?: string[];
  /** A free GrowDaily app that solves the problem; shown instead of the service pitch. */
  tool?: { name: string; href: string; pitch: string };
  published: string;
  updated: string;
  sources?: { label: string; url: string }[];
}
