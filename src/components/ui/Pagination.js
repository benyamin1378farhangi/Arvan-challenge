import Link from "next/link";
import { cx } from "@/utils/cx";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

// Real URL navigation (next/link), not onClick + setState — pagination is
// URL-driven per the routing decision made in Phase 1 (`/articles` for
// page 1, `/articles/page/:page` after that), so page links need to be
// real hrefs a user can share, bookmark, or hit back/forward on.
function getPageNumbers(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export default function Pagination({ currentPage, totalPages, getHref }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <PageLink
        href={currentPage > 1 ? getHref(currentPage - 1) : undefined}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="size-4" />
      </PageLink>

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const showEllipsisBefore = previous !== undefined && page - previous > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsisBefore && (
              <span className="px-1 text-neutral-fg2" aria-hidden="true">
                …
              </span>
            )}
            <PageLink href={getHref(page)} selected={page === currentPage}>
              {page}
            </PageLink>
          </span>
        );
      })}

      <PageLink
        href={currentPage < totalPages ? getHref(currentPage + 1) : undefined}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, selected = false, disabled = false, children, ...props }) {
  const classes = cx(
    "flex size-8 items-center justify-center rounded-lg text-body-2 tracking-body-2",
    selected && "bg-primary text-neutral-fg3 font-semibold",
    !selected && !disabled && "text-neutral-fg1 hover:bg-neutral-bg2",
    disabled && "text-neutral-fg1-disabled cursor-not-allowed",
  );

  if (disabled || !href) {
    return (
      <span className={classes} aria-disabled="true" {...props}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} aria-current={selected ? "page" : undefined} {...props}>
      {children}
    </Link>
  );
}
