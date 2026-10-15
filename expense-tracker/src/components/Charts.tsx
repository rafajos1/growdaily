"use client";

import { CATEGORY_META } from "@/lib/categories";
import type { CategoryTotal, MonthTotal } from "@/lib/analytics";
import { formatMonthShort } from "@/lib/dates";
import { formatCurrency, formatCurrencyWhole, niceStep } from "@/lib/money";
import type { Category } from "@/lib/types";
import { useElementWidth } from "@/hooks/useElementWidth";

const C = {
  grid: "#1d2b3e",
  axis: "#6f829b",
  label: "#9fb3c9",
  fg: "#e8eef5",
  soft: "#cdd8e5",
  muted: "#8a9bb2",
  amber: "#f2b54b",
  bar: "#2a4462",
  last: "#4c6584",
  bg: "#0d1520",
};
const MONO = "var(--font-dm-mono), ui-monospace, monospace";

function Axis({ x0, x1, y, value }: { x0: number; x1: number; y: number; value: number }) {
  return (
    <>
      <line x1={x0} x2={x1} y1={y} y2={y} stroke={C.grid} />
      <text x={x0 - 8} y={y + 4} textAnchor="end" fontFamily={MONO} fontSize={10} fill={C.axis}>
        {formatCurrencyWhole(value)}
      </text>
    </>
  );
}

// ---------------------------------------------------------------------------

interface PaceChartProps {
  thisCumulative: number[];
  lastCumulative: number[];
  daysInMonth: number;
  projectedCents: number;
}

/** Running total this month vs. last month, with a dotted projection to month end. */
export function PaceChart({ thisCumulative, lastCumulative, daysInMonth, projectedCents }: PaceChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const H = 200, L = 52, R = 14, T = 16, B = 24;
  const day = thisCumulative.length;
  const spent = thisCumulative[day - 1] ?? 0;
  const lastAtDay = lastCumulative[Math.min(day, lastCumulative.length) - 1] ?? 0;
  const step = niceStep(Math.max(projectedCents, lastCumulative[lastCumulative.length - 1] ?? 0, spent));
  const max = step * 4;
  const x = (d: number) => L + ((d - 1) / Math.max(daysInMonth - 1, 1)) * (width - L - R);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const path = (a: number[]) => a.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join("");
  // Place the "last month" label on whichever side of the point has room; if neither does, pin it top-left.
  const lastLabel = `Last month by day ${day}: ${formatCurrencyWhole(lastAtDay)}`;
  const labelWidth = lastLabel.length * 6.2;
  const labelPos =
    x(day) + 8 + labelWidth <= width - R
      ? { x: x(day) + 8, y: y(lastAtDay) - 7, anchor: "start" as const }
      : x(day) - 8 - labelWidth >= L
        ? { x: x(day) - 8, y: y(lastAtDay) - 7, anchor: "end" as const }
        : { x: L + 6, y: T + 4, anchor: "start" as const };

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label={`Spent ${formatCurrency(spent)} by day ${day}, compared with ${formatCurrency(lastAtDay)} by the same day last month.`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Axis key={i} x0={L} x1={width - R} y={y(step * i)} value={step * i} />
          ))}
          {[1, 8, 15, 22, 29].filter((d) => d <= daysInMonth).map((d) => (
            <text key={d} x={x(d)} y={H - 6} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={C.axis}>
              {d}
            </text>
          ))}
          {lastCumulative.length > 0 && <path d={path(lastCumulative.slice(0, daysInMonth))} fill="none" stroke={C.last} strokeWidth={2} />}
          {day > 0 && (
            <>
              <path d={`${path(thisCumulative)}L${x(day)},${y(0)}L${x(1)},${y(0)}Z`} fill={C.amber} opacity={0.1} />
              <path d={path(thisCumulative)} fill="none" stroke={C.amber} strokeWidth={2.5} strokeLinejoin="round" />
              {day < daysInMonth && (
                <line x1={x(day)} y1={y(spent)} x2={x(daysInMonth)} y2={y(projectedCents)} stroke={C.amber} strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />
              )}
              {lastCumulative.length > 0 && (
                <>
                  <circle cx={x(day)} cy={y(lastAtDay)} r={3.5} fill={C.last} />
                  <text x={labelPos.x} y={labelPos.y} textAnchor={labelPos.anchor} fontFamily={MONO} fontSize={10} fill={C.muted}>
                    {lastLabel}
                  </text>
                </>
              )}
              <circle cx={x(day)} cy={y(spent)} r={5} fill={C.bg} stroke={C.amber} strokeWidth={2.5} />
            </>
          )}
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

const HEAT = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];

/** Month grid where each day is shaded by how much was spent. */
export function CalendarHeatmap({ year, month, daily, today }: { year: number; month: number; daily: number[]; today: number }) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const max = Math.max(...daily.slice(0, today), 1);
  const level = (v: number) => (v === 0 ? 0 : v < max * 0.25 ? 1 : v < max * 0.5 ? 2 : v < max * 0.8 ? 3 : 4);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5" role="grid" aria-label="Daily spending this month">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="pb-0.5 text-center font-mono text-[11px] tracking-widest text-muted" aria-hidden>
            {d}
          </div>
        ))}
        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {daily.map((v, i) => {
          const d = i + 1;
          if (d > today) {
            return (
              <div key={d} className="flex aspect-[1.25] rounded-lg border border-dashed border-line p-1.5 font-mono text-[11px] text-dim sm:p-2">
                {d}
              </div>
            );
          }
          const lv = level(v);
          return (
            <div
              key={d}
              role="gridcell"
              aria-label={`Day ${d}: ${v ? formatCurrency(v) : "nothing spent"}`}
              className={`flex aspect-[1.25] flex-col justify-between rounded-lg p-1.5 font-mono text-[11px] sm:p-2 ${HEAT[lv]} ${lv === 4 ? "text-[#0d2433]" : "text-[#9fb3c9]"} ${d === today ? "outline outline-2 outline-offset-1 outline-amber" : ""}`}
            >
              {d}
              {v > 0 && <b className={`hidden text-xs font-medium sm:block ${lv === 4 ? "text-[#08202e]" : "text-fg"}`}>{formatCurrencyWhole(v)}</b>}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[11px] text-muted" aria-hidden>
        less {HEAT.map((c) => <i key={c} className={`inline-block h-2.5 w-[18px] rounded-[3px] ${c}`} />)} more
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

/** One horizontal bar split by category share, plus a legend. */
export function CategoryStack({ data }: { data: CategoryTotal[] }) {
  return (
    <div>
      <div className="my-4 flex h-3.5 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={data.map((d) => `${d.category} ${(d.share * 100).toFixed(0)}%`).join(", ")}>
        {data.map((d) => (
          <i key={d.category} style={{ flex: d.share, background: CATEGORY_META[d.category].color }} />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {data.map((d) => (
          <li key={d.category} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CATEGORY_META[d.category].color }} aria-hidden />
            {d.category}
            <span className="ml-auto font-mono text-[13px] tabular-nums">{formatCurrency(d.totalCents)}</span>
            <span className="w-9 text-right font-mono text-xs text-muted">{(d.share * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------

/** Monthly totals with a "typical month" line and the current month's projection. */
export function MonthlyBars({ data, typicalCents, projectedCents }: { data: MonthTotal[]; typicalCents: number | null; projectedCents: number }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const H = 250, L = 56, R = 10, T = 20, B = 28;
  const step = niceStep(Math.max(...data.map((m) => m.totalCents), projectedCents, typicalCents ?? 0));
  const max = step * 4;
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const bw = (width - L - R) / data.length;
  const compact = bw < 56;
  const lastIndex = data.length - 1;

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label="Total spending per month">
          {[0, 1, 2, 3, 4].map((i) => (
            <Axis key={i} x0={L} x1={width - R} y={y(step * i)} value={step * i} />
          ))}
          {data.map((m, i) => {
            const x = L + i * bw + bw * 0.2, w = bw * 0.6, last = i === lastIndex;
            return (
              <g key={m.month}>
                {last && projectedCents > m.totalCents && (
                  <>
                    <rect x={x} y={y(projectedCents)} width={w} height={y(0) - y(projectedCents)} rx={6} fill="none" stroke={C.amber} strokeDasharray="4 4" opacity={0.7} />
                    <text x={x + w / 2} y={y(projectedCents) - 8} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={C.amber}>
                      ≈{formatCurrencyWhole(projectedCents)}
                    </text>
                  </>
                )}
                <rect x={x} y={y(m.totalCents)} width={w} height={Math.max(y(0) - y(m.totalCents), 0)} rx={Math.min(6, w / 4)} fill={last ? C.amber : C.bar} />
                {!last && !compact && (
                  <text x={x + w / 2} y={y(m.totalCents) - 8} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={C.label}>
                    {formatCurrencyWhole(m.totalCents)}
                  </text>
                )}
                <text x={x + w / 2} y={H - 8} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={last ? C.amber : C.muted}>
                  {compact ? formatMonthShort(m.month).slice(0, 1) : formatMonthShort(m.month)}
                </text>
              </g>
            );
          })}
          {typicalCents !== null && (
            <>
              <line x1={L} x2={width - R} y1={y(typicalCents)} y2={y(typicalCents)} stroke={C.fg} strokeDasharray="2 6" strokeLinecap="round" opacity={0.6} />
              <text x={L + 6} y={y(typicalCents) - 7} fontFamily={MONO} fontSize={11} fill={C.soft}>
                typical {formatCurrencyWhole(typicalCents)}
              </text>
            </>
          )}
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

/** Small column chart of one category across months, with its average as a dotted line. */
export function CategorySpark({ category, series, labels, averageCents, highlightIndex }: { category: Category; series: number[]; labels: string[]; averageCents: number; highlightIndex: number }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const H = 64;
  const max = Math.max(...series, averageCents, 1);
  const bw = width / series.length;
  const color = CATEGORY_META[category].color;
  const ay = H - (averageCents / max) * (H - 6);
  return (
    <div ref={ref} className="mt-3 w-full">
      {width > 0 && (
        <svg width={width} height={H + 16} role="img" aria-label={`${category} by month`}>
          {series.map((v, i) => {
            const h = v ? Math.max(3, (v / max) * (H - 6)) : 1;
            const opacity = i === highlightIndex ? 1 : i === series.length - 1 ? 0.35 : 0.45;
            return <rect key={i} x={i * bw + bw * 0.18} y={H - h} width={bw * 0.64} height={h} rx={3} fill={color} opacity={opacity} />;
          })}
          {averageCents > 0 && <line x1={0} x2={width} y1={ay} y2={ay} stroke={C.fg} strokeDasharray="2 5" opacity={0.45} />}
          {labels.map((l, i) => (
            <text key={i} x={(i + 0.5) * bw} y={H + 13} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={i === highlightIndex ? C.soft : "#5f7590"}>
              {l}
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayBars({ totals }: { totals: number[] }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const H = 170, B = 22;
  const max = Math.max(...totals, 1);
  const top = totals.indexOf(max);
  const bw = width / 7;
  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label="Spending by day of the week">
          {totals.map((v, i) => {
            const h = (v / max) * (H - B - 20), x = i * bw + bw * 0.2, w = bw * 0.6, y = H - B - h, hi = i === top && v > 0;
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} rx={5} fill={hi ? C.amber : C.bar} />
                {bw > 44 && (
                  <text x={x + w / 2} y={y - 6} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={hi ? C.amber : C.muted}>
                    {formatCurrencyWhole(v)}
                  </text>
                )}
                <text x={x + w / 2} y={H - 5} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={hi ? C.fg : C.muted}>
                  {WEEKDAYS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
