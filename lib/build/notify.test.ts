import { describe, expect, it } from "vitest";
import { buildAlertEmail } from "./notify";

const input = { name: "Sam <Rivera>", email: "sam@example.org", orgType: "Small business" as const, interest: "AI training" as const, idea: "Help us with <b>emails</b>\nand notes." };

describe("buildAlertEmail", () => {
  it("summarizes the request in the subject", () => {
    expect(buildAlertEmail(input, null, "/build/ai-training").subject).toBe("New quote request: AI training, Small business (Sam <Rivera>)");
  });
  it("escapes what people typed in the HTML", () => {
    const { html, text } = buildAlertEmail(input, null, "/build");
    expect(html).toContain("Help us with &lt;b&gt;emails&lt;/b&gt;");
    expect(html).not.toContain("<b>emails</b>");
    expect(html).toContain("Sam &lt;Rivera&gt;");
    expect(text).toContain("Help us with <b>emails</b>\nand notes.");
  });
  it("keeps the subject on one line", () => {
    expect(buildAlertEmail({ ...input, name: "Sam\nBcc: x@y.z" }, null, "").subject).not.toMatch(/\n/);
  });
  it("includes the AI sketch when there was one", () => {
    const { text, html } = buildAlertEmail(input, { name: "ShiftBuddy", oneLiner: "Answers volunteer questions.", features: ["Shift times"], firstVersion: "A FAQ page.", aiRole: "" }, "/build");
    expect(text).toContain("ShiftBuddy: Answers volunteer questions.");
    expect(html).toContain("<li>Shift times</li>");
  });
});
