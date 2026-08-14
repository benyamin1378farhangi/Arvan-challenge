import { cache } from "react";
import { createQueryClient } from "./queryClient";

// One QueryClient per server request — React's cache() dedupes calls to
// this within a single render, the server equivalent of providers.js's
// one-per-app client instance (without leaking state across requests).
export const getQueryClient = cache(createQueryClient);
