"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import { ROUTES } from "@/constants/routes";
import Header from "./Header";
import Sidebar from "./Sidebar";

const NAV_ITEMS = [
  {
    href: ROUTES.articles,
    label: "All Articles",
    isActive: (pathname) => pathname === ROUTES.articles || pathname.startsWith("/articles/page/"),
  },
  { href: ROUTES.createArticle, label: "New Article", exact: true },
];

// The one Client Component in the dashboard layout tree — everything else
// under (dashboard)/layout.js can stay a Server Component. Only this shell
// needs useCurrentUser()/useLogout(), which are hooks.
export default function DashboardShell({ children }) {
  const router = useRouter();
  const { data } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push(ROUTES.login),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header userName={data?.user?.username} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar items={NAV_ITEMS} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
