"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { ShieldAlert, User as UserIcon, Calendar, BadgeCheck } from "lucide-react";

interface User {
  id: number;
  username: string;
  roles: string[];
  created_at: string;
}

export default function AdminUsersPage() {
  const { token, isAdmin, isSuperAdmin, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Hapus trailing slash dari base
    const cleanBase = base.replace(/\/+$/, "");
    // Pastikan endpoint mulai dengan satu slash
    const cleanEndpoint = `/${endpoint.replace(/^\/+/, "")}`;
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

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const rawText = await res.text();
          console.error("Non-JSON Response from", url, ":", rawText);
          throw new Error(`Server returned non-JSON response (${res.status}).`);
        }

        const data = await res.json();
        setUsers(data || []);
      } catch (err: any) {
        console.error("Gagal ambil data user:", err);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [token, isAdmin, logout]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    const url = `${getApiUrl("/api/admin/users")}?id=${id}`;
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const contentType = res.headers.get("content-type");
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        let errMsg = "Gagal menghapus user.";
        if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errMsg = data.error || errMsg;
        }
        alert(errMsg);
      }
    } catch (err: any) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    }
  };

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
                        <div className="flex flex-col gap-1 items-end">
                          {u.roles.map(role => (
                            <span key={role} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                (role === 'admin' || role === 'superadmin') ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}>
                                {role}
                            </span>
                          ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Username</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-black text-white">{u.username}</p>
                                {(u.roles.includes('admin') || u.roles.includes('superadmin')) && <BadgeCheck size={16} className="text-red-500" />}
                            </div>
                        </div>

                        {isSuperAdmin && !u.roles.includes('superadmin') && (
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20 mt-2"
                          >
                            Delete User
                          </button>
                        )}

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
