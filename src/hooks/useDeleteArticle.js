"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArticle } from "@/lib/api/posts";
import { recordDeletedArticle } from "./useArticleOverrides";

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: (_response, deletedId) => {
      recordDeletedArticle(queryClient, deletedId);
    },
  });
}
