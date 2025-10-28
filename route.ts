import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  // Later, replace this with OneSignal, FCM, or Expo SDK call
  const { data: users, error } = await supabase.from("users").select("id, email, niche, tone");

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  // Simulate sending push notifications
  for (const user of users || []) {
    console.log(`🔔 Would send push to ${user.email} (${user.niche}, ${user.tone})`);
  }

  return NextResponse.json({ message: "Simulated push notifications complete" });
}
