"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Seed the cache directly instead of invalidating+refetching — we
      // already have the user object from the login response, no need for
      // a second round-trip to /api/auth/me right away.
      queryClient.setQueryData(["auth", "me"], { user: data.user });
    },
  });
}
