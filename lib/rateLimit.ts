/**
 * Best-effort daily limit per visitor for the free AI features. It lives in
 * server memory, so it resets when an instance restarts; it stops casual
 * abuse, not a determined attacker.
 */
const buckets = new Map<string, { day: string; count: number }>();

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function allowDaily(key: string, limit: number): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const entry = buckets.get(key);
  if (!entry || entry.day !== day) {
    buckets.set(key, { day, count: 1 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
