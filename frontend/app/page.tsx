"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Diambil dari library framer-motion yang diinstall di Langkah 1
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";
import AnalyticsCard from "./components/AnalyticsCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
  
    try {
      const res = await fetch("http://localhost:8080/api/transactions");
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

    const isEdit = editingId !== null;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8080/api/transactions?id=${editingId}`
      : "http://localhost:8080/api/transactions";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          desc: desc,
          type: type,
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchTransactions();
      }
    } catch (err) {
      alert("Koneksi ke server gagal");
    }
  };

  const hapusTransaksi = async (id: number) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTransactions();
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

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

      {/* 6.2: GRID DASHBOARD UTAMA - SEKARANG BERANIMASI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} // Keadaan Awal: Tidak terlihat (opacity 0) dan agak ke bawah (y: 20px)
        animate={{ opacity: 1, y: 0 }}   // Keadaan Akhir: Terlihat penuh dan kembali ke posisi asli
        transition={{ duration: 0.5, delay: 0.2 }} // Mengatur durasi animasi 0.5 detik dan delay 0.2 detik agar terasa halus
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
      </motion.div> {/* <-- Pastikan tag penutupnya juga motion.div */}
    </main>
  );
}
