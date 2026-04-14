"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  Download 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TrendChart from "../components/TrendChart";
import CategoryChart from "../components/CategoryChart";
import { useAuth } from "../context/AuthContext";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: "income" | "expense";
  created_at: string;
}

export default function VaultPage() {
  const { token, isAdmin, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect admin
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin/users");
    }
  }, [isAdmin, router]);

  // Helper untuk mendapatkan URL API yang valid
  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  };

  const fetchAllData = async () => {
    if (!token || isAdmin) return;
    setIsLoading(true);

    const url = getApiUrl("/api/transactions");

    try {
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error(`Failed to fetch all data from ${url}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && !isAdmin) {
      fetchAllData();
    }
  }, [token, isAdmin]);

  if (isAdmin) return null;

  // Filtering Logic
  const filteredData = transactions.filter((t) => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const totalIncome = filteredData
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = filteredData
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const hapusData = async (id: number) => {
    if (!confirm("Hapus data permanen dari Vault?")) return;
    if (!token) return;

    const url = `${getApiUrl("/api/transactions")}?id=${id}`;

    try {
      const res = await fetch(url, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchAllData();
      } else if (res.status === 401) {
        logout();
      } else {
        const errorData = await res.json();
        alert(errorData.error || `Gagal menghapus: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error in hapusData at ${url}:`, err);
      alert("Gagal menghapus data. Pastikan Backend sudah jalan.");
    }
  };

  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen font-sans antialiased text-white">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">THE VAULT</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Arsip data finansial sejak awal pencatatan.</p>
        </motion.div>
        
        <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-300 hover:bg-gray-800 transition-all active:scale-95 shadow-lg">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2.5rem] relative overflow-hidden group shadow-lg"
        >
          <div className="absolute -right-4 -bottom-4 text-blue-500/10 group-hover:rotate-12 transition-all duration-500">
            <Wallet size={120} />
          </div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 relative z-10">Net Historical Balance</p>
          <h2 className="text-2xl font-black text-white relative z-10">Rp {netBalance.toLocaleString("id-ID")}</h2>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-green-500/5 border border-green-500/10 p-6 rounded-[2.5rem] relative overflow-hidden group shadow-lg"
        >
          <div className="absolute -right-4 -bottom-4 text-green-500/10 group-hover:rotate-12 transition-all duration-500">
            <TrendingUp size={120} />
          </div>
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 relative z-10">Total Life-time Income</p>
          <h2 className="text-2xl font-black text-white relative z-10">Rp {totalIncome.toLocaleString("id-ID")}</h2>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2.5rem] relative overflow-hidden group shadow-lg"
        >
          <div className="absolute -right-4 -bottom-4 text-red-500/10 group-hover:rotate-12 transition-all duration-500">
            <TrendingDown size={120} />
          </div>
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 relative z-10">Total Life-time Expense</p>
          <h2 className="text-2xl font-black text-white relative z-10">Rp {totalExpense.toLocaleString("id-ID")}</h2>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-black tracking-tight text-white uppercase leading-none">Cash Flow Trend</h3>
            <p className="text-gray-500 text-xs mt-1 font-medium">Aliran dana 10 transaksi terakhir.</p>
          </div>
          <TrendChart data={filteredData} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-black tracking-tight text-white uppercase leading-none">Spending Breakdown</h3>
            <p className="text-gray-500 text-xs mt-1 font-medium">Top 5 alokasi pengeluaran terbesar.</p>
          </div>
          <CategoryChart data={filteredData} />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari transaksi berdasarkan deskripsi..."
            className="w-full bg-gray-900/40 backdrop-blur-md border border-gray-800 p-4 pl-12 rounded-[1.2rem] focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 text-sm text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-900/40 backdrop-blur-md p-1.5 border border-gray-800 rounded-[1.2rem] min-w-[300px]">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                filterType === type ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60 text-gray-400">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Tanggal</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Deskripsi</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Kategori</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Jumlah</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {isLoading ? (
                 <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-600 font-bold animate-pulse uppercase tracking-widest text-[10px]">
                      Memuat Arsip Data...
                    </td>
                 </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-600">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={40} className="opacity-20" />
                      <p className="font-bold text-sm">Tidak ada data yang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {currentItems.map((t) => (
                    <motion.tr
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-blue-500/5 transition-colors group"
                    >
                      <td className="p-6 text-sm font-mono text-gray-500">
                        {new Date(t.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6 font-bold text-gray-200">{t.desc}</td>
                      <td className="p-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          t.type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`p-6 text-right font-mono font-black text-lg ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                        {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => hapusData(t.id)} 
                          className="text-gray-600 hover:text-red-500 transition-all p-3 hover:bg-red-500/10 rounded-xl active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-800 bg-gray-900/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} items
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-all text-gray-300"
              >
                Prev
              </button>
              <div className="flex items-center px-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                <span className="text-[10px] font-black text-blue-500">{currentPage} / {totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-all text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
