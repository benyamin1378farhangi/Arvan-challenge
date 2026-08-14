"use client";

import { useRouter } from "next/navigation";
import ArticleForm from "@/components/articles/ArticleForm";
import { useUpdateArticle } from "@/hooks/useUpdateArticle";
import { ROUTES } from "@/constants/routes";

// Thin wrapper around ArticleForm — same form, same validation, same
// layout as Create; only the submit behavior (update vs. create) and
// initial values differ.
export default function EditArticleForm({ article }) {
  const router = useRouter();
  const updateArticleMutation = useUpdateArticle();

  const handleSubmit = (values) => {
    // Same body-merge rule as Create. Description always starts empty for
    // an existing article (see Phase 7 plan — there's no way to know
    // which part of an existing post's body was ever a "description"),
    // so this only has an effect if the user types something new here.
    const body = values.description
      ? `${values.description}\n\n${values.body}`
      : values.body;

    updateArticleMutation.mutate(
      { id: article.id, title: values.title, body, tags: values.tags },
      { onSuccess: () => router.push(`${ROUTES.articles}?updated=1`) },
    );
  };

  return (
    <ArticleForm
      heading="Edit article"
      defaultValues={{
        title: article.title,
        description: "",
        body: article.body,
        tags: article.tags ?? [],
      }}
      onSubmit={handleSubmit}
      isSubmitting={updateArticleMutation.isPending}
      submitError={
        updateArticleMutation.isError ? updateArticleMutation.error.message : null
      }
      submitLabel="Submit"
    />
  );
}
