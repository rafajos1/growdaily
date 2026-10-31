import { NextResponse } from "next/server";
import { generateJSON } from "../../../lib/anthropic";
import { buildPrompt, CHECKIN_TYPES, cleanMemory, cleanThread, isCrisis, MAX_TEXT, SCHEMAS, shapeResult, VOICE, type CheckinType, type Step } from "../../../lib/barnabas/core";
import { allowDaily, clientIp } from "../../../lib/rateLimit";

const STEPS: Step[] = ["area", "why", "when", "reply", "checkin"];

/** One Barnabas turn. Nothing is stored on the server; the conversation lives in the person's browser. */
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const step = STEPS.find((s) => s === body.step);
  if (!step) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const text = typeof body.text === "string" ? body.text.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT) : "";
  if (step !== "checkin" && !text) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Crisis language never goes to the AI: the browser shows fixed crisis help.
  if (text && isCrisis(text)) return NextResponse.json({ crisis: true });

  if (!allowDaily(`barnabas:${clientIp(req)}`, 80)) {
    return NextResponse.json({ error: "limit" }, { status: 429 });
  }

  const checkin = CHECKIN_TYPES.find((t) => t === body.checkin) as CheckinType | undefined;
  const when = typeof body.when === "string" ? body.when.slice(0, 40) : "";
  const prompt = buildPrompt(step, { text, mem: cleanMemory(body.mem), thread: cleanThread(body.thread), checkin, when });

  try {
    const raw = await generateJSON(prompt, SCHEMAS[step], { system: VOICE, maxTokens: 2000, effort: "low" });
    return NextResponse.json(shapeResult(step, raw));
  } catch (err) {
    console.error("Barnabas turn failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
