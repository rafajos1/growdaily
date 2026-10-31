"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, Clock, FastForward, ShieldCheck } from "lucide-react";
import { CRISIS_REPLY, DAYS, isCrisis, VERSES, type CheckinType, type Step } from "../../../lib/barnabas/core";

interface Msg {
  from: "u" | "b" | "c" | "sys";
  text: string;
  at: number;
  verse?: { ref: string; text: string } | null;
}
interface State {
  now: number;
  stage: "name" | "area" | "why" | "when" | "active";
  msgs: Msg[];
  mem: { name: string; area: string; areaRaw: string; why: string; hardText: string; hardDay: number | null; hardHour: number | null; notes: string[]; wins: number; slips: number; startedAt: number };
  sent: number;
  unanswered: number;
  lastType: string;
  plan: { at: number; type: CheckinType } | null;
  crisis: boolean;
}

const KEY = "growdaily.barnabas.v1";
const fresh = (): State => ({
  now: Date.now(),
  stage: "name",
  msgs: [],
  mem: { name: "", area: "", areaRaw: "", why: "", hardText: "", hardDay: null, hardHour: null, notes: [], wins: 0, slips: 0, startedAt: Date.now() },
  sent: 0,
  unanswered: 0,
  lastType: "",
  plan: null,
  crisis: false,
});

const TYPE_NAME: Record<CheckinType, string> = { accountability: "Accountability question", checkin: "Check-in", verse: "A verse for you", followup: "Before your hard moment", noreply: "No reply needed", silence: "After a quiet stretch", reflect: "Looking back on your progress" };
const STARTERS: Record<State["stage"], string[]> = {
  name: [],
  area: ["I want to stop looking at porn.", "I want a real prayer life, not just before meals.", "Being more patient with my kids."],
  why: ["When I'm stressed or alone it's the easy escape.", "I start strong and then life gets busy."],
  when: ["Late at night after everyone's asleep.", "Weekday mornings, I just grab my phone."],
  active: ["Honestly, I slipped last night.", "Had a really good week actually.", "Work's been crazy, haven't thought about it.", "I'm struggling tonight."],
};

function fmtTime(t: number) {
  const d = new Date(t);
  const h = d.getHours();
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
const fmtDay = (t: number) => new Date(t).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
const fmtShort = (t: number) => `${DAYS[new Date(t).getDay()].slice(0, 3)} ${fmtTime(t)}`;
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function parseWhen(t: string) {
  const s = t.toLowerCase();
  let day: number | null = null;
  let hour: number | null = null;
  DAYS.forEach((d, i) => {
    if (s.includes(d.toLowerCase())) day = i;
  });
  if (/night|bed|asleep/.test(s)) hour = 21;
  else if (/evening|after work|dinner/.test(s)) hour = 19;
  else if (/afternoon|lunch/.test(s)) hour = 13;
  else if (/morning|wake/.test(s)) hour = 7;
  return { day, hour };
}

export function BarnabasApp() {
  const [S, setS] = useState<State | null>(null);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const ref = useRef<State | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const commit = (next: State) => {
    ref.current = next;
    setS({ ...next, msgs: [...next.msgs] });
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };
  const st = () => ref.current!;

  useEffect(() => {
    let loaded: State | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = { ...fresh(), ...JSON.parse(raw) };
    } catch {}
    commit(loaded ?? fresh());
    if (!loaded) void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [S?.msgs.length, typing]);

  const push = (m: Omit<Msg, "at">) => {
    const s = st();
    s.msgs.push({ ...m, at: s.now });
    commit(s);
  };
  const says = async (text: string, verse?: Msg["verse"]) => {
    setTyping(true);
    await wait(450 + Math.min(1400, text.length * 10));
    setTyping(false);
    st().now += 20_000;
    push({ from: "b", text, verse });
  };

  const memFor = () => {
    const m = st().mem;
    return { name: m.name, area: m.area || m.areaRaw, why: m.why, hardText: m.hardText, notes: m.notes, wins: m.wins, slips: m.slips, days: Math.max(0, Math.round((st().now - m.startedAt) / 864e5)) };
  };
  const thread = () =>
    st()
      .msgs.filter((m) => m.from === "u" || m.from === "b")
      .slice(-12)
      .map((m) => ({ from: m.from, text: m.text }));

  async function ai(step: Step, extra: Record<string, unknown> = {}): Promise<Record<string, unknown> | null> {
    setTyping(true);
    try {
      const res = await fetch("/api/barnabas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ step, mem: memFor(), thread: thread(), ...extra }) });
      if (!res.ok) return null;
      return (await res.json()) as Record<string, unknown>;
    } catch {
      return null;
    } finally {
      setTyping(false);
    }
  }
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : "");

  async function start() {
    const s = st();
    s.msgs.push({ from: "sys", text: "You started Barnabas. It's private: just you and Barnabas, saved only on this device.", at: s.now });
    commit(s);
    await says("Hey, it's Barnabas. Quick heads-up so there are no surprises: I'm an AI, your accountability friend. I'll check in, ask the honest questions, and never judge you. This stays between us.");
    await says("So, glad you're here. What should I call you?");
  }

  async function crisis() {
    const s = st();
    s.crisis = true;
    s.plan = null;
    commit(s);
    setTyping(true);
    await wait(600);
    setTyping(false);
    s.now += 15_000;
    push({ from: "c", text: CRISIS_REPLY });
  }

  function planNext() {
    const s = st();
    if (s.stage !== "active" || s.crisis) {
      s.plan = null;
      return commit(s);
    }
    const m = s.mem;
    let type: CheckinType;
    if (s.unanswered >= 2) type = "silence";
    else if (s.sent >= 4 && s.sent % 5 === 4) type = "reflect";
    else if ((m.hardDay !== null || m.hardHour !== null) && s.lastType !== "followup" && s.sent % 3 === 1) type = "followup";
    else type = pick((["accountability", "checkin", "verse", "noreply", "accountability"] as CheckinType[]).filter((t) => t !== s.lastType));
    const d = new Date(s.now);
    if (type === "followup") {
      d.setDate(d.getDate() + 1);
      if (m.hardDay !== null) while (d.getDay() !== m.hardDay) d.setDate(d.getDate() + 1);
      d.setHours(Math.max(7, (m.hardHour ?? 20) - 1), 15 + Math.floor(Math.random() * 30), 0, 0);
    } else {
      d.setDate(d.getDate() + (type === "silence" ? 3 : 1 + Math.floor(Math.random() * 2)));
      const [h, mi] = pick([[7, 40], [12, 10], [17, 50], [20, 5], [9, 25]]);
      d.setHours(h, mi, 0, 0);
    }
    if (d.getTime() <= s.now) d.setTime(s.now + 6 * 3600e3);
    s.plan = { at: d.getTime(), type };
    commit(s);
  }

  async function sendCheckin() {
    const s = st();
    if (!s.plan) return;
    const { at, type } = s.plan;
    s.now = at;
    commit(s);
    const out = await ai("checkin", { checkin: type, when: fmtShort(at) });
    const n = s.mem.name || "friend";
    const area = s.mem.area || "what you're working on";
    const fallback: Record<CheckinType, string> = {
      accountability: `Straight answer, ${n}: how have you done with ${area} since we last talked? Honest beats perfect. No judgment either way.`,
      checkin: `Hey ${n}, you've been on my mind today. How's it going with ${area}?`,
      verse: `Came across this and thought of you, ${n}.`,
      followup: `Hey ${n}. You said ${s.mem.hardText || "this time"} is when it gets hard. Thinking of you tonight. What's your plan?`,
      noreply: `No need to reply. Just wanted you to know someone's in your corner today, ${n}.`,
      silence: `Hey ${n}, haven't heard from you in a bit. No pressure and no judgment. I'm still here whenever you want to talk.`,
      reflect: `${n}, you've kept showing up and you've been honest along the way. That matters more than a perfect record.`,
    };
    let verse = (out?.verse as Msg["verse"]) ?? null;
    if (type === "verse" && !verse) {
      const v = s.mem.slips > s.mem.wins ? pick(VERSES.filter((x) => x.id === "lam3" || x.id === "rom8")) : pick(VERSES);
      verse = { ref: v.ref, text: v.text };
    }
    push({ from: "b", text: str(out?.text) || fallback[type], verse: type === "verse" ? verse : null });
    s.sent += 1;
    s.lastType = type;
    if (type !== "noreply") s.unanswered += 1;
    planNext();
  }

  async function onboarding(text: string) {
    const s = st();
    if (s.stage === "name") {
      const name = text.replace(/^(i'?m|it'?s|my name is|call me)\s+/i, "").split(/[\s,.!]/)[0].slice(0, 24) || "friend";
      s.mem.name = name.charAt(0).toUpperCase() + name.slice(1);
      s.stage = "area";
      commit(s);
      return says(`Good to meet you, ${s.mem.name}. What's one thing you want to grow in right now? A habit you want to break, your prayer life, patience at home, whatever's real.`);
    }
    if (s.stage === "area") {
      s.mem.areaRaw = text.slice(0, 120);
      s.stage = "why";
      commit(s);
      const out = await ai("area", { text });
      if (out?.crisis || out?.concern === "crisis") return crisis();
      s.mem.area = str(out?.area);
      commit(s);
      return says(str(out?.reply) || "Thanks for trusting me with that. It's a real thing to want. What makes it hard for you?");
    }
    if (s.stage === "why") {
      s.mem.why = text.slice(0, 200);
      s.stage = "when";
      commit(s);
      const out = await ai("why", { text });
      if (out?.crisis || out?.concern === "crisis") return crisis();
      if (str(out?.why)) s.mem.why = str(out?.why);
      commit(s);
      return says(str(out?.reply) || "That makes sense, and you're not the only one. When does it usually get hardest? A time of day, a day of the week, a situation?");
    }
    // when
    const p = parseWhen(text);
    s.mem.hardText = text.replace(/[.!?\s]+$/, "").replace(/^\w/, (c) => c.toLowerCase()).slice(0, 60);
    s.mem.hardDay = p.day;
    s.mem.hardHour = p.hour;
    const out = await ai("when", { text });
    if (out?.crisis || out?.concern === "crisis") return crisis();
    if (typeof out?.hardDay === "number") s.mem.hardDay = out.hardDay;
    if (typeof out?.hardHour === "number") s.mem.hardHour = out.hardHour;
    if (str(out?.hardText)) s.mem.hardText = str(out?.hardText);
    s.stage = "active";
    commit(s);
    await says(str(out?.reply) || `Got it. Thank you for trusting me with all that, ${s.mem.name}. I'll check in now and then with honest questions, and I'll be around for ${s.mem.hardText || "the hard moments"}. This stays between us.`);
    planNext();
  }

  async function onUser(text: string) {
    const s = st();
    s.now += 60_000;
    s.unanswered = 0;
    push({ from: "u", text });
    if (isCrisis(text)) return crisis();
    if (s.crisis) return says("I'm still here. Please call or text 988 now so you can talk with someone trained, any time, day or night. If you're in danger, call 911.");
    if (s.stage !== "active") return onboarding(text);
    const out = await ai("reply", { text });
    if (out?.crisis || out?.concern === "crisis") return crisis();
    if (out) {
      if (out.slip) s.mem.slips += 1;
      if (out.win) s.mem.wins += 1;
      if (str(out.note)) s.mem.notes = [...s.mem.notes, str(out.note)].slice(-8);
      commit(s);
    }
    let reply = str(out?.reply);
    if (!reply) {
      if (/slip|fail|messed up|relapse|fell|gave in|blew it/i.test(text)) {
        s.mem.slips += 1;
        reply = `Thanks for being honest, ${s.mem.name}. That takes guts, and it doesn't undo the ground you've gained. What's one small thing you can do tonight?`;
      } else if (/good|great|win|clean|did it|better|strong/i.test(text)) {
        s.mem.wins += 1;
        reply = `That's real progress, ${s.mem.name}. Hold onto that. What helped most?`;
      } else reply = `I hear you, ${s.mem.name}. Thanks for telling me. What's weighing on you most right now?`;
    }
    await says(reply);
    planNext();
  }

  async function submit(text: string) {
    const t = text.replace(/\s+/g, " ").trim().slice(0, 500);
    if (!t || busy || typing) return;
    setBusy(true);
    try {
      await onUser(t);
    } finally {
      setBusy(false);
    }
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = draft;
    setDraft("");
    void submit(t);
  };
  const skip = async () => {
    if (busy || typing) return;
    setBusy(true);
    try {
      await sendCheckin();
    } finally {
      setBusy(false);
    }
  };
  const reset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    setConfirmReset(false);
    commit(fresh());
    setBusy(true);
    try {
      await start();
    } finally {
      setBusy(false);
    }
  };
  const resume = () => {
    const s = st();
    s.crisis = false;
    commit(s);
    planNext();
  };

  if (!S) return <div className="h-[640px] rounded-[28px] border border-line bg-panel" aria-hidden />;

  let lastDay = "";
  const m = S.mem;
  const chips = STARTERS[S.stage];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      <div className="mx-auto w-full max-w-[400px] rounded-[30px] border border-line bg-sunken p-2.5 shadow-2xl shadow-black/40">
        <div className="grid h-[min(680px,78vh)] min-h-[520px] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[22px] bg-bg">
          <div className="grid justify-items-center gap-0.5 border-b border-line bg-panel px-3 pb-2.5 pt-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber font-extrabold text-amber-ink" aria-hidden>
              B
            </div>
            <b className="text-sm">Barnabas</b>
            <span className="text-[11.5px] text-muted">AI accountability friend · private</span>
          </div>
          <div ref={threadRef} className="flex flex-col gap-1.5 overflow-y-auto px-3 py-3.5" aria-live="polite" aria-label="Conversation with Barnabas">
            {S.msgs.map((msg, i) => {
              const day = fmtDay(msg.at);
              const showDay = day !== lastDay;
              lastDay = day;
              const next = S.msgs[i + 1];
              const showTime = msg.from !== "sys" && (!next || next.from !== msg.from || next.at - msg.at > 10 * 60e3);
              return (
                <div key={i} className="contents">
                  {showDay && (
                    <p className="mb-1 mt-3 self-center font-mono text-[11px] text-dim">
                      {day} · {fmtTime(msg.at)}
                    </p>
                  )}
                  {msg.from === "sys" ? (
                    <p className="mb-1.5 max-w-[88%] self-center text-center text-[11.5px] text-muted">{msg.text}</p>
                  ) : (
                    <div
                      className={`max-w-[84%] whitespace-pre-wrap break-words rounded-[18px] px-3 py-2 text-[15px] leading-snug ${
                        msg.from === "u" ? "self-end rounded-br-md bg-amber text-amber-ink" : msg.from === "c" ? "self-start rounded-bl-md border border-up/60 bg-up/15 text-fg" : "self-start rounded-bl-md bg-raised text-fg"
                      }`}
                    >
                      {msg.text}
                      {msg.verse && (
                        <span className="mt-2 block rounded-r-lg border-l-2 border-amber bg-black/20 px-2.5 py-2 text-sm">
                          &ldquo;{msg.verse.text}&rdquo;
                          <cite className="mt-1 block font-mono text-[11px] not-italic text-amber">{msg.verse.ref} (WEB)</cite>
                        </span>
                      )}
                    </div>
                  )}
                  {showTime && <p className={`mb-1 font-mono text-[10.5px] text-dim ${msg.from === "u" ? "mr-2 self-end" : "ml-2 self-start"}`}>{fmtTime(msg.at)}</p>}
                </div>
              );
            })}
            {typing && (
              <div className="flex gap-1 self-start rounded-[18px] bg-raised px-3.5 py-3" aria-label="Barnabas is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 0.2}s` }} />
                ))}
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 border-t border-line bg-panel p-2.5" autoComplete="off">
            <label htmlFor="barnabas-box" className="sr-only">
              Your message
            </label>
            <input
              id="barnabas-box"
              value={draft}
              maxLength={500}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Text message"
              className="min-w-0 flex-1 rounded-full border border-line bg-bg px-3.5 py-2.5 text-base text-fg placeholder:text-dim focus:border-amber/60 focus:outline-none"
            />
            <button type="submit" disabled={busy || typing || !draft.trim()} aria-label="Send" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber text-amber-ink disabled:opacity-50">
              <ArrowUp className="h-5 w-5" aria-hidden />
            </button>
          </form>
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        {S.crisis && (
          <section className="grid gap-2 rounded-2xl border border-up/50 bg-up/10 p-5 text-sm text-soft">
            <b className="text-fg">Crisis help shown. Regular check-ins are paused.</b>
            <span>Barnabas pointed to 988, the Crisis Text Line and 911. In this demo you can resume check-ins when you&apos;re ready.</span>
            <button type="button" onClick={resume} className="justify-self-start rounded-lg border border-line bg-raised px-3 py-2 font-semibold text-fg hover:bg-[#24364f]">
              Resume check-ins
            </button>
          </section>
        )}
        <section className="rounded-2xl border border-line bg-panel p-5">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Next check-in</p>
          {S.plan ? (
            <>
              <p className="mt-2 flex items-center gap-2 font-mono text-xl font-semibold">
                <Clock className="h-5 w-5 text-amber" aria-hidden /> {fmtShort(S.plan.at)}
              </p>
              <p className="mt-1 text-sm text-soft">{TYPE_NAME[S.plan.type]}</p>
              <p className="mt-2 text-sm text-muted">Barnabas texts first, at times that fit what you told him. In this demo, skip ahead instead of waiting.</p>
              <button type="button" onClick={skip} disabled={busy || typing} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-amber px-4 font-bold text-[#2a1c05] transition hover:brightness-110 disabled:opacity-60">
                <FastForward className="h-4 w-4" aria-hidden /> {busy ? "Barnabas is writing…" : "Skip ahead to it"}
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">{S.crisis ? "Paused." : "Barnabas plans his first check-in once you've finished introducing yourself."}</p>
          )}
        </section>
        {chips.length > 0 && (
          <section className="rounded-2xl border border-line bg-panel p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Try a reply</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c} type="button" disabled={busy || typing} onClick={() => void submit(c)} className="rounded-full border border-line bg-raised px-3 py-1.5 text-left text-sm text-soft transition hover:border-amber/50 hover:text-fg disabled:opacity-60">
                  {c}
                </button>
              ))}
            </div>
          </section>
        )}
        <section className="rounded-2xl border border-line bg-panel p-5">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">What Barnabas remembers</p>
          {m.name ? (
            <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-muted">Name</dt>
              <dd>{m.name}</dd>
              <dt className="text-muted">Growing in</dt>
              <dd>{m.area || m.areaRaw || <span className="text-dim">not yet</span>}</dd>
              <dt className="text-muted">Why it&apos;s hard</dt>
              <dd>{m.why || <span className="text-dim">not yet</span>}</dd>
              <dt className="text-muted">Hardest</dt>
              <dd>{m.hardText || <span className="text-dim">not yet</span>}</dd>
              <dt className="text-muted">Shared</dt>
              <dd>
                {m.wins} {m.wins === 1 ? "win" : "wins"} · {m.slips} honest {m.slips === 1 ? "slip" : "slips"}
              </dd>
            </dl>
          ) : (
            <p className="mt-2 text-sm text-muted">Nothing yet. Barnabas learns as you text.</p>
          )}
          <p className="mt-4 flex items-start gap-2 text-xs text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-down" aria-hidden /> Saved only in this browser. Messages are sent to AI to write replies, and nothing is stored on our servers.
          </p>
          <button type="button" onClick={() => void reset()} className="mt-3 text-sm text-muted underline underline-offset-4 hover:text-fg">
            {confirmReset ? "Tap again to erase everything" : "Erase and start over"}
          </button>
        </section>
      </div>
    </div>
  );
}
