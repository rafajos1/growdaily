import { NextResponse } from "next/server";
import { generateJSON } from "../../../../lib/anthropic";
import { isCrisis, MAX_TEXT, normalizeTurn, promptFor, sanitizeContext, SCHEMAS, VOICE, type CheckinType, type TurnRequest } from "../../../../lib/faith/barnabas";
import { allowDaily, clientIp } from "../../../../lib/rateLimit";

const KINDS = ["area", "why", "when", "reply", "checkin"] as const;
const CHECKINS: CheckinType[] = ["checkin", "verse", "followup", "noreply", "silence", "reflect"];

/** Writes one Barnabas text: an onboarding step, a reply, or a check-in he sends first. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = KINDS.find((k) => k === body.kind);
  if (!kind) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const context = sanitizeContext(body.context);

  let turn: TurnRequest;
  if (kind === "checkin") {
    const type = CHECKINS.find((t) => t === body.type);
    if (!type) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    turn = { kind, type, context };
  } else {
    const text = typeof body.text === "string" ? body.text.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT) : "";
    if (!text) return NextResponse.json({ error: "Type a message first." }, { status: 400 });
    // The fixed rules run here too, so a crisis never depends on the browser or the AI.
    if (isCrisis(text)) return NextResponse.json({ result: { reply: "", concern: "crisis" } });
    turn = { kind, text, context };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Live AI isn't available right now." }, { status: 503 });
  }
  if (!allowDaily(`barnabas:${clientIp(req)}`, 60)) {
    return NextResponse.json({ error: "That's a lot of texts for one day. Barnabas will keep going in scripted mode." }, { status: 429 });
  }

  try {
    const raw = await generateJSON(promptFor(turn), SCHEMAS[turn.kind], { system: VOICE, maxTokens: 2000, effort: "low" });
    const result = normalizeTurn(turn, raw);
    if (!result) throw new Error("empty reply");
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Barnabas failed", err);
    return NextResponse.json({ error: "Barnabas couldn't write that one." }, { status: 502 });
  }
}
