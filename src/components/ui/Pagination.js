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

// The bordered/rounded wrapper (pixel-confirmed from a Figma reference
// screenshot: a #CCCCCC — i.e. `neutral-st2` — box around the whole
// control) wraps both nav variants so it's present regardless of which
// breakpoint is showing.
//
// Below `sm` (Phase 9), the full number list doesn't reliably fit — this
// renders both the full nav and a compact Prev/"n / total"/Next nav, and
// lets Tailwind's `sm:` breakpoint pick one; there's no JS media-query
// logic; the compact nav's Prev/Next hrefs come from the same
// currentPage/totalPages math, just rendered differently.
export default function Pagination({ currentPage, totalPages, getHref }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const previousHref = currentPage > 1 ? getHref(currentPage - 1) : undefined;
  const nextHref = currentPage < totalPages ? getHref(currentPage + 1) : undefined;

  return (
    <div className="inline-flex items-center justify-center rounded-xl border border-neutral-st2 p-1">
      <nav aria-label="Pagination" className="hidden items-center justify-center gap-1 sm:flex">
        <PageLink href={previousHref} disabled={currentPage === 1} aria-label="Previous page">
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

        <PageLink href={nextHref} disabled={currentPage === totalPages} aria-label="Next page">
          <ChevronRightIcon className="size-4" />
        </PageLink>
      </nav>

      <nav aria-label="Pagination" className="flex items-center justify-center gap-2 sm:hidden">
        <PageLink href={previousHref} disabled={currentPage === 1} aria-label="Previous page">
          <ChevronLeftIcon className="size-4" />
        </PageLink>
        <span className="px-2 text-body-2 tracking-body-2 text-neutral-fg1">
          {currentPage} / {totalPages}
        </span>
        <PageLink href={nextHref} disabled={currentPage === totalPages} aria-label="Next page">
          <ChevronRightIcon className="size-4" />
        </PageLink>
      </nav>
    </div>
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
