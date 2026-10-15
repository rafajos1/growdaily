export const HABIT_COLORS = ["#53cfa0", "#5cb8e6", "#f2b54b", "#ef7fa8", "#b48cf2", "#f2846b"] as const;

export interface Habit {
  id: string;
  name: string;
  color: string;
  /** Weekdays the habit is scheduled on, 0 = Sunday. */
  days: number[];
  /** Calendar date the habit was created; earlier days don't count against it. */
  startDate: string;
  createdAt: string;
}

export interface HabitData {
  habits: Habit[];
  /** Completed dates (`YYYY-MM-DD`) per habit id. */
  checks: Record<string, string[]>;
}

export const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAYS = [1, 2, 3, 4, 5];
