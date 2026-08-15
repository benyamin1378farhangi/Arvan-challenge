import { apiFetch } from "./http";
import { ARTICLES_PAGE_SIZE } from "@/constants/pagination";

export function fetchArticlesPage(page) {
  const skip = (page - 1) * ARTICLES_PAGE_SIZE;
  return apiFetch(`/posts?limit=${ARTICLES_PAGE_SIZE}&skip=${skip}`);
}

export function fetchArticleById(id) {
  return apiFetch(`/posts/${id}`);
}
