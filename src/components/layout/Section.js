import { cx } from "@/utils/cx";

export default function Section({ children, className = "" }) {
  return (
    <div className={cx("rounded-lg bg-neutral-bg1", className)}>{children}</div>
  );
}
