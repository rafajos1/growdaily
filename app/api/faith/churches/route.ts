import { NextResponse } from "next/server";
import { geocodeUrls, normalizeChurches, OVERPASS_SERVERS, overpassQuery, parseGeocode, RADII_MILES, type Church } from "../../../../lib/faith/churches";
import { allowDaily, clientIp } from "../../../../lib/rateLimit";

// The page searches from the visitor's browser first; this route is the
// fallback. OVERPASS_URL / GEOCODE_URL override the public services in tests.
const OVERPASS = process.env.OVERPASS_URL ? [process.env.OVERPASS_URL] : OVERPASS_SERVERS;
const geocoders = (place: string) => (process.env.GEOCODE_URL ? [`${process.env.GEOCODE_URL}?${new URLSearchParams({ q: place })}`] : geocodeUrls(place));
// OpenStreetMap's services ask apps to identify themselves.
const HEADERS = { "User-Agent": "GrowDaily/1.0 (+https://www.growdaily.ai/faith/church)", Accept: "application/json" };

const cache = new Map<string, { at: number; churches: Church[] }>();
const HOUR = 60 * 60 * 1000;

async function getJson(url: string, init: RequestInit, ms: number): Promise<unknown> {
  const res = await fetch(url, { ...init, headers: { ...HEADERS, ...init.headers }, signal: AbortSignal.timeout(ms) });
  if (!res.ok) throw new Error(`${new URL(url).host} ${res.status}`);
  return res.json();
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const radius = RADII_MILES.find((r) => r === Number(params.get("miles"))) ?? 10;
  const place = (params.get("place") ?? "").trim().slice(0, 100);
  let lat = Number(params.get("lat"));
  let lon = Number(params.get("lon"));
  let label = "";

  if (!allowDaily(`churches:${clientIp(req)}`, 40)) {
    return NextResponse.json({ error: "That's a lot of searches for one day. Try again tomorrow." }, { status: 429 });
  }

  const failures: string[] = [];
  try {
    if (place) {
      let found: ReturnType<typeof parseGeocode> = null;
      for (const url of geocoders(place)) {
        try {
          found = parseGeocode(await getJson(url, {}, 8000), place);
          if (found) break;
        } catch (err) {
          failures.push(String(err));
        }
      }
      if (!found) {
        if (failures.length < geocoders(place).length) return NextResponse.json({ error: `We couldn't find "${place}". Try a city and state, or a ZIP code.` }, { status: 404 });
        throw new Error("no geocoder answered");
      }
      ({ lat, lon, label } = found);
    } else if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return NextResponse.json({ error: "Share your location or type a city or ZIP code." }, { status: 400 });
    }

    // Nearby searches share results; the location itself is never stored.
    const key = `${lat.toFixed(2)},${lon.toFixed(2)},${radius}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < HOUR) return NextResponse.json({ churches: hit.churches, label, miles: radius });

    const body = new URLSearchParams({ data: overpassQuery(lat, lon, radius * 1609.34) });
    for (const server of OVERPASS) {
      try {
        const churches = normalizeChurches(await getJson(server, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } }, 20_000), lat, lon, radius);
        if (cache.size > 500) cache.clear();
        cache.set(key, { at: Date.now(), churches });
        return NextResponse.json({ churches, label, miles: radius });
      } catch (err) {
        failures.push(String(err));
      }
    }
    throw new Error("no map server answered");
  } catch (err) {
    console.error("Church search failed", err, failures);
    return NextResponse.json({ error: "The church map isn't answering right now. Please try again in a minute." }, { status: 502 });
  }
}
