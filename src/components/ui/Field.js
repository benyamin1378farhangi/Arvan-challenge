import { cx } from "@/utils/cx";

export default function Field({
  label,
  htmlFor,
  error,
  required = false,
  hint,
  children,
  className = "",
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-body-2 tracking-body-2 text-neutral-fg1"
        >
          {label}
          {required && (
            <span className="text-error" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-caption-1 tracking-caption-1 text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-caption-1 tracking-caption-1 text-neutral-fg2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
