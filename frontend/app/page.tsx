"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

  const tambahTransaksi = async () => {
    if (!desc || amount <= 0) return alert("Isi data dengan benar!");

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8080/api/transactions?id=${editingId}` 
      : "http://localhost:8080/api/transactions";

    await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), desc, type }),
    });

    setEditingId(null);
    setDesc("");
    setAmount(0);
    fetchTransactions();
  };

  const hapusTransaksi = async (id: number) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
    await fetch(`http://localhost:8080/api/transactions?id=${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setDesc(t.desc);
    setAmount(t.amount);
    setType(t.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Menghitung saldo secara real-time dari state transaksi yang ada
  const totalBalance = transactions.reduce((acc, t: any) => 
    t.type === "income" ? acc + t.amount : acc - t.amount, 0
  );
  // Menghitung total pemasukan dan pengeluaran untuk grafik
  const incomeTotal = transactions
    .filter((t: any) => t.type === "income")
    .reduce((acc, t: any) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((acc, t: any) => acc + t.amount, 0);

  // Format data untuk Recharts
  const chartData = [
    { name: "Pemasukan", value: incomeTotal, color: "#22c55e" }, // Green-500
    { name: "Pengeluaran", value: expenseTotal, color: "#ef4444" }, // Red-500
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-black text-white font-sans">
      <header className="flex items-center gap-4 mb-10 group">
        <div className="relative p-2 bg-gray-900 rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-2xl shadow-blue-500/10">
          <Image src="/logo-finastriva.svg" alt="Finastriva Logo" width={40} height={40} priority />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">FINASTRIVA</h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-semibold mt-1 opacity-80">Smart Assets Manager</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mx-auto">
        
        {/* CARD 1: TOTAL BALANCE */}
        <div className="md:col-span-1 bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl h-fit">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-white">Rp {totalBalance.toLocaleString()}</p>
          <div className="mt-4 flex gap-4">
            <span className="text-green-400 text-xs font-medium">↑ Income</span>
            <span className="text-red-400 text-xs font-medium">↓ Expense</span>
          </div>
        </div>

        {/* CARD 2: ANALYTICS (Pie Chart) */}
        <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col h-[300px] md:h-full">
          <h2 className="text-gray-400 text-xs font-medium uppercase tracking-[0.2em] mb-4">Alokasi Dana</h2>
          
          {incomeTotal === 0 && expenseTotal === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic">
              Belum ada data untuk ditampilkan
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* CARD 3: INPUT FORM */}
        <div className="md:col-span-1 bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Transaksi" : "Tambah Transaksi"}</h3>
          
          <div className="flex gap-2 mb-4 bg-gray-900 p-1 rounded-lg">
            <button onClick={() => setType("income")} className={`flex-1 py-2 rounded-lg font-medium transition ${type === "income" ? "bg-green-600 text-white" : "text-gray-400"}`}>Pemasukan</button>
            <button onClick={() => setType("expense")} className={`flex-1 py-2 rounded-lg font-medium transition ${type === "expense" ? "bg-red-600 text-white" : "text-gray-400"}`}>Pengeluaran</button>
          </div>

          <label className="block text-sm mb-1 text-gray-400">Keterangan</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 transition" placeholder="Contoh: Beli Kopi" />
          
          <label className="block text-sm mb-1 text-gray-400">Nominal (IDR)</label>
          <input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 mb-6 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 transition font-mono" placeholder="10000" />
          
          <button onClick={tambahTransaksi} className="w-full bg-blue-600 p-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">{editingId ? "Update Data" : "Simpan Transaksi"}</button>
          {editingId && <button onClick={() => setEditingId(null)} className="w-full mt-2 text-gray-500 text-sm hover:underline">Batal Edit</button>}
        </div>

        {/* CARD 4: TRANSACTION HISTORY */}
        <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col">
          <h3 className="text-xl font-bold mb-6">Riwayat Transaksi</h3>
          <div className="overflow-y-auto max-h-[500px] space-y-3 custom-scrollbar">
            {transactions.map((t: any) => (
              <div key={t.id} className={`bg-gray-800/50 p-4 rounded-2xl flex justify-between border-l-4 ${t.type === "income" ? "border-green-500" : "border-red-500"} items-center hover:bg-gray-800 transition`}>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{t.desc}</span>
                  <span className="text-gray-500 text-xs">{new Date(t.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-lg font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>{t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString()}</span>
                  <div className="flex gap-1 border-l border-gray-700 pl-4">
                    <button onClick={() => startEdit(t)} className="text-gray-500 hover:text-blue-500 p-1">✏️</button>
                    <button onClick={() => hapusTransaksi(t.id)} className="text-gray-500 hover:text-red-500 p-1">🗑</button>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-gray-500 text-center py-10">Belum ada transaksi.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}