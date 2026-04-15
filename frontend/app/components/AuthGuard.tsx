"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    // Protected paths (exclude / (Landing) and /auth)
    const isProtectedPath = pathname === "/dashboard" || 
                           pathname.startsWith("/vault") || 
                           pathname.startsWith("/hub") || 
                           pathname.startsWith("/admin");

    if (!storedToken && isProtectedPath) {
      router.push("/auth");
    }
    
    // If logged in and on auth page, redirect to dashboard
    if (storedToken && pathname === "/auth") {
      router.push("/dashboard");
    }
  }, [pathname, router, token]);

  return <>{children}</>;
}
