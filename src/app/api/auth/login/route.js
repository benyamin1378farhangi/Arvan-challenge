import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/http";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  resolveDummyJsonCredentials,
} from "@/lib/auth/constants";
import { pickPublicUser } from "@/lib/auth/pickPublicUser";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.username || !body?.password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    const credentials = resolveDummyJsonCredentials(body.username, body.password);
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const response = NextResponse.json({ user: pickPublicUser(data) });

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
