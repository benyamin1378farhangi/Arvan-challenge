import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/http";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import { pickPublicUser } from "@/lib/auth/pickPublicUser";

// Figma labels this field "Email", but DummyJSON authenticates by
// `username` (its test account is "emilys", not an email address). The
// client keeps the "Email" label and sends whatever the user typed as
// `username` here — this is the integration boundary with a mock API that
// doesn't match the design's field name, not a bug.
export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.username || !body?.password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    });

    const response = NextResponse.json({ user: pickPublicUser(data) });

    // The accessToken never reaches the client as JSON — only as an
    // HttpOnly cookie on our own domain. DummyJSON's own Set-Cookie (if
    // any) is scoped to dummyjson.com and irrelevant to us; this is a
    // cookie we set ourselves from the token in the response body.
    response.cookies.set(SESSION_COOKIE_NAME, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // DummyJSON returns 400 for both a wrong password and an unknown
      // username, with the same "Invalid credentials" message — we pass
      // that through as-is rather than inventing a more specific one.
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
