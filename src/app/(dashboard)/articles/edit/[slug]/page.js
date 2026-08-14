import { notFound } from "next/navigation";
import { fetchArticleById } from "@/lib/api/articles.server";
import { ApiError } from "@/lib/api/http";
import EditArticleForm from "@/components/articles/EditArticleForm";

// No client-side query for the article being edited — see Phase 7 plan.
// A plain server fetch avoids the RHF defaultValues/reset() dance that a
// client-side TanStack Query would need, and there's no caching/
// background-refetch value for a one-time form prefill.
export default async function EditArticlePage({ params }) {
  const { slug } = await params;
  const id = Number(slug);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  let article;
  try {
    article = await fetchArticleById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return <EditArticleForm article={article} />;
}
