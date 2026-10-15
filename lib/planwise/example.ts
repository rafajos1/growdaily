import type { Plan } from "./plan";

export const EXAMPLE_DUMP = `Finish the Q3 budget slides for Friday
Reply to Sam about the venue
Dentist at 3:30pm
Groceries for the week
Call mom
Clean up the inbox
Plan Saturday's hike
Read the onboarding doc for the new tool`;

/** A hand-written plan for EXAMPLE_DUMP, shown before the visitor makes their own. */
export const EXAMPLE_PLAN: Plan = {
  summary: "Get the budget slides done while your energy is high, keep the afternoon light around the dentist, and push the reading to tomorrow.",
  top3: ["Finish the Q3 budget slides", "Reply to Sam about the venue", "Dentist at 3:30pm"],
  blocks: [
    { start: "09:00", end: "10:30", title: "Finish the Q3 budget slides", kind: "focus" },
    { start: "10:30", end: "10:45", title: "Break", kind: "break" },
    { start: "10:45", end: "11:15", title: "Reply to Sam about the venue", kind: "task" },
    { start: "11:15", end: "12:00", title: "Clean up the inbox", kind: "task" },
    { start: "12:00", end: "13:00", title: "Lunch", kind: "break" },
    { start: "13:00", end: "13:30", title: "Call mom", kind: "task" },
    { start: "13:30", end: "14:30", title: "Plan Saturday's hike", kind: "focus" },
    { start: "15:30", end: "16:30", title: "Dentist", kind: "fixed" },
    { start: "16:45", end: "17:30", title: "Groceries for the week", kind: "task" },
  ],
  later: [{ title: "Read the onboarding doc for the new tool", reason: "Not urgent, and it needs a fresh mind. First thing tomorrow." }],
};
