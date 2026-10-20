"use client";

import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { clock, conflictsFor, isTime, toMin, weeklyDates } from "../../../lib/roomwise/logic";
import type { Booking, BookingStatus, Room, RoomData } from "../../../lib/roomwise/types";
import { btn, input, label } from "./ui";

export interface BookingDraft {
  roomId: string;
  title: string;
  contact: string;
  date: string;
  start: string;
  end: string;
  status: BookingStatus;
  notes: string;
  weeks: number;
}

/** New or edited booking. Weekly repeats are only offered for new bookings. */
export function BookingForm({ data, initial, defaults, onSubmit, onCancel, onDelete }: { data: RoomData; initial?: Booking; defaults?: Partial<BookingDraft>; onSubmit: (d: BookingDraft) => void; onCancel: () => void; onDelete?: (series: boolean) => void }) {
  const [d, setD] = useState<BookingDraft>({
    roomId: initial?.roomId ?? defaults?.roomId ?? data.rooms[0]?.id ?? "",
    title: initial?.title ?? defaults?.title ?? "",
    contact: initial?.contact ?? defaults?.contact ?? "",
    date: initial?.date ?? defaults?.date ?? "",
    start: initial?.start ?? defaults?.start ?? "19:00",
    end: initial?.end ?? defaults?.end ?? "20:00",
    status: initial?.status ?? defaults?.status ?? "confirmed",
    notes: initial?.notes ?? defaults?.notes ?? "",
    weeks: defaults?.weeks ?? 1,
  });
  const [error, setError] = useState("");
  const set = (patch: Partial<BookingDraft>) => {
    setD({ ...d, ...patch });
    setError("");
  };
  const timesOk = isTime(d.start) && isTime(d.end) && toMin(d.start) < toMin(d.end);
  const clashes =
    d.roomId && d.date && timesOk
      ? weeklyDates(d.date, initial ? 1 : d.weeks).flatMap((date) => conflictsFor(data, { roomId: d.roomId, date, start: d.start, end: d.end }, initial?.id))
      : [];
  const room = data.rooms.find((r: Room) => r.id === d.roomId);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!d.title.trim()) return setError("What's the booking for?");
    if (!d.date) return setError("Pick a date.");
    if (!timesOk) return setError("The end time needs to be after the start time.");
    if (clashes.length) return setError("That room is already booked then. Pick another time or room.");
    onSubmit({ ...d, title: d.title.trim().slice(0, 80), contact: d.contact.trim().slice(0, 80), notes: d.notes.trim().slice(0, 500) });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="bk-title" className={label}>
          What&apos;s it for?
        </label>
        <input id="bk-title" className={`${input} mt-1.5`} value={d.title} maxLength={80} onChange={(e) => set({ title: e.target.value })} placeholder="Women's Bible study" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="bk-room" className={label}>
            Room
          </label>
          <select id="bk-room" className={`${input} mt-1.5`} value={d.roomId} onChange={(e) => set({ roomId: e.target.value })}>
            {data.rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.capacity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bk-contact" className={label}>
            Group or contact
          </label>
          <input id="bk-contact" className={`${input} mt-1.5`} value={d.contact} maxLength={80} onChange={(e) => set({ contact: e.target.value })} placeholder="Women's ministry" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 sm:col-span-1">
          <label htmlFor="bk-date" className={label}>
            Date
          </label>
          <input id="bk-date" type="date" className={`${input} mt-1.5`} value={d.date} onChange={(e) => set({ date: e.target.value })} />
        </div>
        <div className="col-span-3 grid grid-cols-2 gap-3 sm:col-span-2">
          <div>
            <label htmlFor="bk-start" className={label}>
              Starts
            </label>
            <input id="bk-start" type="time" step={900} className={`${input} mt-1.5`} value={d.start} onChange={(e) => set({ start: e.target.value })} />
          </div>
          <div>
            <label htmlFor="bk-end" className={label}>
              Ends
            </label>
            <input id="bk-end" type="time" step={900} className={`${input} mt-1.5`} value={d.end} onChange={(e) => set({ end: e.target.value })} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {!initial && (
          <div>
            <label htmlFor="bk-weeks" className={label}>
              Repeat weekly
            </label>
            <select id="bk-weeks" className={`${input} mt-1.5`} value={d.weeks} onChange={(e) => set({ weeks: Number(e.target.value) })}>
              {[1, 2, 4, 6, 8, 12, 26].map((n) => (
                <option key={n} value={n}>
                  {n === 1 ? "Just once" : `${n} weeks`}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="bk-status" className={label}>
            Status
          </label>
          <select id="bk-status" className={`${input} mt-1.5`} value={d.status} onChange={(e) => set({ status: e.target.value as BookingStatus })}>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending (requested)</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="bk-notes" className={label}>
          Notes
        </label>
        <textarea id="bk-notes" rows={2} className={`${input} mt-1.5`} value={d.notes} maxLength={500} onChange={(e) => set({ notes: e.target.value })} placeholder="Setup, tables, kitchen, AV…" />
      </div>
      {room && <p className="text-xs text-muted">{room.name} seats {room.capacity}{room.features.length ? ` · ${room.features.join(", ")}` : ""}.</p>}
      {clashes.length > 0 && (
        <div role="alert" className="rounded-xl border border-up/40 bg-up/10 p-3 text-sm text-soft">
          <p className="font-semibold text-up">Already booked:</p>
          <ul className="mt-1 space-y-0.5">
            {clashes.slice(0, 4).map((c) => (
              <li key={c.id}>
                {new Date(`${c.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}, {clock(c.start)}–{clock(c.end)}: {c.title}
              </li>
            ))}
            {clashes.length > 4 && <li>and {clashes.length - 4} more</li>}
          </ul>
        </div>
      )}
      {error && !clashes.length && (
        <p role="alert" className="text-sm font-semibold text-up">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center">
        {onDelete && initial && (
          <div className="flex flex-wrap gap-1 sm:mr-auto">
            <button type="button" onClick={() => onDelete(false)} className={`${btn.ghost} gap-1.5 text-sm`}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </button>
            {initial.seriesId && (
              <button type="button" onClick={() => onDelete(true)} className={`${btn.ghost} text-sm`}>
                Delete this and later weeks
              </button>
            )}
          </div>
        )}
        <button type="button" onClick={onCancel} className={`${btn.secondary} sm:ml-auto`}>
          Cancel
        </button>
        <button type="submit" className={btn.primary}>
          {initial ? "Save booking" : d.weeks > 1 ? `Book ${d.weeks} weeks` : "Book room"}
        </button>
      </div>
    </form>
  );
}
