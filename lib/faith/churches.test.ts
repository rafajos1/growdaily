import { describe, expect, it } from "vitest";
import { appleDirectionsUrl, boundingBox, denominationLabel, directionsUrl, isProtestantOrCatholic, milesBetween, normalizeChurches, normalizePlaces, overpassQuery, parseGeocode, placeSearchUrls } from "./churches";

// Around downtown Nashville.
const LAT = 36.1627;
const LON = -86.7816;

describe("denominationLabel", () => {
  it("maps common tags to familiar names", () => {
    expect(denominationLabel("roman_catholic")).toBe("Catholic");
    expect(denominationLabel("Southern Baptist")).toBe("Baptist");
    expect(denominationLabel("nondenominational")).toBe("Non-denominational");
    expect(denominationLabel("anglican")).toBe("Anglican / Episcopal");
  });
  it("tidies unknown tags and handles missing ones", () => {
    expect(denominationLabel("moravian")).toBe("Moravian");
    expect(denominationLabel(undefined)).toBe("");
  });
});

describe("overpassQuery", () => {
  it("asks for Christian places of worship around the point, with centers for buildings", () => {
    const f = '["amenity"="place_of_worship"]["religion"="christian"](around:16093,36.16270,-86.78160)';
    expect(overpassQuery(LAT, LON, 16093.4)).toBe(`[out:json][timeout:20];(node${f};way${f};relation${f};);out tags center 200;`);
  });
});

describe("milesBetween", () => {
  it("measures straight-line distance", () => {
    // Nashville to Memphis is about 197 miles as the crow flies.
    expect(milesBetween(LAT, LON, 35.1495, -90.049)).toBeGreaterThan(190);
    expect(milesBetween(LAT, LON, 35.1495, -90.049)).toBeLessThan(205);
    expect(milesBetween(LAT, LON, LAT, LON)).toBe(0);
  });
});

describe("normalizeChurches", () => {
  const json = {
    elements: [
      { type: "way", id: 2, center: { lat: 36.17, lon: -86.78 }, tags: { name: "Grace Fellowship", denomination: "nondenominational", website: "gracefellowship.example", "addr:housenumber": "12", "addr:street": "Main St", "addr:city": "Nashville" } },
      { type: "node", id: 1, lat: 36.163, lon: -86.7817, tags: { name: "St. Mary's", denomination: "roman_catholic" } },
      { type: "node", id: 3, lat: 36.17, lon: -86.78, tags: { name: "Grace Fellowship" } }, // same place mapped twice
      { type: "node", id: 4, lat: 36.2, lon: -86.7, tags: {} }, // no name
      { type: "node", id: 5, lat: 37.5, lon: -86.7, tags: { name: "Too far" } },
      { type: "node", id: 6, lat: 36.164, lon: -86.782, tags: { name: "Bad link", website: "javascript:alert(1)" } },
    ],
  };
  const list = normalizeChurches(json, LAT, LON, 10);

  it("keeps named churches within range, nearest first, once each", () => {
    expect(list.map((c) => c.name)).toEqual(["St. Mary's", "Bad link", "Grace Fellowship"]);
    expect(list[0].miles).toBeLessThan(0.1);
  });

  it("uses building centers, friendly labels, addresses and safe website links", () => {
    const grace = list.find((c) => c.name === "Grace Fellowship")!;
    expect(grace).toMatchObject({ denomination: "Non-denominational", address: "12 Main St, Nashville", website: "https://gracefellowship.example/" });
    expect(list.find((c) => c.name === "Bad link")!.website).toBe("");
  });

  it("copes with empty or broken responses", () => {
    expect(normalizeChurches(null, LAT, LON, 10)).toEqual([]);
    expect(normalizeChurches({ elements: "nope" }, LAT, LON, 10)).toEqual([]);
  });

  it("links to directions", () => {
    expect(directionsUrl({ lat: 36.17, lon: -86.78 })).toBe("https://www.google.com/maps/dir/?api=1&destination=36.170000,-86.780000");
    expect(appleDirectionsUrl({ lat: 36.17, lon: -86.78 })).toBe("https://maps.apple.com/?daddr=36.170000,-86.780000");
  });
});

describe("parseGeocode", () => {
  it("reads Photon results", () => {
    const photon = { features: [{ geometry: { coordinates: [-86.7816, 36.1627] }, properties: { name: "Nashville", state: "Tennessee" } }] };
    expect(parseGeocode(photon, "nashville")).toEqual({ lat: 36.1627, lon: -86.7816, label: "Nashville, Tennessee" });
  });
  it("reads Nominatim results", () => {
    expect(parseGeocode([{ lat: "36.1627", lon: "-86.7816", display_name: "Nashville, Davidson County, Tennessee" }], "x")).toEqual({ lat: 36.1627, lon: -86.7816, label: "Nashville, Davidson County" });
  });
  it("returns null when nothing matched", () => {
    expect(parseGeocode({ features: [] }, "x")).toBeNull();
    expect(parseGeocode([], "x")).toBeNull();
    expect(parseGeocode(null, "x")).toBeNull();
  });
});

describe("boundingBox and placeSearchUrls", () => {
  it("draws a box about the right size", () => {
    const [w, s, e, n] = boundingBox(LAT, LON, 10);
    expect(n - s).toBeCloseTo(20 / 69, 2);
    expect(e - w).toBeGreaterThan(n - s);
  });
  it("asks Photon and Nominatim for churches inside the box", () => {
    const [photon, nominatim] = placeSearchUrls(LAT, LON, 10);
    expect(photon).toContain("photon.komoot.io");
    expect(photon).toContain("osm_tag=amenity%3Aplace_of_worship");
    expect(nominatim).toContain("bounded=1");
    expect(nominatim).toContain("extratags=1");
  });
});

describe("normalizePlaces", () => {
  it("reads Photon results and skips non-churches", () => {
    const json = {
      features: [
        { geometry: { coordinates: [-86.781, 36.163] }, properties: { name: "First Baptist Church", osm_type: "W", osm_id: "9", osm_value: "place_of_worship", street: "Main St", housenumber: "1", city: "Nashville" } },
        { geometry: { coordinates: [-86.782, 36.164] }, properties: { name: "Islamic Center", osm_value: "place_of_worship" } },
        { geometry: { coordinates: [-86.782, 36.164] }, properties: { name: "Church Street Cafe", osm_value: "cafe" } },
      ],
    };
    const list = normalizePlaces(json, LAT, LON, 10);
    expect(list.map((c) => c.name)).toEqual(["First Baptist Church"]);
    expect(list[0]).toMatchObject({ id: "way/9", address: "1 Main St, Nashville" });
  });
  it("reads Nominatim results with religion and denomination", () => {
    const json = [
      { lat: "36.170", lon: "-86.780", name: "St. Mary's", category: "amenity", type: "place_of_worship", osm_type: "node", osm_id: 5, extratags: { religion: "christian", denomination: "roman_catholic", website: "stmarys.example" }, address: { road: "Fifth Ave", city: "Nashville" } },
      { lat: "36.171", lon: "-86.781", name: "Temple Beth", category: "amenity", type: "place_of_worship", extratags: { religion: "jewish" } },
      { lat: "36.172", lon: "-86.782", name: "Church Hill Park", category: "leisure", type: "park" },
    ];
    const list = normalizePlaces(json, LAT, LON, 10);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: "St. Mary's", denomination: "Catholic", website: "https://stmarys.example/", address: "Fifth Ave, Nashville" });
  });
});

describe("isProtestantOrCatholic", () => {
  it("keeps Protestant, Catholic and unlabeled churches", () => {
    expect(isProtestantOrCatholic("St. Mary's", "roman_catholic")).toBe(true);
    expect(isProtestantOrCatholic("St. Elias Byzantine Catholic Church", "byzantine_catholic")).toBe(true);
    expect(isProtestantOrCatholic("First Baptist Church", "baptist")).toBe(true);
    expect(isProtestantOrCatholic("Grace Fellowship", undefined)).toBe(true);
    expect(isProtestantOrCatholic("Living Hope Orthodox Presbyterian Church", "presbyterian")).toBe(true);
    expect(isProtestantOrCatholic("Unity Baptist Church", "baptist")).toBe(true);
  });
  it("leaves out other traditions by denomination or name", () => {
    expect(isProtestantOrCatholic("Ward Meetinghouse", "mormon")).toBe(false);
    expect(isProtestantOrCatholic("The Church of Jesus Christ of Latter-day Saints", undefined)).toBe(false);
    expect(isProtestantOrCatholic("Kingdom Hall of Jehovah's Witnesses", undefined)).toBe(false);
    expect(isProtestantOrCatholic("St. Nicholas", "greek_orthodox")).toBe(false);
    expect(isProtestantOrCatholic("Holy Trinity Orthodox Church", undefined)).toBe(false);
    expect(isProtestantOrCatholic("First Church of Christ, Scientist", undefined)).toBe(false);
    expect(isProtestantOrCatholic("Unitarian Universalist Fellowship", "unitarian_universalist")).toBe(false);
  });
  it("is applied to search results", () => {
    const json = { elements: [
      { type: "node", id: 1, lat: 36.163, lon: -86.7817, tags: { name: "St. Mary's", denomination: "roman_catholic" } },
      { type: "node", id: 2, lat: 36.164, lon: -86.7817, tags: { name: "Meetinghouse", denomination: "mormon" } },
      { type: "node", id: 3, lat: 36.165, lon: -86.7817, tags: { name: "Kingdom Hall of Jehovah's Witnesses" } },
    ] };
    expect(normalizeChurches(json, LAT, LON, 10).map((c) => c.name)).toEqual(["St. Mary's"]);
  });
});
