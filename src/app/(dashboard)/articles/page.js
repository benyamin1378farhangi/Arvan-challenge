import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/getQueryClient";
import { queryKeys } from "@/lib/query/keys";
import { fetchArticlesPage } from "@/lib/api/articles.server";
import ArticlesList from "@/components/articles/ArticlesList";

// Without this, Next.js prerenders this route as static at build time —
// nothing here reads cookies/headers directly (auth is enforced in
// proxy.js and the /api/articles Route Handler instead), so it has no
// other signal that this list needs to be fetched fresh per request.
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.articles.list(1),
    queryFn: () => fetchArticlesPage(1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ArticlesList reads ?created=1/?updated=1/?deleted=1 itself via
          useSearchParams(), which Next.js requires to be wrapped in
          Suspense. */}
      <Suspense fallback={null}>
        <ArticlesList page={1} />
      </Suspense>
    </HydrationBoundary>
  );
}
