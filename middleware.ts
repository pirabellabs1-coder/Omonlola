import { NextRequest, NextResponse } from "next/server";

const COOKIE = "omonlola_session";

const PUBLIC_API_EXACT = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me"
]);

// Endpoints that are public ONLY for specific methods
const PUBLIC_API_METHODS: Record<string, Set<string>> = {
  "/api/contact": new Set(["POST"]),
  "/api/lead-magnet": new Set(["POST"]),
  "/api/track": new Set(["POST"]),
  "/api/guide": new Set(["GET"])
};

const PUBLIC_API_PREFIX = ["/api/reviews/by-token/"];

function isPublicApi(pathname: string, method: string): boolean {
  if (PUBLIC_API_EXACT.has(pathname)) return true;
  if (PUBLIC_API_METHODS[pathname]?.has(method)) return true;
  if (PUBLIC_API_PREFIX.some((p) => pathname.startsWith(p))) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Block any access to legacy /admin (and subpaths) — return a 404
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL("/_not-found", req.url), { status: 404 });
  }

  // 2. Validate the secret slug for /manage/[token]
  if (pathname === "/manage" || pathname.startsWith("/manage/")) {
    const expected = process.env.ADMIN_PATH ?? "";
    const parts = pathname.split("/").filter(Boolean); // ["manage", "<token>", ...]
    const token = parts[1] ?? "";
    if (!expected || token !== expected) {
      return NextResponse.rewrite(new URL("/_not-found", req.url), { status: 404 });
    }
  }

  // 3. Protect admin API endpoints with cookie presence (route handler does full validation)
  if (pathname.startsWith("/api/") && !isPublicApi(pathname, req.method)) {
    const cookie = req.cookies.get(COOKIE);
    if (!cookie?.value) {
      return new NextResponse(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/manage", "/manage/:path*", "/api/:path*"]
};
