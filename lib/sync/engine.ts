/**
 * Optional "Save my progress". The apps keep everything in localStorage; when
 * someone signs in with their email, this keeps those keys in step with a
 * private copy in their GrowDaily account (Supabase), so progress survives a
 * cleared browser and follows them to other browsers and devices.
 *
 * It talks to Supabase's REST endpoints directly (no client library) so the
 * static Spendwise page can bundle it too. Everything here is browser-only.
 */

/** The localStorage keys that are saved. Ask history and AI caches stay on the device. */
export const SYNC_KEYS = [
  "growdaily:faith",
  "growdaily:day",
  "habitwise:v1",
  "habitwise:examples",
  "planwise:v1",
  "mealwise:v1",
  "moodwise:v1",
  "moodwise:examples",
  "expense-tracker:v1",
  "expense-tracker:examples-loaded",
] as const;

const SESSION_KEY = "growdaily:session";
const META_KEY = "growdaily:sync";
const CONFIG_KEY = "growdaily:sync-config";
const RELOADS_KEY = "growdaily:sync-reloads";

export interface Session {
  accessToken: string;
  refreshToken: string;
  /** Milliseconds since the epoch. */
  expiresAt: number;
  userId: string;
  email: string;
}

export interface SyncMeta {
  /** The account this device last synced with; a different account starts fresh. */
  userId: string | null;
  /** Hash of each key's value as of the last sync. */
  hashes: Record<string, string>;
  /** When each key was changed on this device since the last sync (ms). */
  edited: Record<string, number>;
  lastSynced: number | null;
}

export interface RemoteRow {
  key: string;
  value: string | null;
  updated_at: string;
}

export type SyncState = "signed-out" | "syncing" | "synced" | "offline" | "error";
export interface SyncStatus {
  state: SyncState;
  email: string | null;
  lastSynced: number | null;
  message: string | null;
}

// ---------- Pure helpers (unit-tested) ----------

/** Short, stable fingerprint of a stored value; null (missing) has its own. */
export function hashValue(value: string | null): string {
  if (value === null) return "none";
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${(h >>> 0).toString(36)}.${value.length.toString(36)}`;
}

export interface SyncPlan {
  /** Values to write into this browser. */
  pull: { key: string; value: string | null }[];
  /** Values to save to the account. */
  push: { key: string; value: string | null; updatedAt: string }[];
  /** Hashes once the plan is applied. */
  hashes: Record<string, string>;
}

/**
 * Decides, key by key, which side wins.
 *
 * - First sync of this device with this account: the account wins wherever it
 *   has a value (a new phone shouldn't overwrite real progress with examples);
 *   anything the account doesn't have yet is saved from this device.
 * - After that: whichever side changed since the last sync wins, and if both
 *   changed, the newer change wins.
 */
export function planSync(
  local: Record<string, string | null>,
  remote: Record<string, RemoteRow>,
  meta: SyncMeta,
  userId: string,
  now: number,
): SyncPlan {
  const first = meta.userId !== userId;
  const plan: SyncPlan = { pull: [], push: [], hashes: {} };
  for (const key of Object.keys(local)) {
    const value = local[key];
    const lh = hashValue(value);
    const r = remote[key];
    const rh = r ? hashValue(r.value) : null;
    const base = first ? undefined : meta.hashes[key];
    const editedAt = meta.edited[key] ?? now;
    const push = () => plan.push.push({ key, value, updatedAt: new Date(editedAt).toISOString() });
    const pull = () => plan.pull.push({ key, value: r!.value });

    if (first || base === undefined) {
      if (r && rh !== lh) pull();
      else if (!r && value !== null) push();
      plan.hashes[key] = r ? rh! : lh;
      continue;
    }
    const localChanged = lh !== base;
    const remoteChanged = r ? rh !== base : false;
    if (localChanged && remoteChanged && lh !== rh) {
      if (editedAt >= Date.parse(r!.updated_at)) push();
      else pull();
    } else if (localChanged && lh !== rh) push();
    else if (remoteChanged && lh !== rh) pull();
    plan.hashes[key] = plan.pull.some((p) => p.key === key) ? rh! : lh;
  }
  return plan;
}

function decodeJwt(token: string): { sub?: string; email?: string } {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "=")));
  } catch {
    return {};
  }
}

/** Reads the session Supabase puts in the URL after someone taps the email link. */
export function sessionFromHash(hash: string, now: number): { session: Session } | { error: string } | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const errorDescription = params.get("error_description");
  if (params.get("error") || errorDescription) {
    return { error: params.get("error_code") === "otp_expired" ? "That sign-in link has expired or was already used. Send a new one." : (errorDescription ?? "Sign-in didn't work. Try again.").replace(/\+/g, " ") };
  }
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;
  const claims = decodeJwt(accessToken);
  if (!claims.sub) return { error: "Sign-in didn't work. Try again." };
  const expiresAt = Number(params.get("expires_at")) * 1000 || now + Number(params.get("expires_in") ?? 3600) * 1000;
  return { session: { accessToken, refreshToken, expiresAt, userId: claims.sub, email: claims.email ?? "" } };
}

/** In-app browsers (Instagram, Facebook, TikTok…) often forget what a site saved. */
export function inAppBrowserName(userAgent: string): string | null {
  const apps: [RegExp, string][] = [
    [/Instagram/i, "Instagram"],
    [/FBAN|FBAV|FB_IAB/i, "Facebook"],
    [/musical_ly|TikTok|BytedanceWebview/i, "TikTok"],
    [/Snapchat/i, "Snapchat"],
    [/LinkedInApp/i, "LinkedIn"],
    [/Pinterest/i, "Pinterest"],
    [/\bLine\//i, "LINE"],
    [/GSA\//i, "the Google app"],
  ];
  return apps.find(([re]) => re.test(userAgent))?.[1] ?? null;
}

// ---------- Storage ----------

function readJSON<T>(key: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}
function writeJSON(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
function readLocal(): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const key of SYNC_KEYS) {
    try {
      out[key] = localStorage.getItem(key);
    } catch {
      out[key] = null;
    }
  }
  return out;
}

const emptyMeta = (): SyncMeta => ({ userId: null, hashes: {}, edited: {}, lastSynced: null });
const readMeta = () => ({ ...emptyMeta(), ...(readJSON<SyncMeta>(META_KEY) ?? {}) });
export const readSession = () => readJSON<Session>(SESSION_KEY);

// ---------- Supabase ----------

interface Config {
  url: string;
  anonKey: string;
}
let configPromise: Promise<Config | null> | null = null;

function getConfig(): Promise<Config | null> {
  if (!configPromise) {
    configPromise = (async () => {
      try {
        const cached = JSON.parse(sessionStorage.getItem(CONFIG_KEY) ?? "null") as Config | null;
        if (cached?.url && cached.anonKey) return cached;
      } catch {
        /* ignore */
      }
      try {
        const res = await fetch("/api/public-config");
        const json = (await res.json()) as { supabaseUrl?: string; supabaseAnonKey?: string };
        if (!json.supabaseUrl || !json.supabaseAnonKey) return null;
        const config = { url: json.supabaseUrl.replace(/\/$/, ""), anonKey: json.supabaseAnonKey };
        try {
          sessionStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch {
          /* ignore */
        }
        return config;
      } catch {
        configPromise = null;
        return null;
      }
    })();
  }
  return configPromise;
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const config = await getConfig();
  if (!config) throw new HttpError(0, "Saving isn't set up yet.");
  const headers: Record<string, string> = { apikey: config.anonKey, "Content-Type": "application/json", ...(init.headers as Record<string, string>) };
  if (init.token) headers.Authorization = `Bearer ${init.token}`;
  const res = await fetch(`${config.url}${path}`, { ...init, headers });
  const text = await res.text();
  const json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!res.ok) throw new HttpError(res.status, String(json.msg ?? json.error_description ?? json.message ?? json.error ?? res.statusText));
  return json as T;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  user?: { id: string; email?: string };
}
function toSession(t: TokenResponse, fallbackEmail = ""): Session {
  const claims = decodeJwt(t.access_token);
  return {
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    expiresAt: t.expires_at ? t.expires_at * 1000 : Date.now() + (t.expires_in ?? 3600) * 1000,
    userId: t.user?.id ?? claims.sub ?? "",
    email: t.user?.email ?? claims.email ?? fallbackEmail,
  };
}

/** Emails a sign-in link (and a code, if the email template includes one). */
export async function sendSignInEmail(email: string, redirectTo: string): Promise<void> {
  await call(`/auth/v1/otp?${new URLSearchParams({ redirect_to: redirectTo })}`, {
    method: "POST",
    body: JSON.stringify({ email, create_user: true }),
  });
}

export async function verifyCode(email: string, code: string): Promise<void> {
  const t = await call<TokenResponse>("/auth/v1/verify", { method: "POST", body: JSON.stringify({ type: "email", email, token: code }) });
  await signedIn(toSession(t, email));
}

async function validSession(): Promise<Session | null> {
  const session = readSession();
  if (!session) return null;
  if (session.expiresAt - 60_000 > Date.now()) return session;
  try {
    const t = await call<TokenResponse>("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: session.refreshToken }) });
    const next = toSession(t, session.email);
    writeJSON(SESSION_KEY, next);
    return next;
  } catch (e) {
    // A rejected refresh token means the sign-in is over; network trouble doesn't.
    if (e instanceof HttpError && e.status >= 400 && e.status < 500) {
      writeJSON(SESSION_KEY, null);
      setStatus({ state: "signed-out", email: null, message: "You were signed out. Sign in again to keep saving." });
      return null;
    }
    throw e;
  }
}

// ---------- Status ----------

let status: SyncStatus = { state: "signed-out", email: null, lastSynced: null, message: null };
const listeners = new Set<(s: SyncStatus) => void>();
function setStatus(next: Partial<SyncStatus>) {
  status = { ...status, ...next };
  for (const fn of listeners) fn(status);
}
export function getStatus(): SyncStatus {
  return status;
}
export function subscribe(fn: (s: SyncStatus) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------- Syncing ----------

let running: Promise<void> | null = null;
let again = false;
let onApplied: (keys: string[]) => void = defaultApplied;

/** After pulling saved progress the open app has stale data in memory, so reload (at most twice a minute). */
function defaultApplied() {
  try {
    const recent = (JSON.parse(sessionStorage.getItem(RELOADS_KEY) ?? "[]") as number[]).filter((t) => Date.now() - t < 60_000);
    if (recent.length >= 2) return;
    sessionStorage.setItem(RELOADS_KEY, JSON.stringify([...recent, Date.now()]));
  } catch {
    /* ignore */
  }
  location.reload();
}

/** Notes which saved keys changed on this device since the last sync. Returns true if any did. */
function markEdits(): boolean {
  const meta = readMeta();
  if (!meta.userId) return false;
  const local = readLocal();
  let dirty = false;
  for (const key of SYNC_KEYS) {
    if (meta.hashes[key] !== undefined && hashValue(local[key]) !== meta.hashes[key]) {
      dirty = true;
      meta.edited[key] ??= Date.now();
    }
  }
  if (dirty) writeJSON(META_KEY, meta);
  return dirty;
}

export function syncNow(): Promise<void> {
  if (running) {
    again = true;
    return running;
  }
  running = (async () => {
    try {
      do {
        again = false;
        await syncOnce();
      } while (again);
    } finally {
      running = null;
    }
  })();
  return running;
}

async function syncOnce() {
  let session: Session | null;
  try {
    session = await validSession();
  } catch {
    setStatus({ state: "offline", message: null });
    return;
  }
  if (!session) {
    if (status.state !== "signed-out") setStatus({ state: "signed-out", email: null });
    return;
  }
  setStatus({ state: "syncing", email: session.email });
  try {
    markEdits();
    const rows = await call<RemoteRow[]>(`/rest/v1/app_state?select=key,value,updated_at`, { token: session.accessToken });
    const remote: Record<string, RemoteRow> = {};
    for (const row of rows) remote[row.key] = row;
    const meta = readMeta();
    const now = Date.now();
    const plan = planSync(readLocal(), remote, meta, session.userId, now);

    if (plan.push.length > 0) {
      await call(`/rest/v1/app_state?on_conflict=user_id,key`, {
        method: "POST",
        token: session.accessToken,
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(plan.push.map((p) => ({ user_id: session.userId, key: p.key, value: p.value, updated_at: p.updatedAt }))),
      });
    }
    for (const p of plan.pull) {
      try {
        if (p.value === null) localStorage.removeItem(p.key);
        else localStorage.setItem(p.key, p.value);
      } catch {
        /* storage full: the next sync tries again */
      }
    }
    writeJSON(META_KEY, { userId: session.userId, hashes: plan.hashes, edited: {}, lastSynced: now } satisfies SyncMeta);
    setStatus({ state: "synced", email: session.email, lastSynced: now, message: null });
    if (plan.pull.length > 0) onApplied(plan.pull.map((p) => p.key));
  } catch (e) {
    if (e instanceof HttpError && e.status === 401) writeJSON(SESSION_KEY, { ...session, expiresAt: 0 });
    setStatus(e instanceof HttpError && e.status > 0 ? { state: "error", message: "Couldn't save just now. We'll keep trying." } : { state: "offline", message: null });
  }
}

async function signedIn(session: Session) {
  writeJSON(SESSION_KEY, session);
  setStatus({ state: "syncing", email: session.email, message: null });
  await syncNow();
}

/** Signs out on this device. Progress stays here; the saved copy stays in the account. */
export async function signOut(): Promise<void> {
  const session = readSession();
  writeJSON(SESSION_KEY, null);
  writeJSON(META_KEY, null);
  setStatus({ state: "signed-out", email: null, lastSynced: null, message: null });
  if (session) await call("/auth/v1/logout", { method: "POST", token: session.accessToken }).catch(() => undefined);
}

/** Deletes the saved copy from the account, then signs out. Progress on this device stays. */
export async function deleteSavedCopy(): Promise<void> {
  const session = await validSession();
  if (session) await call(`/rest/v1/app_state?user_id=eq.${encodeURIComponent(session.userId)}`, { method: "DELETE", token: session.accessToken });
  await signOut();
}

let started = false;

/**
 * Starts syncing on this page: finishes a sign-in from an email link, asks the
 * browser to keep this site's data, and saves changes as people make them.
 */
export function startSync(options: { onApplied?: (keys: string[]) => void } = {}): void {
  if (started || typeof window === "undefined") return;
  started = true;
  if (options.onApplied) onApplied = options.onApplied;

  // Ask the browser not to clear what the apps saved when space runs low.
  navigator.storage?.persist?.().catch(() => undefined);

  const finishLinkSignIn = () => {
    const fromLink = sessionFromHash(location.hash, Date.now());
    if (!fromLink) return false;
    history.replaceState(null, "", location.pathname + location.search);
    if ("error" in fromLink) setStatus({ state: "signed-out", message: fromLink.error });
    else void signedIn(fromLink.session);
    return true;
  };
  const fromLink = finishLinkSignIn();
  // The link can also land on a page that's already open.
  window.addEventListener("hashchange", finishLinkSignIn);

  const session = readSession();
  if (session) {
    setStatus({ state: "syncing", email: session.email, lastSynced: readMeta().lastSynced });
    if (!fromLink) void syncNow();
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  setInterval(() => {
    if (readSession() && markEdits() && !timer) {
      timer = setTimeout(() => {
        timer = null;
        void syncNow();
      }, 1500);
    }
  }, 3000);
  document.addEventListener("visibilitychange", () => {
    if (readSession()) void syncNow();
  });
  window.addEventListener("online", () => {
    if (readSession()) void syncNow();
  });
}
