"use client";

import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/lib/api/posts";
import { queryKeys } from "@/lib/query/keys";

export function useArticles(page) {
  return useQuery({
    queryKey: queryKeys.articles.list(page),
    queryFn: () => getArticles({ page }),
  });
}
