import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The Supabase URL and anon key are public by design (row-level security protects the data).
// Served at runtime so the static Spendwise page can use them for "Save my progress".
export function GET() {
  return NextResponse.json(
    { supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null, supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
