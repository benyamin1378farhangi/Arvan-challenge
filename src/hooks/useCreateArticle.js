"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";
import { recordCreatedArticle } from "./useArticleOverrides";

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: (response) => {
      const currentUser = queryClient.getQueryData(queryKeys.auth.me);

      recordCreatedArticle(queryClient, {
        title: response.post.title,
        body: response.post.body,
        tags: response.post.tags,
        userId: currentUser?.user?.id ?? null,
      });
    },
  });
}
