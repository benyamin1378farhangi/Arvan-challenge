import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api/http";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// DummyJSON's /posts/tags isn't sorted — Figma's tips note for the Tags
// panel says the list should be "sorted alphabetically", so that's done
// here rather than on every client render.
export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE_NAME)?.value) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const tags = await apiFetch("/posts/tags");
    const sorted = [...tags].sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(sorted);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: "Failed to load tags" },
        { status: error.status || 502 },
      );
    }
    return NextResponse.json({ message: "Failed to load tags" }, { status: 502 });
  }
}
