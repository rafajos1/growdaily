import { describe, expect, it } from "vitest";
import { hashValue, inAppBrowserName, planSync, sessionFromHash, type RemoteRow, type SyncMeta } from "./engine";

const NOW = Date.parse("2026-10-17T12:00:00Z");
const row = (key: string, value: string | null, at = "2026-10-17T11:00:00Z"): RemoteRow => ({ key, value, updated_at: at });
const meta = (hashes: Record<string, string | null>, edited: Record<string, number> = {}): SyncMeta => ({
  userId: "u1",
  hashes: Object.fromEntries(Object.entries(hashes).map(([k, v]) => [k, hashValue(v)])),
  edited,
  lastSynced: NOW - 60_000,
});
const fresh: SyncMeta = { userId: null, hashes: {}, edited: {}, lastSynced: null };

describe("planSync, first sync on a device", () => {
  it("takes saved progress over this device's examples, and saves what the account lacks", () => {
    const plan = planSync({ habits: "examples", mood: "mine", empty: null }, { habits: row("habits", "real") }, fresh, "u1", NOW);
    expect(plan.pull).toEqual([{ key: "habits", value: "real" }]);
    expect(plan.push.map((p) => p.key)).toEqual(["mood"]);
    expect(plan.hashes).toEqual({ habits: hashValue("real"), mood: hashValue("mine"), empty: hashValue(null) });
  });

  it("treats a different account as a first sync", () => {
    const plan = planSync({ habits: "a" }, { habits: row("habits", "b") }, { ...meta({ habits: "a" }), userId: "someone-else" }, "u1", NOW);
    expect(plan.pull).toEqual([{ key: "habits", value: "b" }]);
  });
});

describe("planSync, later syncs", () => {
  it("does nothing when neither side changed", () => {
    const plan = planSync({ habits: "a" }, { habits: row("habits", "a") }, meta({ habits: "a" }), "u1", NOW);
    expect(plan.pull).toEqual([]);
    expect(plan.push).toEqual([]);
  });

  it("saves a change made on this device", () => {
    const plan = planSync({ habits: "b" }, { habits: row("habits", "a") }, meta({ habits: "a" }, { habits: NOW - 5000 }), "u1", NOW);
    expect(plan.push).toEqual([{ key: "habits", value: "b", updatedAt: new Date(NOW - 5000).toISOString() }]);
    expect(plan.hashes.habits).toBe(hashValue("b"));
  });

  it("brings in a change made on another device", () => {
    const plan = planSync({ habits: "a" }, { habits: row("habits", "c") }, meta({ habits: "a" }), "u1", NOW);
    expect(plan.pull).toEqual([{ key: "habits", value: "c" }]);
    expect(plan.hashes.habits).toBe(hashValue("c"));
  });

  it("lets the newer change win when both changed", () => {
    const remote = { habits: row("habits", "remote", "2026-10-17T11:59:00Z") };
    const older = planSync({ habits: "local" }, remote, meta({ habits: "a" }, { habits: NOW - 10 * 60_000 }), "u1", NOW);
    expect(older.pull).toEqual([{ key: "habits", value: "remote" }]);
    const newer = planSync({ habits: "local" }, remote, meta({ habits: "a" }, { habits: NOW - 1000 }), "u1", NOW);
    expect(newer.push.map((p) => p.value)).toEqual(["local"]);
  });

  it("saves removals too", () => {
    const plan = planSync({ habits: null }, { habits: row("habits", "a") }, meta({ habits: "a" }), "u1", NOW);
    expect(plan.push.map((p) => [p.key, p.value])).toEqual([["habits", null]]);
  });
});

describe("sessionFromHash", () => {
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwt = `x.${b64({ sub: "u1", email: "a@b.co" })}.y`;

  it("reads the session from a sign-in link", () => {
    const r = sessionFromHash(`#access_token=${jwt}&expires_at=1792300000&refresh_token=r1&token_type=bearer&type=magiclink`, NOW);
    expect(r).toEqual({ session: { accessToken: jwt, refreshToken: "r1", expiresAt: 1792300000000, userId: "u1", email: "a@b.co" } });
  });
  it("explains an expired link", () => {
    expect(sessionFromHash("#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid", NOW)).toEqual({ error: expect.stringContaining("expired") });
  });
  it("ignores ordinary hashes", () => {
    expect(sessionFromHash("#progress", NOW)).toBeNull();
    expect(sessionFromHash("", NOW)).toBeNull();
  });
});

describe("inAppBrowserName", () => {
  it("spots in-app browsers but not regular ones", () => {
    expect(inAppBrowserName("Mozilla/5.0 (iPhone) AppleWebKit Mobile/15E148 Instagram 300.0")).toBe("Instagram");
    expect(inAppBrowserName("Mozilla/5.0 (iPhone) Mobile/15E148 [FBAN/FBIOS;FBAV/450.0]")).toBe("Facebook");
    expect(inAppBrowserName("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1")).toBeNull();
  });
});
