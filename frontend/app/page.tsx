"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";
import AnalyticsCard from "./components/AnalyticsCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/transactions");
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const startEdit = (t: any) => {
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

  const totalBalance = transactions.reduce((acc, t: any) => 
    t.type === "income" ? acc + (t.amount || 0) : acc - (t.amount || 0), 0
  );

  const incomeTotal = transactions
    .filter((t: any) => t.type === "income")
    .reduce((acc, t: any) => acc + (t.amount || 0), 0);

  const expenseTotal = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((acc, t: any) => acc + (t.amount || 0), 0);

  const chartData = [
    { name: "Pemasukan", value: incomeTotal },
    { name: "Pengeluaran", value: expenseTotal },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-black text-white font-sans antialiased">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full mx-auto px-6 pb-20">
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
          transactions={transactions} 
          onEdit={startEdit} 
          onDelete={hapusTransaksi} 
        />
      </div>
    </main>
  );
}
