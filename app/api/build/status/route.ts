import { NextResponse } from "next/server";
import { allowDaily, clientIp } from "../../../../lib/rateLimit";
import { getSupabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Setup check for the /build quote form: is the Supabase table there, and are
 * the email settings present and accepted by Resend? Reports yes/no only,
 * never keys or addresses. Open /api/build/status in a browser.
 */
export async function GET(req: Request) {
  if (!allowDaily(`build-status:${clientIp(req)}`, 30)) return NextResponse.json({ error: "Try again tomorrow." }, { status: 429 });

  let database: string;
  try {
    const { error } = await getSupabase().from("build_inquiries").select("id").limit(0);
    database = !error ? "ok" : error.code === "42P01" || error.code === "PGRST205" || /does not exist|schema cache/i.test(error.message) ? "missing table: run supabase/build_inquiries.sql" : `error: ${[error.code, error.message].filter(Boolean).join(" ").slice(0, 160)}`;
  } catch {
    database = "not configured";
  }

  const key = process.env.RESEND_API_KEY;
  let resendKey = "missing";
  if (key) {
    try {
      const res = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000) });
      const body = (await res.json().catch(() => ({}))) as { name?: string };
      resendKey = res.ok ? "ok" : body.name === "restricted_api_key" ? "ok (sending only)" : res.status === 401 || res.status === 403 ? "rejected by Resend: create a new key" : `error ${res.status}`;
    } catch {
      resendKey = "couldn't reach Resend";
    }
  }

  return NextResponse.json({
    database,
    email: {
      RESEND_API_KEY: resendKey,
      INQUIRY_EMAIL: process.env.INQUIRY_EMAIL ? "set" : "missing",
      note: "Until you verify a domain in Resend, INQUIRY_EMAIL must be the exact email of your Resend account.",
    },
  });
}
