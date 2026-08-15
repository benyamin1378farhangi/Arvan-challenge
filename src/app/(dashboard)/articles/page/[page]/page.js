import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/getQueryClient";
import { queryKeys } from "@/lib/query/keys";
import { fetchArticlesPage } from "@/lib/api/articles.server";
import ArticlesList from "@/components/articles/ArticlesList";
import { ROUTES } from "@/constants/routes";

export default async function ArticlesPagedPage({ params }) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  if (page === 1) {
    redirect(ROUTES.articles);
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.articles.list(page),
    queryFn: () => fetchArticlesPage(page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <ArticlesList page={page} />
      </Suspense>
    </HydrationBoundary>
  );
}
