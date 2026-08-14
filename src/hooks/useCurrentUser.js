"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";

// TanStack Query's cache for this key *is* the app's auth state — no
// separate Context provider. A 401 (no session, or an expired one) is an
// expected, non-retryable outcome, not a transient failure worth retrying.
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    retry: false,
  });
}
