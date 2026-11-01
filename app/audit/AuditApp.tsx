"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Download, FileUp, Plus, Printer, ShieldCheck, Trash2, X } from "lucide-react";
import {
  CONTROLS,
  controlsCsv,
  findingFor,
  findings,
  FUNCTIONS,
  maturity,
  newEngagement,
  parseImport,
  readinessIssues,
  resultFor,
  score,
  STATUSES,
  uid,
  type Control,
  type ControlResult,
  type Engagement,
  type Finding,
  type Severity,
  type Status,
} from "../../lib/audit/model";

const KEY = "growdaily.audit.v1";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const input = "w-full rounded-lg border border-line bg-sunken px-3 py-2 text-sm text-fg placeholder:text-dim focus:border-amber/60 focus:outline-none";
const label = "text-xs font-semibold uppercase tracking-[0.08em] text-muted";
const btn = `inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-2 text-sm font-semibold text-fg hover:bg-[#24364f] ${focus}`;
const tabCls = (on: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold ${focus} ${on ? "bg-amber text-amber-ink" : "text-muted hover:text-fg"}`;
const STATUS_STYLE: Record<Status, string> = { "not-assessed": "border-line text-muted", met: "border-down/60 bg-down/10 text-down", partial: "border-amber/60 bg-amber/10 text-amber", "not-met": "border-up/60 bg-up/10 text-up", na: "border-line bg-raised text-soft" };
const SEV_STYLE: Record<Severity, string> = { high: "text-up", medium: "text-amber", low: "text-soft" };
const statusName = (s: Status) => STATUSES.find((x) => x.id === s)!.label;
const today = () => new Date().toISOString().slice(0, 10);
const stamp = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "audit";

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Tab = "overview" | "checklist" | "findings" | "report" | "log";

export function AuditApp() {
  const [list, setList] = useState<Engagement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [ready, setReady] = useState(false);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = JSON.parse(raw) as { engagements: Engagement[]; active?: string };
        setList(v.engagements ?? []);
        setActiveId(v.active ?? v.engagements?.[0]?.id ?? null);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ engagements: list, active: activeId }));
    } catch {
      setMsg("Couldn't save in this browser. Export a backup now.");
    }
  }, [list, activeId, ready]);

  const active = list.find((e) => e.id === activeId) ?? null;
  const update = (fn: (e: Engagement) => Engagement, logText?: string) =>
    setList((ls) =>
      ls.map((e) => {
        if (e.id !== activeId) return e;
        const now = new Date().toISOString();
        const next = fn(e);
        return { ...next, updated: now, log: logText ? [{ at: now, text: logText }, ...next.log].slice(0, 500) : next.log };
      }),
    );

  const create = () => {
    const name = newName.trim();
    if (!name) return;
    const e = newEngagement(name, today());
    setList((ls) => [e, ...ls]);
    setActiveId(e.id);
    setTab("overview");
    setNewName("");
  };
  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      const incoming = parseImport(await f.text());
      setList((ls) => [...incoming.map((e) => (ls.some((x) => x.id === e.id) ? { ...e, id: uid(), client: `${e.client} (imported)` } : e)), ...ls]);
      setActiveId(incoming[0].id);
      setMsg(`Imported ${incoming.length} audit${incoming.length === 1 ? "" : "s"}.`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "That file couldn't be read.");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="grid content-start gap-4 print:hidden" aria-label="Audits">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
          className="grid gap-2 rounded-2xl border border-line bg-panel p-4"
        >
          <label htmlFor="new-audit" className={label}>
            New audit
          </label>
          <input id="new-audit" className={input} value={newName} maxLength={80} onChange={(e) => setNewName(e.target.value)} placeholder="Client organization name" />
          <button type="submit" disabled={!newName.trim()} className={`${btn} justify-center disabled:opacity-50`}>
            <Plus className="h-4 w-4" aria-hidden /> Start audit
          </button>
        </form>
        <nav className="grid gap-1.5">
          {list.length === 0 && <p className="text-sm text-muted">No audits yet.</p>}
          {list.map((e) => {
            const s = score(e);
            return (
              <button key={e.id} type="button" onClick={() => setActiveId(e.id)} className={`rounded-xl border p-3 text-left ${focus} ${e.id === activeId ? "border-amber/60 bg-amber/[0.06]" : "border-line bg-panel hover:border-[#35507a]"}`}>
                <span className="block font-semibold">{e.client}</span>
                <span className="text-xs text-muted">
                  {s.pct}% · {s.assessed}/{s.total} assessed
                </span>
              </button>
            );
          })}
        </nav>
        <div className="grid gap-2 rounded-2xl border border-line bg-panel p-4 text-sm">
          <button type="button" className={btn} onClick={() => download(`governwise-audits-${today()}.json`, JSON.stringify({ engagements: list }, null, 2), "application/json")} disabled={!list.length}>
            <Download className="h-4 w-4" aria-hidden /> Back up all audits
          </button>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
            <FileUp className="h-4 w-4" aria-hidden /> Import from a backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void onImport(e.target.files?.[0])} />
          <p className="text-xs text-dim">Audits are saved only in this browser. Back up after each session.</p>
          {msg && (
            <p role="status" className="text-xs text-amber">
              {msg}
            </p>
          )}
        </div>
      </aside>

      <section className="min-w-0">
        {!active ? (
          <div className="rounded-2xl border border-line bg-panel p-8 text-muted">Start an audit for a client organization, or import a backup.</div>
        ) : (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
              <h2 className="text-2xl font-extrabold tracking-tight">{active.client}</h2>
              <div className="flex flex-wrap gap-1 rounded-xl border border-line p-1">
                {(["overview", "checklist", "findings", "report", "log"] as Tab[]).map((t) => (
                  <button key={t} type="button" className={tabCls(tab === t)} onClick={() => setTab(t)}>
                    {t === "overview" ? "Overview" : t === "checklist" ? "Checklist" : t === "findings" ? `Findings (${findings(active).length})` : t === "report" ? "Report" : "Change log"}
                  </button>
                ))}
              </div>
            </div>
            {tab === "overview" && <Overview e={active} update={update} onDelete={() => { if (window.confirm(`Delete the audit for ${active.client}? This can't be undone unless you have a backup.`)) { setList((ls) => ls.filter((x) => x.id !== active.id)); setActiveId(null); } }} />}
            {tab === "checklist" && <Checklist e={active} update={update} />}
            {tab === "findings" && <Findings e={active} update={update} />}
            {tab === "report" && <Report e={active} />}
            {tab === "log" && (
              <ol className="grid gap-1 rounded-2xl border border-line bg-panel p-5 text-sm">
                {active.log.map((l, i) => (
                  <li key={i} className="grid grid-cols-[150px_minmax(0,1fr)] gap-3 border-b border-hairline py-1.5 last:border-0">
                    <span className="font-mono text-xs text-dim">{stamp(l.at)}</span>
                    <span className="text-soft">{l.text}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

type Update = (fn: (e: Engagement) => Engagement, log?: string) => void;

function Field({ id, text, value, onChange, type = "text", placeholder }: { id: string; text: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      <input id={id} type={type} className={input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Overview({ e, update, onDelete }: { e: Engagement; update: Update; onDelete: () => void }) {
  const set = (k: keyof Engagement) => (v: string) => update((x) => ({ ...x, [k]: v }));
  const issues = readinessIssues(e);
  const blockers = issues.filter((i) => i.level === "blocker");
  const overall = score(e);
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-line bg-panel p-4 sm:col-span-1">
          <p className={label}>Overall</p>
          <p className="mt-1 text-4xl font-extrabold">{overall.pct}%</p>
          <p className="text-sm text-soft">{maturity(overall.pct)}</p>
        </div>
        {FUNCTIONS.map((f) => {
          const s = score(e, f.id);
          return (
            <div key={f.id} className="rounded-2xl border border-line bg-panel p-4">
              <p className={label}>{f.name}</p>
              <p className="mt-1 text-2xl font-extrabold">{s.pct}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden>
                <div className="h-full rounded-full bg-amber" style={{ width: `${s.pct}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                {s.assessed}/{s.total} assessed
              </p>
            </div>
          );
        })}
      </div>

      <div className={`rounded-2xl border p-5 ${blockers.length ? "border-amber/40 bg-amber/[0.05]" : "border-down/40 bg-down/[0.06]"}`}>
        <p className="flex items-center gap-2 font-bold">
          {blockers.length ? <AlertTriangle className="h-5 w-5 text-amber" aria-hidden /> : <ShieldCheck className="h-5 w-5 text-down" aria-hidden />}
          {blockers.length ? `Not audit-ready yet: ${blockers.length} blocker${blockers.length === 1 ? "" : "s"}, ${issues.length - blockers.length} warning${issues.length - blockers.length === 1 ? "" : "s"}` : issues.length ? `Audit-ready, with ${issues.length} warning${issues.length === 1 ? "" : "s"} to tidy up` : "Audit-ready: every control assessed, evidenced and followed up"}
        </p>
        {issues.length > 0 && (
          <ul className="mt-3 max-h-60 space-y-1 overflow-auto text-sm text-soft">
            {issues.map((i) => (
              <li key={i.text} className="flex gap-2">
                <span className={`shrink-0 font-mono text-[11px] uppercase ${i.level === "blocker" ? "text-amber" : "text-dim"}`}>{i.level}</span> {i.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-2">
        <Field id="ov-client" text="Client" value={e.client} onChange={set("client")} />
        <div className="grid gap-1">
          <label htmlFor="ov-type" className={label}>
            Organization type
          </label>
          <select id="ov-type" className={input} value={e.orgType} onChange={(x) => set("orgType")(x.target.value)}>
            {["Business", "Nonprofit", "Church or ministry", "School", "Public sector"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <Field id="ov-contact" text="Client contact" value={e.contact} onChange={set("contact")} placeholder="Name, role" />
        <Field id="ov-auditor" text="Auditor" value={e.auditor} onChange={set("auditor")} placeholder="Your name" />
        <Field id="ov-start" text="Start date" type="date" value={e.start} onChange={set("start")} />
        <Field id="ov-end" text="Report date" type="date" value={e.end} onChange={set("end")} />
        <div className="grid gap-1 sm:col-span-2">
          <label htmlFor="ov-scope" className={label}>
            Scope
          </label>
          <textarea id="ov-scope" rows={2} className={input} value={e.scope} onChange={(x) => set("scope")(x.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => download(`${slug(e.client)}-ai-audit.json`, JSON.stringify(e, null, 2), "application/json")}>
          <Download className="h-4 w-4" aria-hidden /> Back up this audit
        </button>
        <button type="button" className={btn} onClick={() => download(`${slug(e.client)}-ai-audit.csv`, controlsCsv(e), "text/csv")}>
          <Download className="h-4 w-4" aria-hidden /> Controls &amp; findings (CSV)
        </button>
        <button type="button" className={`${btn} text-up`} onClick={onDelete}>
          <Trash2 className="h-4 w-4" aria-hidden /> Delete audit
        </button>
      </div>
    </div>
  );
}

function Checklist({ e, update }: { e: Engagement; update: Update }) {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "gaps">("all");
  const show = (c: Control) => {
    const r = resultFor(e, c.id);
    if (filter === "todo") return r.status === "not-assessed" || ((r.status === "met" || r.status === "partial") && !r.evidence.length);
    if (filter === "gaps") return r.status === "partial" || r.status === "not-met";
    return true;
  };
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-1 print:hidden">
        {(["all", "todo", "gaps"] as const).map((f) => (
          <button key={f} type="button" className={tabCls(filter === f)} onClick={() => setFilter(f)}>
            {f === "all" ? "All controls" : f === "todo" ? "Needs work" : "Gaps only"}
          </button>
        ))}
      </div>
      {FUNCTIONS.map((f) => {
        const cs = CONTROLS.filter((c) => c.fn === f.id && show(c));
        if (!cs.length) return null;
        return (
          <section key={f.id} aria-labelledby={`fn-${f.id}`}>
            <h3 id={`fn-${f.id}`} className="text-lg font-extrabold">
              {f.name} <span className="text-sm font-normal text-muted">· {f.blurb}</span>
            </h3>
            <ul className="mt-3 grid gap-2">
              {cs.map((c) => (
                <ControlCard key={c.id} c={c} r={resultFor(e, c.id)} open={open === c.id} toggle={() => setOpen(open === c.id ? null : c.id)} update={update} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ControlCard({ c, r, open, toggle, update }: { c: Control; r: ControlResult; open: boolean; toggle: () => void; update: Update }) {
  const [ev, setEv] = useState({ label: "", where: "", date: today() });
  const setResult = (p: Partial<ControlResult>, log?: string) => update((e) => ({ ...e, results: { ...e.results, [c.id]: { ...resultFor(e, c.id), ...p } } }), log);
  const gap = r.status === "partial" || r.status === "not-met";
  const f = findingFor(c, r);
  const setFinding = (p: Partial<Finding>, log?: string) => setResult({ finding: { ...f, ...p } }, log);
  const missingEvidence = (r.status === "met" || r.status === "partial") && !r.evidence.length;
  return (
    <li className="rounded-xl border border-line bg-panel">
      <button type="button" onClick={toggle} aria-expanded={open} className={`flex w-full items-center gap-3 p-4 text-left ${focus}`}>
        <span className="w-10 shrink-0 font-mono text-xs text-dim">{c.id}</span>
        <span className="min-w-0 flex-1 font-semibold">{c.title}</span>
        {missingEvidence && <AlertTriangle className="h-4 w-4 shrink-0 text-amber" aria-label="No evidence yet" />}
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[r.status]}`}>{statusName(r.status)}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="grid gap-4 border-t border-hairline p-4">
          <p className="text-sm text-soft">
            <strong className="text-fg">What good looks like:</strong> {c.good} <span className="font-mono text-xs text-dim">NIST AI RMF {c.rmf}</span>
          </p>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Status for ${c.id}`}>
            {STATUSES.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={r.status === s.id} onClick={() => r.status !== s.id && setResult({ status: s.id }, `${c.id} status: ${statusName(r.status)} → ${s.label}.`)} className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${focus} ${r.status === s.id ? STATUS_STYLE[s.id] : "border-line text-muted hover:text-fg"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="grid gap-1">
            <label htmlFor={`n-${c.id}`} className={label}>
              Notes {r.status === "na" && "(say why it doesn't apply)"}
            </label>
            <textarea id={`n-${c.id}`} rows={2} className={input} value={r.notes} onChange={(x) => setResult({ notes: x.target.value })} placeholder="What you saw, who you spoke with, any caveats" />
          </div>

          <div className="grid gap-2">
            <p className={label}>Evidence</p>
            {r.evidence.length === 0 && <p className="text-sm text-dim">None recorded. Expected: {c.evidence.join("; ")}.</p>}
            <ul className="grid gap-1.5">
              {r.evidence.map((x) => (
                <li key={x.id} className="flex items-start gap-2 rounded-lg border border-line bg-sunken px-3 py-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-down" aria-hidden />
                  <span className="min-w-0 flex-1 break-words">
                    <strong>{x.label}</strong> · {/^https?:\/\//.test(x.where) ? <a href={x.where} target="_blank" rel="noopener noreferrer" className="text-amber underline-offset-2 hover:underline">{x.where}</a> : x.where} {x.date && <span className="text-dim">· {x.date}</span>}
                  </span>
                  <button type="button" aria-label={`Remove evidence ${x.label}`} onClick={() => setResult({ evidence: r.evidence.filter((y) => y.id !== x.id) }, `${c.id} evidence removed: ${x.label}.`)} className={`text-muted hover:text-up ${focus}`}>
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {c.evidence.map((s) => (
                <button key={s} type="button" onClick={() => setEv({ ...ev, label: s })} className={`rounded-full border border-line px-2.5 py-1 text-xs text-soft hover:border-amber/50 ${focus}`}>
                  + {s}
                </button>
              ))}
            </div>
            <form
              className="grid gap-2 sm:grid-cols-[1fr_1.3fr_140px_auto]"
              onSubmit={(x) => {
                x.preventDefault();
                if (!ev.label.trim() || !ev.where.trim()) return;
                setResult({ evidence: [...r.evidence, { id: uid(), label: ev.label.trim(), where: ev.where.trim(), date: ev.date }] }, `${c.id} evidence added: ${ev.label.trim()}.`);
                setEv({ label: "", where: "", date: today() });
              }}
            >
              <input aria-label="Evidence" className={input} value={ev.label} onChange={(x) => setEv({ ...ev, label: x.target.value })} placeholder="What it is" />
              <input aria-label="Where it's kept" className={input} value={ev.where} onChange={(x) => setEv({ ...ev, where: x.target.value })} placeholder="Link, file name or location" />
              <input aria-label="Date collected" type="date" className={input} value={ev.date} onChange={(x) => setEv({ ...ev, date: x.target.value })} />
              <button type="submit" className={btn} disabled={!ev.label.trim() || !ev.where.trim()}>
                Add
              </button>
            </form>
          </div>

          {gap && (
            <div className="grid gap-3 rounded-lg border border-amber/30 bg-amber/[0.04] p-3 sm:grid-cols-2">
              <p className={`${label} sm:col-span-2`}>Finding</p>
              <div className="grid gap-1 sm:col-span-2">
                <label htmlFor={`rec-${c.id}`} className={label}>
                  Recommendation
                </label>
                <textarea id={`rec-${c.id}`} rows={2} className={input} value={f.recommendation} onChange={(x) => setFinding({ recommendation: x.target.value })} />
              </div>
              <div className="grid gap-1">
                <label htmlFor={`sev-${c.id}`} className={label}>
                  Severity
                </label>
                <select id={`sev-${c.id}`} className={input} value={f.severity} onChange={(x) => setFinding({ severity: x.target.value as Severity }, `${c.id} finding severity set to ${x.target.value}.`)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="grid gap-1">
                <label htmlFor={`st-${c.id}`} className={label}>
                  Status
                </label>
                <select id={`st-${c.id}`} className={input} value={f.state} onChange={(x) => setFinding({ state: x.target.value as Finding["state"] }, `${c.id} finding marked ${x.target.value}.`)}>
                  <option value="open">Open</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <Field id={`ow-${c.id}`} text="Owner" value={f.owner} onChange={(v) => setFinding({ owner: v })} placeholder="Client owner" />
              <Field id={`du-${c.id}`} text="Due" type="date" value={f.due} onChange={(v) => setFinding({ due: v })} />
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function Findings({ e, update }: { e: Engagement; update: Update }) {
  const rows = findings(e);
  const setF = (id: string, p: Partial<Finding>, log?: string) =>
    update((x) => {
      const c = CONTROLS.find((k) => k.id === id)!;
      const r = resultFor(x, id);
      return { ...x, results: { ...x.results, [id]: { ...r, finding: { ...findingFor(c, r), ...p } } } };
    }, log);
  if (!rows.length) return <p className="rounded-2xl border border-line bg-panel p-6 text-muted">No findings yet. Controls marked partly met or not met appear here.</p>;
  return (
    <ul className="grid gap-2">
      {rows.map(({ control: c, result: r, finding: f }) => (
        <li key={c.id} className="grid gap-3 rounded-xl border border-line bg-panel p-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="font-semibold">
              <span className={`mr-2 font-mono text-xs uppercase ${SEV_STYLE[f.severity]}`}>{f.severity}</span>
              {c.id} {c.title} <span className="text-sm font-normal text-muted">· {statusName(r.status)}</span>
            </p>
            <p className="mt-1 text-sm text-soft">{f.recommendation}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:w-[420px]">
            <input aria-label={`Owner for ${c.id}`} className={input} value={f.owner} placeholder="Owner" onChange={(x) => setF(c.id, { owner: x.target.value })} />
            <input aria-label={`Due date for ${c.id}`} type="date" className={input} value={f.due} onChange={(x) => setF(c.id, { due: x.target.value })} />
            <select aria-label={`Status for ${c.id} finding`} className={input} value={f.state} onChange={(x) => setF(c.id, { state: x.target.value as Finding["state"] }, `${c.id} finding marked ${x.target.value}.`)}>
              <option value="open">Open</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Report({ e }: { e: Engagement }) {
  const overall = score(e);
  const rows = useMemo(() => findings(e), [e]);
  const blockers = readinessIssues(e).filter((i) => i.level === "blocker").length;
  const fmt = (d: string) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "");
  const cell = "border border-[#d5dbe3] px-2 py-1.5 align-top";
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <p className="text-sm text-muted">{blockers ? `Draft: ${blockers} blocker${blockers === 1 ? "" : "s"} still open on the Overview tab.` : "Final: every control assessed and evidenced."}</p>
        <button type="button" className={btn} onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden /> Print or save as PDF
        </button>
      </div>
      <article className="rounded-2xl bg-white p-6 text-[#14202e] shadow-xl sm:p-10 print:rounded-none print:p-0 print:shadow-none">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#5b6b80]">AI governance audit{blockers ? " · draft" : ""}</p>
        <h1 className="mt-2 text-3xl font-extrabold">{e.client}</h1>
        <p className="mt-1 text-sm text-[#5b6b80]">
          {e.orgType}
          {e.contact && ` · Client contact: ${e.contact}`}
          {e.auditor && ` · Auditor: ${e.auditor}`}
          {(e.start || e.end) && ` · ${fmt(e.start)}${e.end ? ` to ${fmt(e.end)}` : ""}`}
        </p>
        <p className="mt-3 text-sm">
          <strong>Scope:</strong> {e.scope}
        </p>

        <h2 className="mt-8 text-xl font-bold">Summary</h2>
        <p className="mt-1 text-sm">
          Overall maturity: <strong>{overall.pct}% ({maturity(overall.pct)})</strong> across {overall.counted} applicable controls, mapped to the four functions of the NIST AI Risk Management Framework. {rows.length} finding{rows.length === 1 ? "" : "s"}: {rows.filter((r) => r.finding.severity === "high").length} high, {rows.filter((r) => r.finding.severity === "medium").length} medium, {rows.filter((r) => r.finding.severity === "low").length} low.
        </p>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2f6]">
              <th className={`${cell} text-left`}>Function</th>
              <th className={`${cell} text-left`}>Score</th>
              <th className={`${cell} text-left`}>Maturity</th>
            </tr>
          </thead>
          <tbody>
            {FUNCTIONS.map((f) => {
              const s = score(e, f.id);
              return (
                <tr key={f.id}>
                  <td className={cell}>
                    <strong>{f.name}</strong>: {f.blurb}
                  </td>
                  <td className={cell}>{s.pct}%</td>
                  <td className={cell}>{maturity(s.pct)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="mt-8 text-xl font-bold">Findings and recommendations</h2>
        {rows.length === 0 ? (
          <p className="mt-1 text-sm">No gaps found.</p>
        ) : (
          <table className="mt-3 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#eef2f6]">
                <th className={`${cell} text-left`}>Severity</th>
                <th className={`${cell} text-left`}>Control</th>
                <th className={`${cell} text-left`}>Recommendation</th>
                <th className={`${cell} text-left`}>Owner · due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ control: c, result: r, finding: f }) => (
                <tr key={c.id} style={{ breakInside: "avoid" }}>
                  <td className={`${cell} font-semibold capitalize`}>{f.severity}</td>
                  <td className={cell}>
                    {c.id} {c.title} ({STATUSES.find((s) => s.id === r.status)!.label})
                  </td>
                  <td className={cell}>{f.recommendation}</td>
                  <td className={cell}>
                    {f.owner || "Not set"}
                    {f.due && ` · ${fmt(f.due)}`}
                    {f.state !== "open" && ` · ${f.state === "done" ? "Done" : "In progress"}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="mt-8 text-xl font-bold">Control detail and evidence</h2>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#eef2f6]">
              <th className={`${cell} text-left`}>Control</th>
              <th className={`${cell} text-left`}>Status</th>
              <th className={`${cell} text-left`}>Notes and evidence</th>
            </tr>
          </thead>
          <tbody>
            {CONTROLS.map((c) => {
              const r = resultFor(e, c.id);
              return (
                <tr key={c.id} style={{ breakInside: "avoid" }}>
                  <td className={cell}>
                    <strong>{c.id}</strong> {c.title}
                    <span className="block text-xs text-[#5b6b80]">NIST AI RMF {c.rmf}</span>
                  </td>
                  <td className={cell}>{STATUSES.find((s) => s.id === r.status)!.label}</td>
                  <td className={cell}>
                    {r.notes && <span className="block">{r.notes}</span>}
                    {r.evidence.map((x) => (
                      <span key={x.id} className="block text-xs text-[#3a4a5e]">
                        Evidence: {x.label} ({x.where}
                        {x.date ? `, ${x.date}` : ""})
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-8 text-xs text-[#5b6b80]">
          Prepared with Governwise Audit by GrowDaily. This report reflects the evidence reviewed during the audit period. It is practical governance guidance, not legal advice; controls are mapped to the NIST AI Risk Management Framework (AI RMF 1.0) for reference.
        </p>
      </article>
    </div>
  );
}
