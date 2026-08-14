"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArticle } from "@/lib/api/posts";
import { recordUpdatedArticle } from "./useArticleOverrides";

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    // Same reasoning as useDeleteArticle: DummyJSON doesn't persist the
    // edit, so invalidating and refetching would just show the original
    // row again. The local override is what makes the edited fields
    // actually stick for the rest of this session.
    onSuccess: (response, variables) => {
      recordUpdatedArticle(queryClient, variables.id, response.post);
    },
  });
}
