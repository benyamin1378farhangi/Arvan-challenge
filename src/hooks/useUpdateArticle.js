"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}
