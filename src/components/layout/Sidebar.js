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
export default function Sidebar({ items }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="w-60 shrink-0 border-r border-neutral-st3 bg-neutral-bg1 p-4">
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
  );
}
