"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";
import { CheckCircleIcon, WarningIcon } from "./icons";
import Button from "./Button";

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
