import { describe, expect, it } from "vitest";
import { bookingAt, bookingsOn, clampRoom, clock, conflictsFor, dayText, findRooms, openSpot, overlaps, weeklyDates } from "./logic";
import { sampleData } from "./sample";
import { parseData } from "./storage";
import type { Booking, Room, RoomData } from "./types";

const hall: Room = { id: "hall", name: "Hall", capacity: 100, features: ["kitchen", "projector"], color: "#fff", x: 0, y: 0, w: 6, h: 4 };
const room: Room = { id: "r1", name: "Room 1", capacity: 20, features: ["TV"], color: "#fff", x: 6, y: 0, w: 4, h: 3 };
const b = (id: string, roomId: string, date: string, start: string, end: string): Booking => ({ id, roomId, title: id, contact: "", date, start, end, status: "confirmed", notes: "" });
const data: RoomData = { building: "Grace", rooms: [hall, room], bookings: [b("study", "r1", "2026-10-21", "19:00", "20:30"), b("dinner", "hall", "2026-10-21", "17:00", "19:00")] };

describe("times", () => {
  it("formats 24-hour times for people", () => {
    expect(clock("19:30")).toBe("7:30 PM");
    expect(clock("09:00")).toBe("9 AM");
    expect(clock("00:15")).toBe("12:15 AM");
  });

  it("detects overlaps, but not back-to-back bookings", () => {
    expect(overlaps(b("a", "r1", "2026-10-21", "18:00", "19:30"), data.bookings[0])).toBe(true);
    expect(overlaps(b("a", "r1", "2026-10-21", "20:30", "21:00"), data.bookings[0])).toBe(false);
    expect(overlaps(b("a", "hall", "2026-10-21", "19:30", "20:00"), data.bookings[0])).toBe(false);
  });

  it("finds conflicts, ignoring the booking being edited", () => {
    expect(conflictsFor(data, { roomId: "r1", date: "2026-10-21", start: "20:00", end: "21:00" })).toHaveLength(1);
    expect(conflictsFor(data, { roomId: "r1", date: "2026-10-21", start: "20:00", end: "21:00" }, "study")).toHaveLength(0);
  });

  it("lists a day in order and says what's on at a time", () => {
    expect(bookingsOn(data, "2026-10-21").map((x) => x.id)).toEqual(["dinner", "study"]);
    expect(bookingAt(data, "hall", "2026-10-21", "18:59")?.id).toBe("dinner");
    expect(bookingAt(data, "hall", "2026-10-21", "19:00")).toBeUndefined();
  });

  it("repeats weekly", () => {
    expect(weeklyDates("2026-10-21", 3)).toEqual(["2026-10-21", "2026-10-28", "2026-11-04"]);
  });
});

describe("finding a room", () => {
  it("prefers free rooms with the features, then the smallest that fits", () => {
    const need = { date: "2026-10-21", start: "19:00", end: "20:00", capacity: 15, features: [], weeks: 1 };
    expect(findRooms(data, need).map((m) => m.room.id)).toEqual(["hall", "r1"]); // Room 1 is taken
    expect(findRooms(data, { ...need, start: "21:00", end: "22:00" }).map((m) => m.room.id)).toEqual(["r1", "hall"]);
    expect(findRooms(data, { ...need, start: "21:00", end: "22:00", features: ["projector"] })[0].room.id).toBe("hall");
    expect(findRooms(data, { ...need, capacity: 50 }).map((m) => m.room.id)).toEqual(["hall"]);
  });

  it("checks every week of a series", () => {
    const m = findRooms(data, { date: "2026-10-14", start: "19:00", end: "20:00", capacity: 10, features: ["tv"], weeks: 3 }).find((x) => x.room.id === "r1")!;
    expect(m.busyDates).toEqual(["2026-10-21"]);
    expect(m.missing).toEqual([]);
  });
});

describe("the floor plan", () => {
  it("keeps rooms on the plan", () => {
    expect(clampRoom({ x: 30, y: -2, w: 1, h: 20 })).toEqual({ x: 22, y: 0, w: 2, h: 14 });
  });
  it("finds an open spot for a new room", () => {
    expect(openSpot([hall, room], 4, 3)).toEqual({ x: 10, y: 0 });
  });
});

describe("example and storage", () => {
  const sample = sampleData("2026-10-20");
  it("has no double bookings", () => {
    for (const x of sample.bookings) expect(conflictsFor(sample, x, x.id)).toEqual([]);
  });
  it("round-trips and drops bad data", () => {
    expect(parseData(JSON.stringify(sample)).bookings).toHaveLength(sample.bookings.length);
    expect(parseData(JSON.stringify({ rooms: [hall], bookings: [{ ...data.bookings[1], start: "19:00", end: "18:00" }, b("orphan", "nope", "2026-10-21", "09:00", "10:00")] })).bookings).toEqual([]);
  });
  it("writes a day as text", () => {
    expect(dayText(data, "2026-10-21")).toBe("Grace: Wednesday, October 21\n5 PM–7 PM  dinner (Hall)\n7 PM–8:30 PM  study (Room 1)");
  });
});
