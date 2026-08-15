import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api/http";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { pickPublicUser } from "@/lib/auth/pickPublicUser";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await apiFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json({ user: pickPublicUser(user) });
  } catch {
    const response = NextResponse.json(
      { message: "Session expired" },
      { status: 401 },
    );
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}
