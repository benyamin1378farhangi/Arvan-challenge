"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";
import { CheckCircleIcon, WarningIcon } from "./icons";
import Button from "./Button";

// Controlled component (open/onClose come from the parent) rendered
// through a portal so it always sits above the dashboard layout regardless
// of where it's mounted in the tree — the standard approach for anything
// that needs to overlay the whole page.
//
// Only one size is implemented (matching the ~456px width used by the
// Delete confirmation modal, the only modal in the Challenge) — the
// Design Kit's small/medium/large variants aren't all used anywhere, so a
// `size` prop wasn't added speculatively.
//
// Note: Escape-to-close and click-outside-to-close are handled, and focus
// moves to the dialog on open. A full focus trap (Tab cycling only inside
// the dialog) is not implemented — it isn't needed for this Challenge's
// single confirmation-modal use case, and pulling in a dedicated
// focus-trap dependency for it isn't justified at this stage.
export default function Modal({
  open,
  onClose,
  title,
  description,
  danger = false,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isConfirming = false,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // `open` starts false in every real usage, so the server and the first
  // client render both return null here — no hydration mismatch, and no
  // extra "mounted" state needed just to gate the portal until the client
  // has `document` available (it always does by the time `open` flips
  // true, since that only happens from a user interaction).
  if (!open) return null;

  const Icon = danger ? WarningIcon : CheckCircleIcon;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="w-full max-w-[456px] overflow-hidden rounded-lg bg-neutral-bg1 shadow-xl outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-neutral-st3 px-6 py-4">
          <h2
            id="modal-title"
            className="text-body-1 tracking-body-1 font-semibold text-neutral-fg1"
          >
            {title}
          </h2>
          {description && (
            <p className="text-caption-1 tracking-caption-1 text-neutral-fg2">
              {description}
            </p>
          )}
        </div>

        {message && (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <span
              className={cx(
                "flex size-12 items-center justify-center rounded-full",
                danger ? "bg-error/10 text-error" : "bg-success-bg text-success-fg",
              )}
            >
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <p className="text-body-2 tracking-body-2 text-neutral-fg1">{message}</p>
          </div>
        )}

        {/* ترتیب دکمه‌ها عمداً بین دو حالت فرق دارد: طبق Design Kit، در حالت
            danger (مثل تأیید حذف) دکمه‌ی خطر سمت چپ و Cancel سمت راست است؛
            در حالت عادی برعکس (Cancel چپ، Confirm راست). */}
        <div className="flex items-center justify-end gap-4 border-t border-neutral-st3 px-6 py-4">
          {danger && (
            <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
              {confirmLabel}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          {!danger && (
            <Button variant="primary" onClick={onConfirm} isLoading={isConfirming}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
