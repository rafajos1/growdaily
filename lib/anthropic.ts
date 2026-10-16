import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

// Created on first use rather than at import time, so `next build`
// doesn't need ANTHROPIC_API_KEY to be set.
export function getAnthropic(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export const CLAUDE_MODEL = "claude-opus-5-5";

/** Sends a single-turn prompt to Claude and returns the text of the reply. */
export async function generateText(prompt: string, options: { system?: string; maxTokens?: number } = {}): Promise<string> {
  const response = await getAnthropic().beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens ?? 16000,
    ...(options.system ? { system: options.system } : {}),
    // If a safety classifier declines the request, re-run it server-side on
    // Anthropic's recommended fallback model instead of failing.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Claude declined to generate a response for this request.");
  }

  return response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();
}

/**
 * Sends a single-turn prompt and returns Claude's reply parsed as JSON. The reply
 * is constrained to `schema` with structured outputs, so it is always valid JSON
 * of that shape (callers should still validate the values).
 */
export async function generateJSON<T>(
  prompt: string,
  schema: Record<string, unknown>,
  options: { system?: string; maxTokens?: number; effort?: "low" | "medium" | "high" } = {},
): Promise<T> {
  const response = await getAnthropic().beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens ?? 16000,
    ...(options.system ? { system: options.system } : {}),
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    // Effort sets how much the model thinks before answering (claude-opus-5-5 defaults to medium).
    output_config: { format: { type: "json_schema", schema }, ...(options.effort ? { effort: options.effort } : {}) },
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Claude declined to generate a response for this request.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("Claude's response was cut off before it finished.");
  }

  const text = response.content.map((block) => (block.type === "text" ? block.text : "")).join("");
  return JSON.parse(text) as T;
}
