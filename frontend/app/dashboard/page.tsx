"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";
import BalanceCard from "@/app/components/BalanceCard";
import AnalyticsCard from "@/app/components/AnalyticsCard";
import TransactionForm from "@/app/components/TransactionForm";
import TransactionList from "@/app/components/TransactionList";
import { useAuth } from "@/app/context/AuthContext";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

export default function Home() {
  const { token, isAdmin, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Redirect admin to user management
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

  const fetchTransactions = async () => {
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
      console.error(`Failed to fetch transactions from ${url}:`, err);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && !isAdmin) {
      fetchTransactions();
    }
  }, [token, isAdmin]);

  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setDesc(t.desc);
    setAmount(t.amount);
    setType(t.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDesc("");
    setAmount(0);
  };

  const tambahTransaksi = async () => {
    if (!desc || amount <= 0) return alert("Isi data dengan benar!");
    if (!token) return;

    const isEdit = editingId !== null;
    const method = isEdit ? "PUT" : "POST";
    const baseUrl = getApiUrl("/api/transactions");
    const url = isEdit ? `${baseUrl}?id=${editingId}` : baseUrl;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          desc: desc,
          type: type,
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchTransactions();
      } else if (res.status === 401) {
        logout();
      } else {
        const errorData = await res.json();
        alert(errorData.error || `Gagal menyimpan: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error in tambahTransaksi:`, err);
      alert("Koneksi ke server gagal. Pastikan Backend sudah jalan.");
    }
  };

  const hapusTransaksi = async (id: number) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
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
        fetchTransactions();
      } else if (res.status === 401) {
        logout();
      } else {
        const errorData = await res.json();
        alert(errorData.error || `Gagal menghapus: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error in hapusTransaksi:`, err);
      alert("Koneksi ke server gagal.");
    }
  };

  if (isAdmin) return null;

  const totalBalance = transactions.reduce((acc, t) => 
    t.type === "income" ? acc + (t.amount || 0) : acc - (t.amount || 0), 0
  );

  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const chartData = [
    { name: "Pemasukan", value: incomeTotal },
    { name: "Pengeluaran", value: expenseTotal },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-black text-white font-sans antialiased">
      <Header />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full mx-auto px-6 pb-20"
      >
        <BalanceCard 
          total={totalBalance} 
          income={incomeTotal} 
          expense={expenseTotal} 
        />

        <AnalyticsCard 
          income={incomeTotal} 
          expense={expenseTotal} 
          chartData={chartData} 
        />

        <TransactionForm
          editingId={editingId}
          desc={desc}
          setDesc={setDesc}
          amount={amount}
          setAmount={setAmount}
          type={type}
          setType={setType}
          onSubmit={tambahTransaksi}
          onCancel={handleCancelEdit}
        />

        <TransactionList 
          transactions={transactions.slice(0, 5)} 
          onEdit={startEdit} 
          onDelete={hapusTransaksi} 
          isLoading={isLoading}
        />
      </motion.div>
    </main>
  );
}
