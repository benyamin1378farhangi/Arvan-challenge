"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/cx";

// Client Component: needs usePathname() to highlight the active item.
// Takes `items` instead of hardcoding "All Articles" / "New Article" so
// the same component can be reused as-is if a nav item is ever added —
// still a two-line prop, not a speculative abstraction.
//
// `isActive(pathname)` is an escape hatch for items whose "active" range
// isn't a clean prefix of their href — e.g. "All Articles" (/articles)
// must also stay highlighted on /articles/page/2, but a plain prefix match
// on "/articles" would incorrectly also match /articles/create and
// /articles/edit/*. Falls back to the original exact/prefix behavior when
// not provided.
//
// `open`/`onNavigate` (Phase 9) only affect layout below `lg`: below that
// breakpoint this renders as an off-canvas drawer (fixed, translated
// off-screen unless `open`) with a backdrop; at `lg` and up the drawer
// classes are overridden back to the original static, always-visible
// sidebar — same markup, no separate desktop/mobile component.
export default function Sidebar({ items, open = false, onNavigate }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onNavigate}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <nav
        aria-label="Dashboard"
        className={cx(
          "z-50 w-60 shrink-0 border-r border-neutral-st3 bg-neutral-bg1 p-4 transition-transform",
          "fixed inset-y-0 left-0 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const selected = item.isActive
              ? item.isActive(pathname)
              : item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={selected ? "page" : undefined}
                  onClick={onNavigate}
                  className={cx(
                    "block rounded-lg px-4 py-2.5 text-body-2 tracking-body-2 font-semibold transition-colors",
                    selected
                      ? "bg-primary-soft text-primary"
                      : "text-neutral-fg1 hover:bg-neutral-bg2",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
