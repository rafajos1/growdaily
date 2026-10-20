/** The floor plan is a grid this many units wide and tall. */
export const GRID_W = 24;
export const GRID_H = 14;

export interface Room {
  id: string;
  name: string;
  capacity: number;
  /** Short tags like "projector", "kitchen", "piano". */
  features: string[];
  color: string;
  /** Position and size on the floor plan, in grid units. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export type BookingStatus = "confirmed" | "pending";

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  /** Who it's for: a group, ministry or contact person. */
  contact: string;
  date: string;
  /** "HH:MM", 24-hour. */
  start: string;
  end: string;
  status: BookingStatus;
  notes: string;
  /** Shared by the bookings in a weekly series. */
  seriesId?: string;
}

export interface RoomData {
  building: string;
  rooms: Room[];
  bookings: Booking[];
}

export const ROOM_COLORS = ["#4fc7b8", "#8fb3ff", "#f2b54b", "#ef7fa8", "#b48cf2", "#53cfa0", "#d9965b", "#5cb8e6"] as const;
export const EMPTY: RoomData = { building: "", rooms: [], bookings: [] };
