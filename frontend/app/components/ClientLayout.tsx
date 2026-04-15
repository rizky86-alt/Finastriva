"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import AuthGuard from "./AuthGuard";
import { useAuth } from "../context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // Pages that never require AuthGuard
  const isPublicPage = pathname === "/auth" || pathname === "/landing";

  // If it's the auth page, just show it
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // If it's the landing page and user is not logged in, show it without Sidebar/AuthGuard
  if (pathname === "/landing" && !isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, wrap with AuthGuard and show Sidebar
  return (
    <AuthGuard>
      <div className="flex bg-black text-white overflow-hidden min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen bg-black relative custom-scrollbar">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
