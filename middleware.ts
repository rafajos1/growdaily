import { NextResponse, type NextRequest } from "next/server";

/**
 * Locks the private audit workspace to one person. The username and password
 * live only in the AUDIT_USERNAME and AUDIT_PASSWORD environment variables
 * (set in Vercel). If either is missing, the workspace doesn't exist at all.
 */
export function middleware(req: NextRequest) {
  const user = process.env.AUDIT_USERNAME;
  const pass = process.env.AUDIT_PASSWORD;
  if (!user || !pass) return new NextResponse("Not found", { status: 404 });

  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {}
    const i = decoded.indexOf(":");
    if (i > 0 && same(decoded.slice(0, i), user) && same(decoded.slice(i + 1), pass)) {
      const res = NextResponse.next();
      res.headers.set("Cache-Control", "private, no-store");
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
  }
  return new NextResponse("Sign in required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Governwise Audit", charset="UTF-8"', "Cache-Control": "no-store" } });
}

/** Compares in constant time, so response timing doesn't leak how much of a guess was right. */
function same(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export const config = { matcher: ["/audit", "/audit/:path*"] };
