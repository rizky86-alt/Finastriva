
# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 8 – The Vault: Financial Archive & Live Analytics

Setelah membangun sistem navigasi di Chapter 7, sekarang saatnya kita membangun fitur **The Vault**. 

Berbeda dengan Dashboard yang berfokus pada transaksi harian, The Vault dirancang sebagai arsip besar yang "pintar". Kita akan mengimplementasikan fitur pencarian mendalam, statistik yang berubah secara *live* mengikuti pencarian, dan sistem pembagian halaman (pagination).

---

## Full Source Code (Copy-Paste)

```tsx

"use client";

import { useState, useEffect } from "react";
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

// --- LANGKAH 1: THE SKELETON (TypeScript Interface) ---
interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: "income" | "expense";
  created_at: string;
}

export default function VaultPage() {
  // --- LANGKAH 1: THE SKELETON (State Management) ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // --- LANGKAH 7: PREMIUM PAGINATION (State) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

  // --- LANGKAH 1: THE SKELETON (Fetch Data) ---
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal ambil arsip:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- LANGKAH 4: ARCHIVE ENGINE (Filtering Logic) ---
  const filteredData = transactions.filter((t) => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  // --- LANGKAH 7: PREMIUM PAGINATION (Logic) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- LANGKAH 4: ARCHIVE ENGINE (Smart Reset Halaman) ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // --- LANGKAH 2: LIVE ANALYTICS (Smart Calculations) ---
  const totalIncome = filteredData
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = filteredData
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const hapusData = async (id: number) => {
    if (!confirm("Hapus data permanen dari Vault?")) return;
    try {
      const res = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAllData();
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  return (
    // --- LANGKAH 6: TAILWIND DESIGN (Layouting & Glassmorphism) ---
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen font-sans">
      
      {/* --- LANGKAH 3: STATS CARDS (Header Section) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter uppercase">THE VAULT</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Arsip data finansial sejak awal pencatatan.</p>
        </motion.div>
        
        <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-300 hover:bg-gray-800 transition-all active:scale-95 shadow-lg">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* --- LANGKAH 3: STATS CARDS (Visuals & Hover Effects) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Balance Card */}
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

        {/* Income Card */}
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

        {/* Expense Card */}
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

      {/* --- CHAPTER 9: THE ANALYTICS HUB GRID --- */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      
      {/* Kiri: Trend Line Chart */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="mb-4">
          <h3 className="text-lg font-black tracking-tight text-white uppercase">Cash Flow Trend</h3>
          <p className="text-gray-500 text-xs font-medium">Aliran dana 10 transaksi terakhir.</p>
        </div>
        <TrendChart data={filteredData} />
      </motion.div>

      {/* Kanan: Spending Distribution (Donut Chart) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="mb-4">
          <h3 className="text-lg font-black tracking-tight text-white uppercase">Spending Breakdown</h3>
          <p className="text-gray-500 text-xs font-medium">Top 5 alokasi pengeluaran terbesar.</p>
        </div>
        <CategoryChart data={filteredData} />
      </motion.div>

    </div>

      {/* --- LANGKAH 4: ARCHIVE ENGINE (Search & Filter UI) --- */}
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

      {/* --- LANGKAH 5: THE PREMIUM TABLE (Data Display & Animations) --- */}
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

        {/* --- LANGKAH 7: PREMIUM PAGINATION (Navigation UI) --- */}
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

```

> ✅ **Checkpoint 8.0:** Copy-paste ke project kamu, jalankan, dan lihat hasil “The Vault” secara penuh.

---

## 🗺️ Roadmap Chapter 8 (The Archive Journey)

| Langkah | Fokus Utama | Deskripsi |
| :--- | :--- | :--- |
| **1** | **The Skeleton** | Setup TypeScript Interface dan koneksi ke API database. |
| **2** | **Live Analytics** | Membuat statistik yang berubah secara cerdas mengikuti hasil pencarian. |
| **3** | **Stats Cards** | Desain visual kartu informasi yang mewah dan interaktif. |
| **4** | **Archive Engine** | Sistem pencarian (Search) dan filter kategori (Income/Expense). |
| **5** | **The Premium Table** | Menampilkan data dalam tabel dengan animasi transisi yang halus. |
| **6** | **Tailwind Tutorial** | Bedah desain (Glassmorphism, Layouting, Interaksi). |
| **7** | **Premium Pagination** | Menjaga halaman tetap rapi dengan membagi data menjadi beberapa halaman. |

---

## Interactive Step-by-Step Analysis

Di bawah, setiap langkah ada **“Mini Challenge”** agar pembaca aktif:

### 🛠️ Langkah 1: The Skeleton (Pondasi Aman)

Kita mulai dengan menentukan "aturan main" untuk data kita menggunakan **TypeScript Interface**. Ini memastikan aplikasi tidak akan error jika ada data yang salah format. Setelah itu, kita siapkan "lemari" (state) untuk menyimpan data.

```tsx
// Aturan data transaksi
interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: "income" | "expense";
  created_at: string;
}

// State untuk menyimpan data
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [isLoading, setIsLoading] = useState(true);
```
**Tujuan:** Memastikan aplikasi punya data structure dan koneksi API.

**Mini Challenge:**

* Tambahkan state baru: `const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);`
* Apa efeknya jika kita gunakan `selectedTransaction` di tabel?

✅ **Checkpoint 8.1:** Pondasi data siap dan aplikasi terhubung dengan database secara aman.

---

### 🛠️ Langkah 2: Live Analytics (Smart Intelligence)

Fitur ini membuat Vault terasa "hidup". Statistik di atas tidak hanya menunjukkan total seumur hidup, tapi **Total dari apa yang sedang Anda cari**. 

**Logikanya:** Kita menghitung dari `filteredData`, bukan dari semua data.

```tsx
const totalIncome = filteredData
  .filter((t) => t.type === "income")
  .reduce((sum, t) => sum + (t.amount || 0), 0);

const netBalance = totalIncome - totalExpense;
```

**Tujuan:** Hitung total income, expense, dan net balance berdasarkan filter/search.

**Mini Challenge:**

1. Ubah `filteredData` agar hanya menghitung transaksi bulan ini (`created_at`).
2. Amati perubahan angka pada kartu statistik.

✅ **Checkpoint 8.2:** Kartu statistik kini reaktif dan berubah secara otomatis saat Anda mengetik di Search Bar.

---

### 🛠️ Langkah 3: Desain Kartu Statistik (Premium Visuals)

Kita mendesain 3 kartu utama (Net, Income, Expense) dengan sentuhan profesional:
- **Warna:** Biru, Hijau, dan Merah yang lembut.
- **Background Ikon:** Ikon raksasa yang transparan di pojok kanan bawah kartu.
- **Interaksi:** Kartu akan bergeser naik (`whileHover={{ y: -5 }}`) saat disentuh kursor.

**Tujuan:** Menampilkan kartu Net, Income, Expense interaktif dengan Motion hover.

**Mini Challenge:**

* Ganti ikon pada kartu Net Balance dengan `TrendingUp`.
* Coba ubah warna `bg-blue-600/10` menjadi `bg-purple-500/10`.
* Apa efeknya terhadap UX?

✅ **Checkpoint 8.3:** UI statistik tampil mewah seperti aplikasi bank modern.

---

### 🛠️ Langkah 4: Archive Engine (Pencarian & Filter)

Pengguna bisa mencari data berdasarkan deskripsi dan memilah kategori. Kita juga menambahkan **Smart Reset** agar halaman otomatis kembali ke nomor 1 saat pengguna mulai mencari (agar hasil tidak tersembunyi di halaman lain).

```tsx
const filteredData = transactions.filter((t) => {
  const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
  const matchType = filterType === "all" || t.type === filterType;
  return matchSearch && matchType;
});

// Reset ke halaman 1 jika filter berubah
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, filterType]);
```
**Tujuan:** Filter transaksi dan search by description.

**Mini Challenge:**

1. Tambahkan filter baru: `type === "savings"`.
2. Ubah placeholder input menjadi `"Cari transaksi / tabungan..."`.

✅ **Checkpoint 8.4:** Sistem penyaringan data bekerja secara instan tanpa loading ulang.

---

### 🛠️ Langkah 5: The Premium Table & Animasi

Data ditampilkan dalam tabel yang sangat rapi. Kita menggunakan `AnimatePresence` dari Framer Motion agar saat baris data muncul atau menghilang, gerakannya terasa halus.

- **Mata Uang:** Kita ubah angka menjadi format Rupiah yang mudah dibaca (`toLocaleString("id-ID")`).
- **Tanggal:** Kita format tanggal menjadi lebih manusiawi (Contoh: "31 Mar 2026").

**Tujuan:** Tampilkan transaksi dalam tabel animasi halus.

**Mini Challenge:**

* Tambahkan kolom baru `Notes` → tampilkan dummy text `"Belanja harian"`
* **Hint:** Jangan lupa update `interface Transaction` di Langkah 1 agar mendukung kolom baru ini (misal: `notes?: string;`)!
* Perhatikan animasi AnimatePresence saat menambah/menghapus data

✅ **Checkpoint 8.5:** Penyajian data terasa profesional dan interaktif.

---

### 🎨 Langkah 6: Tailwind Design Tutorial

Inilah "resep" rahasia desain premium di halaman ini:

1.  **Glassmorphism:** Menggunakan `bg-gray-900/40` dan `backdrop-blur-md` untuk efek kaca buram yang elegan.
2.  **Layouting:** Menggunakan `grid` untuk kartu dan `flex` untuk filter bar agar responsif di HP maupun Laptop.
3.  **Spacing:** Sudut yang sangat bulat (`rounded-[2.5rem]`) memberikan kesan modern dan organik.

**Tujuan:** Layouting, glassmorphism, spacing modern.

**Mini Challenge:**

* Tambahkan `hover:scale-105` pada kartu statistik
* Ubah `rounded-[2.5rem]` menjadi `rounded-3xl`
* Lihat perbedaan visual

✅ **Checkpoint 8.6:** Desain visual kini konsisten, responsif, dan terlihat mahal.

---

### 📑 Langkah 7: Premium Pagination (Manajemen Data)

Agar halaman tidak menjadi sangat panjang jika ada ribuan data, kita membaginya menjadi beberapa halaman (10 data per halaman).

```tsx
const itemsPerPage = 10;
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
```
**Tujuan:** Slice filteredData, navigasi page, prev/next buttons.

**Mini Challenge:**

1. Ubah `itemsPerPage` menjadi `5`
2. Tambahkan tombol `First` & `Last` page
3. Amati perbedaan pagination di tabel

✅ **Checkpoint 8.7:** Navigasi data kini lebih teratur dan performa aplikasi tetap cepat.

---

## 📌 Ringkasan Akhir Chapter 8

| Fitur | Status |
| :--- | :--- |
| TypeScript Type Safety | ✅ |
| Live Recreative Analytics | ✅ |
| Premium Stats Cards Design | ✅ |
| Real-time Search & Filter Engine | ✅ |
| Animated Premium Data Table | ✅ |
| Tailwind Glassmorphism Styling | ✅ |
| Client-Side Pagination System | ✅ |

✅ **Checkpoint Final Chapter 8:** The Vault selesai dengan standar industri dan siap dikembangkan lebih jauh!
