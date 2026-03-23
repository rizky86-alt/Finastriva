"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState<number | null>(null); // Menyimpan ID yang sedang diedit

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

      // Reset semua form
      setEditingId(null);
      setDesc("");
      setAmount(0);
      fetchTransactions();
    };
    const hapusTransaksi = async (id: number) => {
    // Mekanik Konfirmasi: Agar tidak tidak sengaja terhapus
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    await fetch(`http://localhost:8080/api/transactions?id=${id}`, {
      method: "DELETE",
    });

    // Refresh data setelah menghapus
    fetchTransactions();
  };
    const startEdit = (t: any) => {
    setEditingId(t.id);
    setDesc(t.desc);
    setAmount(t.amount);
    setType(t.type);

    window.scrollTo({ top: 0, behavior: "smooth" })
  };
  


  return (
    
    
    <main className="flex min-h-screen flex-col items-center p-10 bg-black text-white">
       
       <header className="flex items-center gap-4 mb-10 group">
        {/* Container Logo dengan efek Hover minimalis */}
        <div className="relative p-2 bg-gray-900 rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-2xl shadow-blue-500/10">
          <Image 
            src="/logo-finastriva.svg" 
            alt="Finastriva Logo" 
            width={40} 
            height={40}
            priority // Memastikan logo dimuat paling awal
          />
        </div>

        {/* Penyelarasan Teks Brand */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight font-montserrat text-white leading-none">
            FINASTRIVA
          </h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-semibold mt-1 opacity-80">
            Smart Assets Manager
          </span>
        </div>
      </header>

      <div className="mt-4 p-6 bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex gap-2 mb-4 bg-gray-900 p-1 rounded-lg">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              type === "income" ? "bg-green-600 text-white" : "text-gray-400"
            }`}
          >
            Pemasukan
          </button>

          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              type === "expense" ? "bg-red-600 text-white" : "text-gray-400"
            }`}
          >
            Pengeluaran
          </button>
        </div>

        <label className="block mb-2">Keterangan</label>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 outline-none"
          placeholder="Contoh: Beli Kopi"
        />

        <label className="block mb-2">Nominal (IDR)</label>
        <input
          value={amount === 0 ? "" : amount}
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 mb-6 rounded bg-gray-700 outline-none font-mono"
          placeholder="10000"
        />

        <button
          onClick={tambahTransaksi}
          className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 transition"
        >
        
          {editingId ? "Perbarui Transaksi" : "Simpan Transaksi"}
        </button>
      </div>

      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-400">
          Riwayat Transaksi
        </h2>

        {transactions.map((t: any) => (
          <div
            key={t.id}
            className={`bg-gray-900 p-4 rounded-lg flex justify-between border-l-4 ${
              t.type === "income" ? "border-green-500" : "border-red-500"
            } items-center mb-3 shadow-md`}
          >
            <div className="flex flex-col">
              <span className="text-white font-medium">{t.desc}</span>

              <span className="text-gray-500 text-xs">
                {new Date(t.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <span
              className={`font-mono text-lg font-bold ${
                t.type === "income" ? "text-green-400" : "text-red-400"
              }`}
            >
              {t.type === "income" ? "+" : "-"} Rp{" "}
              {t.amount.toLocaleString()}
            </span>
              
               {/* Tombol Edit */}
              <button 
              onClick={() => startEdit(t)}
              className="text-gray-500 hover:text-blue-500 transition-colors p-2"
            >✏️</button>

             {/* Tombol Hapus */}
            <button 
              onClick={() => hapusTransaksi(t.id)}
              className="text-gray-500 hover:text-red-500 transition-colors p-2"
              title="Hapus">🗑</button>
          </div>
          
        ))}
      </div>
    </main>
  );
}