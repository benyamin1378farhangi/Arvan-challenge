"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Section from "@/components/layout/Section";
import Dropdown from "@/components/ui/Dropdown";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import AutoDismissToast from "@/components/ui/AutoDismissToast";
import { useArticles } from "@/hooks/useArticles";
import { useDeleteArticle } from "@/hooks/useDeleteArticle";
import { useArticleOverrides, recordDeletedArticle } from "@/hooks/useArticleOverrides";
import { ROUTES } from "@/constants/routes";
import { ARTICLES_PAGE_SIZE } from "@/constants/pagination";

function getExcerpt(body) {
  const words = body.split(" ");
  return words.length > 20 ? `${words.slice(0, 20).join(" ")}…` : body;
}

const SUCCESS_TOAST_MESSAGES = {
  created: { title: "Well done!", description: "Article created successfully" },
  updated: { title: "Well done!", description: "Article updated successfully" },
  deleted: { title: "Article deleted successfully", description: "" },
};

export default function ArticlesList({ page }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successToastType = searchParams.get("created") === "1"
    ? "created"
    : searchParams.get("updated") === "1"
      ? "updated"
      : searchParams.get("deleted") === "1"
        ? "deleted"
        : null;

  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useArticles(page);
  const overrides = useArticleOverrides();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const deleteArticleMutation = useDeleteArticle();

  const fetchedPosts = (data?.posts ?? [])
    .filter((post) => !overrides.deletedIds.includes(post.id))
    .map((post) => {
      const override = overrides.updatedById[post.id];
      return override ? { ...post, ...override } : post;
    });

  const localCreatedPosts = page === 1 ? overrides.createdArticles : [];
  const posts = [...localCreatedPosts, ...fetchedPosts];

  const totalPages = data ? Math.ceil(data.total / ARTICLES_PAGE_SIZE) : 0;

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    deleteArticleMutation.reset();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.isLocal) {
      recordDeletedArticle(queryClient, deleteTarget.id);
      setDeleteTarget(null);
      router.push(`${ROUTES.articles}?deleted=1`);
      return;
    }

    deleteArticleMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        router.push(`${ROUTES.articles}?deleted=1`);
      },
    });
  };

  const getActionItems = (post) => [
    ...(post.isLocal
      ? []
      : [{ label: "Edit", onClick: () => router.push(ROUTES.editArticle(post.id)) }]),
    { label: "Delete", onClick: () => setDeleteTarget(post) },
  ];

  return (
    <Section className="p-6">
      {successToastType && (
        <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <AutoDismissToast
            key={successToastType}
            variant="success"
            title={SUCCESS_TOAST_MESSAGES[successToastType].title}
            description={SUCCESS_TOAST_MESSAGES[successToastType].description}
          />
        </div>
      )}

      <div className="mb-4 border-b border-neutral-st3 pb-4">
        <h1 className="text-title-3 tracking-title-3 font-semibold text-neutral-fg1">
          All Posts
        </h1>
      </div>

      {isLoading && (
        <p className="py-12 text-center text-body-2 tracking-body-2 text-neutral-fg2">
          Loading articles…
        </p>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-body-2 tracking-body-2 text-error">
            Failed to load articles.
          </p>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && data && posts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-body-2 tracking-body-2 text-neutral-fg2">
            No articles yet.
          </p>
          <Link href={ROUTES.createArticle}>
            <Button>New Article</Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && data && posts.length > 0 && (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-st3 bg-neutral-bg2 text-body-2 tracking-body-2 font-semibold text-neutral-fg1">
                  <th className="py-2 pr-4 font-semibold">#</th>
                  <th className="py-2 pr-4 font-semibold">Title</th>
                  <th className="py-2 pr-4 font-semibold">Author</th>
                  <th className="py-2 pr-4 font-semibold">Tags</th>
                  <th className="py-2 pr-4 font-semibold">Excerpt</th>
                  <th className="py-2 pr-4 font-semibold">Created</th>
                  <th className="py-2 pr-4 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-neutral-st3">
                    <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg1">
                      {post.id}
                    </td>
                    <td className="py-3 pr-4 text-body-2 tracking-body-2 font-semibold text-neutral-fg1">
                      {post.title}
                    </td>
                    <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                      {post.isLocal ? "You" : `User #${post.userId}`}
                    </td>
                    <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                      {post.tags.join(", ")}
                    </td>
                    <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                      {getExcerpt(post.body)}
                    </td>
                    <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                      {post.isLocal ? "Just now" : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <Dropdown
                        triggerLabel={`Actions for "${post.title}"`}
                        items={getActionItems(post)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg border border-neutral-st3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body-2 tracking-body-2 font-semibold text-neutral-fg1">
                    {post.title}
                  </p>
                  <Dropdown
                    triggerLabel={`Actions for "${post.title}"`}
                    items={getActionItems(post)}
                  />
                </div>
                <p className="mt-1 text-caption-1 tracking-caption-1 text-neutral-fg2">
                  {post.isLocal ? "You" : `User #${post.userId}`}
                </p>
                <p className="mt-2 text-body-2 tracking-body-2 text-neutral-fg2">
                  {getExcerpt(post.body)}
                </p>
                {post.tags.length > 0 && (
                  <p className="mt-2 text-caption-1 tracking-caption-1 text-neutral-fg2">
                    {post.tags.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              getHref={(targetPage) =>
                targetPage === 1 ? ROUTES.articles : ROUTES.articlesPage(targetPage)
              }
            />
          </div>
        </>
      )}

      {deleteArticleMutation.isError && (
        <div className="mt-4">
          <Toast
            variant="error"
            title="Couldn't delete article"
            description={deleteArticleMutation.error.message}
          />
        </div>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={closeDeleteModal}
        title="Delete Article"
        danger
        message="Are you sure you want to delete this article?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        isConfirming={deleteArticleMutation.isPending}
      />
    </Section>
  );
}
