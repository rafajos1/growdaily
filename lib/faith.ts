/**
 * GrowDaily's site-wide Faith switch. Off unless the person turns it on, and
 * stored only in their browser like everything else.
 */
export const FAITH_KEY = "growdaily:faith";
/** Habitwise had its own switch before Faith covered every app. */
const LEGACY_KEYS = ["habitwise:faith"];
/** Fired on `window` so other components on the same page update at once. */
export const FAITH_EVENT = "growdaily:faith-change";

export function readFaith(): boolean {
  try {
    const value = localStorage.getItem(FAITH_KEY);
    if (value !== null) return value === "1";
    for (const key of LEGACY_KEYS) {
      if (localStorage.getItem(key) === "1") {
        localStorage.setItem(FAITH_KEY, "1");
        return true;
      }
    }
  } catch {
    /* storage unavailable */
  }
  return false;
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
