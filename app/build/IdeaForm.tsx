"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { ORG_TYPES, type IdeaSketch, type OrgType } from "../../lib/build/idea";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const input = `block min-h-12 w-full rounded-[10px] border border-line bg-sunken px-3.5 text-base text-fg placeholder:text-dim ${focus}`;

/** "Tell us your idea": sends an inquiry and shows an AI sketch of a small first version. */
export function IdeaForm({ defaultOrg = "Something else", page }: { defaultOrg?: OrgType; page: string }) {
  const [orgType, setOrgType] = useState<OrgType>(defaultOrg);
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ sketch: IdeaSketch | null } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/build/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgType, idea, name, email, website, page }),
      });
      const json = (await res.json()) as { sketch?: IdeaSketch | null; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setSent({ sketch: json.sketch ?? null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    const s = sent.sketch;
    return (
      <div className="space-y-5" aria-live="polite">
        <p className="flex items-start gap-3 rounded-xl border border-down/40 bg-down/10 p-4 text-sm text-soft">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-down" aria-hidden />
          <span>
            <strong className="text-fg">Thanks, {name.split(" ")[0]}.</strong> We&apos;ve got your idea and will email {email} to set up a free 20-minute call.
          </span>
        </p>
        {s && (
          <div className="rounded-2xl border border-line bg-sunken p-5 sm:p-6">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-amber">
              <Sparkles className="h-4 w-4" aria-hidden /> A first sketch of your app
            </p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{s.name}</h3>
            <p className="mt-1 text-soft">{s.oneLiner}</p>
            <ul className="mt-4 space-y-2 text-sm text-soft">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            {s.firstVersion && (
              <p className="mt-4 text-sm text-muted">
                <strong className="text-soft">Start small:</strong> {s.firstVersion}
              </p>
            )}
            {s.aiRole && (
              <p className="mt-2 text-sm text-muted">
                <strong className="text-soft">Where AI helps:</strong> {s.aiRole}
              </p>
            )}
            <p className="mt-4 text-xs text-dim">Sketched by AI from your description. We&apos;ll shape the real plan together on the call.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">You&apos;re building for a…</legend>
        <div className="flex flex-wrap gap-2">
          {ORG_TYPES.map((t) => (
            <label key={t} className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber ${orgType === t ? "border-amber bg-amber/15 text-fg" : "border-line text-muted hover:text-fg"}`}>
              <input type="radio" name="orgType" value={t} checked={orgType === t} onChange={() => setOrgType(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="idea-text" className="mb-1.5 block text-sm font-semibold">
          What do you wish an app did for you?
        </label>
        <textarea
          id="idea-text"
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          maxLength={2000}
          placeholder="e.g. Answer the questions newcomers ask before visiting, and help them plan their first Sunday."
          className={`${input} py-3`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="idea-name" className="mb-1.5 block text-sm font-semibold">
            Your name
          </label>
          <input id="idea-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="idea-email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input id="idea-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
      </div>
      {/* Left empty by people; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="idea-website">Website</label>
        <input id="idea-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {error && (
        <p role="alert" className="text-sm text-up">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-amber px-5 text-base font-bold text-[#2a1c05] transition hover:brightness-110 disabled:opacity-60 sm:w-auto ${focus}`}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
        {busy ? "Sketching your idea…" : "Send my idea and see a sketch"}
      </button>
      <p className="text-xs text-dim">Free, no obligation. We only use your details to reply to you.</p>
    </form>
  );
}
