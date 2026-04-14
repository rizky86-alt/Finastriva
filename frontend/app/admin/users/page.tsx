"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { ShieldAlert, User as UserIcon, Calendar, BadgeCheck } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const { token, isAdmin, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      setIsLoading(true);
      const url = getApiUrl("/api/admin/users");

      try {
        const res = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          alert("Akses ditolak atau token kadaluarsa.");
          logout();
          return;
        }

        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Gagal ambil data user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [token, isAdmin, logout]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans antialiased text-white">
        <p className="text-red-500 font-black italic uppercase tracking-widest">
          Unauthorized Access
        </p>
      </div>
    );
  }

  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen font-sans antialiased text-white">
      <header className="mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
                <ShieldAlert size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">User Management</h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-1">Pantau seluruh pengguna yang terdaftar di Finastriva.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <div className="col-span-full py-20 text-center text-gray-600 animate-pulse font-bold tracking-widest uppercase text-[10px]">
                Mengambil data kependudukan...
            </div>
        ) : users.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-600 border-2 border-dashed border-gray-800 rounded-[2.5rem]">
                Tidak ada user ditemukan.
            </div>
        ) : (
            users.map((u, index) => (
                <motion.div
                    key={u.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-6 rounded-[2rem] hover:border-red-500/30 transition-all group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                            <UserIcon size={24} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            u.role === 'admin' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}>
                            {u.role}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Username</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-black text-white">{u.username}</p>
                                {u.role === 'admin' && <BadgeCheck size={16} className="text-red-500" />}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-800 flex items-center gap-2 text-gray-500">
                            <Calendar size={14} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                Joined {new Date(u.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))
        )}
      </div>
    </main>
  );
}
