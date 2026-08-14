import { forwardRef } from "react";
import { cx } from "@/utils/cx";

// Same visual language as Input — the Design Kit only defines a
// single-line Input primitive, there's no separate "Textarea" component
// to mirror — but for the Body field, which New/Edit Article render as a
// multi-line box.
const Textarea = forwardRef(function Textarea(
  { error = false, className = "", rows = 10, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={error || undefined}
      className={cx(
        "w-full rounded-lg border bg-neutral-bg1 px-3 py-2 text-body-2 tracking-body-2 text-neutral-fg1 outline-none transition-colors",
        "placeholder:text-neutral-fg1-disabled",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:bg-neutral-bg2 disabled:text-neutral-fg1-disabled",
        error
          ? "border-error"
          : "border-neutral-st2 hover:border-neutral-st2-hover",
        className,
      )}
      {...props}
    />
  );
});

export default Textarea;
