import { cx } from "@/utils/cx";

// Deliberately doesn't clone/inject props into `children` — the caller
// wires `id`/`error`/`{...register()}` onto the input itself explicitly.
// Slightly more to type at the call site, but every prop that ends up on
// the input is visible right there instead of happening implicitly here.
//
//   <Field label="Email" htmlFor="email" error={errors.email?.message}>
//     <Input id="email" error={Boolean(errors.email)} {...register("email")} />
//   </Field>
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
