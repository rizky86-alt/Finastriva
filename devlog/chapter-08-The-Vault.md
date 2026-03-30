
# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 8 – The Vault (Archive & Insights)

Jika Dashboard adalah "Pusat Komando" untuk memantau kondisi hari ini, maka **The Vault** adalah "Gudang Data" tempat kamu bisa melihat sejarah keuanganmu secara mendalam. Di bab ini, kita akan membangun sistem arsip yang cerdas, mulai dari kalkulasi statistik historis hingga tabel interaktif dengan fitur pencarian instan.

---

## 🛠️ Langkah 1: Setup State & Koneksi API

**Tujuan Langkah Ini:**
Sebelum membuat tabel yang keren, kita harus menyiapkan "wadah" (State) untuk menampung data dan membuat fungsi untuk mengambil data tersebut dari Backend Go. Tanpa ini, tabel kita hanya akan berisi data statis yang membosankan.

**Apa yang kita lakukan?**
1.  **Impor Hook:** Kita butuh `useState` untuk menyimpan data dan `useEffect` untuk memicu pengambilan data saat halaman dibuka.
2.  **Define API URL:** Kita menggunakan variabel lingkungan `.env.local` yang sudah kita buat di Chapter 7 agar alamat backend terpusat.
3.  **Fetch Logic:** Membuat fungsi `fetchAllData` untuk "nembak" API transaksi.

**Perubahan Kode:**

```tsx
"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header"; // Kita pakai Header yang sudah ada

export default function VaultPage() {
  // 1. Wadah untuk menyimpan daftar transaksi dari database
  const [transactions, setTransactions] = useState([]);

  // 2. Mengambil alamat API dari pusat konfigurasi (.env.local)
  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

  // 3. Fungsi untuk mengambil seluruh arsip data
  const fetchAllData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal mengambil arsip data:", err);
    }
  };

  // 4. Jalankan fungsi ambil data otomatis saat halaman pertama kali dibuka
  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter">THE VAULT</h1>
        <p className="text-gray-500 text-sm">
          Menampilkan {transactions.length} data yang ditemukan dalam arsip.
        </p>
      </div>

      <div className="bg-gray-900/30 border border-gray-800 rounded-[2rem] p-20 text-center">
        <p className="text-gray-600 italic">
          Data sudah berhasil ditarik dari Backend. Langkah selanjutnya: Membangun Tabel Master.
        </p>
      </div>
    </main>
  );
}
```

**Analisis Mekanik:**
* **`process.env.NEXT_PUBLIC_API_URL`**: Ini memastikan kode kita fleksibel. Kalau nanti kamu ganti port backend, kamu cukup ubah satu file `.env.local` saja.
* **`transactions.length`**: Kita langsung menampilkan jumlah data di bagian sub-judul untuk memverifikasi bahwa koneksi ke database PostgreSQL sudah berhasil.

---


## 🛠️ Langkah 2: Logika & UI Historical Summary

**Tujuan Langkah Ini:**
Pada Dashboard (Chapter 6), kita menggunakan format *list* yang ringkas. Namun, karena **The Vault** adalah "Gudang Data", kita butuh tabel yang lebih padat informasi agar kamu bisa melihat perbandingan antar transaksi secara horizontal dengan mudah.

**Apa yang kita lakukan?**
1.  **Struktur Header:** Menentukan kolom apa saja yang penting (Tanggal, Deskripsi, Kategori, dan Jumlah).
2.  **Mapping Data:** Mengubah array `transactions` menjadi baris-baris tabel (`<tr>`).
3.  **Formatting:** Memastikan tanggal dan nominal uang tampil dalam format Indonesia agar tidak pusing membacanya.

**Perubahan Kode:**
Update bagian `return` pada file `frontend/app/vault/page.tsx` menjadi seperti ini:

```tsx
  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* 1. Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-white">THE VAULT</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">
          Arsip data finansial sejak awal pencatatan.
        </p>
      </div>

      {/* 2. The Master Table Container */}
      <div className="bg-gray-900/20 border border-gray-800 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/40 text-gray-500">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Tanggal</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Deskripsi</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Kategori</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Jumlah (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transactions.length > 0 ? (
                transactions.slice().reverse().map((t: any) => (
                  <tr key={t.id} className="hover:bg-blue-500/5 transition-colors group">
                    <td className="p-6 text-sm font-mono text-gray-500">
                      {new Date(t.created_at).toLocaleDateString("id-ID", { 
                        day: '2-digit', month: 'short', year: 'numeric' 
                      })}
                    </td>
                    <td className="p-6 font-bold text-gray-200">{t.desc}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        t.type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`p-6 text-right font-mono font-bold ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}>
                      {t.type === "income" ? "+" : "-"} {t.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-600 italic">
                    Belum ada data dalam arsip.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
```

**Analisis Mekanik:**
* **`overflow-x-auto`**: Sangat penting agar tabel kamu tidak "pecah" saat dibuka di layar HP; user bisa menggesernya ke samping.
* **`divide-y`**: Memberikan garis pemisah yang tipis antar baris, membuat mata lebih mudah menelusuri data yang banyak.
* **`toLocaleDateString` & `toLocaleString`**: Mengubah data mentah dari database menjadi format manusia (Contoh: `1.000.000` dan `20 Mar 2026`).

---

## 🛠️ Langkah 3: Smart Search & Filter Bar

**Tujuan Langkah Ini:**
Bayangkan kamu punya ribuan data transaksi. Sangat melelahkan jika harus mencari satu transaksi manual dengan *scrolling*. Kita akan membuat fitur di mana kamu cukup mengetik, dan tabel akan menyaring datanya secara instan. 

Kita menggunakan teknik **Client-Side Filtering** karena:
1.  **Instan:** Tidak ada jeda *loading* karena data sudah ada di memori browser.
2.  **Hemat Resource:** Kita tidak perlu membebani Backend Go untuk pencarian yang sederhana.

**Apa yang kita lakukan?**
1.  **State Pencarian:** Menyiapkan `searchTerm` untuk menangkap apa yang kamu ketik.
2.  **State Filter:** Menyiapkan `filterType` untuk menyaring berdasarkan Pemasukan/Pengeluaran.
3.  **Logika Filtering:** Membuat variabel `filteredData` yang merupakan hasil penyaringan dari data asli.

**Perubahan Kode:**
Update file `frontend/app/vault/page.tsx` kamu dengan logika dan UI baru ini:

```tsx
"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react"; // Import icon baru

export default function VaultPage() {
  const [transactions, setTransactions] = useState([]);
  
  // 1. State untuk menyimpan input pencarian dan kategori filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

  const fetchAllData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal mengambil arsip:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. LOGIKA UTAMA: Menyaring data secara real-time di browser
  const filteredData = transactions.filter((t: any) => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-white">THE VAULT</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Arsip data finansial sejak awal pencatatan.</p>
      </div>

      {/* 3. Bar Kontrol: Search Input & Filter Buttons */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari transaksi (misal: Spp, Token, Gaji)..."
            className="w-full bg-gray-900/40 border border-gray-800 p-4 pl-12 rounded-[1.2rem] focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 text-sm text-white"
            onChange={(e) => setSearchTerm(e.target.value)} // Update state saat mengetik
          />
        </div>
        
        <div className="flex bg-gray-900/40 p-1.5 border border-gray-800 rounded-[1.2rem] min-w-[300px]">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)} // Update kategori filter
              className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                filterType === type ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900/20 border border-gray-800 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/40 text-gray-500">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Tanggal</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Deskripsi</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Kategori</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {/* 4. Gunakan filteredData, bukan transactions asli */}
              {filteredData.length > 0 ? (
                filteredData.slice().reverse().map((t: any) => (
                  <tr key={t.id} className="hover:bg-blue-500/5 transition-colors group">
                    {/* ... isi baris sama seperti Tahap 2 ... */}
                    <td className="p-6 text-sm font-mono text-gray-500">
                      {new Date(t.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-6 font-bold text-gray-200">{t.desc}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        t.type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`p-6 text-right font-mono font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                      {t.type === "income" ? "+" : "-"} {t.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-600 italic">
                    Data tidak ditemukan dalam arsip.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
```

**Analisis Mekanik:**
* **`filteredData`**: Ini adalah variabel "bayangan". Kita tidak merusak data asli (`transactions`), tapi kita membuat tampilan yang sudah disaring. Jika input kosong, `filter` akan mengembalikan semua data secara otomatis.
* **`group-focus-within`**: Detil desain kecil agar ikon kaca pembesar berubah warna biru saat kamu mengeklik kotak pencarian, memberikan kesan aplikasi yang responsif.
* **`Animate-Ready`**: Struktur ini sudah siap untuk kita tambahkan animasi Framer Motion agar baris tabel tidak "hilang kaget" saat disaring.

---

## 🛠️ Langkah 4: Historical Summary Cards

**Tujuan Langkah Ini:**
Tabel memberikan detail, tapi **Card** memberikan *insight*. Tujuan langkah ini adalah menghitung total seluruh transaksi (Life-time Stats) yang ada di database. Kita ingin tahu tiga angka keramat:
1.  **Total Pemasukan:** Berapa banyak uang yang pernah masuk?
2.  **Total Pengeluaran:** Berapa banyak uang yang sudah keluar?
3.  **Saldo Bersih (Net Balance):** Berapa sisa uang yang seharusnya ada?

**Apa yang kita lakukan?**
1.  **Agregasi Data:** Menggunakan fungsi `.reduce()` untuk menjumlahkan angka di dalam array transaksi.
2.  **Visual Depth:** Menambahkan kartu dengan warna yang berbeda (Biru, Hijau, Merah) dan ikon latar belakang (Watermark) agar tampilan terlihat seperti aplikasi keuangan profesional.
3.  **Micro-Interaction:** Menambahkan efek *hover* sederhana agar kartu terasa interaktif.

**Perubahan Kode:**
Tambahkan logika perhitungan di atas `filteredData` dan masukkan UI kartu di bawah Header. Berikut kode lengkap untuk file `frontend/app/vault/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
// 1. Tambahkan ikon baru: Wallet, TrendingUp, TrendingDown
import { Search, Download, Trash2, Wallet, TrendingUp, TrendingDown, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VaultPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

  const fetchAllData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal ambil arsip:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. LOGIKA AGREGASI: Menghitung angka historis dari seluruh data
  const totalIncome = transactions
    .filter((t: any) => t.type === "income")
    .reduce((sum, t: any) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((sum, t: any) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredData = transactions.filter((t: any) => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">THE VAULT</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Arsip data finansial sejak awal pencatatan.</p>
        </div>
      </div>

      {/* 3. UI BARU: Historical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Net Balance */}
        <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-blue-500/10 group-hover:scale-110 transition-transform duration-500">
            <Wallet size={120} />
          </div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Net Historical Balance</p>
          <h2 className="text-2xl font-black text-white">Rp {netBalance.toLocaleString("id-ID")}</h2>
        </div>

        {/* Total Income */}
        <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-green-500/10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={120} />
          </div>
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Total Life-time Income</p>
          <h2 className="text-2xl font-black text-white">Rp {totalIncome.toLocaleString("id-ID")}</h2>
        </div>

        {/* Total Expense */}
        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-red-500/10 group-hover:scale-110 transition-transform duration-500">
            <TrendingDown size={120} />
          </div>
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Total Life-time Expense</p>
          <h2 className="text-2xl font-black text-white">Rp {totalExpense.toLocaleString("id-ID")}</h2>
        </div>
      </div>

      {/* SEARCH & FILTER (Sama seperti Tahap 3) */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari dalam arsip..."
            className="w-full bg-gray-900/40 border border-gray-800 p-4 pl-12 rounded-[1.2rem] focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600 text-sm text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-gray-900/40 p-1.5 border border-gray-800 rounded-[1.2rem] min-w-[300px]">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                filterType === type ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* TABEL (Sama seperti Tahap 2) */}
      <div className="bg-gray-900/20 border border-gray-800 rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* ... isi tabel ... */}
          </table>
        </div>
      </div>
    </main>
  );
}
```

**Analisis Mekanik:**
* **`.reduce()`**: Ini adalah cara paling efisien untuk menghitung total. Kita menjumlahkan semua `amount` untuk mendapatkan angka besar tanpa perlu melakukan *looping* manual yang lambat.
* **`absolute -right-4 -bottom-4`**: Teknik memposisikan ikon di pojok kartu dengan posisi "meluber" keluar sedikit adalah trik desain agar kartu terlihat lebih modern dan tidak kaku.
* **`group-hover`**: Dengan membungkus elemen dalam class `group`, kita bisa membuat ikon di latar belakang membesar saat seluruh area kartu disorot, memberikan kesan *premium*.

## 🛠️ Langkah 5: Delete Action & Framer Motion Layout

**Tujuan Langkah Ini:**
Sebuah gudang data yang dinamis harus memungkinkan pengguna untuk membuang data yang sudah tidak valid. Selain itu, kita akan memberikan sentuhan "Sihir" menggunakan Framer Motion agar baris tabel memiliki transisi yang halus saat dihapus atau disaring. Tanpa ini, perubahan data akan terasa kaku dan "patah-patah".

**Apa yang kita lakukan?**
1.  **Fungsi Hapus:** Membuat fungsi `hapusData` yang mengirimkan request `DELETE` ke Backend Go berdasarkan ID unik transaksi.
2.  **AnimatePresence:** Membungkus baris tabel dengan komponen ini agar Next.js bisa menjalankan animasi "keluar" sebelum elemen benar-benar hilang dari layar.
3.  **Layout Animation:** Menambahkan properti `layout` pada baris tabel agar baris di bawahnya otomatis bergeser naik dengan mulus saat ada baris di atasnya yang dihapus.

**Perubahan Kode:**
Silakan lengkapi file `frontend/app/vault/page.tsx` kamu dengan bagian akhir ini:

```tsx
"use client";
import { useState, useEffect } from "react";
// 1. Tambahkan Trash2 dan AnimatePresence
import { Search, Download, Trash2, Wallet, TrendingUp, TrendingDown, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VaultPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/transactions";

  const fetchAllData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal ambil arsip:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. FUNGSI HAPUS: Menghapus data permanen dari database
  const hapusData = async (id: number) => {
    if (!confirm("Hapus data permanen dari Vault?")) return;
    
    try {
      const res = await fetch(`${API_URL}?id=${id}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        // Refresh data setelah berhasil menghapus
        fetchAllData();
      }
    } catch (err) {
      alert("Waduh, gagal menghapus data.");
    }
  };

  // ... (logika filteredData dan summary tetap sama) ...
  const filteredData = transactions.filter((t: any) => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* ... (Header dan Summary Cards) ... */}

      {/* 3. TABLE DENGAN ANIMASI PREMIUM */}
      <div className="bg-gray-900/20 border border-gray-800 rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/40 text-gray-500">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Tanggal</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Deskripsi</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Jumlah</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* AnimatePresence memastikan animasi 'exit' berjalan */}
              <AnimatePresence mode="popLayout">
                {filteredData.length > 0 ? (
                  filteredData.map((t: any) => (
                    <motion.tr
                      key={t.id}
                      layout // Baris akan bergeser mulus saat ada yang dihapus
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-gray-800/50 hover:bg-blue-500/5 transition-colors group"
                    >
                      <td className="p-6 text-sm font-mono text-gray-500">
                        {new Date(t.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6 font-bold text-gray-200">{t.desc}</td>
                      <td className={`p-6 text-right font-mono font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                        {t.type === "income" ? "+" : "-"} {t.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => hapusData(t.id)} 
                          className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={4} className="p-20 text-center">
                       <div className="flex flex-col items-center gap-3 text-gray-600">
                         <Inbox size={48} className="opacity-20" />
                         <p>Arsip tidak ditemukan.</p>
                       </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
```

**Analisis Mekanik:**
* **`AnimatePresence mode="popLayout"`**: Ini adalah kunci agar elemen yang tersisa tidak "loncat" saat elemen lain dihapus. Elemen akan meluncur perlahan ke posisi baru mereka.
* **`confirm()`**: Meskipun kita ingin cepat, keamanan data finansial adalah nomor satu. Dialog konfirmasi mencegah kesalahan fatal akibat klik yang tidak sengaja.
* **`exit={{ opacity: 0, scale: 0.95 }}`**: Memberikan efek visual seolah-olah baris tersebut menyusut dan menghilang ke belakang, memberikan kesan kedalaman pada UI dashboard kamu.

---
## 🧐 Mekanik Engineering di Balik Chapter 8

1.  **Client-Side Filtering:** Kita tidak merusak data asli di state `transactions`, tapi kita membuat "bayangan" melalui `filteredData`. Ini teknik optimasi agar pencarian terasa instan.
2.  **Data Aggregation:** Penggunaan `.reduce()` memungkinkan kita menghitung ribuan data arus kas secara efisien untuk ditampilkan di Summary Cards.
3.  **Visual Hierarchy:** Watermark icon dan Zebra-hover effect membantu mata pengguna tetap fokus saat menelusuri data yang padat di dalam "Gudang Data".


**Checklist Final Chapter 8:**
* [x] Data ditarik otomatis dari Backend Go.
* [x] Pencarian instan dan Filter kategori di sisi Client.
* [x] Kartu Statistik Historis sepanjang masa.
* [x] Fitur hapus permanen dengan transisi animasi halus.

Gudang data sudah mantap, navigasi sidebar sudah licin. Sekarang, apakah kamu siap untuk memberikan "Otak Buatan" pada aplikasi ini? Kita bisa lanjut ke **Chapter 11: AI HUB (Integrasi Gemini AI)** atau fokus ke **Chapter 10: Security Layer** dulu? Katakan pilihanmu! 🚀🧠

✅ **Checkpoint Final Chapter 8:** `THE VAULT` kini berfungsi penuh sebagai pusat arsip yang interaktif, cerdas, dan estetik. 🚀
