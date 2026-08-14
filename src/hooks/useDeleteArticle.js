"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";
import { EMPTY_ARTICLE_OVERRIDES } from "./useArticleOverrides";

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    // Not invalidateQueries + refetch — DummyJSON never actually deletes
    // anything server-side, so refetching would just bring the exact same
    // row right back. Recording the id as a local override is what
    // actually makes it disappear (and stay gone for this session).
    onSuccess: (_response, deletedId) => {
      queryClient.setQueryData(
        queryKeys.articles.localOverrides,
        (current = EMPTY_ARTICLE_OVERRIDES) => ({
          ...current,
          deletedIds: [...current.deletedIds, deletedId],
        }),
      );
    },
  });
}
