import openai from "../../../lib/openai";
import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Step 1: Scan trends
  const trendScan = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `List 3 trending content themes today for ${user.niche} creators on ${user.platform}.`
      }
    ]
  });

  const trends = trendScan.choices[0].message.content?.trim();

  // Step 2: Generate content pushes
  const prompt = `
You are a creative strategist for ${user.niche} influencers.
Voice: ${user.tone}. Platform: ${user.platform}.
Trending topics: ${trends}.

Generate 3 short content pushes. Each push includes:
1️⃣ Hook/title
2️⃣ Concept or action idea
3️⃣ Why it fits the trend
${user.faith_layer ? "End with a short faith reflection line." : ""}
`;

  const ideas = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const message = ideas.choices[0].message.content?.trim();
  await supabase.from("ideas").insert({ user_id: userId, idea: message });

  return NextResponse.json({ message });
}