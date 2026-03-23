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

  useEffect(() => { fetchTransactions(); }, []);

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

    setEditingId(null); setDesc(""); setAmount(0);
    fetchTransactions();
  };

  const hapusTransaksi = async (id: number) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
    await fetch(`http://localhost:8080/api/transactions?id=${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  const startEdit = (t: any) => {
    setEditingId(t.id); setDesc(t.desc); setAmount(t.amount); setType(t.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalBalance = transactions.reduce((acc, t: any) => 
    t.type === "income" ? acc + (t.amount || 0) : acc - (t.amount || 0), 0
  );
  
  const incomeTotal = transactions.filter((t: any) => t.type === "income").reduce((acc, t: any) => acc + (t.amount || 0), 0);
  const expenseTotal = transactions.filter((t: any) => t.type === "expense").reduce((acc, t: any) => acc + (t.amount || 0), 0);

  const chartData = [
    { name: "Pemasukan", value: incomeTotal },
    { name: "Pengeluaran", value: expenseTotal },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-black text-white font-sans antialiased">
      {/* 🟢 CUSTOM SCROLLBAR CSS 🟢 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>

      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
        <header className="flex items-center gap-4 group">
          <div className="relative p-2 bg-gray-900 rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-2xl">
            <Image src="/logo-finastriva.svg" alt="Logo" width={42} height={42} priority />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">FINASTRIVA</h1>
            <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mt-1 opacity-80">Smart Assets Manager</span>
          </div>
        </header>
        <div className="hidden md:block text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Dashboard Overview</p>
            <p className="text-sm text-gray-400 font-mono">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full mx-auto px-6 pb-20">
        
        {/* CARD 1: TOTAL BALANCE */}
        <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center min-h-[350px]">
          <h2 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Total Balance</h2>
          <p className={`text-5xl font-black tracking-tighter ${totalBalance < 0 ? 'text-red-500' : 'text-white'}`}>
            {totalBalance < 0 ? `- Rp ${Math.abs(totalBalance).toLocaleString()}` : `Rp ${totalBalance.toLocaleString()}`}
          </p>
          <div className="mt-8 flex items-center gap-6 border-t border-gray-800 pt-6">
            <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold">Income</span>
                <span className="text-green-400 font-mono font-bold">↑ Rp {incomeTotal.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] uppercase font-bold">Expense</span>
                <span className="text-red-400 font-mono font-bold">↓ Rp {expenseTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: ANALYTICS */}
        <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col min-h-[350px]">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Alokasi Dana</h2>
          {incomeTotal === 0 && expenseTotal === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-600 italic text-sm">No transaction data yet.</div>
          ) : (
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="45%" innerRadius="65%" outerRadius="85%" paddingAngle={10} dataKey="value">
                    <Cell fill="#22c55e" stroke="none" />
                    <Cell fill="#ef4444" stroke="none" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CARD 3: INPUT FORM */}
        <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-fit">
          <h3 className="text-xl font-black mb-8 tracking-tight">{editingId ? "Edit Transaction" : "New Transaction"}</h3>
          <div className="flex gap-2 mb-6 bg-black/50 p-1.5 rounded-2xl border border-gray-800">
            <button onClick={() => setType("income")} className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${type === "income" ? "bg-green-600 text-white shadow-lg shadow-green-900/20" : "text-gray-500 hover:text-white"}`}>Income</button>
            <button onClick={() => setType("expense")} className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${type === "expense" ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-gray-500 hover:text-white"}`}>Expense</button>
          </div>
          <div className="space-y-4">
            <div>
                <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Keterangan</label>
                <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Beli Kopi..." />
            </div>
            <div>
                <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Nominal (IDR)</label>
                <input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all font-mono text-lg" placeholder="0" />
            </div>
          </div>
          <button onClick={tambahTransaksi} className="w-full mt-8 bg-blue-600 p-4 rounded-2xl font-black text-white hover:bg-blue-500 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/30">
            {editingId ? "UPDATE DATA" : "SAVE TRANSACTION"}
          </button>
          {editingId && <button onClick={() => {setEditingId(null); setDesc(""); setAmount(0);}} className="w-full mt-4 text-gray-500 text-xs font-bold hover:text-white transition">CANCEL EDIT</button>}
        </div>

        {/* CARD 4: TRANSACTION HISTORY (FIXED SCROLLING) */}
        <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-[488px] flex flex-col">
          <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <h3 className="text-xl font-black tracking-tight">Recent History</h3>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400">{transactions.length} items</span>
          </div>
          
          {/* 🟢 SCROLLABLE AREA 🟢 */}
          <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">
            {transactions.slice().reverse().map((t: any) => (
              <div key={t.id} className="bg-gray-800/30 p-5 rounded-2xl flex justify-between items-center border border-gray-800/50 hover:border-gray-700 transition-all group">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {t.type === 'income' ? '↓' : '↑'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold group-hover:text-blue-400 transition-colors">{t.desc}</span>
                        <span className="text-gray-500 text-[10px] font-medium font-mono">{new Date(t.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`font-mono text-lg font-black ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+ " : "- "} Rp {t.amount?.toLocaleString()}
                  </span>
                  <div className="flex gap-3 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(t)} title="Edit" className="text-gray-500 hover:text-blue-400 transition">✏️</button>
                    <button onClick={() => hapusTransaksi(t.id)} title="Hapus" className="text-gray-500 hover:text-red-400 transition">🗑</button>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <div className="text-gray-600 text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-sm">No transaction records.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}