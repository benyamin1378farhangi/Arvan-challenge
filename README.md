# Arvancloud Frontend Challenge — Blog Dashboard

Work in progress. Full documentation (architecture, design system, API
layer, known limitations) is written in Phase 12 once the app is feature
complete.

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Authentication

Demo credentials (DummyJSON's test account):

```
username: emilys
password: emilyspass
```

**Architecture.** The client never talks to DummyJSON directly for auth.
`useLogin`/`useLogout`/`useCurrentUser` (TanStack Query) call our own Route
Handlers under `app/api/auth/*`, which call DummyJSON server-side and set
an HttpOnly cookie (`session_token`) on the app's own domain. The client
only ever receives non-sensitive user fields (id, username, email, name,
image) — never the access token, and never DummyJSON's raw user object
(which includes the account's password, SSN, bank details, etc.).

**Why HttpOnly cookie, not localStorage.** A token in localStorage is
readable by any script on the page, so it's a direct target for XSS. An
HttpOnly cookie can't be read from JavaScript at all. The trade-off is more
moving parts — a Route Handler in front of every DummyJSON auth call
instead of a plain client-side `fetch` — which is why it's isolated to
`app/api/auth/*` rather than spread across components.

**Why a Route Handler (not a Server Action or direct client call).** Every
other server interaction in this app goes through a TanStack Query
mutation/query calling `lib/api`; auth follows the same shape instead of
introducing a second pattern. A Route Handler is also what makes setting an
HttpOnly cookie on our own domain possible in the first place — DummyJSON's
own `Set-Cookie` is scoped to `dummyjson.com` and never reaches us.

**Route protection.** `proxy.js` (Next's `middleware.js` convention,
renamed in this Next.js version) checks for the presence of the session
cookie only — not whether the token inside it is still valid — for
`/articles/*`, `/login` and `/register`. An expired or invalid token is
caught on first use by `/api/auth/me`, which returns 401 and clears the
cookie.

**DummyJSON limitations this app works around:**
- *Login is username-based, but Figma labels the field "Email".* The label
  stays as designed; its value is submitted to DummyJSON as `username`
  without email-format validation (DummyJSON's test account, `emilys`,
  isn't an email address).
- *DummyJSON has no real registration.* `POST /users/add` is a documented,
  real endpoint, but per DummyJSON's own docs it only simulates the
  request — the created account is never persisted and can't subsequently
  log in. The Sign-up form still submits to it (so the full loading/error
  flow is real, not faked), but on success the user is redirected to
  `/login` with a message explaining the account isn't usable, rather than
  being auto-logged-in.
- *`/auth/me` is inconsistent on failure* — DummyJSON returns 401 for a
  missing token but 500 for an invalid one. `/api/auth/me` normalizes both
  into a single 401.

## Known Limitations / Future Improvements

- **No refresh-token rotation.** DummyJSON's access token expires after 60
  minutes (matched by the cookie's `maxAge`); after that, the user is
  signed out on next request rather than silently re-authenticated.
  Automatic refresh was left out of scope — it adds real complexity
  (retry-on-401, concurrent-request races) that isn't justified for this
  challenge.
- **Yekan Bakh VF (Persian typography) isn't wired up.** No fallback font
  was substituted for it; Persian text, if any is added later, will render
  in the browser's default font until the real font file is available.
