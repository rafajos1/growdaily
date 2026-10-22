import { cleanPlan } from "./template";
import { EMPTY, type Inputs, type Pilot, type PilotData } from "./types";

export const STORAGE_KEY = "pilotwise:v1";

function parseInputs(v: unknown): Inputs {
  const i = (v ?? {}) as Partial<Inputs>;
  const s = (x: unknown, max: number) => (typeof x === "string" ? x.slice(0, max) : "");
  return { useCase: s(i.useCase, 1500), orgSize: s(i.orgSize, 40), industry: s(i.industry, 80), builder: s(i.builder, 60), data: s(i.data, 800), weeks: typeof i.weeks === "number" && i.weeks >= 4 && i.weeks <= 26 ? Math.round(i.weeks) : 12 };
}

/** Parses stored data, dropping anything malformed instead of failing the whole load. */
export function parseData(raw: string | null): PilotData {
  if (!raw) return { ...EMPTY };
  const p = JSON.parse(raw) as Partial<PilotData> | null;
  const pilots: Pilot[] = [];
  let n = 0;
  for (const x of Array.isArray(p?.pilots) ? p.pilots : []) {
    if (!x || typeof x.id !== "string" || !x.plan || typeof x.plan !== "object") continue;
    const inputs = parseInputs(x.inputs);
    pilots.push({
      id: x.id,
      createdAt: String(x.createdAt ?? ""),
      updatedAt: String(x.updatedAt ?? ""),
      source: x.source === "ai" ? "ai" : "template",
      inputs,
      plan: cleanPlan(x.plan, inputs, () => `p${Date.now().toString(36)}${n++}`, false),
    });
  }
  return { pilots: pilots.slice(0, 30) };
}

export function loadData(): PilotData {
  return parseData(window.localStorage.getItem(STORAGE_KEY));
}

export function saveData(data: PilotData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
}
