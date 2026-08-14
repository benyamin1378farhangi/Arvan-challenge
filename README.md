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

## Dashboard / Articles

**Data fetching.** `/articles` and `/articles/page/:page` prefetch the
article list server-side (`queryClient.prefetchQuery` + `HydrationBoundary`)
so the initial HTML already contains real data instead of a loading flash,
then `ArticlesList` picks up the same query client-side via `useArticles`
for pagination/refetching. Both routes are marked `force-dynamic` — this
list is paginated, live data behind auth, so it has no business being
baked into the build as static HTML.

**Pagination.** Page 1's canonical URL is `/articles`; later pages are
`/articles/page/:page`. Visiting `/articles/page/1` redirects to
`/articles`. A non-numeric or sub-1 page (`/articles/page/abc`,
`/articles/page/0`) is a 404. A page past the last one isn't treated as an
error — DummyJSON returns an empty `posts` array for a `skip` beyond
`total` (verified directly against the live API), which renders as the
same "No articles yet" empty state as a genuinely empty list.

**Author / Created columns — DummyJSON data limitation.** Figma's table
has `Author` (`@username`) and `Created` (a date) columns, but a DummyJSON
post object only has a numeric `userId` — no username, and no date field
at all:

```json
{ "id": 1, "title": "...", "body": "...", "tags": [...], "userId": 121 }
```

- **Author** is shown as `User #{userId}`. Resolving it to a real username
  would mean an extra `GET /users/:id` request per row (an N+1 pattern) —
  not worth the added complexity/latency for this challenge.
- **Created** is shown as `—`. There is no date field to show, and no
  timestamp is fabricated for it.

**Excerpt** *is* derivable — Figma's own note for that column says "first
20 words of article body", which is what's shown.

**Delete** is intentionally partial in this phase: the row menu's Delete
action opens the confirmation modal, and Cancel/Confirm both close it, but
Confirm doesn't call the DELETE endpoint yet — that (plus the
success/error Toast) is separate scope.

## Create Article

**Flow.** Client (React Hook Form + Zod) → `useCreateArticle` (TanStack
Query mutation) → `POST /api/articles` → DummyJSON. On success: the
articles query cache is invalidated and the user is redirected to
`/articles?created=1`, which shows the success Toast on the Dashboard
(same pattern as Sign-up's redirect to `/login`) rather than on the Create
page itself — matching Figma, which has a distinct "Dashboard → Article
created" screen, not a Toast on the form.

**`userId` is derived server-side, never trusted from the client.**
DummyJSON's `POST /posts/add` requires a `userId` (verified — without it,
`400 "User id is required"`), but there's no such field in Figma's form;
it's not something the user fills in. `/api/articles`'s POST handler calls
DummyJSON's `/auth/me` with the session's own token (the same call
`/api/auth/me` makes) to get the real logged-in user's id and uses that —
a `userId` sent in the request body is ignored entirely, it's never read.

**Description has no home in DummyJSON's schema.** A post is only
`{ title, body, tags, userId }` — sending a `description` field is
silently dropped (verified). The Description field stays in the UI
(Figma has it), but its value is folded into `body` before submitting
(`description + "\n\n" + body`) so it actually affects the created
article instead of being entered and quietly discarded.

**Tags.** The panel's list comes from `GET /posts/tags` (via our own
`/api/tags`, sorted alphabetically by name — DummyJSON doesn't sort it).
The single search input both filters that list and, on Enter, adds a new
tag (slugified, auto-checked) if nothing matches — new tags are
client-side only for the lifetime of the form; DummyJSON has no endpoint
that would persist a new tag either.

**Persistence — same limitation as Login/Register.** `POST /posts/add`
returns a real `201` with an echoed post (`id`, `title`, `body`, `tags`),
but nothing is actually stored: a `GET` for that same id immediately
afterward 404s, and the articles list's `total` count never changes.
Verified directly against the live API before and after creating a test
article. The UI reflects this honestly — Create shows success (the request
genuinely succeeded), but the new article does not appear in the Dashboard
list after redirecting, because DummyJSON never kept it.

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
- **Delete doesn't call the API yet** (see Dashboard / Articles above) —
  the mutation and its Toast feedback are separate scope.
- **Article author is shown as `User #{id}`, not a real username** —
  DummyJSON posts don't include one, and resolving it would mean an extra
  request per table row.
- **Create doesn't actually persist new articles** (see Create Article
  above) — a DummyJSON limitation, not an app bug; documented so it isn't
  mistaken for one.
- **The Tags panel briefly shows "Loading tags…" on first paint** of the
  Create page — unlike the articles list, this query isn't server-prefetched.
  A secondary panel's brief loading state was judged not worth the same
  SSR-prefetch treatment given to the primary Dashboard list.
