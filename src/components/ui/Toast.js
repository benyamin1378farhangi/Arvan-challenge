import { cx } from "@/utils/cx";
import { CheckCircleIcon } from "./icons";

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
        "inline-flex max-w-full items-start gap-2 rounded-xl px-4 py-3 shadow-toast",
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
