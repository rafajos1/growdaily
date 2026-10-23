import { AGENT_GUIDES } from "./agents";
import { CHURCH_GUIDES } from "./churches";
import { DELIVERY_GUIDES } from "./delivery";
import { EVERYDAY_GUIDES } from "./everyday";
import { ORGANIZATION_GUIDES } from "./organizations";
import { SECURITY_GUIDES } from "./security";
import type { Guide, TopicId } from "./types";
import { WORKPLACE_GUIDES } from "./workplace";

export type { Block, Guide, Service, TopicId } from "./types";

export const GUIDES: Guide[] = [...DELIVERY_GUIDES, ...AGENT_GUIDES, ...WORKPLACE_GUIDES, ...SECURITY_GUIDES, ...CHURCH_GUIDES, ...ORGANIZATION_GUIDES, ...EVERYDAY_GUIDES];

export const TOPICS: { id: TopicId; title: string; blurb: string }[] = [
  { id: "delivery", title: "AI projects & delivery", blurb: "Getting AI from pilot to production: why pilots fail, exit criteria and planning." },
  { id: "agents", title: "AI agents", blurb: "What agents are, real examples, MCP, and how to start safely." },
  { id: "workplace", title: "Using AI at work", blurb: "Everyday uses, prompts, policies and team training." },
  { id: "security", title: "AI security & privacy", blurb: "Keeping your data safe: shadow AI, training settings, private AI and AI-powered scams." },
  { id: "churches", title: "Churches & ministries", blurb: "Reaching and welcoming new people, church AI policies, sermon prep, and a chatbot for your website." },
  { id: "organizations", title: "For your organization", blurb: "Where to start as a business or nonprofit of any size." },
  { id: "everyday", title: "Everyday life", blurb: "Simple, research-backed answers for money, meals, planning your day, habits and mood." },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const guidesIn = (topic: TopicId) => GUIDES.filter((g) => g.topic === topic);
