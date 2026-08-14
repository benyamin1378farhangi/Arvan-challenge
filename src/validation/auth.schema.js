import { z } from "zod";

// The login field is labeled "Email" (Figma) but only required, not
// validated as an email — its value is sent to DummyJSON as `username`,
// and the real test account ("emilys") isn't an email address.
export const loginSchema = z.object({
  email: z.string().min(1, "Required field"),
  password: z.string().min(1, "Required field"),
});

export const registerSchema = z.object({
  username: z.string().min(1, "Required field"),
  email: z.string().min(1, "Required field").email("Enter a valid email address"),
  password: z.string().min(1, "Required field"),
});
