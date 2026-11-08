/**
 * A sample AI governance scorecard for a fictional organization, shown on the
 * AI governance service page so visitors can see what an audit delivers.
 * All numbers are made up and labelled as a sample. Scoring follows the audit
 * method: 29 controls across the four NIST AI RMF functions, met = 1, partly = 0.5.
 */

// Status colors for chart marks, checked for color-blind separation; every mark also carries a text label.
const GOOD = "#3fb88a";
const WARN = "#f2b54b";
const BAD = "#e0583f";
const NEUTRAL = "#6f829b";

const FUNCTIONS = [
  { name: "Govern", what: "Policy, owners, training", score: 3, of: 7 },
  { name: "Map", what: "AI register, uses, data", score: 3.5, of: 6 },
  { name: "Measure", what: "Testing, bias, accuracy", score: 2, of: 6 },
  { name: "Manage", what: "Incidents, vendors, fraud", score: 5.5, of: 10 },
];
const total = FUNCTIONS.reduce((s, f) => s + f.score, 0);
const controls = FUNCTIONS.reduce((s, f) => s + f.of, 0);
const overall = Math.round((total / controls) * 100);

const FINDINGS = [
  { label: "High", n: 4, color: BAD },
  { label: "Medium", n: 7, color: WARN },
  { label: "Low", n: 5, color: NEUTRAL },
];
const TOOLS = [
  { label: "Approved", n: 6, color: GOOD },
  { label: "Limited", n: 5, color: WARN },
  { label: "Not allowed", n: 3, color: BAD },
];
const PLAN = [
  { label: "Days 1–30 · Quick wins", detail: "Register, business accounts, call-back rule", pct: 100 },
  { label: "Days 31–60 · Policy & training", detail: "AI policy signed, staff trained", pct: 60 },
  { label: "Days 61–90 · Testing & monitoring", detail: "Bias test, vendor review, incident drill", pct: 15 },
];

const card = "rounded-2xl border border-line bg-panel p-5";
const label = "text-xs font-semibold uppercase tracking-wider text-muted";
const pct = (a: number, b: number) => Math.round((a / b) * 100);

function Gauge({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 shrink-0" role="img" aria-label={`Overall readiness ${value}%`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-raised)" strokeWidth="10" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 64 64)"
      />
      <text x="64" y="62" textAnchor="middle" className="fill-fg text-[28px] font-extrabold">
        {value}%
      </text>
      <text x="64" y="82" textAnchor="middle" className="fill-muted text-[11px]">
        ready
      </text>
    </svg>
  );
}

/** One horizontal stacked bar with a 2px gap between segments, plus a legend with counts. */
function Stacked({ parts, unit }: { parts: { label: string; n: number; color: string }[]; unit: string }) {
  const sum = parts.reduce((s, p) => s + p.n, 0);
  return (
    <div>
      <p className="text-3xl font-extrabold tracking-tight">
        {sum} <span className="text-sm font-semibold text-muted">{unit}</span>
      </p>
      <div className="mt-3 flex h-3 gap-[2px] overflow-hidden rounded-full">
        {parts.map((p) => (
          <div
            key={p.label}
            className="h-full transition-opacity hover:opacity-80"
            style={{ width: `${(p.n / sum) * 100}%`, background: p.color }}
            title={`${p.label}: ${p.n}`}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} aria-hidden />
            <span className="text-soft">{p.label}</span>
            <span className="ml-auto font-mono text-fg">{p.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GovScorecard() {
  return (
    <section aria-labelledby="scorecard-heading" className="pb-20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber">What you get</p>
      <h2 id="scorecard-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
        Your AI governance, on one page
      </h2>
      <p className="mt-2 max-w-[62ch] text-muted">
        Every audit ends with a scorecard like this: where you stand, what to fix first and how the plan is going. Scored against the NIST AI Risk Management Framework.
      </p>

      <div className="mt-8 rounded-3xl border border-line bg-sunken p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
          <p className="font-bold">AI governance scorecard</p>
          <p className="rounded-full border border-line px-3 py-1 text-xs text-muted">Sample · fictional nonprofit, 40 staff</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className={`${card} flex items-center gap-5`}>
            <Gauge value={overall} />
            <div>
              <p className={label}>Overall readiness</p>
              <p className="mt-1 text-sm text-soft">
                {total} of {controls} controls in place
              </p>
              <p className="mt-2 text-xs text-muted">Met counts 1, partly met counts ½.</p>
            </div>
          </div>

          <div className={card}>
            <p className={label}>Readiness by NIST AI RMF function</p>
            <ul className="mt-4 space-y-3">
              {FUNCTIONS.map((f) => {
                const v = pct(f.score, f.of);
                return (
                  <li key={f.name} className="grid grid-cols-[8.5rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm" title={`${f.name}: ${f.score} of ${f.of} controls (${v}%)`}>
                    <span>
                      <span className="block font-semibold text-fg">{f.name}</span>
                      <span className="block text-xs leading-snug text-muted">{f.what}</span>
                    </span>
                    <span className="h-2.5 rounded-full bg-raised">
                      <span className="block h-full rounded-full bg-amber" style={{ width: `${v}%` }} />
                    </span>
                    <span className="text-right font-mono text-fg">{v}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className={card}>
            <p className={label}>Findings by severity</p>
            <div className="mt-3">
              <Stacked parts={FINDINGS} unit="findings" />
            </div>
          </div>
          <div className={card}>
            <p className={label}>AI tools in use</p>
            <div className="mt-3">
              <Stacked parts={TOOLS} unit="tools rated" />
            </div>
          </div>
          <div className={card}>
            <p className={label}>90-day plan · day 45</p>
            <ul className="mt-4 space-y-4">
              {PLAN.map((s) => (
                <li key={s.label} title={`${s.label}: ${s.pct}% done`}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold text-fg">{s.label}</span>
                    <span className="font-mono text-fg">{s.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-raised">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.pct === 100 ? GOOD : "var(--color-amber)" }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{s.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
