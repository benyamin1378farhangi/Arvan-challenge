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
// useCreateArticle/useUpdateArticle/useDeleteArticle write to it via the
// functions below; ArticlesList reads it via the hook and applies it on
// top of whatever the list query returns.
//
// Deliberately not persisted anywhere durable (no localStorage): it's
// exactly as long-lived as the mutation "succeeded" on DummyJSON — gone on
// a hard refresh, which is the honest behavior given the backend never
// really remembered it either.
export const EMPTY_ARTICLE_OVERRIDES = {
  deletedIds: [],
  updatedById: {},
  createdArticles: [],
};

export function useArticleOverrides() {
  const { data } = useQuery({
    queryKey: queryKeys.articles.localOverrides,
    queryFn: () => EMPTY_ARTICLE_OVERRIDES,
    initialData: EMPTY_ARTICLE_OVERRIDES,
    staleTime: Infinity,
  });

  return data;
}

function updateOverrides(queryClient, updater) {
  queryClient.setQueryData(queryKeys.articles.localOverrides, (current = EMPTY_ARTICLE_OVERRIDES) =>
    updater(current),
  );
}

export function recordDeletedArticle(queryClient, id) {
  updateOverrides(queryClient, (current) => ({
    ...current,
    deletedIds: [...current.deletedIds, id],
    // If `id` is itself a local-only article (never a real DummyJSON
    // post), drop it outright instead of also carrying a "deleted" flag
    // for an id nothing else will ever look up.
    createdArticles: current.createdArticles.filter((post) => post.id !== id),
  }));
}

export function recordUpdatedArticle(queryClient, id, fields) {
  updateOverrides(queryClient, (current) => ({
    ...current,
    updatedById: { ...current.updatedById, [id]: fields },
  }));
}

// DummyJSON's POST /posts/add always returns the same id ("total + 1",
// and `total` never actually changes) — useless for telling separate
// creates apart. A negative, locally-generated id is used instead: always
// unique within the session, and trivially distinguishable from a real
// DummyJSON id (always positive) via the `isLocal` flag this also sets.
let nextLocalArticleId = 0;

export function recordCreatedArticle(queryClient, post) {
  nextLocalArticleId -= 1;
  const localPost = { ...post, id: nextLocalArticleId, isLocal: true };

  updateOverrides(queryClient, (current) => ({
    ...current,
    // Newest first — there's no real "created date" to sort by (DummyJSON
    // posts don't have one), but a session's own local creates do have a
    // known, real order, so new ones are prepended rather than appended.
    createdArticles: [localPost, ...current.createdArticles],
  }));

  return localPost;
}
