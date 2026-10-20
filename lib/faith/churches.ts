/**
 * Finding churches near someone with OpenStreetMap data: Protestant and
 * Catholic places of worship, via the Overpass API. Free, no key, and community
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

// We list Protestant and Catholic churches only. These denomination tags (and
// names, for listings without one) mark other traditions. Listings with no
// denomination stay, since most churches don't record one.
const OTHER_TRADITION_TAG = /orthodox|armenian|coptic|ethiopian|mormon|latter|lds|jehovah|christian_science|scientist|unitarian|universalist|iglesia_ni_cristo|christadelphian|swedenborg|new_apostolic|spiritualist|^unity$/;
const OTHER_TRADITION_NAME = /latter[- ]day saints|\blds\b|kingdom hall|jehovah|christian science|church of christ,? scientist|unitarian|universalist|iglesia ni cristo|christadelphian|swedenborg|new apostolic/i;

/** True for Protestant and Catholic churches, and for listings that don't say. */
export function isProtestantOrCatholic(name: string, denominationTag: string | undefined): boolean {
  const key = (denominationTag ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (key && OTHER_TRADITION_TAG.test(key)) return false;
  if (OTHER_TRADITION_NAME.test(name)) return false;
  // "Orthodox Presbyterian" is Protestant; other Orthodox churches aren't.
  return !(/\borthodox\b/i.test(name) && !/presbyterian/i.test(name));
}

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
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
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

/** A box around a point, [west, south, east, north], roughly `miles` in each direction. */
export function boundingBox(lat: number, lon: number, miles: number): [number, number, number, number] {
  const dLat = miles / 69;
  const dLon = miles / (69 * Math.max(Math.cos((lat * Math.PI) / 180), 0.01));
  const r = (n: number) => Math.round(n * 1e5) / 1e5;
  return [r(lon - dLon), r(lat - dLat), r(lon + dLon), r(lat + dLat)];
}

/**
 * Place-search services used when every Overpass server is down: Photon and
 * Nominatim, asked for churches inside the search box. They return fewer
 * churches than Overpass, but they're separate systems that are rarely down together.
 */
export function placeSearchUrls(lat: number, lon: number, miles: number): string[] {
  const [w, s, e, n] = boundingBox(lat, lon, miles);
  return [
    `https://photon.komoot.io/api/?${new URLSearchParams({ q: "church", lat: String(lat), lon: String(lon), limit: "50", osm_tag: "amenity:place_of_worship", bbox: `${w},${s},${e},${n}` })}`,
    `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ q: "church", format: "jsonv2", limit: "50", bounded: "1", viewbox: `${w},${n},${e},${s}`, extratags: "1", addressdetails: "1" })}`,
  ];
}

// Places of worship that aren't churches, for results that don't say their religion.
const NOT_CHURCH = /\b(mosque|masjid|islamic|synagogue|temple|mandir|gurdwara|jewish|buddhist|hindu|sikh|jain|baha'?i)\b/i;

/** Photon or Nominatim results → churches, in the same shape as Overpass gives. */
export function normalizePlaces(json: unknown, originLat: number, originLon: number, radiusMiles: number): Church[] {
  const elements: OverpassElement[] = [];
  const photon = (json as { features?: unknown })?.features;
  if (Array.isArray(photon)) {
    for (const f of photon as { geometry?: { coordinates?: number[] }; properties?: Record<string, string> }[]) {
      const p = f.properties ?? {};
      const [lon, lat] = f.geometry?.coordinates ?? [];
      if (p.osm_value && p.osm_value !== "place_of_worship") continue;
      elements.push({
        type: { N: "node", W: "way", R: "relation" }[p.osm_type] ?? "node",
        id: Number(p.osm_id),
        lat,
        lon,
        tags: { name: p.name ?? "", "addr:housenumber": p.housenumber ?? "", "addr:street": p.street ?? "", "addr:city": p.city ?? "" },
      });
    }
  } else if (Array.isArray(json)) {
    for (const r of json as { lat?: string; lon?: string; name?: string; category?: string; type?: string; osm_type?: string; osm_id?: number; extratags?: Record<string, string> | null; address?: Record<string, string> }[]) {
      const extra = r.extratags ?? {};
      const isChurch = (r.category === "amenity" && r.type === "place_of_worship") || (r.category === "building" && (r.type === "church" || r.type === "chapel" || r.type === "cathedral"));
      if (!isChurch || (extra.religion && extra.religion !== "christian")) continue;
      const a = r.address ?? {};
      elements.push({
        type: r.osm_type,
        id: r.osm_id,
        lat: Number(r.lat),
        lon: Number(r.lon),
        tags: {
          name: r.name ?? "",
          denomination: extra.denomination ?? "",
          website: extra.website ?? extra["contact:website"] ?? "",
          "addr:housenumber": a.house_number ?? "",
          "addr:street": a.road ?? "",
          "addr:city": a.city ?? a.town ?? a.village ?? "",
        },
      });
    }
  }
  return normalizeChurches({ elements: elements.filter((e) => !NOT_CHURCH.test(e.tags?.name ?? "")) }, originLat, originLon, radiusMiles);
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
    if (!isProtestantOrCatholic(name, tags.denomination)) continue;
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

/** Directions from wherever the person is, in Google Maps. */
export function directionsUrl(c: Pick<Church, "lat" | "lon">): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${c.lat.toFixed(6)},${c.lon.toFixed(6)}`;
}

/** Directions from wherever the person is, in Apple Maps (opens the app on Apple devices). */
export function appleDirectionsUrl(c: Pick<Church, "lat" | "lon">): string {
  return `https://maps.apple.com/?daddr=${c.lat.toFixed(6)},${c.lon.toFixed(6)}`;
}
