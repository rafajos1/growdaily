/**
 * GrowDaily's site-wide Faith switch, read and written the same way as the main
 * site (`lib/faith.ts` at the repo root). Spendwise is served from the same
 * origin, so the setting is shared through localStorage.
 */
export const FAITH_KEY = "growdaily:faith";
const LEGACY_KEYS = ["habitwise:faith"];
export const FAITH_EVENT = "growdaily:faith-change";

export function readFaith(): boolean {
  try {
    const value = localStorage.getItem(FAITH_KEY);
    if (value !== null) return value === "1";
    return LEGACY_KEYS.some((k) => localStorage.getItem(k) === "1");
  } catch {
    return false;
  }
}

export function writeFaith(on: boolean): void {
  try {
    localStorage.setItem(FAITH_KEY, on ? "1" : "0");
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  } catch {
    /* storage unavailable; the switch still works for this visit */
  }
  window.dispatchEvent(new CustomEvent(FAITH_EVENT, { detail: on }));
}
