import { cx } from "@/utils/cx";
import { CheckCircleIcon } from "./icons";

// Presentational only — no visibility/queue state lives here. How a toast
// gets triggered (a single "current toast" slot vs. a stack, how long it
// stays visible) depends on the caller.
//
// Shape/sizing (pill, hug-content) is shared by both variants — a base
// Toast property, not something that plausibly differs per color. Icon
// presence and colors are per-variant: the error variant's pill background
// (`error-soft`) was pixel-sampled directly from a Figma reference
// screenshot (Sign-in → Failed), which also showed no icon on the error
// toast — the success variant's icon/colors were separately confirmed
// earlier from Figma's variable dump and a "Article created" screenshot,
// so it keeps its icon rather than assuming symmetry with error.
const VARIANTS = {
  success: {
    container: "bg-success-bg text-success-fg",
    icon: CheckCircleIcon,
  },
  error: {
    container: "bg-error-soft text-error",
    icon: null,
  },
};

export default function Toast({
  variant = "success",
  title,
  description,
  className = "",
}) {
  const { container, icon: Icon } = VARIANTS[variant];

  return (
    <div
      role="status"
      className={cx(
        "inline-flex max-w-full items-start gap-2 rounded-full px-4 py-3 shadow-toast",
        container,
        className,
      )}
    >
      {Icon && <Icon className="size-5 shrink-0" aria-hidden="true" />}
      <p className="text-body-2 tracking-body-2 font-semibold">
        {title}
        {description && <span className="ml-1 font-normal">{description}</span>}
      </p>
    </div>
  );
}
