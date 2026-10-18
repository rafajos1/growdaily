import { describe, expect, it } from "vitest";
import { churchesAt, failureReason, firstSuccess, type Attempt } from "./churchSearch";

const LAT = 36.1627;
const LON = -86.7816;
const overpass = { elements: [{ type: "node", id: 1, lat: 36.163, lon: -86.7817, tags: { name: "St. Mary's" } }] };
const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });

describe("firstSuccess", () => {
  it("returns the first task that succeeds, starting the next when one fails", async () => {
    const order: string[] = [];
    const value = await firstSuccess(
      [
        async () => {
          order.push("a");
          throw new Error("down");
        },
        async () => {
          order.push("b");
          return "b";
        },
      ],
      10_000,
    );
    expect(value).toBe("b");
    expect(order).toEqual(["a", "b"]);
  });
  it("starts the next task when the first is slow", async () => {
    const value = await firstSuccess([() => new Promise<string>((r) => setTimeout(() => r("slow"), 500)), async () => "fast"], 20);
    expect(value).toBe("fast");
  });
  it("rejects when every task fails", async () => {
    await expect(firstSuccess([async () => Promise.reject(new Error("x"))], 10)).rejects.toThrow();
  });
});

describe("churchesAt", () => {
  it("uses Overpass when it answers", async () => {
    const attempts: Attempt[] = [];
    const list = await churchesAt(LAT, LON, 10, attempts, { servers: ["https://a.example/api"], getJson: async () => overpass });
    expect(list.map((c) => c.name)).toEqual(["St. Mary's"]);
    expect(attempts).toEqual([]);
  });

  it("falls back to place searches when every Overpass server fails, and records why", async () => {
    const attempts: Attempt[] = [];
    const getJson = async (url: string) => {
      if (url.includes("example")) throw httpError(504);
      if (url.includes("photon")) return { features: [{ geometry: { coordinates: [-86.781, 36.163] }, properties: { name: "Grace Church", osm_value: "place_of_worship" } }] };
      throw httpError(429);
    };
    const list = await churchesAt(LAT, LON, 10, attempts, { servers: ["https://a.example/api", "https://b.example/api"], getJson, staggerMs: 1 });
    expect(list.map((c) => c.name)).toEqual(["Grace Church"]);
    expect(attempts).toEqual([
      { service: "a.example", reason: "HTTP 504" },
      { service: "b.example", reason: "HTTP 504" },
      { service: "nominatim.openstreetmap.org", reason: "HTTP 429" },
    ]);
  });

  it("explains the failure when nothing answers", async () => {
    const attempts: Attempt[] = [];
    await expect(churchesAt(LAT, LON, 10, attempts, { servers: ["https://a.example/api"], getJson: async () => Promise.reject(new TypeError("Load failed")), staggerMs: 1 })).rejects.toThrow("isn't answering");
    expect(attempts.map((a) => a.reason)).toEqual(["blocked or offline", "blocked or offline", "blocked or offline"]);
  });
});

describe("failureReason", () => {
  it("names timeouts and HTTP errors plainly", () => {
    expect(failureReason(Object.assign(new Error("t"), { name: "TimeoutError" }))).toBe("timed out");
    expect(failureReason(httpError(429))).toBe("HTTP 429");
  });
});
