// Talks to our own /api/auth/* Route Handlers (same-origin, relative
// paths) — never to DummyJSON directly from the client. This is a
// separate, small helper rather than reusing apiFetch from http.js,
// because apiFetch is specifically the DummyJSON client (it prefixes
// NEXT_PUBLIC_API_BASE_URL); these calls are same-origin.
async function parseResponse(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function login({ username, password }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseResponse(response);
}

export async function logout() {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  return parseResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me");
  return parseResponse(response);
}

export async function registerUser({ username, email, password }) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return parseResponse(response);
}
