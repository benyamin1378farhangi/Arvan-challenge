"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";

// DummyJSON's create/update/delete endpoints are simulated — nothing
// actually changes server-side, so every fresh fetch (including the SSR
// prefetch that reruns on every navigation back to /articles) always
// returns the original, untouched data. This is a small, session-only
// record of what the user actually did, kept in TanStack Query's cache
// under its own key so it's completely separate from — and never at risk
// of being silently overwritten by — the real articles list query.
// useDeleteArticle/useUpdateArticle write to it; ArticlesList reads it via
// this hook and applies it on top of whatever the list query returns.
//
// Deliberately not persisted anywhere durable (no localStorage): it's
// exactly as long-lived as the mutation "succeeded" on DummyJSON — gone on
// a hard refresh, which is the honest behavior given the backend never
// really remembered it either.
export const EMPTY_ARTICLE_OVERRIDES = { deletedIds: [], updatedById: {} };

export function useArticleOverrides() {
  const { data } = useQuery({
    queryKey: queryKeys.articles.localOverrides,
    queryFn: () => EMPTY_ARTICLE_OVERRIDES,
    initialData: EMPTY_ARTICLE_OVERRIDES,
    staleTime: Infinity,
  });

  return data;
}
