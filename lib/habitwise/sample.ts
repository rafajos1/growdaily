import { addDays, weekday } from "./dates";
import { newId } from "./storage";
import { EVERY_DAY, HABIT_COLORS, WEEKDAYS, type HabitData } from "./types";

/** Six weeks of believable example history: strong mornings, slipping Thursdays. */
export function sampleData(today: string): HabitData {
  const start = addDays(today, -42);
  const defs = [
    { name: "Drink 8 glasses of water", days: EVERY_DAY, rate: 0.85, slipDay: 6 },
    { name: "Workout 30 minutes", days: [1, 3, 4, 6], rate: 0.75, slipDay: 4 },
    { name: "Read 20 pages", days: EVERY_DAY, rate: 0.7, slipDay: 5 },
    { name: "No phone first hour", days: WEEKDAYS, rate: 0.6, slipDay: 1 },
  ];
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const now = new Date().toISOString();
  const data: HabitData = { habits: [], checks: {} };
  defs.forEach((d, i) => {
    const id = newId();
    data.habits.push({ id, name: d.name, color: HABIT_COLORS[i], days: d.days, startDate: start, createdAt: now });
    const dates: string[] = [];
    for (let date = start; date < today; date = addDays(date, 1)) {
      if (!d.days.includes(weekday(date))) continue;
      const p = weekday(date) === d.slipDay ? d.rate - 0.45 : d.rate + 0.05;
      if (rand() < p) dates.push(date);
    }
    // The last few days are a solid run so the streaks look alive.
    for (let k = 1; k <= 4; k++) {
      const date = addDays(today, -k);
      if (d.days.includes(weekday(date)) && !dates.includes(date)) dates.push(date);
    }
    data.checks[id] = dates.sort();
  });
  return data;
}
