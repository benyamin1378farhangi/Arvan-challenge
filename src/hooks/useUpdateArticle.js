"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArticle } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";
import { EMPTY_ARTICLE_OVERRIDES } from "./useArticleOverrides";

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    // Same reasoning as useDeleteArticle: DummyJSON doesn't persist the
    // edit, so invalidating and refetching would just show the original
    // row again. The local override is what makes the edited fields
    // actually stick for the rest of this session.
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.articles.localOverrides,
        (current = EMPTY_ARTICLE_OVERRIDES) => ({
          ...current,
          updatedById: { ...current.updatedById, [variables.id]: response.post },
        }),
      );
    },
  });
}
