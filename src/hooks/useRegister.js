"use client";

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/auth";

// No cache to update on success — the created account isn't a usable
// session (see /api/auth/register), so there's no "current user" to seed.
export function useRegister() {
  return useMutation({ mutationFn: registerUser });
}
