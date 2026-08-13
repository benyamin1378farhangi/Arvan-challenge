import { QueryClient } from "@tanstack/react-query";

/**
 * DummyJSON mutations (POST/PUT/DELETE) are simulated and never persist on
 * the server. We keep a short staleTime so lists still feel responsive, and
 * disable refetch-on-window-focus so the mock API isn't hit on every tab
 * switch. Each mutation is responsible for updating the cache explicitly
 * (see hooks/) instead of relying on aggressive background refetching.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
