import { describe, expect, it } from "vitest";
import { denominationLabel, directionsUrl, milesBetween, normalizeChurches, overpassQuery } from "./churches";

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
    expect(overpassQuery(LAT, LON, 16093.4)).toBe(
      '[out:json][timeout:20];nwr["amenity"="place_of_worship"]["religion"="christian"](around:16093,36.16270,-86.78160);out center tags 200;',
    );
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
  });
});
