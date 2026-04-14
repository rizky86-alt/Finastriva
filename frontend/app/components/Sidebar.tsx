"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, BrainCircuit, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { name: "The Vault", icon: <History size={20} />, path: "/vault" },
  { name: "AI Hub", icon: <BrainCircuit size={20} />, path: "/hub" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { username, isAdmin, logout } = useAuth();

  // Don't show sidebar on auth page
  if (pathname === "/auth") return null;

  return (
    <aside className="w-64 bg-black border-r border-gray-800 flex flex-col h-screen sticky top-0 flex-shrink-0 z-50 text-white font-sans antialiased">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="relative w-10 h-10 bg-blue-600 rounded-lg p-2 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
           {/* Fallback if logo not found, but we will assume it exists in public/ */}
           <Image 
            src="/logo-finastriva.svg" 
            alt="Finastriva Logo" 
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-black tracking-tighter">FINASTRIVA</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {/* Regular Menu - Only for NON-ADMINS */}
        {!isAdmin && menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" 
                : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <span className={`${isActive ? "text-blue-500" : "group-hover:text-white"}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}

        {/* Admin Menu - Only for ADMINS */}
        {isAdmin && (
          <Link
            href="/admin/users"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
              pathname === "/admin/users"
              ? "bg-red-600/10 text-red-500 border border-red-600/20" 
              : "text-gray-400 hover:bg-gray-900 hover:text-white"
            }`}
          >
            <span className={`${pathname === "/admin/users" ? "text-red-500" : "group-hover:text-white"}`}>
              <ShieldAlert size={20} />
            </span>
            <span className="font-bold text-sm tracking-wide uppercase italic">User Management</span>
          </Link>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="p-6 border-t border-gray-900">
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800/50 flex flex-col gap-3">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Authenticated As</p>
            <p className={`text-sm font-black truncate ${isAdmin ? "text-red-400" : "text-blue-400"}`}>
              {username || "User"} {isAdmin && " (ADMIN)"}
            </p>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <LogOut size={14} />
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}
