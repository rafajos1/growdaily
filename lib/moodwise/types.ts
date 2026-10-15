export const TAGS = ["exercise", "outdoors", "friends", "work stress", "caffeine", "alcohol", "late screens"] as const;
export type Tag = (typeof TAGS)[number];

export const MOOD_LABELS = ["Awful", "Low", "Okay", "Good", "Great"] as const;
export const ENERGY_LABELS = ["Drained", "Tired", "Steady", "Energized", "Buzzing"] as const;

export interface Entry {
  /** Calendar date, `YYYY-MM-DD`. One entry per day. */
  date: string;
  mood: number; // 1..5
  energy: number; // 1..5
  /** Hours slept last night, or null if skipped. */
  sleep: number | null;
  tags: Tag[];
  /** Private; never sent anywhere. */
  note: string;
}
