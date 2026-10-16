/** Short, simple prayers before a meal, said the way a friend would say them. */
export const GRACES = [
  "Thank you, God, for this food and the hands that made it. Be with us around this table.",
  "God, thank you for what's in front of us tonight. Help us really notice the people we're sharing it with.",
  "Thank you for this meal, God. Be with the people who don't have enough tonight, and show us how to help.",
  "For food, for friends, for one more day: thank you, God.",
  "God, thank you for taking care of us. Let this table be a place of peace tonight.",
];

/** A different grace each day. */
export function graceFor(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return GRACES[Math.floor(Date.UTC(y, m - 1, d) / 86_400_000) % GRACES.length];
}
