import { sameOriginFetch } from "./sameOriginFetch";

export function getArticles({ page }) {
  return sameOriginFetch(`/api/articles?page=${page}`);
}
