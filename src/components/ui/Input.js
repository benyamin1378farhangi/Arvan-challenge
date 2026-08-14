import { forwardRef } from "react";
import { cx } from "@/utils/cx";

// A single fixed size (40px, matching Design Kit's "Md"). Every input
// across the Challenge screens (Sign-in, Sign-up, New/Edit article, Tags
// search) uses this one size — Sm/Lg exist in the Design Kit but nothing
// in the actual screens uses them, so no `size` prop was added.
//
// forwardRef so this composes with React Hook Form's `register()`, which
// needs a real ref to the <input> element.
const Input = forwardRef(function Input(
  { error = false, className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={error || undefined}
      className={cx(
        "h-10 w-full rounded-lg border bg-neutral-bg1 px-3 text-body-2 tracking-body-2 text-neutral-fg1 outline-none transition-colors",
        "placeholder:text-neutral-fg1-disabled",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:bg-neutral-bg2 disabled:text-neutral-fg1-disabled",
        "read-only:bg-neutral-bg2",
        error
          ? "border-error"
          : "border-neutral-st2 hover:border-neutral-st2-hover",
        className,
      )}
      {...props}
    />
  );
});

export default Input;
