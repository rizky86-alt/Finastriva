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
    
    // Jika tidak ada token dan bukan di halaman auth, tendang ke /auth
    if (!storedToken && pathname !== "/auth") {
      router.push("/auth");
    }
    
    // Jika sudah login tapi malah mau buka /auth, balikin ke dashboard
    if (storedToken && pathname === "/auth") {
      router.push("/");
    }
  }, [pathname, router, token]);

  return <>{children}</>;
}
