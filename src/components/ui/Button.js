import { cx } from "@/utils/cx";
import { SpinnerIcon } from "./icons";

// Only the variants actually used across the Challenge screens:
// primary (Sign in, Submit, Confirm), secondary (Cancel, Actions trigger,
// outline buttons) and danger (Delete). Design Kit also has a
// Primary+Danger "icon" layout combo that never appears in any screen, so
// it's not specifically catered for beyond what `layout="icon"` already
// gives any variant.
const VARIANT_CLASSES = {
  primary:
    "bg-primary text-neutral-fg3 hover:bg-primary-hover active:bg-primary-press disabled:bg-primary-disabled",
  secondary:
    "border border-neutral-st2 bg-neutral-bg1 text-neutral-fg1 hover:border-neutral-st2-hover active:border-neutral-st2-press disabled:border-neutral-st2-disabled disabled:text-neutral-fg1-disabled",
  danger:
    "bg-error text-neutral-fg3 hover:bg-error-hover active:bg-error-press disabled:bg-error-disabled",
};

export default function Button({
  variant = "primary",
  layout = "text",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  type = "button",
  ...props
}) {
  const isIconOnly = layout === "icon";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl text-body-2 tracking-body-2 font-semibold transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed",
        isIconOnly ? "size-10 shrink-0" : "min-w-[72px] px-4 py-2.5",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <SpinnerIcon className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
}
