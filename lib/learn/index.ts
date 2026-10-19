import { AGENT_GUIDES } from "./agents";
import { ORGANIZATION_GUIDES } from "./organizations";
import type { Guide, TopicId } from "./types";
import { WORKPLACE_GUIDES } from "./workplace";

export type { Block, Guide, Service, TopicId } from "./types";

export const GUIDES: Guide[] = [...AGENT_GUIDES, ...WORKPLACE_GUIDES, ...ORGANIZATION_GUIDES];

export const TOPICS: { id: TopicId; title: string; blurb: string }[] = [
  { id: "agents", title: "AI agents", blurb: "What agents are, real examples, MCP, and how to start safely." },
  { id: "workplace", title: "Using AI at work", blurb: "Everyday uses, prompts, policies, training and data safety." },
  { id: "organizations", title: "For your organization", blurb: "Where to start as a small business, nonprofit or church." },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidesIn = (topic: TopicId) => GUIDES.filter((g) => g.topic === topic);
