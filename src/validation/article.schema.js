import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Required field"),
  description: z.string().optional(),
  body: z.string().min(1, "Required field"),
  tags: z.array(z.string()).default([]),
});
