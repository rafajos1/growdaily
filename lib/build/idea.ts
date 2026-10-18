/** "Tell us your idea" on /build: validation and the AI's quick sketch of a first version. */

export const ORG_TYPES = ["Church or ministry", "Small business", "Nonprofit", "Something else"] as const;
export type OrgType = (typeof ORG_TYPES)[number];

export interface IdeaSketch {
  name: string;
  oneLiner: string;
  features: string[];
  firstVersion: string;
  aiRole: string;
}

export const SKETCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "oneLiner", "features", "firstVersion", "aiRole"],
  properties: {
    name: { type: "string" },
    oneLiner: { type: "string" },
    features: { type: "array", items: { type: "string" } },
    firstVersion: { type: "string" },
    aiRole: { type: "string" },
  },
} as const;

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().replace(/\s+/g, " ").slice(0, max) : "");

export function normalizeSketch(raw: unknown): IdeaSketch | null {
  const r = (raw ?? {}) as Record<string, unknown>;
  const sketch = {
    name: clean(r.name, 40),
    oneLiner: clean(r.oneLiner, 200),
    features: (Array.isArray(r.features) ? r.features : []).map((f) => clean(f, 160)).filter(Boolean).slice(0, 4),
    firstVersion: clean(r.firstVersion, 400),
    aiRole: clean(r.aiRole, 400),
  };
  return sketch.name && sketch.oneLiner && sketch.features.length > 0 ? sketch : null;
}

export interface IdeaInput {
  name: string;
  email: string;
  orgType: OrgType;
  idea: string;
}

/** Checks a submitted idea; returns the cleaned input or a message for the person. */
export function validateIdea(body: Record<string, unknown>): IdeaInput | { error: string } {
  const name = clean(body.name, 100);
  const email = clean(body.email, 200).toLowerCase();
  const orgType = ORG_TYPES.find((t) => t === body.orgType) ?? "Something else";
  const idea = typeof body.idea === "string" ? body.idea.trim().slice(0, 2001) : "";
  if (!name) return { error: "Add your name so we know who to reply to." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (idea.length < 20) return { error: "Tell us a little more about your idea (a sentence or two is plenty)." };
  if (idea.length > 2000) return { error: "Keep your idea under 2,000 characters. We'll talk through the details on the call." };
  return { name, email, orgType, idea };
}
