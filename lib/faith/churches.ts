/**
 * Finding churches near someone with OpenStreetMap data: places of worship
 * tagged as Christian, via the Overpass API. Free, no key, and community
 * maintained, so listings can be incomplete; the page says so.
 */

export interface Church {
  id: string;
  name: string;
  /** Friendly denomination label, or "" when OpenStreetMap doesn't say. */
  denomination: string;
  lat: number;
  lon: number;
  /** Straight-line distance in miles. */
  miles: number;
  address: string;
  website: string;
}

export const RADII_MILES = [5, 10, 25] as const;
export const MAX_RESULTS = 40;

const LABELS: Record<string, string> = {
  catholic: "Catholic",
  roman_catholic: "Catholic",
  baptist: "Baptist",
  southern_baptist: "Baptist",
  methodist: "Methodist",
  united_methodist: "Methodist",
  lutheran: "Lutheran",
  anglican: "Anglican / Episcopal",
  episcopal: "Anglican / Episcopal",
  presbyterian: "Presbyterian",
  pentecostal: "Pentecostal",
  assemblies_of_god: "Pentecostal",
  evangelical: "Evangelical",
  nondenominational: "Non-denominational",
  non_denominational: "Non-denominational",
  orthodox: "Orthodox",
  greek_orthodox: "Orthodox",
  russian_orthodox: "Orthodox",
  serbian_orthodox: "Orthodox",
  coptic_orthodox: "Orthodox",
  church_of_christ: "Church of Christ",
  church_of_god: "Church of God",
  reformed: "Reformed",
  christian_reformed: "Reformed",
  adventist: "Adventist",
  seventh_day_adventist: "Adventist",
  nazarene: "Nazarene",
  mennonite: "Mennonite",
  quaker: "Quaker",
  salvation_army: "Salvation Army",
  vineyard: "Vineyard",
  congregational: "Congregational",
  united_church_of_christ: "Congregational",
  wesleyan: "Wesleyan",
  free_methodist: "Methodist",
  apostolic: "Apostolic",
};

/** Turns an OpenStreetMap denomination tag into a label people recognize. */
export function denominationLabel(tag: string | undefined): string {
  if (!tag) return "";
  const key = tag.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (LABELS[key]) return LABELS[key];
  // Unknown tags: show them tidied up rather than dropping them.
  return key.split("_").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

/** Public Overpass servers with the same OpenStreetMap data, tried in order. */
export const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

/**
 * Overpass query for Christian places of worship around a point. Written as a
 * node/way/relation union with "out tags center" so every Overpass server
 * version accepts it.
 */
export function overpassQuery(lat: number, lon: number, radiusMeters: number): string {
  const filter = `["amenity"="place_of_worship"]["religion"="christian"](around:${Math.round(radiusMeters)},${lat.toFixed(5)},${lon.toFixed(5)})`;
  return `[out:json][timeout:20];(node${filter};way${filter};relation${filter};);out tags center 200;`;
}

/** Reads a Photon (komoot) or Nominatim geocoding response into a point. */
export function parseGeocode(json: unknown, fallbackLabel: string): { lat: number; lon: number; label: string } | null {
  // Photon: GeoJSON features with [lon, lat] coordinates.
  const feature = (json as { features?: { geometry?: { coordinates?: number[] }; properties?: Record<string, string> }[] })?.features?.[0];
  if (feature?.geometry?.coordinates?.length === 2) {
    const [lon, lat] = feature.geometry.coordinates;
    const p = feature.properties ?? {};
    const label = [p.name ?? p.city, p.state].filter(Boolean).join(", ") || fallbackLabel;
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon, label } : null;
  }
  // Nominatim: an array of places with string coordinates.
  const hit = Array.isArray(json) ? (json[0] as { lat?: string; lon?: string; display_name?: string } | undefined) : undefined;
  const lat = Number(hit?.lat);
  const lon = Number(hit?.lon);
  if (!hit || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon, label: (hit.display_name ?? fallbackLabel).split(",").slice(0, 2).join(",").trim() };
}

export const geocodeUrls = (place: string) => [
  `https://photon.komoot.io/api/?${new URLSearchParams({ q: place, limit: "1" })}`,
  `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ q: place, format: "jsonv2", limit: "1" })}`,
];

export function milesBetween(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

interface OverpassElement {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
}

function safeWebsite(raw: string | undefined): string {
  if (!raw) return "";
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/** Overpass JSON → named churches, nearest first, without duplicates. */
export function normalizeChurches(json: unknown, originLat: number, originLon: number, radiusMiles: number): Church[] {
  const elements = ((json ?? {}) as { elements?: unknown }).elements;
  if (!Array.isArray(elements)) return [];
  const seen = new Set<string>();
  const out: Church[] = [];
  for (const el of elements as OverpassElement[]) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    const tags = el.tags ?? {};
    const name = (tags.name ?? "").trim().slice(0, 120);
    if (typeof lat !== "number" || typeof lon !== "number" || !name) continue;
    const miles = milesBetween(originLat, originLon, lat, lon);
    if (miles > radiusMiles * 1.05) continue;
    // The same church is sometimes mapped twice (a building and a point).
    const key = `${name.toLowerCase()}|${lat.toFixed(3)}|${lon.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
    out.push({
      id: `${el.type ?? "node"}/${el.id ?? key}`,
      name,
      denomination: denominationLabel(tags.denomination),
      lat,
      lon,
      miles: Math.round(miles * 10) / 10,
      address: [street, tags["addr:city"]].filter(Boolean).join(", ").slice(0, 160),
      website: safeWebsite(tags.website ?? tags["contact:website"] ?? tags.url),
    });
  }
  return out.sort((a, b) => a.miles - b.miles).slice(0, MAX_RESULTS);
}

/** Directions from wherever the person is, in their maps app. */
export function directionsUrl(c: Pick<Church, "lat" | "lon">): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${c.lat.toFixed(6)},${c.lon.toFixed(6)}`;
}
