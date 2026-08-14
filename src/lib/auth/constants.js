// Shared by the Route Handlers (set/read/clear the cookie) and by
// middleware.js (presence-check only). Kept as a plain string in its own
// file with no Node-specific imports so it's safe to import from
// middleware, which runs on the Edge runtime.
export const SESSION_COOKIE_NAME = "session_token";

// Matches DummyJSON's default accessToken expiry (expiresInMins: 60) — the
// cookie shouldn't outlive the token it stores.
export const SESSION_MAX_AGE_SECONDS = 60 * 60;
