import { generateText } from "../../../lib/anthropic";
import { getSupabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const { data: user } = await getSupabase()
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Step 1: Scan trends
  const trends = await generateText(
    `List 3 trending content themes today for ${user.niche} creators on ${user.platform}.`
  );

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

  const message = await generateText(prompt);
  await getSupabase().from("ideas").insert({ user_id: userId, idea: message });

  return NextResponse.json({ message });
}