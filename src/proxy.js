import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

const PROTECTED_PREFIX = "/articles";
const AUTH_PAGES = ["/login", "/register"];

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
