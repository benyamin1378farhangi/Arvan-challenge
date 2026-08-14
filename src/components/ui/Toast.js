import { cx } from "@/utils/cx";
import { CheckCircleIcon, WarningIcon } from "./icons";

// Presentational only — no visibility/queue state lives here. How a toast
// gets triggered (a single "current toast" slot vs. a stack, how long it
// stays visible) depends on the first real mutation that needs one, so
// that decision is made in the phase that adds it, not guessed now.
const VARIANTS = {
  success: {
    container: "bg-success-bg text-success-fg",
    icon: CheckCircleIcon,
  },
  // The exact Figma background fill for the error Toast wasn't verified —
  // Figma MCP hit its rate limit before this component's "Type=Error"
  // variant could be checked. This uses only already-confirmed tokens
  // (white background, error text/border) as an interim treatment.
  error: {
    container: "border border-error bg-neutral-bg1 text-error",
    icon: WarningIcon,
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
        "flex items-start gap-2 rounded-xl px-4 py-3 shadow-toast",
        container,
        className,
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <p className="text-body-2 tracking-body-2 font-semibold">
        {title}
        {description && <span className="ml-1 font-normal">{description}</span>}
      </p>
    </div>
  );
}
