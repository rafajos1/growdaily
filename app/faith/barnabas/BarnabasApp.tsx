"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import {
  CRISIS_REPLY, DAYS, fallbackCheckin, fallbackReply, fallbackVerse, fmtDay, fmtShort, fmtTime, freshState, isCrisis,
  ONBOARDING_FALLBACK, parseName, parseWhen, planNext, toContext, wantsHuman,
  type BarnabasState, type CheckinType, type Message, type TurnResult,
} from "../../../lib/faith/barnabas";

const KEY = "faith:barnabas:v1";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btn = `inline-flex items-center justify-center rounded-[10px] bg-amber px-4 py-3 text-sm font-bold text-amber-ink transition hover:bg-amber-hover disabled:opacity-50 ${focus}`;
const btnGhost = `inline-flex items-center justify-center rounded-[10px] bg-raised px-3 py-2 text-sm font-bold text-fg transition hover:bg-line disabled:opacity-50 ${focus}`;
const chip = `rounded-full border border-line bg-raised px-3 py-1.5 text-left text-sm text-soft transition hover:border-muted hover:text-fg ${focus}`;
const card = "grid min-w-0 gap-2.5 rounded-2xl border border-line bg-panel p-4";
const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";
const pill = "inline-block rounded-full bg-raised px-2.5 py-0.5 font-mono text-xs";

const TYPE_NAME: Record<CheckinType, string> = { checkin: "Check-in", verse: "Verse for you", followup: "Hard-moment follow-up", noreply: "No reply needed", silence: "After silence", reflect: "Progress reflection" };
const STAGE_CHIPS: Record<string, string[]> = {
  name: ["Raf"],
  area: ["I want to stop looking at porn.", "I want a real prayer life, not just before meals.", "Being more patient with my kids."],
  why: ["When I'm stressed or alone it's the easy escape.", "I start strong and then life gets busy."],
  when: ["Friday nights after everyone's asleep.", "Weekday mornings, I just grab my phone."],
};
const ACTIVE_CHIPS = ["Honestly, I slipped last night.", "Had a really good week actually.", "Work's been crazy, haven't thought about it.", "Can I talk to a real person?"];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function load(): BarnabasState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: start fresh */
  }
  return freshState();
}

function relDays(t: number, now: number) {
  const h = Math.round((t - now) / 36e5);
  const d = Math.round((t - now) / 864e5);
  return h < 24 ? `in ${h}h` : `in ${d} day${d === 1 ? "" : "s"}`;
}

export function BarnabasApp() {
  // The conversation runs as a sequence of async steps, so state lives in a ref
  // and `bump` re-renders after each change.
  const S = useRef<BarnabasState>(freshState());
  const [, setTick] = useState(0);
  const bump = () => setTick((t) => t + 1);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(true);
  const [aiLive, setAiLive] = useState<boolean | null>(null);
  const [box, setBox] = useState("");
  const [volName, setVolName] = useState("Mark");
  const [volMsg, setVolMsg] = useState("");
  const [armed, setArmed] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(S.current));
    } catch {
      /* storage unavailable: the thread still works for this visit */
    }
    bump();
  };
  const push = (from: Message["from"], text: string, extra: Partial<Message> = {}) => {
    S.current.msgs.push({ from, text, at: S.current.now, ...extra });
    save();
  };
  const logSafety = (text: string, level: "info" | "watch" | "alarm" = "info") => {
    S.current.safety.push({ at: S.current.now, text, level });
    save();
  };
  const replan = () => {
    S.current.plan = planNext(S.current);
    save();
  };
  const first = () => S.current.mem.name || "friend";

  async function barnabasSays(text: string, extra?: Partial<Message>) {
    setTyping(true);
    await wait(500 + Math.min(1600, text.length * 12));
    setTyping(false);
    S.current.now += 20 * 1000;
    push("b", text, extra);
  }

  /** Asks the server to write one message. Returns null when live AI isn't available, so the scripted version takes over. */
  async function ask(body: Record<string, unknown>): Promise<TurnResult | null> {
    try {
      const res = await fetch("/api/faith/barnabas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, context: toContext(S.current) }) });
      const json = (await res.json().catch(() => ({}))) as { result?: TurnResult };
      if (res.ok && json.result) {
        if (json.result.concern !== "crisis" || json.result.reply) setAiLive(true);
        return json.result;
      }
      setAiLive(false);
    } catch {
      setAiLive(false);
    }
    return null;
  }

  async function startIfNew() {
    if (S.current.msgs.length) return;
    push("sys", "You signed up for Barnabas. Text HUMAN anytime to reach a person. Text STOP to unsubscribe.");
    await barnabasSays("Hey, it's Barnabas. Quick heads-up so there are no surprises: I'm an AI companion. Real people on our prayer team pray alongside me, and you can text HUMAN anytime to reach a person.");
    await barnabasSays("So, glad you're here. What should I call you?");
  }

  useEffect(() => {
    S.current = load();
    bump();
    void startIfNew().finally(() => setBusy(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on arrival
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  });

  async function crisis(why: string) {
    const s = S.current;
    s.paused = true;
    s.handoff = "urgent";
    s.plan = null;
    logSafety(`Crisis response sent (${why}). Check-ins paused. Care team alerted (urgent).`, "alarm");
    setTyping(true);
    await wait(700);
    setTyping(false);
    s.now += 15 * 1000;
    push("c", CRISIS_REPLY);
  }

  async function requestHuman(why: string) {
    S.current.handoff = "requested";
    logSafety(`Care team handoff requested: ${why}.`, "watch");
    await barnabasSays("Absolutely. I've let our care team know, and a real person will text you right here soon. Just so you know, they're volunteers who listen and pray, not counselors.");
  }

  async function onboardingTurn(text: string) {
    const s = S.current;
    const m = s.mem;
    if (s.stage === "name") {
      m.name = parseName(text);
      s.stage = "area";
      save();
      await barnabasSays(`Good to meet you, ${m.name}. What's one thing you want to grow in right now? Could be anything. Prayer, a habit you want to break, patience at home, whatever's real.`);
      return;
    }
    if (s.stage === "area") {
      m.areaRaw = text;
      s.stage = "why";
      save();
      setTyping(true);
      const out = await ask({ kind: "area", text });
      setTyping(false);
      if (out?.concern === "crisis") return crisis("onboarding answer flagged");
      m.area = out?.area ?? "";
      await barnabasSays(out?.reply || ONBOARDING_FALLBACK.area);
      return;
    }
    if (s.stage === "why") {
      m.why = text.slice(0, 200);
      s.stage = "when";
      save();
      setTyping(true);
      const out = await ask({ kind: "why", text });
      setTyping(false);
      if (out?.concern === "crisis") return crisis("onboarding answer flagged");
      if (out?.why) m.why = out.why;
      await barnabasSays(out?.reply || ONBOARDING_FALLBACK.why);
      return;
    }
    if (s.stage === "when") {
      const p = parseWhen(text);
      m.hardText = text.replace(/[.!?\s]+$/, "").replace(/^\w/, (c) => c.toLowerCase()).slice(0, 120);
      m.hardDay = p.day;
      m.hardHour = p.hour;
      setTyping(true);
      const out = await ask({ kind: "when", text });
      setTyping(false);
      if (out?.concern === "crisis") return crisis("onboarding answer flagged");
      if (out) {
        if (out.hardDay != null) m.hardDay = out.hardDay;
        if (out.hardHour != null) m.hardHour = out.hardHour;
        if (out.hardText) m.hardText = out.hardText;
      }
      s.prayerRequest = out?.prayerRequest || `Pray for ${m.name} as they grow in ${m.area || "an area they shared privately"}.`;
      s.stage = "active";
      save();
      await barnabasSays(out?.reply || ONBOARDING_FALLBACK.when(m.name));
      logSafety("Onboarding complete. Prayer request sent to team.");
      replan();
    }
  }

  async function onUser(text: string) {
    const s = S.current;
    s.now += 60 * 1000;
    push("u", text);
    s.unanswered = 0;

    if (isCrisis(text)) return crisis("keyword match");
    if (/^stop$/i.test(text.trim())) {
      s.paused = true;
      s.plan = null;
      push("sys", "You're unsubscribed. Text START to begin again.");
      logSafety("User texted STOP. All messages paused.");
      return;
    }
    if (/^start$/i.test(text.trim()) && s.paused && s.handoff !== "urgent") {
      s.paused = false;
      await barnabasSays(`Welcome back, ${first()}. Picking up right where we left off.`);
      return replan();
    }
    if (s.stage !== "active") return onboardingTurn(text);
    if (s.paused) return;
    if (s.handoff === "connected" || s.handoff === "urgent") {
      logSafety("Message routed to care team (Barnabas is paused while a person is handling this).");
      return;
    }
    if (wantsHuman(text)) return requestHuman("They asked for a person");

    setTyping(true);
    const out = await ask({ kind: "reply", text });
    setTyping(false);
    if (out) {
      if (out.concern === "crisis") return crisis("AI detected risk");
      if (out.slip) s.mem.slips++;
      if (out.win) s.mem.wins++;
      if (out.newNote) s.mem.notes = [...s.mem.notes, out.newNote].slice(-8);
      if (out.concern === "watch") logSafety("AI noticed low mood. Reply included a gentle nudge toward support.", "watch");
      if (out.wantsHuman) return requestHuman("AI detected they want a person");
      await barnabasSays(out.reply || "Thanks for telling me. I'm here.");
    } else {
      const f = fallbackReply(text, s.mem);
      if (f.slip) s.mem.slips++;
      if (f.win) s.mem.wins++;
      await barnabasSays(f.reply);
    }
    replan();
  }

  async function sendCheckin() {
    const s = S.current;
    if (!s.plan) return;
    const { at, type } = s.plan;
    s.now = at;
    const unprayed = s.prayers.length - s.prayersMentioned;
    setTyping(true);
    const out = await ask({ kind: "checkin", type });
    setTyping(false);
    const text = out?.reply || fallbackCheckin(type, s);
    let verse = out?.verse;
    if (type === "verse" && !verse) {
      const v = fallbackVerse(s.mem);
      verse = { ref: v.ref, text: v.text };
    }
    if (unprayed > 0 && /pray/i.test(text)) s.prayersMentioned = s.prayers.length;
    await wait(250);
    push("b", text, verse ? { verse, checkin: type } : { checkin: type });
    s.sentCount++;
    s.lastType = type;
    if (type !== "noreply") s.unanswered++;
    replan();
  }

  async function run(step: () => Promise<void>) {
    if (busy || typing) return;
    setBusy(true);
    try {
      await step();
    } finally {
      setBusy(false);
    }
  }
  const say = (text: string) => {
    const t = text.trim();
    if (t) void run(() => onUser(t));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = box;
    setBox("");
    say(t);
  };

  const sendAsHuman = () => {
    const s = S.current;
    const by = volName.trim() || "Care team";
    const t = volMsg.trim() || `Hey, this is ${by} from the care team. Barnabas said you wanted to talk. I'm here.`;
    s.now += 4 * 60e3;
    if (s.handoff === "requested") {
      s.handoff = "connected";
      logSafety(`${by} from the care team picked up the conversation.`);
    }
    push("h", t, { by });
    setVolMsg("");
  };
  const handBack = () =>
    run(async () => {
      S.current.handoff = "none";
      logSafety("Care team handed the conversation back to Barnabas.");
      await barnabasSays(`Glad you got to talk with a real person, ${first()}. I'm still here too.`);
      replan();
    });
  const resume = () => {
    const s = S.current;
    s.handoff = "none";
    s.paused = false;
    logSafety("Care team confirmed follow-up. Check-ins resumed.");
    replan();
  };
  const logPrayer = () => {
    S.current.prayers.push({ at: S.current.now, by: "Volunteer" });
    save();
  };
  const restart = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 4000);
      return;
    }
    setArmed(false);
    S.current = freshState();
    save();
    void run(startIfNew);
  };

  const s = S.current;
  const m = s.mem;
  const active = s.stage === "active";
  const handoffOpen = s.handoff !== "none";

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-5xl items-center justify-between">
        <Link href="/faith" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          Faith
        </Link>
        <HomeLink />
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber">Barnabas</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-4xl">
              A friend who <span className="text-amber">checks in</span> on you.
            </h1>
          </div>
          <span className="whitespace-nowrap rounded-full border border-amber/50 px-3 py-1 font-mono text-xs text-amber">
            {aiLive === true ? "Test build · live AI" : aiLive === false ? "Test build · scripted mode" : "Test build"}
          </span>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* phone */}
          <div className="w-full max-w-[400px] justify-self-center rounded-[30px] border border-line bg-sunken p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]" aria-label="Text message thread with Barnabas">
            <div className="grid h-[min(720px,78vh)] min-h-[520px] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[22px] bg-bg">
              <div className="grid justify-items-center gap-0.5 border-b border-line bg-panel px-3 pb-2.5 pt-3.5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f6c56d,#f2b54b_55%,#b9832a)] text-lg font-extrabold text-amber-ink" aria-hidden>B</div>
                <b className="text-sm">Barnabas</b>
                <span className="text-xs text-muted">AI companion · real people pray with you</span>
              </div>
              <div ref={threadRef} className="flex flex-col gap-1.5 overflow-y-auto px-3 pb-2.5 pt-3.5" aria-live="polite">
                <Thread msgs={s.msgs} />
                {typing && (
                  <div className="flex gap-1 self-start rounded-[18px] bg-raised px-3.5 py-3" aria-label="Barnabas is typing">
                    {[0, 1, 2].map((i) => <i key={i} className="h-[7px] w-[7px] animate-pulse rounded-full bg-muted" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                )}
              </div>
              <form className="flex gap-2 border-t border-line bg-panel p-2.5" onSubmit={submit} autoComplete="off">
                <input
                  value={box}
                  onChange={(e) => setBox(e.target.value)}
                  placeholder="Text message"
                  aria-label="Your message"
                  maxLength={600}
                  className={`min-w-0 flex-1 rounded-full border border-line bg-bg px-3.5 py-2.5 text-base text-fg placeholder:text-dim ${focus}`}
                />
                <button className={`grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-amber text-amber-ink disabled:opacity-45 ${focus}`} disabled={busy || typing} aria-label="Send">
                  <ArrowUp className="h-5 w-5" aria-hidden />
                </button>
              </form>
            </div>
          </div>

          {/* behind the scenes */}
          <div className="grid min-w-0 gap-3.5">
            <section className="grid gap-1 border-l-2 border-amber pl-3.5">
              <span className={label}>How to test</span>
              <p className="text-[15px] text-soft">
                {active
                  ? "You're the person texting. Reply in the thread, or tap Skip ahead to jump to the next time Barnabas reaches out on his own."
                  : "You're the person who just signed up. Answer Barnabas in the text thread to finish meeting him."}
              </p>
            </section>

            {s.handoff === "urgent" && (
              <div className="grid gap-2 rounded-xl border border-up/55 bg-up/10 p-3.5 text-sm">
                <b>Crisis response sent. Check-ins are paused.</b>
                <span className="text-soft">Barnabas pointed them to 988, the Crisis Text Line, and 911. A care-team member has been alerted to follow up. Barnabas stays quiet until a person resumes it.</span>
                <div><button className={btnGhost} onClick={resume}>Care team followed up: resume check-ins</button></div>
              </div>
            )}

            <section className={card}>
              <span className={label}>Next check-in</span>
              {s.plan ? (
                <>
                  <div className="font-mono text-xl font-semibold tabular-nums">{fmtShort(s.plan.at)}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`${pill} text-amber`}>{TYPE_NAME[s.plan.type]}</span>
                    <span className={pill}>{relDays(s.plan.at, s.now)}</span>
                  </div>
                  <p className="text-sm text-muted">{s.plan.reason}</p>
                  <button className={btn} disabled={busy || typing} onClick={() => void run(sendCheckin)}>
                    {busy && typing ? "Barnabas is writing…" : "Skip ahead to this check-in"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted">{s.paused ? "Paused." : active ? "Planning…" : "Barnabas plans his first check-in after you finish meeting him."}</p>
              )}
            </section>

            <section className={card}>
              <span className={label}>Try a reply</span>
              <div className="flex flex-wrap gap-2">
                {(active ? ACTIVE_CHIPS : STAGE_CHIPS[s.stage] ?? []).map((c) => (
                  <button key={c} className={chip} onClick={() => say(c)}>{c}</button>
                ))}
                <button className={`${chip} border-up/55`} onClick={() => say("Honestly I don't want to be here anymore.")}>Safety test: crisis message</button>
              </div>
            </section>

            {handoffOpen && (
              <section className={card}>
                <span className={label}>Care team</span>
                <h2 className="text-lg font-extrabold">{s.handoff === "urgent" ? "Urgent follow-up needed" : s.handoff === "connected" ? "A person is texting them" : "Someone asked for a person"}</h2>
                <p className="text-sm text-muted">Play the volunteer. Your message shows up in their thread labeled as a human. Barnabas pauses while you&apos;re talking.</p>
                <label className="grid gap-1.5 text-sm font-bold">
                  Volunteer name
                  <input value={volName} onChange={(e) => setVolName(e.target.value)} maxLength={20} className={`rounded-[10px] border border-line bg-bg px-3 py-2.5 text-base font-normal text-fg ${focus}`} />
                </label>
                <label className="grid gap-1.5 text-sm font-bold">
                  Message
                  <textarea value={volMsg} onChange={(e) => setVolMsg(e.target.value)} rows={2} placeholder={`Hey, this is ${volName || "Mark"} from the care team. Barnabas said you wanted to talk. I'm here.`} className={`resize-y rounded-[10px] border border-line bg-bg px-3 py-2.5 text-base font-normal text-fg placeholder:text-dim ${focus}`} />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className={btnGhost} onClick={sendAsHuman}>Send as human</button>
                  {s.handoff !== "urgent" && <button className={btnGhost} disabled={busy || typing} onClick={() => void handBack()}>Hand back to Barnabas</button>}
                </div>
              </section>
            )}

            <div className="grid gap-3.5 sm:grid-cols-2">
              <section className={card}>
                <span className={label}>What Barnabas remembers</span>
                {m.name ? (
                  <>
                    <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 gap-y-1.5 text-sm">
                      <dt className="text-muted">Name</dt><dd className="m-0 break-words">{m.name}</dd>
                      <dt className="text-muted">Growing in</dt><dd className="m-0 break-words">{m.area || m.areaRaw || <Empty />}</dd>
                      <dt className="text-muted">Why it&apos;s hard</dt><dd className="m-0 break-words">{m.why || <Empty />}</dd>
                      <dt className="text-muted">Hardest</dt>
                      <dd className="m-0 break-words">
                        {m.hardText || <Empty />}
                        {(m.hardDay !== null || m.hardHour !== null) && (
                          <span className={`${pill} ml-1`}>{m.hardDay !== null ? DAYS[m.hardDay].slice(0, 3) : "any day"} {m.hardHour !== null ? fmtTime(new Date(2000, 0, 1, m.hardHour)) : ""}</span>
                        )}
                      </dd>
                      <dt className="text-muted">Shared</dt>
                      <dd className="m-0"><span className={`${pill} text-down`}>{m.wins} wins</span> <span className={pill}>{m.slips} slips</span></dd>
                    </dl>
                    {m.notes.length > 0 && <ul className="m-0 grid gap-0.5 pl-4 text-sm">{m.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
                  </>
                ) : (
                  <p className="text-sm italic text-muted">Nothing yet. He learns as you text.</p>
                )}
              </section>
              <section className={card}>
                <span className={label}>Prayer team</span>
                {s.prayerRequest ? (
                  <>
                    <p className="text-sm">“{s.prayerRequest}”</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`${pill} text-down`}>{s.prayers.length} prayed</span>
                      {s.prayers.length - s.prayersMentioned > 0 && <span className={`${pill} text-amber`}>{s.prayers.length - s.prayersMentioned} not yet mentioned</span>}
                    </div>
                    <p className="text-sm text-muted">Barnabas only says &quot;people prayed for you&quot; after a volunteer actually logs it here.</p>
                    <div><button className={btnGhost} onClick={logPrayer}>I prayed (log as volunteer)</button></div>
                  </>
                ) : (
                  <p className="text-sm italic text-muted">An anonymous prayer request goes to volunteers after onboarding.</p>
                )}
              </section>
            </div>

            <section className={card}>
              <span className={label}>Safety and care log</span>
              {s.safety.length ? (
                <div className="grid max-h-[180px] gap-1.5 overflow-y-auto text-sm">
                  {s.safety.slice().reverse().map((e, i) => (
                    <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5">
                      <span className="whitespace-nowrap font-mono text-xs text-muted">{fmtShort(e.at)}</span>
                      <span>
                        {e.level === "alarm" && <span className={`${pill} mr-1 bg-up/25 text-up`}>crisis</span>}
                        {e.level === "watch" && <span className={`${pill} mr-1 text-amber`}>watch</span>}
                        {e.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted">Nothing logged.</p>
              )}
              <p className="text-sm text-muted">
                Guardrails: crisis words are caught by fixed rules before the AI ever sees the message, and the AI also flags softer signs. A crisis always gets 988, the Crisis Text Line, and 911, and check-ins pause until a person steps in.
              </p>
            </section>
          </div>
        </div>

        <footer className="text-center text-xs text-muted">
          Test build. Messages stay in this browser only.{" "}
          <button className={`p-1.5 text-sm underline underline-offset-2 ${focus}`} onClick={restart}>Start over</button>
          {armed && <span> Tap again to erase the thread.</span>}
        </footer>
      </main>
    </div>
  );
}

function Empty() {
  return <span className="italic text-muted">not yet</span>;
}

function Thread({ msgs }: { msgs: Message[] }) {
  const out: ReactNode[] = [];
  let lastDay = "";
  let lastFrom = "";
  msgs.forEach((m, i) => {
    const day = fmtDay(m.at);
    if (day !== lastDay) {
      out.push(<div key={`d${i}`} className="mx-0 mb-1 mt-3 self-center text-center font-mono text-[11px] text-muted">{day} · {fmtTime(m.at)}</div>);
      lastDay = day;
      lastFrom = "";
    }
    if (m.from === "sys") {
      out.push(<div key={i} className="mb-1.5 mt-0.5 max-w-[88%] self-center text-center text-xs text-muted">{m.text}</div>);
      lastFrom = "sys";
      return;
    }
    if (m.from === "h" && lastFrom !== "h") out.push(<div key={`w${i}`} className="mb-[-2px] ml-1.5 mt-1.5 self-start text-[11px] font-bold text-down">{m.by || "Care team"} · care team (human)</div>);
    const tone = {
      b: "self-start rounded-bl-md bg-raised",
      u: "self-end rounded-br-md bg-amber text-amber-ink",
      h: "self-start rounded-bl-md border border-down/55 bg-down/15",
      c: "self-start rounded-bl-md border border-up/55 bg-up/15",
    }[m.from];
    out.push(
      <div key={i} className={`max-w-[82%] whitespace-pre-wrap break-words rounded-[18px] px-3 py-2 text-[15px] leading-snug ${tone}`}>
        {m.text}
        {m.verse && (
          <span className="mt-2 block rounded-r-[10px] border-l-2 border-amber bg-black/20 px-2.5 py-2 text-sm">
            “{m.verse.text}”
            <cite className="mt-1 block font-mono text-xs not-italic text-amber">{m.verse.ref} (WEB)</cite>
          </span>
        )}
      </div>,
    );
    const next = msgs[i + 1];
    if (!next || next.from !== m.from || next.at - m.at > 10 * 60e3)
      out.push(<div key={`t${i}`} className={`mb-1 font-mono text-[10.5px] text-muted ${m.from === "u" ? "mr-2 self-end" : "ml-2 self-start"}`}>{fmtTime(m.at)}</div>);
    lastFrom = m.from;
  });
  return <>{out}</>;
}
