"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";
import { CheckIcon, MinusIcon } from "./icons";

// Real <input type="checkbox">, visually styled via `appearance-none` with
// our own icon drawn on top — keeps native keyboard/screen-reader behavior
// while matching the Design Kit look. `indeterminate` has no HTML
// attribute equivalent, so it's set imperatively via ref.
export default function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  id,
  className = "",
  ...props
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      htmlFor={id}
      className={cx(
        "inline-flex items-center gap-2 text-body-2 tracking-body-2 text-neutral-fg1",
        disabled ? "cursor-not-allowed text-neutral-fg1-disabled" : "cursor-pointer",
        className,
      )}
    >
      <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className={cx(
            "size-5 appearance-none rounded border bg-neutral-bg1 transition-colors",
            "checked:border-primary checked:bg-primary",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            "disabled:cursor-not-allowed disabled:border-neutral-st2-disabled disabled:bg-neutral-bg2",
            checked || indeterminate ? "border-primary" : "border-neutral-st2",
          )}
          {...props}
        />
        {(checked || indeterminate) && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-neutral-fg3">
            {indeterminate ? (
              <MinusIcon className="size-3" />
            ) : (
              <CheckIcon className="size-3" />
            )}
          </span>
        )}
      </span>
      {label}
    </label>
  );
}
