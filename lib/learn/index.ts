import { AGENT_GUIDES } from "./agents";
import { CHURCH_GUIDES } from "./churches";
import { ORGANIZATION_GUIDES } from "./organizations";
import { SECURITY_GUIDES } from "./security";
import type { Guide, TopicId } from "./types";
import { WORKPLACE_GUIDES } from "./workplace";

export type { Block, Guide, Service, TopicId } from "./types";

export const GUIDES: Guide[] = [...AGENT_GUIDES, ...WORKPLACE_GUIDES, ...SECURITY_GUIDES, ...CHURCH_GUIDES, ...ORGANIZATION_GUIDES];

export const TOPICS: { id: TopicId; title: string; blurb: string }[] = [
  { id: "agents", title: "AI agents", blurb: "What agents are, real examples, MCP, and how to start safely." },
  { id: "workplace", title: "Using AI at work", blurb: "Everyday uses, prompts, policies and team training." },
  { id: "security", title: "AI security & privacy", blurb: "Keeping your data safe: shadow AI, training settings, private AI and AI-powered scams." },
  { id: "churches", title: "Churches & ministries", blurb: "Reaching and welcoming new people, church AI policies, sermon prep, and a chatbot for your website." },
  { id: "organizations", title: "For your organization", blurb: "Where to start as a small business or nonprofit." },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidesIn = (topic: TopicId) => GUIDES.filter((g) => g.topic === topic);
