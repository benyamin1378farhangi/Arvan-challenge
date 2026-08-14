// Tiny className joiner. A dedicated dependency (clsx/tailwind-merge) isn't
// justified for this project's needs — components don't receive
// conflicting Tailwind classes that need runtime resolution, just
// conditional strings to filter and join.
export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
