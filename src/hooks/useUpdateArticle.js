"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArticle } from "@/lib/api/posts";
import { recordUpdatedArticle } from "./useArticleOverrides";

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    onSuccess: (response, variables) => {
      recordUpdatedArticle(queryClient, variables.id, response.post);
    },
  });
}
