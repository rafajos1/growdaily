import { addDays, weekday } from "../habitwise/dates";
import { newId } from "../habitwise/storage";
import type { Booking, Room, RoomData } from "./types";

const room = (name: string, capacity: number, features: string[], color: string, x: number, y: number, w: number, h: number): Room => ({ id: newId(), name, capacity, features, color, x, y, w, h });

/** An example church building with a month of regular and one-off bookings. */
export function sampleData(today: string): RoomData {
  const rooms = [
    room("Sanctuary", 300, ["sound system", "projector", "piano"], "#4fc7b8", 0, 0, 10, 8),
    room("Fellowship Hall", 120, ["kitchen", "tables", "projector"], "#f2b54b", 10, 0, 8, 6),
    room("Chapel", 60, ["piano"], "#b48cf2", 18, 0, 6, 5),
    room("Youth Room", 40, ["TV", "games"], "#ef7fa8", 18, 5, 6, 4),
    room("Room 101", 20, ["whiteboard", "TV"], "#8fb3ff", 0, 8, 5, 4),
    room("Room 102", 15, ["whiteboard"], "#5cb8e6", 5, 8, 5, 4),
    room("Nursery", 12, ["changing table"], "#53cfa0", 10, 8, 4, 4),
    room("Conference Room", 10, ["TV", "conference table"], "#d9965b", 14, 9, 4, 3),
  ];
  const id = (name: string) => rooms.find((r) => r.name === name)!.id;

  const weekly: { day: number; room: string; title: string; contact: string; start: string; end: string }[] = [
    { day: 0, room: "Sanctuary", title: "Sunday worship", contact: "Worship team", start: "09:00", end: "12:00" },
    { day: 0, room: "Room 101", title: "Sunday school: adults", contact: "Adult ministry", start: "09:30", end: "10:30" },
    { day: 0, room: "Room 102", title: "Sunday school: kids", contact: "Children's ministry", start: "09:30", end: "10:30" },
    { day: 0, room: "Nursery", title: "Nursery", contact: "Children's ministry", start: "08:45", end: "12:15" },
    { day: 2, room: "Fellowship Hall", title: "Community recovery group", contact: "Community group", start: "19:00", end: "20:30" },
    { day: 3, room: "Youth Room", title: "Youth night", contact: "Youth ministry", start: "18:30", end: "20:00" },
    { day: 3, room: "Conference Room", title: "Midweek Bible study", contact: "Small groups", start: "19:00", end: "20:30" },
    { day: 4, room: "Sanctuary", title: "Choir rehearsal", contact: "Music ministry", start: "19:00", end: "21:00" },
    { day: 6, room: "Fellowship Hall", title: "Food pantry", contact: "Outreach team", start: "09:00", end: "12:00" },
  ];

  const bookings: Booking[] = [];
  const series = new Map(weekly.map((w) => [w, newId()]));
  for (let date = addDays(today, -7); date <= addDays(today, 28); date = addDays(date, 1)) {
    for (const w of weekly) {
      if (weekday(date) === w.day) bookings.push({ id: newId(), roomId: id(w.room), title: w.title, contact: w.contact, date, start: w.start, end: w.end, status: "confirmed", notes: "", seriesId: series.get(w) });
    }
  }
  const nextSat = addDays(today, (6 - weekday(today) + 7) % 7 || 7);
  bookings.push(
    { id: newId(), roomId: id("Chapel"), title: "Wedding rehearsal", contact: "Taylor & Morgan", date: addDays(nextSat, -1), start: "17:00", end: "19:00", status: "confirmed", notes: "Pastor attending." },
    { id: newId(), roomId: id("Chapel"), title: "Wedding", contact: "Taylor & Morgan", date: nextSat, start: "14:00", end: "17:00", status: "confirmed", notes: "Florist arrives at noon." },
    { id: newId(), roomId: id("Fellowship Hall"), title: "Baby shower", contact: "Ana P. (member)", date: nextSat, start: "14:00", end: "17:00", status: "pending", notes: "Needs kitchen and 8 tables." },
    { id: newId(), roomId: id("Room 101"), title: "Volunteer training", contact: "Outreach team", date: addDays(today, 2), start: "18:00", end: "19:30", status: "pending", notes: "" },
  );
  return { building: "Grace Community Church", rooms, bookings };
}
