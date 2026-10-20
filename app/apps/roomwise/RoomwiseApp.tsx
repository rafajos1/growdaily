"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ClipboardCopy, DoorOpen, Info, Pencil, Plus, Printer, Search, Sparkles, Trash2, X } from "lucide-react";
import { HomeLink } from "../../components/HomeLink";
import { SaveProgress } from "../../components/SaveProgress";
import { addDays, todayISO } from "../../../lib/habitwise/dates";
import { newId } from "../../../lib/habitwise/storage";
import { printArea } from "../../../lib/print/printArea";
import { bookingAt, bookingsOn, clock, conflictsFor, dayText, findRooms, openSpot, weeklyDates, type Match, type Need } from "../../../lib/roomwise/logic";
import { sampleData } from "../../../lib/roomwise/sample";
import { loadData, saveData, STORAGE_KEY } from "../../../lib/roomwise/storage";
import { EMPTY, ROOM_COLORS, type Booking, type Room, type RoomData } from "../../../lib/roomwise/types";
import { BookingForm, type BookingDraft } from "./BookingForm";
import { FloorPlan, type RoomState } from "./FloorPlan";
import { ACCENT, btn, eyebrow, input, label, Modal, panel } from "./ui";

const EXAMPLES_KEY = "roomwise:examples";
type Tab = "day" | "find" | "rooms";
type Dialog = { kind: "none" } | { kind: "booking"; booking?: Booking; defaults?: Partial<BookingDraft> };

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const TIMES = Array.from({ length: 33 }, (_, i) => {
  const m = 6 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
});
const longDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
const shortDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function nowSlot(): string {
  const d = new Date();
  const m = d.getHours() * 60 + (d.getMinutes() < 30 ? 0 : 30);
  const t = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return TIMES.includes(t) ? t : "09:00";
}

export function RoomwiseApp() {
  const [data, setData] = useState<RoomData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [examples, setExamples] = useState(false);
  const [tab, setTab] = useState<Tab>("day");
  const [dialog, setDialog] = useState<Dialog>({ kind: "none" });
  const [toast, setToast] = useState<string | null>(null);
  const today = todayISO();
  const [date, setDate] = useState(today);

  useEffect(() => {
    try {
      let loaded = loadData();
      if (loaded.rooms.length === 0 && safeGet(EXAMPLES_KEY) === null) {
        loaded = sampleData(todayISO());
        saveData(loaded);
        safeSet(EXAMPLES_KEY, "1");
      }
      setData(loaded);
      setExamples(safeGet(EXAMPLES_KEY) === "1" && loaded.rooms.length > 0);
    } catch {
      setStorageError("Your browser isn't letting Roomwise save. Changes will be lost when you close the page.");
    }
    setReady(true);
    const hash = location.hash.slice(1);
    if (hash === "find" || hash === "rooms") setTab(hash);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setData(loadData());
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = useCallback((next: RoomData, message?: string) => {
    setData(next);
    try {
      saveData(next);
      setStorageError(null);
    } catch {
      setStorageError("Couldn't save your last change. Your browser storage may be full or blocked.");
    }
    if (message) setToast(message);
  }, []);

  const switchTab = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "day" ? location.pathname : `#${t}`);
  };

  const saveBooking = (d: BookingDraft) => {
    if (dialog.kind !== "booking") return;
    if (dialog.booking) {
      const id = dialog.booking.id;
      commit({ ...data, bookings: data.bookings.map((b) => (b.id === id ? { ...b, ...d } : b)) }, "Booking updated.");
    } else {
      const seriesId = d.weeks > 1 ? newId() : undefined;
      const added = weeklyDates(d.date, d.weeks).map((date) => ({ id: newId(), roomId: d.roomId, title: d.title, contact: d.contact, date, start: d.start, end: d.end, status: d.status, notes: d.notes, seriesId }));
      commit({ ...data, bookings: [...data.bookings, ...added] }, d.weeks > 1 ? `Booked ${d.weeks} weeks.` : "Booked.");
      setDate(d.date);
    }
    setDialog({ kind: "none" });
  };

  const deleteBooking = (b: Booking, series: boolean) => {
    commit({ ...data, bookings: data.bookings.filter((x) => (series && b.seriesId ? !(x.seriesId === b.seriesId && x.date >= b.date) : x.id !== b.id)) }, series ? "Deleted this and later weeks." : "Booking deleted.");
    setDialog({ kind: "none" });
  };

  const confirm = (b: Booking) => {
    if (conflictsFor({ ...data, bookings: data.bookings.filter((x) => x.status === "confirmed") }, b, b.id).length) {
      setToast("Can't confirm: another confirmed booking is in that room then.");
      return;
    }
    commit({ ...data, bookings: data.bookings.map((x) => (x.id === b.id ? { ...x, status: "confirmed" as const } : x)) }, `Confirmed “${b.title}”.`);
  };

  const clearExamples = () => {
    commit({ ...EMPTY }, "Examples cleared. Add your building's rooms.");
    safeSet(EXAMPLES_KEY, "0");
    setExamples(false);
    switchTab("rooms");
  };

  const pending = data.bookings.filter((b) => b.status === "pending" && b.date >= today).sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
  const newBooking = (defaults?: Partial<BookingDraft>) => setDialog({ kind: "booking", defaults: { date, ...defaults } });

  return (
    <div className="min-h-screen pb-28 px-[max(16px,env(safe-area-inset-left))] sm:pb-16">
      <header className="mx-auto flex min-h-[72px] max-w-5xl flex-wrap items-center justify-between gap-2 py-3 sm:py-0">
        <div className="flex items-center gap-1 sm:gap-3">
          <HomeLink />
          <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
            <span className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(79,199,184,0.15)]" style={{ background: ACCENT }} aria-hidden />
            Roomwise
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label="Roomwise" className="flex gap-1 rounded-[10px] border border-line bg-panel p-1">
            {(
              [
                ["day", "Schedule"],
                ["find", "Find a room"],
                ["rooms", "Rooms"],
              ] as const
            ).map(([id, name]) => (
              <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => switchTab(id)} className={`rounded-[7px] px-2.5 py-1.5 text-sm font-semibold transition sm:px-3 ${tab === id ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}>
                {name}
              </button>
            ))}
          </nav>
          <div className="hidden sm:block">
            <button type="button" onClick={() => newBooking()} disabled={!data.rooms.length} className={btn.primary}>
              <Plus className="h-4 w-4" aria-hidden /> Book a room
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto mb-5 max-w-5xl">
        <SaveProgress />
      </div>

      <main className="mx-auto max-w-5xl space-y-5">
        <h1 className="sr-only">Roomwise: room and facility booking with a floor plan</h1>
        {storageError && (
          <p role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm text-soft">
            {storageError}
          </p>
        )}
        {examples && (
          <div className="flex flex-col gap-3 rounded-xl border border-[#4fc7b8]/40 bg-[#4fc7b8]/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
            <Info className="h-5 w-5 shrink-0" style={{ color: ACCENT }} aria-hidden />
            <p className="flex-1">
              This is an <strong className="text-fg">example church building</strong> with a month of bookings, so you can see how Roomwise works.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={btn.secondary}
                onClick={() => {
                  safeSet(EXAMPLES_KEY, "0");
                  setExamples(false);
                }}
              >
                Keep exploring
              </button>
              <button type="button" className={btn.primary} onClick={clearExamples}>
                Set up mine
              </button>
            </div>
          </div>
        )}

        {!ready ? (
          <div className={`${panel} h-64 animate-pulse`} aria-busy="true" aria-label="Loading" />
        ) : tab === "rooms" || data.rooms.length === 0 ? (
          <RoomsView data={data} onChange={commit} />
        ) : tab === "find" ? (
          <FindView data={data} today={today} onBook={(defaults) => newBooking(defaults)} />
        ) : (
          <DayView
            data={data}
            date={date}
            today={today}
            pending={pending}
            onDate={setDate}
            onBook={newBooking}
            onEdit={(booking) => setDialog({ kind: "booking", booking })}
            onConfirm={confirm}
            onDecline={(b) => commit({ ...data, bookings: data.bookings.filter((x) => x.id !== b.id) }, `Declined “${b.title}”.`)}
            onToast={setToast}
          />
        )}

        {ready && (
          <aside className={`${panel} flex flex-col gap-3 p-5 sm:flex-row sm:items-center`}>
            <p className="flex-1 text-sm text-soft">
              <strong className="text-fg">Want this for your church, office or building?</strong> A custom version can take room requests online, send approvals and reminders, and sync with your calendar or church software.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/learn/church-room-booking-and-facility-scheduling" className={btn.secondary}>
                For churches
              </Link>
              <Link href="/learn/meeting-room-booking-for-small-business" className={btn.secondary}>
                For offices
              </Link>
            </div>
          </aside>
        )}
      </main>

      {data.rooms.length > 0 && (
        <button type="button" onClick={() => newBooking()} aria-label="Book a room" className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] right-[max(20px,env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-2xl text-[#05221f] shadow-lg shadow-black/40 sm:hidden" style={{ background: ACCENT }}>
          <Plus className="h-6 w-6" aria-hidden />
        </button>
      )}

      <Modal open={dialog.kind === "booking"} title={dialog.kind === "booking" && dialog.booking ? "Edit booking" : "Book a room"} onClose={() => setDialog({ kind: "none" })}>
        {dialog.kind === "booking" && (
          <BookingForm key={dialog.booking?.id ?? "new"} data={data} initial={dialog.booking} defaults={dialog.defaults} onSubmit={saveBooking} onCancel={() => setDialog({ kind: "none" })} onDelete={dialog.booking ? (series) => deleteBooking(dialog.booking!, series) : undefined} />
        )}
      </Modal>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6">
        {toast && (
          <p role="status" className="pointer-events-auto rounded-xl border border-line bg-raised px-4 py-3 text-sm shadow-xl shadow-black/40">
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function DayView({ data, date, today, pending, onDate, onBook, onEdit, onConfirm, onDecline, onToast }: { data: RoomData; date: string; today: string; pending: Booking[]; onDate: (d: string) => void; onBook: (d?: Partial<BookingDraft>) => void; onEdit: (b: Booking) => void; onConfirm: (b: Booking) => void; onDecline: (b: Booking) => void; onToast: (m: string) => void }) {
  const [time, setTime] = useState(nowSlot);
  const [selected, setSelected] = useState<string | null>(null);
  const rooms = new Map(data.rooms.map((r) => [r.id, r]));
  const day = bookingsOn(data, date);
  const sel = selected ? rooms.get(selected) : undefined;

  const statusFor = (room: Room): RoomState => {
    const b = bookingAt(data, room.id, date, time);
    if (!b) return { state: "free", label: "Free" };
    return { state: b.status === "pending" ? "pending" : "busy", label: `${b.title.length > 18 ? `${b.title.slice(0, 17)}…` : b.title}` };
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(dayText(data, date));
      onToast("Schedule copied.");
    } catch {
      onToast("Couldn't copy on this browser.");
    }
  };

  return (
    <>
      {pending.length > 0 && (
        <section className="rounded-2xl border border-amber/40 bg-amber/[0.07] p-4 sm:p-5" aria-labelledby="pending-heading">
          <h2 id="pending-heading" className="text-base font-bold">
            {pending.length} {pending.length === 1 ? "request" : "requests"} to confirm
          </h2>
          <ul className="mt-2 divide-y divide-hairline">
            {pending.slice(0, 5).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <button type="button" onClick={() => onDate(b.date)} className="min-w-0 flex-1 basis-48 text-left">
                  <span className="block font-semibold">{b.title}</span>
                  <span className="block text-xs text-muted">
                    {shortDay(b.date)}, {clock(b.start)}–{clock(b.end)} · {rooms.get(b.roomId)?.name}
                    {b.contact ? ` · ${b.contact}` : ""}
                  </span>
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => onConfirm(b)} className={`${btn.primary} px-3 py-1.5`}>
                    <Check className="h-4 w-4" aria-hidden /> Confirm
                  </button>
                  <button type="button" onClick={() => onDecline(b)} className={`${btn.secondary} px-3 py-1.5`} aria-label={`Decline ${b.title}`}>
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={`${panel} p-4 sm:p-5`} aria-label="Day">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onDate(addDays(date, -1))} className={btn.ghost} aria-label="Previous day">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <h2 className="min-w-0 flex-1 text-lg font-bold">{longDay(date)}</h2>
          <button type="button" onClick={() => onDate(addDays(date, 1))} className={btn.ghost} aria-label="Next day">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
          {date !== today && (
            <button type="button" onClick={() => onDate(today)} className={`${btn.secondary} px-3 py-1.5`}>
              Today
            </button>
          )}
          <label className="sr-only" htmlFor="day-date">
            Go to date
          </label>
          <input id="day-date" type="date" value={date} onChange={(e) => e.target.value && onDate(e.target.value)} className="rounded-[10px] border border-line bg-sunken px-2 py-1.5 text-sm text-fg" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="map-time" className="text-muted">
            Map shows
          </label>
          <select id="map-time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-[10px] border border-line bg-sunken px-2 py-1.5 text-fg">
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {clock(t)}
              </option>
            ))}
          </select>
          <span className="ml-auto flex flex-wrap gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border" style={{ borderColor: ACCENT }} aria-hidden /> Free
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-up/60" aria-hidden /> Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-amber" aria-hidden /> Pending
            </span>
          </span>
        </div>
        <div className="mt-3">
          <FloorPlan rooms={data.rooms} mode="view" statusFor={statusFor} selectedId={selected} onSelect={(id) => setSelected(id === selected ? null : id)} />
        </div>
        {sel && (
          <div className="mt-3 rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{sel.name}</p>
                <p className="text-xs text-muted">
                  Seats {sel.capacity}
                  {sel.features.length ? ` · ${sel.features.join(", ")}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => onBook({ roomId: sel.id, date, start: time, end: TIMES[Math.min(TIMES.length - 1, TIMES.indexOf(time) + 2)] })} className={`${btn.primary} px-3 py-2`}>
                <Plus className="h-4 w-4" aria-hidden /> Book {sel.name}
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {day.filter((b) => b.roomId === sel.id).map((b) => (
                <li key={b.id} className="text-soft">
                  {clock(b.start)}–{clock(b.end)} · {b.title}
                  {b.status === "pending" && <span className="text-amber"> (pending)</span>}
                </li>
              ))}
              {!day.some((b) => b.roomId === sel.id) && <li className="text-muted">Free all day.</li>}
            </ul>
          </div>
        )}
      </section>

      <section className={`${panel} p-4 sm:p-5`} aria-labelledby="agenda-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="agenda-heading" className="text-base font-bold">
            Bookings
          </h2>
          <div className="flex gap-2">
            <button type="button" onClick={copy} className={`${btn.secondary} px-3 py-1.5`}>
              <ClipboardCopy className="h-4 w-4" aria-hidden /> Copy
            </button>
            <button type="button" onClick={printArea} className={`${btn.secondary} px-3 py-1.5`}>
              <Printer className="h-4 w-4" aria-hidden /> Print
            </button>
          </div>
        </div>
        {day.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing booked. The whole building is free.</p>
        ) : (
          <ul className="mt-2 divide-y divide-hairline">
            {day.map((b) => {
              const room = rooms.get(b.roomId);
              return (
                <li key={b.id} className="flex items-center gap-3 py-2.5">
                  <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: room?.color }} aria-hidden />
                  <span className="w-28 shrink-0 font-mono text-xs text-muted">
                    {clock(b.start)}–{clock(b.end)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {b.title}
                      {b.status === "pending" && <span className="ml-2 rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[11px] text-amber">Pending</span>}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {room?.name}
                      {b.contact ? ` · ${b.contact}` : ""}
                    </span>
                  </span>
                  <button type="button" onClick={() => onEdit(b)} className={btn.ghost} aria-label={`Edit ${b.title}`}>
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Printed instead of the page: a plain schedule to post on a door or bulletin board. */}
      <div className="print-area hidden bg-white p-8 text-black print:block">
        <p className="text-sm text-gray-600">{data.building}</p>
        <h2 className="text-2xl font-bold">{longDay(date)}</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="py-1.5 pr-3">Time</th>
              <th className="py-1.5 pr-3">What</th>
              <th className="py-1.5 pr-3">Room</th>
              <th className="py-1.5">Who</th>
            </tr>
          </thead>
          <tbody>
            {day.map((b) => (
              <tr key={b.id} className="border-b border-gray-200">
                <td className="whitespace-nowrap py-1.5 pr-3">
                  {clock(b.start)}–{clock(b.end)}
                </td>
                <td className="py-1.5 pr-3">
                  {b.title}
                  {b.status === "pending" ? " (pending)" : ""}
                </td>
                <td className="py-1.5 pr-3">{rooms.get(b.roomId)?.name}</td>
                <td className="py-1.5">{b.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {day.length === 0 && <p className="mt-4">No bookings.</p>}
      </div>
    </>
  );
}

function FindView({ data, today, onBook }: { data: RoomData; today: string; onBook: (d: Partial<BookingDraft>) => void }) {
  const features = useMemo(() => [...new Set(data.rooms.flatMap((r) => r.features))].sort(), [data.rooms]);
  const [request, setRequest] = useState("");
  const [ai, setAi] = useState<{ status: "idle" | "loading" | "error"; message?: string }>({ status: "idle" });
  const [need, setNeed] = useState<Need & { title: string; note?: string }>({ title: "", date: today, start: "19:00", end: "20:30", capacity: 0, features: [], weeks: 1 });
  const [searched, setSearched] = useState(false);
  const results: Match[] = searched ? findRooms(data, need) : [];

  const ask = async () => {
    setAi({ status: "loading" });
    try {
      const res = await fetch("/api/roomwise/find", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request, today, features }) });
      const body = (await res.json().catch(() => ({}))) as Partial<Need> & { title?: string; note?: string; error?: string };
      if (!res.ok || !body.date) throw new Error(body.error || "The search couldn't be understood. Try the fields below.");
      setNeed({ title: body.title ?? "", date: body.date, start: body.start!, end: body.end!, capacity: body.capacity ?? 0, features: body.features ?? [], weeks: body.weeks ?? 1, note: body.note });
      setSearched(true);
      setAi({ status: "idle" });
    } catch (err) {
      setAi({ status: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-[#4fc7b8]/40 bg-[#4fc7b8]/[0.07] p-5 sm:p-6" aria-labelledby="ask-heading">
        <h2 id="ask-heading" className="flex items-center gap-2 text-base font-bold">
          <Sparkles className="h-4 w-4" style={{ color: ACCENT }} aria-hidden /> Ask for a room
        </h2>
        <label htmlFor="find-request" className="mt-1 block text-sm text-muted">
          Say what you need in your own words. Roomwise checks every room and every week.
        </label>
        <textarea id="find-request" rows={2} maxLength={500} className={`${input} mt-2`} value={request} onChange={(e) => setRequest(e.target.value)} placeholder="A room for 25 with a projector, Tuesday evenings for the next 6 weeks" />
        <button type="button" onClick={ask} disabled={ai.status === "loading" || request.trim().length < 5} className={`${btn.primary} mt-3`}>
          <Search className="h-4 w-4" aria-hidden /> {ai.status === "loading" ? "Searching…" : "Find rooms"}
        </button>
        {ai.status === "error" && (
          <p role="alert" className="mt-3 text-sm font-semibold text-up">
            {ai.message}
          </p>
        )}
      </section>

      <section className={`${panel} p-5 sm:p-6`} aria-labelledby="need-heading">
        <h2 id="need-heading" className="text-base font-bold">
          {searched ? "Your search" : "Or search by date and time"}
        </h2>
        {need.note && searched && <p className="mt-1 text-sm text-muted">{need.note}</p>}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="need-date" className={label}>
              Date
            </label>
            <input id="need-date" type="date" className={`${input} mt-1.5`} value={need.date} onChange={(e) => e.target.value && setNeed({ ...need, date: e.target.value })} />
          </div>
          <div>
            <label htmlFor="need-start" className={label}>
              From
            </label>
            <input id="need-start" type="time" step={900} className={`${input} mt-1.5`} value={need.start} onChange={(e) => setNeed({ ...need, start: e.target.value })} />
          </div>
          <div>
            <label htmlFor="need-end" className={label}>
              To
            </label>
            <input id="need-end" type="time" step={900} className={`${input} mt-1.5`} value={need.end} onChange={(e) => setNeed({ ...need, end: e.target.value })} />
          </div>
          <div>
            <label htmlFor="need-cap" className={label}>
              People
            </label>
            <input id="need-cap" inputMode="numeric" className={`${input} mt-1.5`} value={need.capacity || ""} onChange={(e) => setNeed({ ...need, capacity: Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0) })} placeholder="Any" />
          </div>
          <div>
            <label htmlFor="need-weeks" className={label}>
              Weeks
            </label>
            <select id="need-weeks" className={`${input} mt-1.5`} value={need.weeks} onChange={(e) => setNeed({ ...need, weeks: Number(e.target.value) })}>
              {[...new Set([1, 2, 4, 6, 8, 12, 26, need.weeks])].sort((a, b) => a - b).map((n) => (
                <option key={n} value={n}>
                  {n === 1 ? "Once" : n}
                </option>
              ))}
            </select>
          </div>
        </div>
        {features.length > 0 && (
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold">Needs</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {features.map((f) => {
                const on = need.features.some((x) => x.toLowerCase() === f.toLowerCase());
                return (
                  <button key={f} type="button" aria-pressed={on} onClick={() => setNeed({ ...need, features: on ? need.features.filter((x) => x.toLowerCase() !== f.toLowerCase()) : [...need.features, f] })} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${on ? "border-[#4fc7b8] bg-[#4fc7b8]/15 text-fg" : "border-line text-soft hover:border-[#4fc7b8]/50"}`}>
                    {f}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
        <button type="button" onClick={() => setSearched(true)} className={`${btn.secondary} mt-4`}>
          <Search className="h-4 w-4" aria-hidden /> Search
        </button>
      </section>

      {searched && (
        <section className={`${panel} p-5 sm:p-6`} aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-base font-bold">
            Rooms for {shortDay(need.date)}, {clock(need.start)}–{clock(need.end)}
            {need.weeks > 1 ? `, ${need.weeks} weeks` : ""}
          </h2>
          {results.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No room seats {need.capacity} people. Try a smaller group or split into two rooms.</p>
          ) : (
            <ul className="mt-2 divide-y divide-hairline">
              {results.map((m) => {
                const free = m.busyDates.length === 0;
                return (
                  <li key={m.room.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: m.room.color }} aria-hidden />
                    <span className="min-w-0 flex-1 basis-48">
                      <span className="block font-semibold">
                        {m.room.name} <span className="text-xs font-normal text-muted">seats {m.room.capacity}</span>
                      </span>
                      <span className={`block text-xs ${free ? "text-down" : "text-up"}`}>
                        {free ? (need.weeks > 1 ? `Free all ${need.weeks} weeks` : "Free") : `Taken on ${m.busyDates.length} of ${need.weeks}: ${m.busyDates.slice(0, 3).map(shortDay).join(", ")}${m.busyDates.length > 3 ? "…" : ""}`}
                        {m.missing.length > 0 && <span className="text-amber"> · no {m.missing.join(", ")}</span>}
                      </span>
                    </span>
                    {free && (
                      <button type="button" onClick={() => onBook({ roomId: m.room.id, date: need.date, start: need.start, end: need.end, weeks: need.weeks, title: need.title })} className={`${btn.primary} px-3 py-1.5`}>
                        Book
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </>
  );
}

function RoomsView({ data, onChange }: { data: RoomData; onChange: (d: RoomData, m?: string) => void }) {
  const [selected, setSelected] = useState<string | null>(data.rooms[0]?.id ?? null);
  const room = data.rooms.find((r) => r.id === selected);
  const [featureText, setFeatureText] = useState(room?.features.join(", ") ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    setFeatureText(room?.features.join(", ") ?? "");
    setConfirmDelete(false);
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (r: Room) => onChange({ ...data, rooms: data.rooms.map((x) => (x.id === r.id ? r : x)) });
  const add = () => {
    const spot = openSpot(data.rooms);
    const r: Room = { id: newId(), name: `Room ${data.rooms.length + 1}`, capacity: 20, features: [], color: ROOM_COLORS[data.rooms.length % ROOM_COLORS.length], ...spot, w: 4, h: 3 };
    onChange({ ...data, rooms: [...data.rooms, r] }, "Room added. Drag it into place.");
    setSelected(r.id);
  };
  const remove = (r: Room) => {
    const count = data.bookings.filter((b) => b.roomId === r.id).length;
    onChange({ ...data, rooms: data.rooms.filter((x) => x.id !== r.id), bookings: data.bookings.filter((b) => b.roomId !== r.id) }, `${r.name} deleted${count ? ` with ${count} bookings` : ""}.`);
    setSelected(null);
  };

  return (
    <>
      <section className={`${panel} p-5 sm:p-6`} aria-labelledby="building-heading">
        <h2 id="building-heading" className="sr-only">
          Building
        </h2>
        <label htmlFor="building-name" className={label}>
          Building or church name
        </label>
        <input id="building-name" className={`${input} mt-1.5`} value={data.building} maxLength={80} onChange={(e) => onChange({ ...data, building: e.target.value })} placeholder="Grace Community Church" />
      </section>

      <section className={`${panel} p-4 sm:p-5`} aria-labelledby="plan-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="plan-heading" className="text-base font-bold">
            Floor plan
          </h2>
          <button type="button" onClick={add} className={`${btn.primary} px-3 py-2`}>
            <Plus className="h-4 w-4" aria-hidden /> Add room
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">Drag rooms to arrange them like your building. Drag a selected room&apos;s corner to resize it. With a keyboard: arrow keys move, Shift + arrows resize.</p>
        <div className="mt-3">
          {data.rooms.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
              <DoorOpen className="h-8 w-8" style={{ color: ACCENT }} aria-hidden />
              <p className="mt-3 font-semibold">Add your first room</p>
              <p className="mt-1 max-w-sm text-sm text-muted">Start with the spaces people ask for most: sanctuary, fellowship hall, classrooms.</p>
            </div>
          ) : (
            <FloorPlan rooms={data.rooms} mode="edit" selectedId={selected} onSelect={setSelected} onChange={update} />
          )}
        </div>
      </section>

      {room && (
        <section className={`${panel} space-y-4 p-5 sm:p-6`} aria-labelledby="room-heading">
          <h2 id="room-heading" className="text-base font-bold">
            {room.name}
          </h2>
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <div>
              <label htmlFor="room-name" className={label}>
                Name
              </label>
              <input id="room-name" className={`${input} mt-1.5`} value={room.name} maxLength={60} onChange={(e) => update({ ...room, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="room-cap" className={label}>
                Seats
              </label>
              <input id="room-cap" inputMode="numeric" className={`${input} mt-1.5`} value={room.capacity || ""} onChange={(e) => update({ ...room, capacity: Math.min(5000, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
            </div>
          </div>
          <div>
            <label htmlFor="room-features" className={label}>
              Features <span className="font-normal text-muted">(comma-separated)</span>
            </label>
            <input
              id="room-features"
              className={`${input} mt-1.5`}
              value={featureText}
              onChange={(e) => setFeatureText(e.target.value)}
              onBlur={() => update({ ...room, features: [...new Set(featureText.split(",").map((f) => f.trim()).filter(Boolean))].slice(0, 12) })}
              placeholder="projector, kitchen, piano"
            />
          </div>
          <fieldset>
            <legend className={label}>Color</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {ROOM_COLORS.map((c) => (
                <button key={c} type="button" aria-label={`Color ${c}`} aria-pressed={room.color === c} onClick={() => update({ ...room, color: c })} className={`h-8 w-8 rounded-full border-2 ${room.color === c ? "border-fg" : "border-transparent"}`} style={{ background: c }} />
              ))}
            </div>
          </fieldset>
          {confirmDelete ? (
            <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-up/40 bg-up/10 p-3 text-sm">
              <span className="flex-1 text-soft">
                Delete {room.name}
                {data.bookings.some((b) => b.roomId === room.id) ? ` and its ${data.bookings.filter((b) => b.roomId === room.id).length} bookings` : ""}? This can&apos;t be undone.
              </span>
              <button type="button" onClick={() => setConfirmDelete(false)} className={`${btn.secondary} px-3 py-1.5`}>
                Cancel
              </button>
              <button type="button" onClick={() => remove(room)} className={`${btn.danger} px-3 py-1.5`}>
                Delete
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className={`${btn.ghost} gap-1.5 text-sm`}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete room
            </button>
          )}
        </section>
      )}
    </>
  );
}

