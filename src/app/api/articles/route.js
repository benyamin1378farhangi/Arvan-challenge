import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/http";
import { fetchArticlesPage } from "@/lib/api/articles.server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// proxy.js already guards the /articles page route itself, but that's a
// page-navigation guard, not an API guard — this checks the session
// cookie again here so the endpoint isn't reachable unauthenticated just
// because it wasn't visited through the page.
export async function GET(request) {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE_NAME)?.value) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;

  try {
    const data = await fetchArticlesPage(page);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: "Failed to load articles" },
        { status: error.status || 502 },
      );
    }
    return NextResponse.json({ message: "Failed to load articles" }, { status: 502 });
  }
}
