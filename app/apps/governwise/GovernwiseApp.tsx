"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Plus, Printer, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import {
  blankOrg,
  CHECKS,
  COMMON_TOOLS,
  DATA_KINDS,
  newTool,
  ORG_TYPES,
  PLANS,
  policyMarkdown,
  registerCsv,
  sampleKit,
  SENSITIVITY,
  SIZES,
  summarize,
  TIER_LABEL,
  type Answer,
  type Org,
  type Tier,
  type Tool,
} from "../../../lib/governwise/logic";

const KEY = "growdaily.governwise.v1";
const SIGNUP_KEY = "growdaily.governwise.signup";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const input = `w-full rounded-lg border border-line bg-sunken px-3 py-2.5 text-base text-fg placeholder:text-dim focus:border-amber/60 focus:outline-none`;
const label = "text-sm font-semibold text-soft";
const tab = (on: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${focus} ${on ? "bg-amber text-amber-ink" : "text-muted hover:text-fg"}`;
const TIER_STYLE: Record<Tier, string> = { approved: "border-down/50 bg-down/10 text-down", limited: "border-amber/50 bg-amber/10 text-amber", "not-allowed": "border-up/50 bg-up/10 text-up" };
const TIER_ICON: Record<Tier, typeof ShieldCheck> = { approved: ShieldCheck, limited: AlertTriangle, "not-allowed": ShieldAlert };

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "our";

export function GovernwiseApp() {
  const [org, setOrg] = useState<Org>(blankOrg);
  const [tools, setTools] = useState<Tool[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [view, setView] = useState<"summary" | "register" | "policy">("summary");
  const [ready, setReady] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = JSON.parse(raw) as { org: Org; tools: Tool[] };
        setOrg({ ...blankOrg(), ...v.org });
        setTools(v.tools ?? []);
      }
      setSignedUp(!!localStorage.getItem(SIGNUP_KEY));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ org, tools }));
    } catch {}
  }, [org, tools, ready]);

  const summary = useMemo(() => summarize(org, tools), [org, tools]);
  const policy = useMemo(() => policyMarkdown(org, tools), [org, tools]);
  const patch = (id: string, p: Partial<Tool>) => setTools((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const toggleData = (d: Org["data"][number]) => setOrg((o) => ({ ...o, data: o.data.includes(d) ? o.data.filter((x) => x !== d) : [...o.data, d] }));
  const setCheck = (id: (typeof CHECKS)[number]["id"], a: Answer) => setOrg((o) => ({ ...o, checks: { ...o.checks, [id]: a } }));
  const loadSample = () => {
    const s = sampleKit();
    setOrg(s.org);
    setTools(s.tools);
    setStep(3);
  };
  const reset = () => {
    if (!window.confirm("Clear everything and start over?")) return;
    setOrg(blankOrg());
    setTools([]);
    setStep(1);
  };
  const go = (n: 1 | 2 | 3) => {
    setStep(n);
    requestAnimationFrame(() => document.getElementById("kit")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const unused = COMMON_TOOLS.filter((n) => !tools.some((t) => t.name === n));

  return (
    <div id="kit" className="scroll-mt-6 rounded-2xl border border-line bg-panel print:border-0 print:bg-white print:text-black">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline p-3 sm:p-4 print:hidden">
        <nav aria-label="Steps" className="flex flex-wrap gap-1">
          <button type="button" className={tab(step === 1)} onClick={() => go(1)} aria-current={step === 1 ? "step" : undefined}>
            1. Your organization
          </button>
          <button type="button" className={tab(step === 2)} onClick={() => go(2)} aria-current={step === 2 ? "step" : undefined}>
            2. AI tools ({tools.length})
          </button>
          <button type="button" className={tab(step === 3)} onClick={() => go(3)} aria-current={step === 3 ? "step" : undefined}>
            3. Your kit
          </button>
        </nav>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={loadSample} className={`font-semibold text-amber hover:underline ${focus}`}>
            See an example
          </button>
          <button type="button" onClick={reset} className={`text-muted hover:text-fg ${focus}`}>
            Start over
          </button>
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-8 p-5 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor="gw-name" className={label}>
                Organization name
              </label>
              <input id="gw-name" className={input} value={org.name} maxLength={80} onChange={(e) => setOrg({ ...org, name: e.target.value })} placeholder="e.g. Riverside Community Services" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="gw-owner" className={label}>
                Who owns AI decisions?
              </label>
              <input id="gw-owner" className={input} value={org.owner} maxLength={80} onChange={(e) => setOrg({ ...org, owner: e.target.value })} placeholder="Name and role, e.g. Dana Lopez, Operations Director" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="gw-type" className={label}>
                Type
              </label>
              <select id="gw-type" className={input} value={org.type} onChange={(e) => setOrg({ ...org, type: e.target.value as Org["type"] })}>
                {ORG_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="gw-size" className={label}>
                People (staff and regular volunteers)
              </label>
              <select id="gw-size" className={input} value={org.size} onChange={(e) => setOrg({ ...org, size: e.target.value as Org["size"] })}>
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="grid gap-2">
            <legend className={label}>What kinds of information does your organization handle?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {DATA_KINDS.map((d) => (
                <label key={d.id} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line bg-sunken px-3 py-2.5 text-sm text-soft has-[:checked]:border-amber/50">
                  <input type="checkbox" className="mt-0.5 accent-[#f2b54b]" checked={org.data.includes(d.id)} onChange={() => toggleData(d.id)} />
                  {d.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-2">
            <legend className={label}>Where are you today?</legend>
            <ul className="mt-2 divide-y divide-hairline rounded-lg border border-line">
              {CHECKS.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                  <span className="text-sm text-soft">{c.label}</span>
                  <span className="flex gap-1" role="radiogroup" aria-label={c.label}>
                    {(["yes", "no", "unsure"] as Answer[]).map((a) => (
                      <button
                        key={a}
                        type="button"
                        role="radio"
                        aria-checked={(org.checks[c.id] ?? "") === a}
                        onClick={() => setCheck(c.id, a)}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${focus} ${(org.checks[c.id] ?? "") === a ? "border-amber bg-amber/15 text-amber" : "border-line text-muted hover:text-fg"}`}
                      >
                        {a === "unsure" ? "Not sure" : a}
                      </button>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </fieldset>
          <button type="button" onClick={() => go(2)} className="justify-self-start rounded-[10px] bg-amber px-5 py-3 font-bold text-amber-ink hover:brightness-110">
            Next: list your AI tools
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 p-5 sm:p-8">
          <p className="text-muted">Add every AI tool your people use for work, including free ones on personal phones and AI built into tools you already have. Ask your team; don&apos;t assume.</p>
          {unused.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {unused.map((n) => (
                <button key={n} type="button" onClick={() => setTools((ts) => [...ts, newTool(n)])} className={`inline-flex items-center gap-1 rounded-full border border-line bg-raised px-3 py-1.5 text-sm text-soft hover:border-amber/50 hover:text-fg ${focus}`}>
                  <Plus className="h-3.5 w-3.5" aria-hidden /> {n}
                </button>
              ))}
              <button type="button" onClick={() => setTools((ts) => [...ts, newTool("")])} className={`inline-flex items-center gap-1 rounded-full border border-amber/50 px-3 py-1.5 text-sm font-semibold text-amber ${focus}`}>
                <Plus className="h-3.5 w-3.5" aria-hidden /> Another tool
              </button>
            </div>
          )}
          {tools.map((t, i) => {
            const r = summary.rated.find((x) => x.tool.id === t.id)!.rating;
            const Icon = TIER_ICON[r.tier];
            return (
              <div key={t.id} className="grid gap-4 rounded-xl border border-line bg-sunken p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${TIER_STYLE[r.tier]}`}>
                    <Icon className="h-3.5 w-3.5" aria-hidden /> {TIER_LABEL[r.tier]}
                  </span>
                  <button type="button" onClick={() => setTools((ts) => ts.filter((x) => x.id !== t.id))} className={`inline-flex items-center gap-1 text-sm text-muted hover:text-up ${focus}`} aria-label={`Remove ${t.name || "tool"}`}>
                    <Trash2 className="h-4 w-4" aria-hidden /> Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label htmlFor={`n-${t.id}`} className={label}>
                      Tool
                    </label>
                    <input id={`n-${t.id}`} className={input} value={t.name} maxLength={60} onChange={(e) => patch(t.id, { name: e.target.value })} placeholder={`Tool ${i + 1}`} />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor={`u-${t.id}`} className={label}>
                      Used for
                    </label>
                    <input id={`u-${t.id}`} className={input} value={t.use} maxLength={100} onChange={(e) => patch(t.id, { use: e.target.value })} placeholder="e.g. drafting emails, meeting notes" />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor={`p-${t.id}`} className={label}>
                      Account type
                    </label>
                    <select id={`p-${t.id}`} className={input} value={t.plan} onChange={(e) => patch(t.id, { plan: e.target.value as Tool["plan"] })}>
                      {PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor={`d-${t.id}`} className={label}>
                      Most sensitive information that goes in
                    </label>
                    <select id={`d-${t.id}`} className={input} value={t.data} onChange={(e) => patch(t.id, { data: e.target.value as Tool["data"] })}>
                      {SENSITIVITY.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}: {s.hint}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor={`t-${t.id}`} className={label}>
                      Is training on your data turned off?
                    </label>
                    <select id={`t-${t.id}`} className={input} value={t.trainingOff} onChange={(e) => patch(t.id, { trainingOff: e.target.value as Answer })}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unsure">Not sure</option>
                    </select>
                  </div>
                  <div className="grid content-end gap-2 text-sm text-soft">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#f2b54b]" checked={t.aboutPeople} onChange={(e) => patch(t.id, { aboutPeople: e.target.checked })} /> Helps decide things about people (hiring, eligibility, care)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#f2b54b]" checked={t.publicFacing} onChange={(e) => patch(t.id, { publicFacing: e.target.checked })} /> Customers, members or the public see its output directly
                    </label>
                  </div>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted marker:text-dim">
                  {r.reasons.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            );
          })}
          <button type="button" onClick={() => go(3)} disabled={!tools.length} className="justify-self-start rounded-[10px] bg-amber px-5 py-3 font-bold text-amber-ink hover:brightness-110 disabled:opacity-50">
            Next: see your kit
          </button>
        </div>
      )}

      {step === 3 && !signedUp && (
        <SignupGate
          org={org}
          toolCount={tools.length}
          onDone={(email) => {
            try {
              localStorage.setItem(SIGNUP_KEY, email);
            } catch {}
            setSignedUp(true);
          }}
        />
      )}

      {step === 3 && signedUp && (
        <div className="grid gap-6 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex flex-wrap gap-1 rounded-xl border border-line p-1">
              {(["summary", "register", "policy"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)} className={tab(view === v)}>
                  {v === "summary" ? "Leadership summary" : v === "register" ? "AI register" : "AI policy"}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button type="button" onClick={() => download(`${slug(org.name)}-ai-policy.md`, policy, "text/markdown")} className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-2 font-semibold text-fg hover:bg-[#24364f] ${focus}`}>
                <Download className="h-4 w-4" aria-hidden /> Policy
              </button>
              <button type="button" onClick={() => download(`${slug(org.name)}-ai-register.csv`, registerCsv(tools), "text/csv")} className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-2 font-semibold text-fg hover:bg-[#24364f] ${focus}`}>
                <Download className="h-4 w-4" aria-hidden /> Register
              </button>
              <button type="button" onClick={() => window.print()} className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-2 font-semibold text-fg hover:bg-[#24364f] ${focus}`}>
                <Printer className="h-4 w-4" aria-hidden /> Print
              </button>
            </div>
          </div>

          {view === "summary" && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-line bg-sunken p-4 sm:col-span-1">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Readiness</p>
                  <p className="mt-1 text-4xl font-extrabold">{summary.readiness.score}%</p>
                  <p className="text-sm text-soft">{summary.readiness.label}</p>
                </div>
                {(["approved", "limited", "not-allowed"] as Tier[]).map((t) => (
                  <div key={t} className={`rounded-xl border p-4 ${TIER_STYLE[t]}`}>
                    <p className="font-mono text-xs uppercase tracking-[0.14em]">{TIER_LABEL[t]}</p>
                    <p className="mt-1 text-4xl font-extrabold text-fg">{summary.counts[t]}</p>
                    <p className="text-sm text-soft">{summary.counts[t] === 1 ? "tool" : "tools"}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">{org.name || "Your organization"}: next steps</h3>
                <ol className="mt-3 grid gap-2">
                  {summary.actions.map((a, i) => (
                    <li key={a} className="flex gap-3 rounded-lg border border-line bg-sunken p-3 text-soft">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber/15 font-mono text-xs font-bold text-amber">{i + 1}</span>
                      {a}
                    </li>
                  ))}
                </ol>
              </div>
              {summary.dataNotes.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold">About the information you handle</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-amber">
                    {summary.dataNotes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {view === "register" && (
            <div className="grid gap-3">
              {summary.rated.length === 0 && <p className="text-muted">No tools yet. Add them in step 2.</p>}
              {summary.rated.map(({ tool: t, rating: r }) => {
                const Icon = TIER_ICON[r.tier];
                return (
                  <div key={t.id} className="rounded-xl border border-line bg-sunken p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-lg font-bold">
                        {t.name || "Unnamed tool"} <span className="text-sm font-normal text-muted">{t.use && `· ${t.use}`}</span>
                      </p>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${TIER_STYLE[r.tier]}`}>
                        <Icon className="h-3.5 w-3.5" aria-hidden /> {TIER_LABEL[r.tier]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-dim">
                      {PLANS.find((p) => p.id === t.plan)!.label} · {SENSITIVITY.find((s) => s.id === t.data)!.label} information
                      {t.aboutPeople ? " · decisions about people" : ""}
                      {t.publicFacing ? " · public-facing" : ""}
                    </p>
                    <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-soft">Why</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
                          {r.reasons.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-soft">{r.tier === "not-allowed" ? "To use it" : "Conditions"}</p>
                        <ul className="mt-1 space-y-1 text-muted">
                          {r.conditions.map((x) => (
                            <li key={x} className="flex gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dim" aria-hidden /> {x}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === "policy" && <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-line bg-sunken p-5 font-sans text-sm leading-relaxed text-soft print:max-h-none">{policy}</pre>}
          <p className="text-xs text-dim">Saved only in this browser. Practical guidance, not legal advice.</p>
        </div>
      )}
    </div>
  );
}

function SignupGate({ org, toolCount, onDone }: { org: Org; toolCount: number; onDone: (email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState(org.name);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/kit/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, organization, orgType: org.type, size: org.size, website }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
      onDone(email.trim().toLowerCase());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber">One step to your kit</p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Get your free AI governance kit</h3>
        <p className="mt-2 text-muted">
          {toolCount ? `Your ${toolCount} AI tool${toolCount === 1 ? " is" : "s are"} rated and ready.` : "Your kit is ready."} Sign up to see your leadership summary, AI register and draft AI policy, and download them.
        </p>
        <p className="mt-4 text-sm text-dim">Only your name, email and organization are sent to GrowDaily. Your list of AI tools stays in this browser. We may email you about your kit and AI governance; unsubscribe anytime.</p>
      </div>
      <div className="grid content-start gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="su-name" className={label}>
            Your name
          </label>
          <input id="su-name" className={input} value={name} maxLength={100} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="su-email" className={label}>
            Work email
          </label>
          <input id="su-email" type="email" className={input} value={email} maxLength={200} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="su-org" className={label}>
            Organization
          </label>
          <input id="su-org" className={input} value={organization} maxLength={120} onChange={(e) => setOrganization(e.target.value)} required autoComplete="organization" />
        </div>
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        {error && (
          <p role="alert" className="text-sm font-semibold text-up">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="justify-self-start rounded-[10px] bg-amber px-5 py-3 font-bold text-amber-ink hover:brightness-110 disabled:opacity-60">
          {busy ? "Signing you up…" : "Get my free kit"}
        </button>
      </div>
    </form>
  );
}
