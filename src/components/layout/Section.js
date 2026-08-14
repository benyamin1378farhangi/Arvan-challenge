import { cx } from "@/utils/cx";

// The white card container used around the table (Dashboard) and around
// each form column (New/Edit article). Radius/shadow weren't independently
// confirmed from Figma for this component (rate-limited) — uses the same
// 8px radius already confirmed for Input/Modal, and no shadow (the
// Dashboard screenshot shows the card sitting flat on the page background
// with no visible elevation, just the background-color contrast).
export default function Section({ children, className = "" }) {
  return (
    <div className={cx("rounded-lg bg-neutral-bg1 p-6", className)}>
      {children}
    </div>
  );
}
