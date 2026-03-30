"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, BrainCircuit, Wallet } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { name: "The Vault", icon: <History size={20} />, path: "/vault" },
  { name: "AI Hub", icon: <BrainCircuit size={20} />, path: "/hub" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black border-r border-gray-800 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Wallet className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tighter">FINASTRIVA</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
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
      </nav>

      {/* User Profile Footer */}
      <div className="p-6 border-t border-gray-900">
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800/50">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Developer Mode</p>
          <p className="text-sm font-black truncate text-blue-400">Rizky Aziz</p>
        </div>
      </div>
    </aside>
  );
}