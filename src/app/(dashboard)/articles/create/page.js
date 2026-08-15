"use client";

import { useRouter } from "next/navigation";
import ArticleForm from "@/components/articles/ArticleForm";
import { useCreateArticle } from "@/hooks/useCreateArticle";
import { ROUTES } from "@/constants/routes";

export default function CreateArticlePage() {
  const router = useRouter();
  const createArticleMutation = useCreateArticle();

  const handleSubmit = (values) => {
    const body = values.description
      ? `${values.description}\n\n${values.body}`
      : values.body;

    createArticleMutation.mutate(
      { title: values.title, body, tags: values.tags },
      { onSuccess: () => router.push(`${ROUTES.articles}?created=1`) },
    );
  };

  return (
    <ArticleForm
      heading="New article"
      onSubmit={handleSubmit}
      isSubmitting={createArticleMutation.isPending}
      submitError={createArticleMutation.isError ? createArticleMutation.error.message : null}
      submitLabel="Submit"
    />
  );
}
