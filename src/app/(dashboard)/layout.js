// Header + Sidebar chrome is added in Phase 3 (shared components) and
// wired up in Phase 5 (Dashboard). Kept as a plain passthrough for now so
// the route group exists and every /articles/* route resolves.
export default function DashboardLayout({ children }) {
  return children;
}
