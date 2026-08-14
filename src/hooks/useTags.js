"use client";

import { useQuery } from "@tanstack/react-query";
import { getTags } from "@/lib/api/tags";
import { queryKeys } from "@/lib/query/keys";

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: getTags,
  });
}
