import { addDays } from "../habitwise/dates";
import { GRID_H, GRID_W, type Booking, type Room, type RoomData } from "./types";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
export const isTime = (t: string) => TIME.test(t);
export const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** 24-hour "HH:MM" as "7:30 PM". */
export function clock(t: string): string {
  const m = toMin(t);
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}${m % 60 ? `:${String(m % 60).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

/** Two bookings clash if they're in the same room on the same day and their times overlap. */
export function overlaps(a: Pick<Booking, "roomId" | "date" | "start" | "end">, b: Pick<Booking, "roomId" | "date" | "start" | "end">): boolean {
  return a.roomId === b.roomId && a.date === b.date && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);
}

export function conflictsFor(data: RoomData, candidate: Pick<Booking, "roomId" | "date" | "start" | "end">, ignoreId?: string): Booking[] {
  return data.bookings.filter((b) => b.id !== ignoreId && overlaps(b, candidate));
}

/** The same booking repeated weekly, `weeks` times in all. */
export function weeklyDates(date: string, weeks: number): string[] {
  return Array.from({ length: Math.max(1, Math.min(52, Math.round(weeks))) }, (_, i) => addDays(date, i * 7));
}

export function bookingsOn(data: RoomData, date: string): Booking[] {
  return data.bookings.filter((b) => b.date === date).sort((a, b) => toMin(a.start) - toMin(b.start) || a.end.localeCompare(b.end));
}

/** What's happening in a room at a moment: the booking, if any. */
export function bookingAt(data: RoomData, roomId: string, date: string, time: string): Booking | undefined {
  const m = toMin(time);
  return data.bookings.find((b) => b.roomId === roomId && b.date === date && toMin(b.start) <= m && m < toMin(b.end));
}

export interface Need {
  date: string;
  start: string;
  end: string;
  capacity: number;
  features: string[];
  weeks: number;
}

export interface Match {
  room: Room;
  /** Dates in the series when the room is already taken. */
  busyDates: string[];
  missing: string[];
}

/**
 * Rooms for a need, best first: free on every date, has the features, and the
 * smallest room that fits (so the big rooms stay free for big groups).
 */
export function findRooms(data: RoomData, need: Need): Match[] {
  const dates = weeklyDates(need.date, need.weeks);
  const want = need.features.map((f) => f.toLowerCase());
  return data.rooms
    .filter((r) => r.capacity >= need.capacity)
    .map((room) => ({
      room,
      busyDates: dates.filter((date) => conflictsFor(data, { roomId: room.id, date, start: need.start, end: need.end }).length > 0),
      missing: want.filter((f) => !room.features.some((rf) => rf.toLowerCase().includes(f) || f.includes(rf.toLowerCase()))),
    }))
    .sort((a, b) => a.busyDates.length - b.busyDates.length || a.missing.length - b.missing.length || a.room.capacity - b.room.capacity);
}

/** A day's schedule as plain text, to paste into a bulletin, email or text. */
export function dayText(data: RoomData, date: string): string {
  const rooms = new Map(data.rooms.map((r) => [r.id, r.name]));
  const day = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const list = bookingsOn(data, date);
  return [
    `${data.building ? `${data.building}: ` : ""}${day}`,
    ...(list.length ? list.map((b) => `${clock(b.start)}–${clock(b.end)}  ${b.title} (${rooms.get(b.roomId) ?? "Room"})${b.status === "pending" ? " [pending]" : ""}`) : ["No bookings."]),
  ].join("\n");
}

const clampInt = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));

/** Keeps a room inside the floor plan, at least 2×2 units. */
export function clampRoom<T extends Pick<Room, "x" | "y" | "w" | "h">>(r: T): T {
  const w = clampInt(r.w, 2, GRID_W);
  const h = clampInt(r.h, 2, GRID_H);
  return { ...r, w, h, x: clampInt(r.x, 0, GRID_W - w), y: clampInt(r.y, 0, GRID_H - h) };
}

/** The first open spot on the plan for a new room of a given size. */
export function openSpot(rooms: Room[], w = 4, h = 3): { x: number; y: number } {
  for (let y = 0; y <= GRID_H - h; y++) {
    for (let x = 0; x <= GRID_W - w; x++) {
      if (rooms.every((r) => x + w <= r.x || r.x + r.w <= x || y + h <= r.y || r.y + r.h <= y)) return { x, y };
    }
  }
  return { x: 0, y: 0 };
}
