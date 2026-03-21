"use client";
import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");

  const tambahTransaksi = async () => {
    const res = await fetch("http://localhost:8080/api/transactions", {
      method: "POST",
      body: JSON.stringify({ amount: Number(amount), desc, type: "expense" }),
    });
    if (res.ok) alert("Transaksi Berhasil Disimpan!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-black text-white">
      <h1 className="text-3xl font-bold text-blue-500">Finastriva Dashboard</h1>
      
      <div className="mt-10 p-6 bg-gray-800 rounded-lg w-full max-w-md">
        <label className="block mb-2">Keterangan</label>
        <input 
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 outline-none" 
          placeholder="Contoh: Beli Kopi"
        />
        
        <label className="block mb-2">Nominal (IDR)</label>
        <input 
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 mb-4 rounded bg-gray-700 outline-none" 
          placeholder="10000"
        />
        
        <button 
          onClick={tambahTransaksi}
          className="w-full bg-blue-600 p-2 rounded font-bold hover:bg-blue-700">
          Simpan Transaksi
        </button>
      </div>
    </main>
  );
}