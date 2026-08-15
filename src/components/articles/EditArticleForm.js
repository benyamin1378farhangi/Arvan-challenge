"use client";

import { useRouter } from "next/navigation";
import ArticleForm from "@/components/articles/ArticleForm";
import { useUpdateArticle } from "@/hooks/useUpdateArticle";
import { ROUTES } from "@/constants/routes";

export default function EditArticleForm({ article }) {
  const router = useRouter();
  const updateArticleMutation = useUpdateArticle();

  const handleSubmit = (values) => {
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
