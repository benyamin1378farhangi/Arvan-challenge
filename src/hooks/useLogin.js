"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], { user: data.user });
    },
  });
}
