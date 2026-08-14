import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api/http";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// Unlike POST /api/articles, this doesn't need to call /auth/me first —
// DummyJSON's PUT /posts/:id already knows the record's original userId
// and preserves it (verified directly), so there's nothing to derive
// server-side beyond confirming our own session cookie is present.
export async function PUT(request, { params }) {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE_NAME)?.value) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.body) {
    return NextResponse.json(
      { message: "Title and body are required" },
      { status: 400 },
    );
  }

  try {
    const updated = await apiFetch(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: body.title,
        body: body.body,
        tags: Array.isArray(body.tags) ? body.tags : [],
      }),
    });

    return NextResponse.json({
      post: {
        id: updated.id,
        title: updated.title,
        body: updated.body,
        tags: updated.tags,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.status === 404 ? "Article not found" : "Failed to update article" },
        { status: error.status || 502 },
      );
    }
    return NextResponse.json({ message: "Failed to update article" }, { status: 502 });
  }
}
