import { geocodeUrls, normalizeChurches, OVERPASS_SERVERS, overpassQuery, parseGeocode, type Church } from "./churches";

export class SearchError extends Error {}

async function fetchJson(url: string, init: RequestInit, ms: number): Promise<unknown> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

/**
 * Searches from the visitor's own browser, so OpenStreetMap's free servers
 * see each visitor separately rather than one busy cloud server. Tries each
 * server in turn, then GrowDaily's own /api/faith/churches as a last resort.
 */
export async function searchChurches(where: { place: string } | { lat: number; lon: number }, miles: number): Promise<{ churches: Church[]; label: string }> {
  let lat: number;
  let lon: number;
  let label = "you";

  if ("place" in where) {
    let found: ReturnType<typeof parseGeocode> = null;
    let reached = false;
    for (const url of geocodeUrls(where.place)) {
      try {
        found = parseGeocode(await fetchJson(url, { headers: { Accept: "application/json" } }, 8000), where.place);
        reached = true;
        if (found) break;
      } catch {
        /* try the next geocoder */
      }
    }
    if (!found && reached) throw new SearchError(`We couldn't find "${where.place}". Try a city and state, or a ZIP code.`);
    if (!found) return viaServer({ place: where.place }, miles);
    ({ lat, lon, label } = found);
  } else {
    ({ lat, lon } = where);
  }

  const body = new URLSearchParams({ data: overpassQuery(lat, lon, miles * 1609.34) });
  for (const server of OVERPASS_SERVERS) {
    try {
      const json = await fetchJson(server, { method: "POST", body }, 20_000);
      return { churches: normalizeChurches(json, lat, lon, miles), label };
    } catch {
      /* try the next server */
    }
  }
  return { ...(await viaServer({ lat: lat.toFixed(4), lon: lon.toFixed(4) }, miles)), label };
}

async function viaServer(params: Record<string, string>, miles: number): Promise<{ churches: Church[]; label: string }> {
  const res = await fetch(`/api/faith/churches?${new URLSearchParams({ ...params, miles: String(miles) })}`);
  const body = (await res.json().catch(() => ({}))) as { churches?: Church[]; label?: string; error?: string };
  if (!res.ok || !body.churches) throw new SearchError(body.error ?? "The church map isn't answering right now. Please try again in a minute.");
  return { churches: body.churches, label: body.label || ("place" in params ? params.place : "you") };
}
