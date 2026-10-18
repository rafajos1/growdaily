import { geocodeUrls, normalizeChurches, normalizePlaces, OVERPASS_SERVERS, overpassQuery, parseGeocode, placeSearchUrls, type Church } from "./churches";

/** What happened with one service, kept so a failure can say why. */
export interface Attempt {
  service: string;
  reason: string;
}

export class SearchError extends Error {
  constructor(
    message: string,
    public details: Attempt[] = [],
  ) {
    super(message);
  }
}

export type JsonFetch = (url: string, init: RequestInit, ms: number) => Promise<unknown>;

const host = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

/** A short, human reason for a failed request: "HTTP 429", "timed out", "blocked or offline". */
export function failureReason(err: unknown): string {
  const e = err as { name?: string; status?: number; message?: string };
  if (e?.status) return `HTTP ${e.status}`;
  if (e?.name === "TimeoutError" || e?.name === "AbortError") return "timed out";
  if (e?.name === "TypeError") return "blocked or offline";
  return String(e?.message ?? err).slice(0, 80);
}

const browserFetch: JsonFetch = async (url, init, ms) => {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
  return res.json();
};

/**
 * Runs tasks with staggered starts and resolves with the first that succeeds:
 * the next one starts when the previous fails or after `staggerMs`, whichever
 * comes first. Fast when the first server is healthy, resilient when it isn't.
 */
export function firstSuccess<T>(tasks: (() => Promise<T>)[], staggerMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    let started = 0;
    let failed = 0;
    let done = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startNext = () => {
      if (done || started >= tasks.length) return;
      const task = tasks[started++];
      clearTimeout(timer);
      if (started < tasks.length) timer = setTimeout(startNext, staggerMs);
      task().then(
        (value) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          resolve(value);
        },
        () => {
          failed++;
          if (failed === tasks.length) {
            done = true;
            reject(new Error("all failed"));
          } else startNext();
        },
      );
    };
    if (tasks.length === 0) reject(new Error("nothing to try"));
    else startNext();
  });
}

/**
 * Churches around a point: Overpass servers first (most complete), then the
 * Photon and Nominatim place searches together. Records each failure in `attempts`.
 */
export async function churchesAt(
  lat: number,
  lon: number,
  miles: number,
  attempts: Attempt[],
  options: { getJson?: JsonFetch; servers?: string[]; staggerMs?: number } = {},
): Promise<Church[]> {
  const getJson = options.getJson ?? browserFetch;
  const servers = options.servers ?? OVERPASS_SERVERS;
  const body = new URLSearchParams({ data: overpassQuery(lat, lon, miles * 1609.34) }).toString();
  const ask = (url: string, init: RequestInit, ms: number) =>
    getJson(url, init, ms).catch((err) => {
      attempts.push({ service: host(url), reason: failureReason(err) });
      throw err;
    });

  try {
    return await firstSuccess(
      servers.map((server) => () => ask(server, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } }, 15_000).then((json) => normalizeChurches(json, lat, lon, miles))),
      options.staggerMs ?? 3000,
    );
  } catch {
    /* every Overpass server failed; try the place searches */
  }

  const results = await Promise.allSettled(placeSearchUrls(lat, lon, miles).map((url) => ask(url, { headers: { Accept: "application/json" } }, 10_000)));
  const answered = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === "fulfilled");
  if (answered.length === 0) throw new SearchError("The church map isn't answering right now. Please try again in a minute.", attempts);
  const seen = new Set<string>();
  return answered
    .flatMap((r) => normalizePlaces(r.value, lat, lon, miles))
    .filter((c) => {
      const key = `${c.name.toLowerCase()}|${c.lat.toFixed(3)}|${c.lon.toFixed(3)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.miles - b.miles);
}

/**
 * Searches from the visitor's own browser, so the free map services see each
 * visitor separately rather than one busy cloud server, then falls back to
 * GrowDaily's own /api/faith/churches.
 */
export async function searchChurches(where: { place: string } | { lat: number; lon: number }, miles: number): Promise<{ churches: Church[]; label: string }> {
  const attempts: Attempt[] = [];
  let lat: number;
  let lon: number;
  let label = "you";

  if ("place" in where) {
    let found: ReturnType<typeof parseGeocode> = null;
    let reached = false;
    for (const url of geocodeUrls(where.place)) {
      try {
        found = parseGeocode(await browserFetch(url, { headers: { Accept: "application/json" } }, 8000), where.place);
        reached = true;
        if (found) break;
      } catch (err) {
        attempts.push({ service: host(url), reason: failureReason(err) });
      }
    }
    if (!found && reached) throw new SearchError(`We couldn't find "${where.place}". Try a city and state, or a ZIP code.`);
    if (!found) return viaServer({ place: where.place }, miles, attempts);
    ({ lat, lon, label } = found);
  } else {
    ({ lat, lon } = where);
  }

  try {
    return { churches: await churchesAt(lat, lon, miles, attempts), label };
  } catch {
    return { ...(await viaServer({ lat: lat.toFixed(4), lon: lon.toFixed(4) }, miles, attempts)), label };
  }
}

async function viaServer(params: Record<string, string>, miles: number, attempts: Attempt[]): Promise<{ churches: Church[]; label: string }> {
  let body: { churches?: Church[]; label?: string; error?: string; details?: Attempt[] } = {};
  let ok = false;
  try {
    const res = await fetch(`/api/faith/churches?${new URLSearchParams({ ...params, miles: String(miles) })}`);
    ok = res.ok;
    body = await res.json().catch(() => ({}));
    if (!ok) attempts.push({ service: "growdaily.ai", reason: `HTTP ${res.status}` });
  } catch (err) {
    attempts.push({ service: "growdaily.ai", reason: failureReason(err) });
  }
  if (!ok || !body.churches) {
    const server = (body.details ?? []).map((d) => ({ service: `server → ${d.service}`, reason: d.reason }));
    throw new SearchError(body.error ?? "The church map isn't answering right now. Please try again in a minute.", [...attempts, ...server]);
  }
  return { churches: body.churches, label: body.label || ("place" in params ? params.place : "you") };
}
