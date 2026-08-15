"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/cx";

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
