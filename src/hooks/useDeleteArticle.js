"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}
