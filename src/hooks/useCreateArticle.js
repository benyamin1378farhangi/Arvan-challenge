"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";
import { recordCreatedArticle } from "./useArticleOverrides";

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    // Not invalidateQueries + refetch — DummyJSON never actually stores
    // the new post, so refetching wouldn't show it either way. Recording
    // it as a local override (with a real, current-user-aware Author,
    // unlike anything DummyJSON would tell us for a made-up id) is what
    // makes it actually appear in the list.
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
