import { NextResponse } from "next/server";
import { generateJSON } from "../../../../lib/anthropic";
import { ANSWER_SCHEMA, checkAnswer, MAX_QUESTION, systemPrompt } from "../../../../lib/church-demo/ask";
import { allowDaily, clientIp } from "../../../../lib/rateLimit";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Live answers aren't available right now. Please try again later." }, { status: 503 });
  }

  let body: { question?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.replace(/\s+/g, " ").trim() : "";
  if (question.length < 3) return NextResponse.json({ error: "Type a question first." }, { status: 400 });
  if (question.length > MAX_QUESTION) return NextResponse.json({ error: `Keep your question under ${MAX_QUESTION} characters.` }, { status: 400 });

  if (!allowDaily(`church-demo:${clientIp(req)}`, 20)) {
    return NextResponse.json({ error: "You've tried a lot of questions today. Come back tomorrow, or book a free call to see it with your own church's content." }, { status: 429 });
  }

  try {
    const raw = await generateJSON(`<question>\n${question}\n</question>`, ANSWER_SCHEMA, { system: systemPrompt(), maxTokens: 4000, effort: "low" });
    return NextResponse.json({ answer: checkAnswer(raw, question) });
  } catch (err) {
    console.error("Church demo failed", err);
    return NextResponse.json({ error: "We couldn't answer that right now. Please try again in a moment." }, { status: 502 });
  }
}
