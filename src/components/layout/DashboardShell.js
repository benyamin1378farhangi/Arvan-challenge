"use client";

import { useState } from "react";
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

export default function DashboardShell({ children }) {
  const router = useRouter();
  const { data } = useCurrentUser();
  const logoutMutation = useLogout();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push(ROUTES.login),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        userName={data?.user?.username}
        onLogout={handleLogout}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className="flex flex-1">
        <Sidebar
          items={NAV_ITEMS}
          open={isSidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
