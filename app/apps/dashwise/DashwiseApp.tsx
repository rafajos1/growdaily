"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { ACCENT } from "./accent";
import { buildDays, CAFE_NAME, insights, money, pct, productRevenue, shortDate, wasteByWeekday, WEEKS, weekTotals, type Day } from "../../../lib/dashwise/data";

/** Two-series palette, checked for color-blind separation and contrast on the dark panel. */
const THIS = "#bd8526";
const LAST = "#527fcc";
const GOOD = "var(--color-down)";
const BAD = "var(--color-up)";

const panel = "min-w-0 rounded-2xl border border-line bg-panel p-4 sm:p-5";
const label = "text-xs font-semibold uppercase tracking-wider text-muted";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

/** The width of an element in CSS pixels, so charts draw at their real size and text stays readable on phones. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(320);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function Tooltip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-raised px-3 py-2 text-xs text-fg shadow-lg"
      style={{ left: x, top: y - 10 }}
    >
      {children}
    </div>
  );
}

function Legend({ items }: { items: { color: string; text: string; dash?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-soft">
      {items.map((i) => (
        <li key={i.text} className="flex items-center gap-1.5">
          {i.dash ? <span className="h-0.5 w-4 rounded" style={{ background: i.color }} aria-hidden /> : <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} aria-hidden />}
          {i.text}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-3 text-sm">
      <summary className={`cursor-pointer rounded text-xs font-semibold text-muted hover:text-fg ${focus}`}>Show the numbers</summary>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-xs">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-muted">
              {head.map((h) => (
                <th key={h} scope="col" className="border-b border-line py-1.5 pr-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums text-soft">
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className="border-b border-hairline py-1.5 pr-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function Spark({ values }: { values: number[] }) {
  const w = 96;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (w - 4) + 2, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24" aria-hidden>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={THIS} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r="2.5" fill={THIS} />
    </svg>
  );
}

function Kpi({ name, value, now, before, history, goodWhenUp, format }: { name: string; value: string; now: number; before: number; history: number[]; goodWhenUp: boolean; format?: (n: number) => string }) {
  const change = pct(now, before);
  const flat = change === 0;
  const up = change > 0;
  const good = up === goodWhenUp;
  const Icon = flat ? ArrowRight : up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className={`${panel} flex flex-col gap-2`}>
      <p className={label}>{name}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">{value}</p>
        <Spark values={history} />
      </div>
      <p className="flex items-center gap-1 text-xs text-muted">
        <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: flat ? "var(--color-soft)" : good ? GOOD : BAD }}>
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {flat ? "0%" : `${up ? "+" : "−"}${Math.abs(change)}%`}
        </span>
        <span>
          vs last week{format ? ` (${format(before)})` : ""} · {flat ? "no change" : good ? "better" : "worse"}
        </span>
      </p>
    </div>
  );
}

function RevenueChart({ days }: { days: Day[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const h = 220;
  const pad = { l: 48, r: 12, t: 12, b: 28 };
  const values = days.map((d) => d.revenue);
  const avg = values.map((_, i) => (i < 6 ? null : values.slice(i - 6, i + 1).reduce((a, b) => a + b, 0) / 7));
  const max = Math.ceil(Math.max(...values) / 500) * 500;
  const x = (i: number) => pad.l + (i / (values.length - 1)) * (width - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b);
  const ticks = [0, max / 2, max];
  const line = (pts: (number | null)[]) =>
    pts
      .map((v, i) => (v === null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");
  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - box.left) / box.width) * (values.length - 1));
    setHover(Math.max(0, Math.min(values.length - 1, i)));
  };
  const hd = hover === null ? null : days[hover];
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-bold">Daily revenue, last 8 weeks</h2>
        <Legend items={[{ color: THIS, text: "Daily revenue", dash: true }, { color: LAST, text: "7-day average", dash: true }]} />
      </div>
      <div ref={ref} className="relative mt-3 w-full min-w-0">
        <svg width={width} height={h} role="img" aria-label={`Daily revenue from ${shortDate(days[0].date)} to ${shortDate(days.at(-1)!.date)}, between ${money(Math.min(...values), false)} and ${money(Math.max(...values), false)} a day, highest on weekends.`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke="var(--color-hairline)" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px]">
                {money(t, false)}
              </text>
            </g>
          ))}
          {days.map((d, i) =>
            (d.weekday === "Mon" && i % 14 === 0) || i === days.length - 1 ? (
              <text key={d.date} x={x(i)} y={h - 8} textAnchor={i === 0 ? "start" : i === days.length - 1 ? "end" : "middle"} className="fill-muted text-[11px]">
                {shortDate(d.date)}
              </text>
            ) : null,
          )}
          <polyline points={line(values)} fill="none" stroke={THIS} strokeWidth="2" strokeLinejoin="round" />
          <polyline points={line(avg)} fill="none" stroke={LAST} strokeWidth="2" strokeLinejoin="round" />
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={h - pad.b} stroke="var(--color-muted)" strokeDasharray="3 3" />
              <circle cx={x(hover)} cy={y(values[hover])} r="4.5" fill={THIS} stroke="var(--color-panel)" strokeWidth="2" />
              {avg[hover] !== null && <circle cx={x(hover)} cy={y(avg[hover]!)} r="4" fill={LAST} stroke="var(--color-panel)" strokeWidth="2" />}
            </g>
          )}
          <rect x={pad.l} y={pad.t} width={width - pad.l - pad.r} height={h - pad.t - pad.b} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
        </svg>
        {hd && hover !== null && (
          <Tooltip x={Math.min(Math.max(x(hover), 90), width - 90)} y={y(values[hover])}>
            <p className="font-semibold">
              {hd.weekday}, {shortDate(hd.date)}
            </p>
            <p>
              Revenue <span className="font-mono">{money(hd.revenue)}</span>
            </p>
            {avg[hover] !== null && (
              <p className="text-muted">
                7-day average <span className="font-mono">{money(avg[hover]!)}</span>
              </p>
            )}
            <p className="text-muted">{hd.orders} orders</p>
          </Tooltip>
        )}
      </div>
      <DataTable
        caption="Daily revenue"
        head={["Date", "Day", "Revenue", "Orders"]}
        rows={[...days].reverse().map((d) => [d.date, d.weekday, money(d.revenue), d.orders])}
      />
    </div>
  );
}

function ProductChart({ days }: { days: Day[] }) {
  const rows = useMemo(() => productRevenue(days), [days]);
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...rows.flatMap((r) => [r.thisWeek, r.lastWeek]));
  return (
    <div className={panel}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-bold">Revenue by product</h2>
        <Legend items={[{ color: THIS, text: "This week" }, { color: LAST, text: "Last week" }]} />
      </div>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const good = r.change >= 0;
          return (
            <li
              key={r.id}
              tabIndex={0}
              onMouseEnter={() => setHover(r.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(r.id)}
              onBlur={() => setHover(null)}
              className={`relative grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 rounded-md text-sm ${focus}`}
              aria-label={`${r.name}: ${money(r.thisWeek)} this week, ${money(r.lastWeek)} last week, ${good ? "up" : "down"} ${Math.abs(r.change)}%`}
            >
              <span className="truncate text-soft">{r.name}</span>
              <span className="grid gap-[2px]">
                <span className="flex items-center gap-2">
                  <span className="h-3 rounded-r-[4px]" style={{ width: `${(r.thisWeek / max) * 78}%`, background: THIS, opacity: hover && hover !== r.id ? 0.5 : 1 }} />
                  <span className="text-xs font-semibold tabular-nums text-fg">{money(r.thisWeek, false)}</span>
                  <span className="text-xs font-semibold" style={{ color: good ? GOOD : BAD }}>
                    {good ? "+" : "−"}
                    {Math.abs(r.change)}%
                  </span>
                </span>
                <span className="h-1.5 rounded-r-[4px]" style={{ width: `${(r.lastWeek / max) * 78}%`, background: LAST, opacity: hover && hover !== r.id ? 0.5 : 1 }} />
              </span>
              {hover === r.id && (
                <span className="pointer-events-none absolute right-0 top-0 z-10 -translate-y-full rounded-lg border border-line bg-raised px-3 py-2 text-xs shadow-lg">
                  <span className="block font-semibold">{r.name}</span>
                  This week <span className="font-mono">{money(r.thisWeek)}</span> · last week <span className="font-mono">{money(r.lastWeek)}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <DataTable caption="Revenue by product" head={["Product", "This week", "Last week", "Change"]} rows={rows.map((r) => [r.name, money(r.thisWeek), money(r.lastWeek), `${r.change}%`])} />
    </div>
  );
}

function WasteChart({ days }: { days: Day[] }) {
  const rows = useMemo(() => wasteByWeekday(days), [days]);
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...rows.map((r) => r.cost));
  return (
    <div className={panel}>
      <h2 className="font-bold">Pastry waste by day, last 4 weeks</h2>
      <p className="mt-1 text-xs text-muted">Cost of croissants and muffins baked but not sold.</p>
      <div className="mt-4 flex h-44 items-end gap-2">
        {rows.map((r) => (
          <button
            key={r.weekday}
            type="button"
            onMouseEnter={() => setHover(r.weekday)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(r.weekday)}
            onBlur={() => setHover(null)}
            aria-label={`${r.weekday}: ${money(r.cost)} wasted, ${r.items} items`}
            className={`group relative flex h-full flex-1 flex-col items-center justify-end gap-1 rounded-md ${focus}`}
          >
            <span className="text-[11px] font-semibold tabular-nums text-soft">{money(r.cost, false)}</span>
            <span className="w-full max-w-10 rounded-t-[4px]" style={{ height: `${(r.cost / max) * 75}%`, background: THIS, opacity: hover && hover !== r.weekday ? 0.5 : 1 }} />
            <span className="text-xs text-muted">{r.weekday}</span>
            {hover === r.weekday && (
              <span className="pointer-events-none absolute bottom-full z-10 mb-1 w-max rounded-lg border border-line bg-raised px-3 py-2 text-left text-xs shadow-lg">
                <span className="block font-semibold">{r.weekday}s, last 4 weeks</span>
                <span className="font-mono">{money(r.cost)}</span> · {r.items} items thrown away
              </span>
            )}
          </button>
        ))}
      </div>
      <DataTable caption="Pastry waste by weekday" head={["Day", "Cost", "Items"]} rows={rows.map((r) => [r.weekday, money(r.cost), r.items])} />
    </div>
  );
}

const SUGGESTIONS = ["What was our best day and why?", "Should we keep cold brew on the menu?", "How much could we save on pastry waste?"];

function Ask() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<{ q: string; a: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ask = async (question: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/dashwise/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const json = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok || !json.answer) throw new Error(json.error ?? "Couldn't answer just now. Please try again.");
      setAnswer({ q: question, a: json.answer });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't answer just now. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) void ask(q.trim());
  };
  return (
    <div className={`${panel} border-[#3a4f2a]`}>
      <h2 className="flex items-center gap-2 font-bold">
        <Sparkles className="h-4 w-4" style={{ color: ACCENT }} aria-hidden /> Ask this data
      </h2>
      <p className="mt-1 text-sm text-muted">Ask a question in plain English. AI answers from the numbers on this page.</p>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="dash-q" className="sr-only">
          Your question
        </label>
        <input
          id="dash-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={300}
          placeholder="e.g. Which day should we bake fewer croissants?"
          className={`min-h-11 flex-1 rounded-[10px] border border-line bg-sunken px-3.5 text-base text-fg placeholder:text-dim ${focus}`}
        />
        <button type="submit" disabled={busy || !q.trim()} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-bold text-[#17220a] disabled:opacity-60 ${focus}`} style={{ background: ACCENT }}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
          {busy ? "Thinking…" : "Ask"}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy}
            onClick={() => {
              setQ(s);
              void ask(s);
            }}
            className={`rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-soft hover:border-[#4b6b33] hover:text-fg disabled:opacity-60 ${focus}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-3">
        {error && (
          <p role="alert" className="text-sm text-up">
            {error}
          </p>
        )}
        {answer && !error && (
          <div className="rounded-xl border border-hairline bg-sunken p-4 text-sm">
            <p className="font-semibold text-soft">{answer.q}</p>
            <p className="mt-2 leading-relaxed text-fg">{answer.a}</p>
            <p className="mt-2 text-xs text-muted">AI can make mistakes. Check the charts before acting on an answer.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashwiseApp({ intro }: { intro?: ReactNode }) {
  const days = useMemo(() => buildDays(), []);
  const weeks = useMemo(() => weekTotals(days), [days]);
  const found = useMemo(() => insights(days), [days]);
  const [prev, now] = weeks.slice(-2);
  const thisWeek = days.filter((d) => d.week === WEEKS - 1);
  return (
    <div className="mx-auto max-w-6xl px-[max(16px,env(safe-area-inset-left))] pb-10 pt-4">
      <div className="flex items-center justify-between gap-3">
        <HomeLink />
        <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">Sample data · fictional café</span>
      </div>
      <header className="mt-6">
        <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
          Dashwise
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[#17220a]" style={{ background: ACCENT }}>
            New · Beta
          </span>
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{CAFE_NAME}: this week at a glance</h1>
        <p className="mt-1 text-sm text-muted">
          Week of {shortDate(thisWeek[0].date)} – {shortDate(thisWeek.at(-1)!.date)}, compared with the week before.
        </p>
        {intro && <div className="mt-3">{intro}</div>}
      </header>

      <section aria-label="Key numbers" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi name="Revenue" value={money(now.revenue, false)} now={now.revenue} before={prev.revenue} history={weeks.map((w) => w.revenue)} goodWhenUp format={(n) => money(n, false)} />
        <Kpi name="Orders" value={now.orders.toLocaleString("en-US")} now={now.orders} before={prev.orders} history={weeks.map((w) => w.orders)} goodWhenUp format={(n) => n.toLocaleString("en-US")} />
        <Kpi name="Average ticket" value={money(now.avgTicket)} now={now.avgTicket} before={prev.avgTicket} history={weeks.map((w) => w.avgTicket)} goodWhenUp format={(n) => money(n)} />
        <Kpi name="Pastry waste" value={money(now.wasteCost, false)} now={now.wasteCost} before={prev.wasteCost} history={weeks.map((w) => w.wasteCost)} goodWhenUp={false} format={(n) => money(n, false)} />
      </section>

      <section aria-labelledby="changed" className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className={panel}>
          <h2 id="changed" className="font-bold">
            What changed this week
          </h2>
          <ul className="mt-3 space-y-3">
            {found.map((f) => (
              <li key={f.title} className="border-l-2 pl-3" style={{ borderColor: ACCENT }}>
                <p className="font-semibold">{f.title}</p>
                <p className="mt-0.5 text-sm text-soft">{f.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Written from the numbers by rules, so they always match the charts.</p>
        </div>
        <Ask />
      </section>

      <section aria-label="Charts" className="mt-4 grid gap-3">
        <RevenueChart days={days} />
        <div className="grid gap-3 lg:grid-cols-2">
          <ProductChart days={days} />
          <WasteChart days={days} />
        </div>
      </section>
    </div>
  );
}
