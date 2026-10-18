/**
 * Emails you when someone asks for a quote on /build, via Resend
 * (RESEND_API_KEY, INQUIRY_EMAIL). Reply-to is the person who asked,
 * so hitting Reply answers them.
 */
import type { IdeaInput, IdeaSketch } from "./idea";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Keeps a header line to one short line. */
const oneLine = (t: string, max: number) => t.replace(/[\r\n]+/g, " ").slice(0, max);

export function buildAlertEmail(input: IdeaInput, sketch: IdeaSketch | null, page: string) {
  const subject = oneLine(`New quote request: ${input.interest}, ${input.orgType} (${input.name})`, 150);
  const lines = [
    `${input.name} <${input.email}> asked for a quote.`,
    "",
    `Looking for: ${input.interest}`,
    `For a: ${input.orgType}`,
    `From page: growdaily.ai${page || "/build"}`,
    "",
    "What they wrote:",
    input.idea,
  ];
  if (sketch) {
    lines.push("", `AI sketch shown to them: ${sketch.name}: ${sketch.oneLiner}`, ...sketch.features.map((f) => `- ${f}`));
    if (sketch.firstVersion) lines.push(`Start small: ${sketch.firstVersion}`);
  }
  lines.push("", "Reply to this email to answer them directly.");

  const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#667085;white-space:nowrap">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1d2433;max-width:560px">
<p style="margin:0 0 12px"><strong>${esc(input.name)}</strong> (<a href="mailto:${esc(input.email)}">${esc(input.email)}</a>) asked for a quote.</p>
<table style="border-collapse:collapse;margin:0 0 16px">${row("Looking for", input.interest)}${row("For a", input.orgType)}${row("From page", `growdaily.ai${page || "/build"}`)}</table>
<p style="margin:0 0 4px;color:#667085">What they wrote</p>
<blockquote style="margin:0 0 16px;padding:12px 16px;background:#f4f6f8;border-radius:8px;white-space:pre-wrap">${esc(input.idea)}</blockquote>
${
  sketch
    ? `<p style="margin:0 0 4px;color:#667085">AI sketch shown to them</p>
<p style="margin:0 0 4px"><strong>${esc(sketch.name)}</strong>: ${esc(sketch.oneLiner)}</p>
<ul style="margin:0 0 16px;padding-left:20px">${sketch.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`
    : ""
}
<p style="margin:0;color:#667085">Reply to this email to answer them directly.</p>
</div>`;
  return { subject, text: lines.join("\n"), html };
}

/** Sends the alert. Returns false (and logs) when it isn't set up or fails; never throws. */
export async function sendInquiryAlert(input: IdeaInput, sketch: IdeaSketch | null, page: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_EMAIL;
  if (!key || !to) return false;
  const { subject, text, html } = buildAlertEmail(input, sketch, page);
  try {
    const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Resend's starter sender works for emailing yourself; set INQUIRY_FROM once your domain is verified.
        from: process.env.INQUIRY_FROM ?? "GrowDaily <onboarding@resend.dev>",
        to: to.split(",").map((t) => t.trim()).filter(Boolean),
        reply_to: input.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return true;
  } catch (err) {
    console.error("Quote request email failed", err);
    return false;
  }
}
