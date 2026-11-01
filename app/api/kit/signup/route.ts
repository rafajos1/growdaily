import { NextResponse } from "next/server";
import { ORG_TYPES, type IdeaInput } from "../../../../lib/build/idea";
import { sendInquiryAlert } from "../../../../lib/build/notify";
import { allowDaily, clientIp } from "../../../../lib/rateLimit";
import { getSupabase } from "../../../../lib/supabase";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/**
 * Sign-up for the free AI governance kit. Only contact details are sent; the
 * person's list of AI tools stays in their browser. Saved with the other
 * inquiries and emailed, like a quote request, so it's never lost.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  // Bots fill every field, including this hidden one.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200).toLowerCase();
  const org = clean(body.organization, 120);
  const orgType = ORG_TYPES.find((t) => t === body.orgType) ?? "Something else";
  const size = clean(body.size, 20);
  if (!name) return NextResponse.json({ error: "Add your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!org) return NextResponse.json({ error: "Add your organization's name." }, { status: 400 });
  if (!allowDaily(`kit:${clientIp(req)}`, 10)) return NextResponse.json({ error: "Too many sign-ups from here today. Please try again tomorrow." }, { status: 429 });

  const input: IdeaInput = { name, email, orgType, interest: "AI governance", idea: `Signed up for the free AI governance kit.\nOrganization: ${org}${size ? ` (${size} people)` : ""}.` };
  const page = "/apps/governwise";
  const [saved, emailed] = await Promise.all([
    (async () => {
      try {
        const { error } = await getSupabase().from("build_inquiries").insert({ name, email, org_type: orgType, interest: input.interest, idea: input.idea, sketch: null, page });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Kit sign-up could not be saved", err);
        return false;
      }
    })(),
    sendInquiryAlert(input, null, page),
  ]);
  if (!saved && !emailed) return NextResponse.json({ error: "We couldn't sign you up just now. Please try again in a few minutes." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
