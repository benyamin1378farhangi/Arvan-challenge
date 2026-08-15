"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisIcon } from "./icons";
import Button from "./Button";

export default function Dropdown({ items, triggerLabel = "More actions" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <Button
        variant="secondary"
        layout="icon"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <EllipsisIcon className="size-4" />
      </Button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-lg border border-neutral-st3 bg-neutral-bg1 shadow-xl"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className="block w-full px-4 py-2 text-left text-body-2 tracking-body-2 text-neutral-fg1 hover:bg-neutral-bg2"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
