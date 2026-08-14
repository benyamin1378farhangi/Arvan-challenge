import { apiFetch } from "./http";
import { ARTICLES_PAGE_SIZE } from "@/constants/pagination";

// Server-only — talks to DummyJSON directly via apiFetch. Shared by the
// /api/articles Route Handler (client-side pagination clicks) and the
// dashboard page.js Server Components (initial-load prefetch), so the
// prefetch doesn't round-trip through our own Route Handler over HTTP
// just to reach the same DummyJSON call.
export function fetchArticlesPage(page) {
  const skip = (page - 1) * ARTICLES_PAGE_SIZE;
  return apiFetch(`/posts?limit=${ARTICLES_PAGE_SIZE}&skip=${skip}`);
}
