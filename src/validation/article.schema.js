import { z } from "zod";

// Title: required, matches Figma (red border + "Required field" on this
// field specifically). Description: optional, Figma has no required-state
// for it. Body: required — DummyJSON's API itself doesn't require it, but
// an article with no body isn't meaningful, so this is an implementation
// decision, not a Figma/API requirement. Tags: optional, zero is valid.
export const articleSchema = z.object({
  title: z.string().min(1, "Required field"),
  description: z.string().optional(),
  body: z.string().min(1, "Required field"),
  tags: z.array(z.string()).default([]),
});
