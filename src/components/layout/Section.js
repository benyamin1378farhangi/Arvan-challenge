import { cx } from "@/utils/cx";

// The white card container used around the table (Dashboard), each form
// column (New/Edit article), and the auth cards (Login/Sign-up). No
// default padding — the plain `cx()` join here has no tailwind-merge, so a
// baked-in `p-6` would risk silently losing to (or clashing with) a
// caller's own padding override. Callers apply whatever padding their
// layout needs directly.
//
// Radius/shadow weren't independently confirmed from Figma for this
// component (rate-limited) — uses the same 8px radius already confirmed
// for Input/Modal, and no shadow (the Dashboard screenshot shows the card
// sitting flat on the page background with no visible elevation, just the
// background-color contrast).
export default function Section({ children, className = "" }) {
  return (
    <div className={cx("rounded-lg bg-neutral-bg1", className)}>{children}</div>
  );
}
