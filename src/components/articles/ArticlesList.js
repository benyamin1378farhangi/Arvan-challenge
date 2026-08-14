"use client";

import { useEffect, useState } from "react";
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

const SUCCESS_TOAST_MESSAGES = {
  created: "Article created successfully",
  updated: "Article updated successfully",
  deleted: "Article deleted successfully",
};

// How long the success Toast stays up before auto-dismissing (Figma shows
// it disappearing on its own, not a duration) — an implementation choice,
// not a measured value.
const SUCCESS_TOAST_DURATION_MS = 4000;

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

  // Derived once from the URL-driven props at mount, then owned locally so
  // it can be dismissed — either automatically (below) or, implicitly, by
  // the user navigating away.
  const [successToast, setSuccessToast] = useState(() => {
    if (createdSuccess) return "created";
    if (updatedSuccess) return "updated";
    if (deletedSuccess) return "deleted";
    return null;
  });

  useEffect(() => {
    if (!successToast) return;
    const timer = setTimeout(() => setSuccessToast(null), SUCCESS_TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [successToast]);

  const totalPages = data ? Math.ceil(data.total / ARTICLES_PAGE_SIZE) : 0;

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    deleteArticleMutation.reset();
  };

  const handleConfirmDelete = () => {
    // Defensive: onConfirm is wired directly to the Modal's Confirm
    // button, and nothing at the type/runtime level actually guarantees
    // deleteTarget is still set by the time this fires (e.g. a rapid
    // double-click before the button's disabled/isConfirming state
    // re-renders). Without this, that race throws trying to read `.id`
    // off null instead of just being a no-op.
    if (!deleteTarget) return;

    deleteArticleMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        router.push(`${ROUTES.articles}?deleted=1`);
      },
    });
  };

  // Shared by both the >=md table row and the <md card (Phase 9) so the
  // Edit/Delete wiring only exists once.
  const getActionItems = (post) => [
    { label: "Edit", onClick: () => router.push(ROUTES.editArticle(post.id)) },
    { label: "Delete", danger: true, onClick: () => setDeleteTarget(post) },
  ];

  return (
    <Section className="p-6">
      {/* Fixed to the top of the viewport (matches the Figma "Dashboard ->
          Article updated" reference — centered on the page, not inline in
          the card) and auto-dismisses itself via the effect above. */}
      {successToast && (
        <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Toast
            variant="success"
            title="Well done!"
            description={SUCCESS_TOAST_MESSAGES[successToast]}
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
          {/* >=md: the original table, now inside an overflow-x-auto
              wrapper as a safety fallback (Phase 9) — below md it's
              replaced entirely by the card list, this is a fallback for
              content wider than expected at md/lg, not the primary mobile
              treatment. */}
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
                        items={getActionItems(post)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <md: Card/List layout (Phase 9) — Figma has no mobile design
              for this table, so this is an implementation decision, not a
              Figma-derived layout. Same fields minus Created (already just
              "—" — not worth the vertical space on a small screen) and #
              (the id has no real meaning to a reader; Title is the primary
              identifier here). */}
          <div className="flex flex-col gap-3 md:hidden">
            {data.posts.map((post) => (
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
                  User #{post.userId}
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

          <div className="mt-4 flex justify-center">
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
