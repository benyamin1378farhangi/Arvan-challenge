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

## Responsive

Figma has no mobile or tablet screens at all — every one of its 11 frames
is 1440px wide, and the challenge brief says explicitly that a mobile
version wasn't designed. Every decision below is an implementation choice,
not something read off a design.

**Breakpoints.** Tailwind's defaults, unchanged (`sm` 640 / `md` 768 / `lg`
1024 / `xl` 1280) — no custom breakpoint was added. Tablet (768–1023px)
intentionally gets the same treatment as mobile (drawer sidebar, stacked
form, card list) rather than an in-between layout: at 768px wide, a fixed
240px sidebar plus real content is still cramped, so there was no reason
to design a third state.

**Sidebar** is a fixed-position, off-canvas drawer below `lg` (closed by
default, opened by the Header's hamburger, closed by its own backdrop or
by picking a nav item) and exactly the original always-visible static
sidebar at `lg` and up — same markup, same `isActive` logic, Tailwind
classes just resolve differently per breakpoint. No new component; the
drawer is `open`/`onNavigate` props added to the existing `Sidebar`.

**Header** drops the "Arvancloud Challenge" pill entirely below `lg` (pure
decoration, not information), truncates a long username instead of
squeezing Logout off-screen, and gains a hamburger button using the
existing `Button` (`layout="icon"`) — not a new component.

**Articles list.** >=`md`: the original table, now wrapped in
`overflow-x-auto` as a safety fallback. <`md`: a card per article (Title,
Author, Excerpt, Tags, Actions — Created is dropped since it only ever
shows "—" anyway, and the `#` id has no reader-facing meaning). Both live
in the same `ArticlesList.js`, sharing one `getActionItems()` helper for
the Edit/Delete `Dropdown` so that wiring only exists once. No new
component — the JSX for two layouts of the same data didn't get
unmanageable enough to justify splitting out.

**Create/Edit Article form.** The two-column layout (form + Tags panel)
holds at `lg`+; below that it's a single column, full-width, form fields
above Tags — same DOM order, so tab order doesn't change, just
`flex-direction`. The old fixed `w-[376px]` on the Tags column (which by
itself exceeded a phone's viewport width) is now `lg:w-[376px]`.

**Pagination.** Below `sm`, the full numbered nav (which doesn't reliably
fit that narrow) is replaced by a compact "Prev / current of total / Next"
nav; `sm` and up keeps the original. Both are rendered and Tailwind's `sm:`
classes pick one — no JS media-query logic.

**Modal, Toast, and the Auth pages (`/login`, `/register`) needed no
changes** — an audit before implementing found they were already
mobile-safe from how they were originally built (`w-full max-w-[...]` on
the card/dialog plus outer `p-4`), not something added for this phase.

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

**Success Toasts** (`?created=1`/`?updated=1`/`?deleted=1`) are read via
`useSearchParams()` directly inside `ArticlesList`, not threaded down as a
prop from the Server Component. Delete redirects to this exact same route
(`/articles`), just with a different query string, so `ArticlesList` stays
mounted and only gets new props on that navigation — a plain prop wasn't
reliably reflecting the change in time, while `useSearchParams()` is
next/navigation's own mechanism for reactively reading the current URL in
a Client Component and updates correctly regardless of that timing. This
requires wrapping `<ArticlesList>` in `<Suspense>` at both call sites,
which Next.js enforces for anything using `useSearchParams()`.

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

**Delete** — see the "Delete Article" section below for the full flow;
this note is a leftover from an earlier phase where it was intentionally
partial and is no longer accurate.

## Local Overrides (why the list actually updates despite DummyJSON)

Create/Edit/Delete all get a real `200`/`201` from DummyJSON, but none of
it is persisted — a follow-up `GET` always returns the original, untouched
data (verified directly for each, see below). Naively calling
`invalidateQueries` after a successful mutation would trigger a refetch
that brings back the exact same list, making a delete look like it didn't
work and an edit look like it didn't save.

Instead, `useDeleteArticle`/`useUpdateArticle` record what actually
happened — a deleted id, or a post's new fields — into a small
session-only cache entry (`queryKeys.articles.localOverrides`, read via
`useArticleOverrides`) that's completely separate from the real articles
list query. `ArticlesList` applies it on top of whatever the list query
returns, every render, so a deleted row disappears immediately and an
edited row shows its new title/body/tags immediately — regardless of how
many times the underlying list gets refetched or re-hydrated from the
server in the background.

This is deliberately not written to `localStorage` or anything else
durable: it's exactly as long-lived as the mutation "succeeded" on
DummyJSON — gone on a hard refresh, which is the honest behavior given the
mock backend never really remembered it either. `total`/page count are
left alone (still DummyJSON's real numbers) since there's no honest way to
adjust them for a deletion the backend doesn't actually know about.

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

## Edit Article

**Flow.** `app/(dashboard)/articles/edit/[slug]/page.js` (Server Component)
fetches the article directly via `fetchArticleById` (the same server-only
module Create/Dashboard use — not through `/api/articles`, since nothing
client-side needs to fetch a single article) and passes it straight into
`ArticleForm` as `defaultValues`. On submit: `useUpdateArticle` →
`PUT /api/articles/{id}` → DummyJSON → invalidate the articles cache →
redirect to `/articles?updated=1` → success Toast on the Dashboard, mirroring
Create's `?created=1`.

**Why no client-side query for the article being edited.** React Hook
Form only reads `defaultValues` once, at mount — if the article arrived
async via TanStack Query, a `reset()` call would be needed once it loaded.
Fetching it server-side and passing it as a prop sidesteps that entirely:
by the time the Client Component mounts, the data is already there. There
is also no caching/background-refetch value for a form you fill in once
and leave.

**`userId` isn't re-derived on update.** Unlike Create, `PUT /posts/:id`
doesn't require (or accept a way to change) `userId` — DummyJSON already
knows the original record's owner and preserves it automatically
(verified). The PUT handler only checks that our session cookie exists;
it has no reason to call `/auth/me` here.

**Description starts empty, always** — even though the article already has
a `body`. There's no way to know which part (if any) of an *existing*
post's body was ever meant to be a "description"; guessing by splitting
the text isn't attempted. If the user types something in Description while
editing, it's folded into `body` the same way Create does
(`description + "\n\n" + body`).

**Invalid / missing article.** A non-numeric slug or an id DummyJSON
doesn't have (`404 "Post with id '...' not found"`, verified) both render
Next's default not-found page via `notFound()` — Figma has no dedicated
screen for this state, so nothing was designed for it here either.

**Persistence.** Same limitation as Create: `PUT /posts/:id` returns a real
`200` with the edited fields echoed back, but a `GET` for that id right
after still shows the untouched original (verified directly). The edit
"succeeds" honestly from the API's point of view; DummyJSON just never
keeps it — the Dashboard row still shows the new title/body/tags
immediately regardless, via Local Overrides (above).

## Delete Article

**Flow.** The row menu's Delete opens the existing confirmation `Modal`
(unchanged since Phase 3/5 — its `isConfirming` prop already disabled
Confirm and showed a loading spinner, so nothing new was needed there).
Confirm now runs `useDeleteArticle` → `DELETE /api/articles/{id}` →
DummyJSON → record the id in Local Overrides (see above — not a cache
invalidation, since DummyJSON never actually deletes anything for a
refetch to reflect) → close the modal → redirect to `/articles?deleted=1`
→ success Toast on the Dashboard, same shape as Create/Edit. Cancel closes the modal and resets the mutation's error state
(so a failed delete doesn't leave a stale error Toast showing the next time
the modal opens for a different article). A failed delete keeps the modal
open and shows an error Toast in the Dashboard instead of navigating away.

**Authorization.** DummyJSON's `DELETE /posts/:id` doesn't check
authorization at all — verified, no `Authorization` header was needed for
it to succeed. `/api/articles/[id]`'s `DELETE` handler is the only access
control this operation has: it 401s without our own session cookie present,
independent of whatever DummyJSON itself would or wouldn't allow.

**Persistence.** Same limitation as Create/Edit: DummyJSON returns a real
`200` with `isDeleted: true` and a `deletedOn` timestamp in its response,
but a `GET` for that id immediately after still returns the original,
un-deleted post (verified directly). `/api/articles/[id]`'s `DELETE`
handler doesn't forward any of that DummyJSON response to the client — it
returns only `{ success: true, id }`, since nothing else about the
(never-actually-deleted) record is meaningful to show. The row still
disappears from the Dashboard immediately — see Local Overrides above for
how, despite this.

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
- **Article author is shown as `User #{id}`, not a real username** —
  DummyJSON posts don't include one, and resolving it would mean an extra
  request per table row.
- **Create/Edit/Delete don't actually persist changes on DummyJSON's end**
  (see Create Article / Edit Article / Delete Article above) — a DummyJSON
  limitation, not an app bug. The Dashboard list itself stays accurate
  within a session via the Local Overrides mechanism (above); a hard
  refresh (or DummyJSON's data from any other client) always shows the
  real, unmodified state.
- **The Tags panel briefly shows "Loading tags…" on first paint** of the
  Create page — unlike the articles list, this query isn't server-prefetched.
  A secondary panel's brief loading state was judged not worth the same
  SSR-prefetch treatment given to the primary Dashboard list.
- **Real browser interactions (clicks, keyboard navigation, focus order,
  loading-state flashes) are code-reviewed, not browser-tested** — this
  project has no browser automation (e.g. Playwright) set up, so anything
  that only manifests through actual user interaction in a running browser
  has been verified by reading the code, not by observing it run.
- **Actual rendered appearance at 375/768/1024/1440px, and opening/closing
  the mobile Sidebar drawer, are code-reviewed only, for the same reason**
  — confirmed that the right Tailwind classes are present and compiled
  (`lg:hidden`, `md:block`, the drawer's `-translate-x-full`, etc.), not
  that they look correct in an actual viewport.
- **Client-side navigation while a component stays mounted (e.g. the
  Delete redirect) can only be verified by reading the code, not curl** —
  every curl request is a fresh page load, so it can confirm a URL renders
  the right thing on its own, but not that a `router.push()` from an
  already-mounted page actually reaches that state without a manual
  refresh. The `useSearchParams()`/`key`-remount fixes here follow
  documented React/Next.js behavior for exactly this scenario, but a real
  browser is needed to watch the click-through happen.
