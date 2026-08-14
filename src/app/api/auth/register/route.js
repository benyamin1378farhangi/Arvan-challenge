import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/http";
import { pickPublicUser } from "@/lib/auth/pickPublicUser";

// DummyJSON has no real registration endpoint — /users/add is documented
// as a simulated create that never persists, so a user made here can't
// subsequently log in via /auth/login. This still goes through a real,
// documented DummyJSON call (not a fabricated one); the client is
// responsible for not treating the result as a usable account.
export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.username || !body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Username, email and password are required" },
      { status: 400 },
    );
  }

  try {
    const created = await apiFetch("/users/add", {
      method: "POST",
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        password: body.password,
      }),
    });

    // DummyJSON echoes the submitted password back in the response —
    // strip it (and everything else we don't need) before this reaches
    // the client.
    return NextResponse.json({ user: pickPublicUser(created) }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: "Something went wrong. Please try again." },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
