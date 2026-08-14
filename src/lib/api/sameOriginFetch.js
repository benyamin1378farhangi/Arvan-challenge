// Shared by every lib/api/*.js client module that calls our own Next.js
// Route Handlers (same-origin, relative paths) — as opposed to
// lib/api/http.js's apiFetch, which is the server-side DummyJSON client
// used inside those Route Handlers. Extracted once two call sites
// (auth.js, posts.js) needed the exact same response/error handling.
export async function sameOriginFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return payload;
}
