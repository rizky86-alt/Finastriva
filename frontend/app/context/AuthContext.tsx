"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  username: string | null;
  roles: string[];
  login: (token: string, username: string, roles: string[]) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    const savedRoles = localStorage.getItem("roles");
    if (savedToken) setToken(savedToken);
    if (savedUsername) setUsername(savedUsername);
    if (savedRoles) setRoles(JSON.parse(savedRoles));
  }, []);

  const login = (newToken: string, newUsername: string, newRoles: string[]) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("roles", JSON.stringify(newRoles));
    setToken(newToken);
    setUsername(newUsername);
    setRoles(newRoles);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    setToken(null);
    setUsername(null);
    setRoles([]);
    router.push("/auth");
  };

  const isAdmin = roles.includes("admin") || roles.includes("superadmin");
  const isSuperAdmin = roles.includes("superadmin");

  return (
    <AuthContext.Provider value={{ 
      token, 
      username, 
      roles, 
      login, 
      logout, 
      isAuthenticated: !!token,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
