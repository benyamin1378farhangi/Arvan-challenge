"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArticle } from "@/lib/api/posts";
import { recordDeletedArticle } from "./useArticleOverrides";

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    // Not invalidateQueries + refetch — DummyJSON never actually deletes
    // anything server-side, so refetching would just bring the exact same
    // row right back. Recording the id as a local override is what
    // actually makes the row disappear (and stay gone this session).
    onSuccess: (_response, deletedId) => {
      recordDeletedArticle(queryClient, deletedId);
    },
  });
}
