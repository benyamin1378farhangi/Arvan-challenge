"use client";

import { useEffect, useState } from "react";
import Toast from "./Toast";

const DEFAULT_DURATION_MS = 4000;

export default function AutoDismissToast({ duration = DEFAULT_DURATION_MS, ...toastProps }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <Toast {...toastProps} />;
}
