import { clampRoom, isTime, toMin } from "./logic";
import { EMPTY, type Booking, type Room, type RoomData } from "./types";

export const STORAGE_KEY = "roomwise:v1";
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);

function isRoom(v: unknown): v is Room {
  const r = v as Room;
  return !!r && typeof r.id === "string" && typeof r.name === "string" && num(r.capacity) && Array.isArray(r.features) && typeof r.color === "string" && [r.x, r.y, r.w, r.h].every(num);
}

function isBooking(v: unknown): v is Booking {
  const b = v as Booking;
  return (
    !!b &&
    typeof b.id === "string" &&
    typeof b.roomId === "string" &&
    typeof b.title === "string" &&
    ISO.test(b.date) &&
    isTime(b.start) &&
    isTime(b.end) &&
    toMin(b.start) < toMin(b.end) &&
    (b.status === "confirmed" || b.status === "pending")
  );
}

/** Parses stored data, dropping anything malformed instead of failing the whole load. */
export function parseData(raw: string | null): RoomData {
  if (!raw) return { ...EMPTY };
  const p = JSON.parse(raw) as Partial<RoomData> | null;
  const rooms = (Array.isArray(p?.rooms) ? p.rooms : [])
    .filter(isRoom)
    .map((r) => clampRoom({ ...r, name: r.name.slice(0, 60), capacity: Math.max(0, Math.round(r.capacity)), features: r.features.filter((f) => typeof f === "string").map((f) => f.slice(0, 30)).slice(0, 12) }));
  const ids = new Set(rooms.map((r) => r.id));
  const bookings = (Array.isArray(p?.bookings) ? p.bookings : [])
    .filter(isBooking)
    .filter((b) => ids.has(b.roomId))
    .map((b) => ({ ...b, title: b.title.slice(0, 80), contact: typeof b.contact === "string" ? b.contact.slice(0, 80) : "", notes: typeof b.notes === "string" ? b.notes.slice(0, 500) : "" }));
  return { building: typeof p?.building === "string" ? p.building.slice(0, 80) : "", rooms, bookings };
}

export function loadData(): RoomData {
  return parseData(window.localStorage.getItem(STORAGE_KEY));
}

export function saveData(data: RoomData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
}
