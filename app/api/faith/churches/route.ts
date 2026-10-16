import { NextResponse } from "next/server";
import { normalizeChurches, overpassQuery, RADII_MILES, type Church } from "../../../../lib/faith/churches";
import { allowDaily, clientIp } from "../../../../lib/rateLimit";

// OpenStreetMap's public services. Overridable for testing.
const OVERPASS_URL = process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";
const NOMINATIM_URL = process.env.NOMINATIM_URL ?? "https://nominatim.openstreetmap.org/search";
// Both services ask apps to identify themselves.
const USER_AGENT = "GrowDaily/1.0 (+https://www.growdaily.ai/faith/church)";

const cache = new Map<string, { at: number; churches: Church[] }>();
const HOUR = 60 * 60 * 1000;

async function geocode(place: string): Promise<{ lat: number; lon: number; label: string } | null> {
  const url = `${NOMINATIM_URL}?${new URLSearchParams({ q: place, format: "jsonv2", limit: "1" })}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" }, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`geocoder ${res.status}`);
  const [hit] = (await res.json()) as { lat?: string; lon?: string; display_name?: string }[];
  const lat = Number(hit?.lat);
  const lon = Number(hit?.lon);
  if (!hit || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon, label: (hit.display_name ?? place).split(",").slice(0, 2).join(",").trim() };
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

  try {
    if (place) {
      const hit = await geocode(place);
      if (!hit) return NextResponse.json({ error: `We couldn't find "${place}". Try a city and state, or a ZIP code.` }, { status: 404 });
      ({ lat, lon, label } = hit);
    } else if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return NextResponse.json({ error: "Share your location or type a city or ZIP code." }, { status: 400 });
    }

    // Nearby searches share results; the location itself is never stored.
    const key = `${lat.toFixed(2)},${lon.toFixed(2)},${radius}`;
    const hit = cache.get(key);
    let churches: Church[];
    if (hit && Date.now() - hit.at < HOUR) {
      churches = hit.churches;
    } else {
      const res = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: overpassQuery(lat, lon, radius * 1609.34) }),
        signal: AbortSignal.timeout(25_000),
      });
      if (!res.ok) throw new Error(`overpass ${res.status}`);
      churches = normalizeChurches(await res.json(), lat, lon, radius);
      if (cache.size > 500) cache.clear();
      cache.set(key, { at: Date.now(), churches });
    }
    return NextResponse.json({ churches, label, miles: radius });
  } catch (err) {
    console.error("Church search failed", err);
    return NextResponse.json({ error: "The church map isn't answering right now. Please try again in a minute." }, { status: 502 });
  }
}
