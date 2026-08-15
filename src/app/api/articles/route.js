import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api/http";
import { fetchArticlesPage } from "@/lib/api/articles.server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

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

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.body) {
    return NextResponse.json(
      { message: "Title and body are required" },
      { status: 400 },
    );
  }

  try {
    const me = await apiFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const created = await apiFetch("/posts/add", {
      method: "POST",
      body: JSON.stringify({
        title: body.title,
        body: body.body,
        tags: Array.isArray(body.tags) ? body.tags : [],
        userId: me.id,
      }),
    });

    return NextResponse.json(
      {
        post: {
          id: created.id,
          title: created.title,
          body: created.body,
          tags: created.tags,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: "Failed to create article" },
        { status: error.status || 502 },
      );
    }
    return NextResponse.json({ message: "Failed to create article" }, { status: 502 });
  }
}
