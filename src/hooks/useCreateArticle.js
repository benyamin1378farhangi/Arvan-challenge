"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    // Invalidated on every success regardless of DummyJSON's persistence
    // limitation — this is the correct thing to do after any create
    // mutation, whether or not the mock API happens to reflect it back.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}
