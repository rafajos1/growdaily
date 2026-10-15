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
