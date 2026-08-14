import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

const PROTECTED_PREFIX = "/articles";
const AUTH_PAGES = ["/login", "/register"];

// Presence-check only — whether the cookie exists, not whether the token
// inside it is still valid. Verifying the token would mean either calling
// DummyJSON from every matched request (real latency, on the Edge
// runtime) or decoding the JWT here, which duplicates validation that
// already happens in /api/auth/me. An expired/invalid token is instead
// caught there, on first use, and handled with a 401 + redirect.
export function proxy(request) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(PROTECTED_PREFIX) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_PAGES.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/articles", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/articles/:path*", "/login", "/register"],
};
