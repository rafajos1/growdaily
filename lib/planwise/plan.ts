/** Planwise: turning a brain dump into a time-blocked plan for one day. */

export type BlockKind = "focus" | "task" | "break" | "fixed";

export interface Block {
  start: string; // "HH:MM", 24h
  end: string;
  title: string;
  kind: BlockKind;
}

export interface Plan {
  summary: string;
  top3: string[];
  blocks: Block[];
  later: { title: string; reason: string }[];
}

export const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "top3", "blocks", "later"],
  properties: {
    summary: { type: "string" },
    top3: { type: "array", items: { type: "string" } },
    blocks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["start", "end", "title", "kind"],
        properties: {
          start: { type: "string" },
          end: { type: "string" },
          title: { type: "string" },
          kind: { type: "string", enum: ["focus", "task", "break", "fixed"] },
        },
      },
    },
    later: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "reason"],
        properties: { title: { type: "string" }, reason: { type: "string" } },
      },
    },
  },
} as const;

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function toMinutes(hhmm: string): number | null {
  const m = HHMM.exec(hhmm);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export function fromMinutes(min: number): string {
  const m = Math.max(0, Math.min(min, 24 * 60 - 1));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** "13:05" -> "1:05 PM" */
export function formatTime(hhmm: string): string {
  const min = toMinutes(hhmm);
  if (min === null) return hhmm;
  const h = Math.floor(min / 60);
  return `${h % 12 || 12}:${String(min % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "");

/**
 * Makes a plan safe to render: valid times inside the day, sorted, no overlaps,
 * trimmed text and capped list sizes. Invalid blocks are dropped, not guessed at.
 */
export function normalizePlan(raw: unknown, dayStart: string, dayEnd: string): Plan {
  const p = (raw ?? {}) as Partial<Plan>;
  const lo = toMinutes(dayStart) ?? 0;
  const hi = toMinutes(dayEnd) ?? 24 * 60 - 1;
  const kinds: BlockKind[] = ["focus", "task", "break", "fixed"];

  const blocks = (Array.isArray(p.blocks) ? p.blocks : [])
    .map((b) => ({ s: toMinutes(b?.start ?? ""), e: toMinutes(b?.end ?? ""), title: clean(b?.title, 80), kind: kinds.includes(b?.kind as BlockKind) ? (b.kind as BlockKind) : "task" }))
    .filter((b): b is { s: number; e: number; title: string; kind: BlockKind } => b.s !== null && b.e !== null && b.title.length > 0)
    .map((b) => ({ ...b, s: Math.max(b.s, lo), e: Math.min(b.e, hi) }))
    .filter((b) => b.e > b.s)
    .sort((a, b) => a.s - b.s);

  const kept: typeof blocks = [];
  for (const b of blocks) {
    const prev = kept[kept.length - 1];
    if (prev && b.s < prev.e) continue; // overlaps the previous block
    kept.push(b);
  }

  return {
    summary: clean(p.summary, 280),
    top3: (Array.isArray(p.top3) ? p.top3 : []).map((t) => clean(t, 80)).filter(Boolean).slice(0, 3),
    blocks: kept.slice(0, 30).map((b) => ({ start: fromMinutes(b.s), end: fromMinutes(b.e), title: b.title, kind: b.kind })),
    later: (Array.isArray(p.later) ? p.later : [])
      .map((l) => ({ title: clean(l?.title, 80), reason: clean(l?.reason, 140) }))
      .filter((l) => l.title)
      .slice(0, 20),
  };
}

/** Splits a messy brain dump into individual items. */
export function splitDump(dump: string): string[] {
  return dump
    .split(/\n|;|•/)
    .map((s) => s.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
    .filter((s) => s.length > 1)
    .slice(0, 40);
}

/** Finds a clock time mentioned in an item ("dentist at 3pm", "call 14:30"), in minutes. */
export function findTime(item: string): number | null {
  const ampm = /\b(\d{1,2})(?::([0-5]\d))?\s*(am|pm)\b/i.exec(item);
  if (ampm) {
    const h = Number(ampm[1]) % 12 + (ampm[3].toLowerCase() === "pm" ? 12 : 0);
    return h < 24 ? h * 60 + Number(ampm[2] ?? 0) : null;
  }
  const clock = /\b([01]?\d|2[0-3]):([0-5]\d)\b/.exec(item);
  return clock ? Number(clock[1]) * 60 + Number(clock[2]) : null;
}

const QUICK = /\b(call|email|text|reply|pay|book|order|send|message|check)\b/i;

/**
 * Deterministic fallback when AI isn't available: timed items become fixed
 * blocks, everything else fills the gaps in order (quick tasks 30 min, others
 * 60 min) with a short break after each hour of work. What doesn't fit moves to later.
 */
export function basicPlan(dump: string, dayStart: string, dayEnd: string, nowMinutes?: number): Plan {
  const lo = Math.max(toMinutes(dayStart) ?? 9 * 60, nowMinutes !== undefined ? Math.ceil(nowMinutes / 15) * 15 : 0);
  const hi = toMinutes(dayEnd) ?? 17 * 60;
  const items = splitDump(dump);
  const fixed = items
    .map((title) => ({ title, at: findTime(title) }))
    .filter((f): f is { title: string; at: number } => f.at !== null && f.at >= lo && f.at < hi)
    .sort((a, b) => a.at - b.at);
  const fixedTitles = new Set(fixed.map((f) => f.title));
  const flexible = items.filter((t) => !fixedTitles.has(t) && findTime(t) === null);
  const outOfHours = items.filter((t) => !fixedTitles.has(t) && findTime(t) !== null);

  const busy = fixed.map((f) => ({ s: f.at, e: Math.min(f.at + 60, hi), title: f.title }));
  const blocks: Block[] = busy.map((b) => ({ start: fromMinutes(b.s), end: fromMinutes(b.e), title: b.title, kind: "fixed" }));
  const later: Plan["later"] = outOfHours.map((title) => ({ title, reason: "Its time is outside your working hours." }));

  let cursor = lo;
  let workedSinceBreak = 0;
  const nextFree = (from: number, length: number) => {
    let t = from;
    for (const b of busy) if (t < b.e && t + length > b.s) t = b.e;
    return t;
  };
  for (const title of flexible) {
    const length = QUICK.test(title) ? 30 : 60;
    if (workedSinceBreak >= 90) {
      const s = nextFree(cursor, 15);
      if (s + 15 <= hi) {
        blocks.push({ start: fromMinutes(s), end: fromMinutes(s + 15), title: "Break", kind: "break" });
        busy.push({ s, e: s + 15, title: "Break" });
        cursor = s + 15;
      }
      workedSinceBreak = 0;
    }
    const s = nextFree(cursor, length);
    if (s + length > hi) {
      later.push({ title, reason: "Didn't fit in today's hours." });
      continue;
    }
    blocks.push({ start: fromMinutes(s), end: fromMinutes(s + length), title, kind: length === 60 ? "focus" : "task" });
    busy.push({ s, e: s + length, title });
    cursor = s + length;
    workedSinceBreak += length;
  }

  blocks.sort((a, b) => a.start.localeCompare(b.start));
  return {
    summary: `A simple plan for ${items.length} item${items.length === 1 ? "" : "s"}, in the order you wrote them.`,
    top3: flexible.slice(0, 3),
    blocks,
    later,
  };
}

/** Index of the block happening at `nowMinutes`, else the next upcoming one, else -1. */
export function currentBlockIndex(plan: Plan, nowMinutes: number): number {
  let next = -1;
  for (let i = 0; i < plan.blocks.length; i++) {
    const s = toMinutes(plan.blocks[i].start)!;
    const e = toMinutes(plan.blocks[i].end)!;
    if (nowMinutes >= s && nowMinutes < e) return i;
    if (s >= nowMinutes && next === -1) next = i;
  }
  return next;
}

export function plannedMinutes(plan: Plan): number {
  return plan.blocks.filter((b) => b.kind !== "break").reduce((a, b) => a + (toMinutes(b.end)! - toMinutes(b.start)!), 0);
}
