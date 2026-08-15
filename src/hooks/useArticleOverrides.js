"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";

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
    createdArticles: current.createdArticles.filter((post) => post.id !== id),
  }));
}

export function recordUpdatedArticle(queryClient, id, fields) {
  updateOverrides(queryClient, (current) => ({
    ...current,
    updatedById: { ...current.updatedById, [id]: fields },
  }));
}

let nextLocalArticleId = 0;

export function recordCreatedArticle(queryClient, post) {
  nextLocalArticleId -= 1;
  const localPost = { ...post, id: nextLocalArticleId, isLocal: true };

  updateOverrides(queryClient, (current) => ({
    ...current,
    createdArticles: [localPost, ...current.createdArticles],
  }));

  return localPost;
}
