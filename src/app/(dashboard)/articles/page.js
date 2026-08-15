import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/getQueryClient";
import { queryKeys } from "@/lib/query/keys";
import { fetchArticlesPage } from "@/lib/api/articles.server";
import ArticlesList from "@/components/articles/ArticlesList";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.articles.list(1),
    queryFn: () => fetchArticlesPage(1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <ArticlesList page={1} />
      </Suspense>
    </HydrationBoundary>
  );
}
