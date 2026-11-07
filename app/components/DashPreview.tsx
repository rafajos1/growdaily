import Link from "next/link";
import { ArrowRight, MessageSquare, Sparkles, Table } from "lucide-react";
import { buildDays, CAFE_NAME, insights, money, pct, weekTotals } from "../../lib/dashwise/data";

const ACCENT = "#a3d35c";
const BAR = "#bd8526";

/** Home page band: a static preview of the Dashwise sample dashboard, drawn from the same fictional data. */
export function DashPreview() {
  const days = buildDays();
  const weeks = weekTotals(days);
  const [prev, now] = weeks.slice(-2);
  const found = insights(days);
  const max = Math.max(...weeks.map((w) => w.revenue));
  const tiles = [
    { name: "Revenue", value: money(now.revenue, false), change: pct(now.revenue, prev.revenue), goodWhenUp: true },
    { name: "Orders", value: now.orders.toLocaleString("en-US"), change: pct(now.orders, prev.orders), goodWhenUp: true },
    { name: "Pastry waste", value: money(now.wasteCost, false), change: pct(now.wasteCost, prev.wasteCost), goodWhenUp: false },
  ];
  const points = [
    { Icon: Sparkles, title: "See what changed", text: "A plain-English summary of the week, written from your numbers." },
    { Icon: MessageSquare, title: "Ask in plain English", text: "“Which day should we bake less?” and get an answer from your data." },
    { Icon: Table, title: "No BI team needed", text: "Start from the spreadsheet you already have. Your team can build it in a workshop." },
  ];
  return (
    <section id="dashboards" aria-labelledby="dash-heading" className="scroll-mt-8 pb-20">
      <div className="grid items-center gap-8 rounded-3xl border border-line bg-panel p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
            AI dashboards
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[#17220a]" style={{ background: ACCENT }}>
              New · Beta
            </span>
          </p>
          <h2 id="dash-heading" className="mt-3 text-3xl font-extrabold tracking-tight [text-wrap:balance] sm:text-4xl">
            Turn your spreadsheet into an AI dashboard
          </h2>
          <ul className="mt-6 space-y-4">
            {points.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/apps/dashwise"
              className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-bold text-[#17220a] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              style={{ background: ACCENT }}
            >
              Try the live demo <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/learn/how-to-build-an-ai-dashboard" className="text-sm font-semibold text-soft underline-offset-4 hover:text-fg hover:underline">
              How to build one
            </Link>
          </div>
        </div>

        <Link
          href="/apps/dashwise"
          aria-label={`Open the Dashwise demo: ${CAFE_NAME}, sample data`}
          className="group block min-w-0 rounded-2xl border border-line bg-sunken p-4 transition hover:border-[#4b6b33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">{CAFE_NAME}: this week</p>
            <p className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted">Sample data</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {tiles.map((t) => {
              const good = t.change >= 0 === t.goodWhenUp;
              return (
                <div key={t.name} className="min-w-0 rounded-xl border border-hairline bg-panel p-2.5 sm:p-3">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted">{t.name}</p>
                  <p className="mt-1 text-lg font-extrabold tabular-nums sm:text-xl">{t.value}</p>
                  <p className="text-[11px] font-semibold" style={{ color: good ? "var(--color-down)" : "var(--color-up)" }}>
                    {t.change >= 0 ? "+" : "−"}
                    {Math.abs(t.change)}% <span className="font-normal text-muted">vs last wk</span>
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-xl border border-hairline bg-panel p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Revenue by week</p>
            <div className="mt-2 flex h-20 items-end gap-1.5" aria-hidden>
              {weeks.map((w, i) => (
                <span key={w.week} className="flex-1 rounded-t-[3px]" style={{ height: `${(w.revenue / max) * 100}%`, background: BAR, opacity: i === weeks.length - 1 ? 1 : 0.45 }} />
              ))}
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {found.slice(1).map((f) => (
              <li key={f.title} className="flex gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} aria-hidden />
                <span className="text-soft">{f.title}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: ACCENT }}>
            Open the full dashboard <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
          </p>
        </Link>
      </div>
    </section>
  );
}
