import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Required field"),
  password: z.string().min(1, "Required field"),
});

export const registerSchema = z.object({
  username: z.string().min(1, "Required field"),
  email: z.string().min(1, "Required field").email("Enter a valid email address"),
  password: z.string().min(1, "Required field"),
});
