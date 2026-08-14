"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Section from "@/components/layout/Section";
import Dropdown from "@/components/ui/Dropdown";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useArticles } from "@/hooks/useArticles";
import { useDeleteArticle } from "@/hooks/useDeleteArticle";
import { ROUTES } from "@/constants/routes";
import { ARTICLES_PAGE_SIZE } from "@/constants/pagination";

// DummyJSON's post `body` has no separate summary field — Figma's own
// "tips" note for this column says the excerpt is "First 20 words of
// article body", so that's how it's derived here.
function getExcerpt(body) {
  const words = body.split(" ");
  return words.length > 20 ? `${words.slice(0, 20).join(" ")}…` : body;
}

export default function ArticlesList({
  page,
  createdSuccess = false,
  updatedSuccess = false,
  deletedSuccess = false,
}) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useArticles(page);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const deleteArticleMutation = useDeleteArticle();

  const totalPages = data ? Math.ceil(data.total / ARTICLES_PAGE_SIZE) : 0;

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    deleteArticleMutation.reset();
  };

  const handleConfirmDelete = () => {
    deleteArticleMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        router.push(`${ROUTES.articles}?deleted=1`);
      },
    });
  };

  return (
    <Section className="p-6">
      <div className="mb-4 border-b border-neutral-st3 pb-4">
        <h1 className="text-title-3 tracking-title-3 font-semibold text-neutral-fg1">
          All Posts
        </h1>
      </div>

      {createdSuccess && (
        <div className="mb-4">
          <Toast
            variant="success"
            title="Well done!"
            description="Article created successfully"
          />
        </div>
      )}

      {updatedSuccess && (
        <div className="mb-4">
          <Toast
            variant="success"
            title="Well done!"
            description="Article updated successfully"
          />
        </div>
      )}

      {deletedSuccess && (
        <div className="mb-4">
          <Toast
            variant="success"
            title="Well done!"
            description="Article deleted successfully"
          />
        </div>
      )}

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

      {!isLoading && !isError && data?.posts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-body-2 tracking-body-2 text-neutral-fg2">
            No articles yet.
          </p>
          <Link href={ROUTES.createArticle}>
            <Button>New Article</Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && data && data.posts.length > 0 && (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-st3 text-caption-1 tracking-caption-1 text-neutral-fg2">
                <th className="py-2 pr-4 font-normal">#</th>
                <th className="py-2 pr-4 font-normal">Title</th>
                <th className="py-2 pr-4 font-normal">Author</th>
                <th className="py-2 pr-4 font-normal">Tags</th>
                <th className="py-2 pr-4 font-normal">Excerpt</th>
                <th className="py-2 pr-4 font-normal">Created</th>
                <th className="py-2 pr-4 font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map((post) => (
                <tr key={post.id} className="border-b border-neutral-st3">
                  <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg1">
                    {post.id}
                  </td>
                  <td className="py-3 pr-4 text-body-2 tracking-body-2 font-semibold text-neutral-fg1">
                    {post.title}
                  </td>
                  {/* DummyJSON posts only carry a numeric userId, not a
                      username — resolving it to a real name would mean an
                      extra request per row (see Phase 5 plan). */}
                  <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                    User #{post.userId}
                  </td>
                  <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                    {post.tags.join(", ")}
                  </td>
                  <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">
                    {getExcerpt(post.body)}
                  </td>
                  {/* DummyJSON posts have no date field at all — shown as
                      "—" rather than a fabricated timestamp. */}
                  <td className="py-3 pr-4 text-body-2 tracking-body-2 text-neutral-fg2">—</td>
                  <td className="py-3 pr-4">
                    <Dropdown
                      triggerLabel={`Actions for "${post.title}"`}
                      items={[
                        {
                          label: "Edit",
                          onClick: () => router.push(ROUTES.editArticle(post.id)),
                        },
                        {
                          label: "Delete",
                          danger: true,
                          onClick: () => setDeleteTarget(post),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
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
