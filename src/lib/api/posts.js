import { sameOriginFetch } from "./sameOriginFetch";

export function getArticles({ page }) {
  return sameOriginFetch(`/api/articles?page=${page}`);
}

export function createArticle({ title, body, tags }) {
  return sameOriginFetch("/api/articles", {
    method: "POST",
    body: JSON.stringify({ title, body, tags }),
  });
}
