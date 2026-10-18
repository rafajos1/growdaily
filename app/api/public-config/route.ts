import { NextResponse } from "next/server";
import { supabaseSettings } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

// The Supabase URL and anon key are public by design (row-level security protects the data).
// Served at runtime so the static Spendwise page can use them for "Save my progress".
export function GET() {
  return NextResponse.json(
    {
      supabaseUrl: supabaseSettings().url ?? null,
      supabaseAnonKey: supabaseSettings().anonKey ?? null,
      // Turned on in Vercel (SYNC_ENABLED=1) once supabase/app_state.sql has run and email sign-in is set up.
      syncEnabled: process.env.SYNC_ENABLED === "1",
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
