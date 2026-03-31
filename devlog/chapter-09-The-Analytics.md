
# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 9 – The Analytics: Data Visualization with Recharts

Setelah membangun sistem navigasi di Chapter 7 dan sistem arsip finansial di Chapter 8, sekarang saatnya kita membangun **The Analytics Hub**.

Jika Vault berfungsi sebagai **arsip pintar**, maka Analytics Hub adalah **mesin visualisasi data** yang membantu kita memahami pola keuangan dengan cepat.

Daripada membaca ratusan angka di tabel, kita akan melihat:

* **Cash Flow Trend** → bagaimana arus uang bergerak dari waktu ke waktu
* **Spending Breakdown** → kategori pengeluaran terbesar

Semua grafik ini **reaktif terhadap pencarian dan filter di Vault**.

Artinya jika Anda mencari `"kopi"` atau `"gaji"`, grafik akan ikut berubah secara **live**.

>Buka terminal kamu (pastikan di folder `frontend`), lalu jalankan perintah ini:

```bash
npm install recharts
```

---

# 🗺️ Roadmap Chapter 9 (The Visualization Journey)

| Langkah | Fokus Utama              | Deskripsi                                                          |
| :------ | :----------------------- | :----------------------------------------------------------------- |
| **1**   | **The Components**       | Membuat komponen grafik `TrendChart.tsx` dan `CategoryChart.tsx`.  |
| **2**   | **Cash Flow Logic**      | Mengubah pengeluaran menjadi nilai negatif untuk grafik arus kas.  |
| **3**   | **Smart Grouping**       | Menggunakan `.reduce()` untuk mengelompokkan kategori pengeluaran. |
| **4**   | **Live Analytics Sync**  | Menghubungkan grafik dengan sistem filter Vault.                   |
| **5**   | **Empty State & Polish** | Menambahkan fallback UI dan memperbaiki tampilan axis.             |

---

## 📦 Full Source Code (Copy-Paste)

### 📊 1. TrendChart.tsx

Grafik tidak bisa membaca data "transaksi per baris". Dia butuh data yang sudah dikelompokkan (misal: per bulan). Kita akan buat fungsi pembantu untuk mengubah data dari database menjadi format koordinat grafik.

>Buat file baru di **`frontend/app/components/TrendChart.tsx`**. Komponen ini akan menerima data transaksi dan mengubahnya menjadi **Area Chart** dengan efek gradien biru neon.


```tsx

"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

interface TrendChartProps {
  data: Transaction[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // 1. Logika Pengolahan Data
  // Kita ambil 10 data terakhir, jadikan negatif jika pengeluaran (True Cash Flow)
  const chartData = data.slice(0, 10).reverse().map(t => ({
    name: new Date(t.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' }),
    amount: t.type === 'income' ? t.amount : -t.amount,
    type: t.type
  }));

  return (
    <div className="w-full h-[300px] mt-4 flex items-center justify-center">
      {chartData.length === 0 ? (
        <div className="text-gray-600 italic text-sm border-2 border-dashed border-gray-800 rounded-3xl w-full h-full flex items-center justify-center">
          No data for trend analysis.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 30, bottom: 20 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => {
                if (value >= 1000000 || value <= -1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000 || value <= -1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
            />
            <ReferenceLine y={0} stroke="#4b5563" strokeWidth={2} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid #374151', 
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
              formatter={(value: unknown) => typeof value === 'number' ? `Rp ${value.toLocaleString("id-ID")}` : String(value)}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```

### Integrasi ke Page Vault
Sekarang kita masukkan grafik ini ke dalam halaman **The Vault**. Buka **`frontend/app/vault/page.tsx`** dan tambahkan komponen `TrendChart` di bawah kartu statistik.

**Update pada `app/vault/page.tsx`:**

1.  **Import:** `import TrendChart from "../components/TrendChart";`
2.  **Pasang di UI:** Cari bagian setelah kartu statistik (Historical Summary Cards) dan sebelum Search Bar, lalu masukkan kode ini:

```tsx
{/* --- CHAPTER 9: TREND VISUALIZATION --- */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] mb-12 shadow-2xl relative overflow-hidden"
>
  <div className="flex justify-between items-center mb-2">
    <div>
      <h3 className="text-lg font-black tracking-tight">CASH FLOW TREND</h3>
      <p className="text-gray-500 text-xs">Visualisasi pergerakan aset 10 transaksi terakhir.</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Data</span>
    </div>
  </div>
  
  {/* Masukkan Komponen Grafik */}
  <TrendChart data={filteredData} />
</motion.div>
```

---

### 🧐 Apa yang Terjadi di Sini?

1.  **`ResponsiveContainer`:** Membuat grafik kamu fleksibel. Kalau layarmu ditarik kecil (HP), grafiknya nggak bakal kepotong, tapi ikut mengecil.
2.  **`linearGradient`:** Ini rahasia tampilan "mahal". Kita nggak cuma kasih warna biru, tapi gradien dari biru transparan yang memudar ke bawah.
3.  **`monotone`:** Membuat garis grafik melengkung halus (*smooth curves*), bukan garis patah-patah yang kaku.
4.  **`animationDuration`:** Begitu halaman dibuka, garisnya akan "menggambar" dirinya sendiri selama 2 detik. *User experience* yang sangat memuaskan!

---

### ✅ Checklist Verifikasi Chapter 9 (Part 1)
* [ ] Jalankan `npm install recharts`.
* [ ] Buat file `TrendChart.tsx`.
* [ ] Update `VaultPage` untuk memanggil grafiknya.
* [ ] Cek di browser: Apakah ada garis biru keren yang muncul di atas tabel?

---

### 🍩 2. CategoryChart.tsx

Sama kayak sebelumnya, Recharts butuh format data khusus. Kita harus menjumlahkan transaksi yang punya deskripsi/kategori yang sama. 

>Buat file baru di **`frontend/app/components/CategoryChart.tsx`**. Kita akan pakai skema warna "Cyberpunk" (Ungu, Pink, Cyan) biar kontras sama grafik biru tadi.


```tsx

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

interface CategoryChartProps {
  data: Transaction[];
}

interface GroupedData {
  name: string;
  value: number;
}

// Warna-warna futuristik untuk tiap potongan donat
const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export default function CategoryChart({ data }: CategoryChartProps) {
  // 1. Filter hanya pengeluaran
  const expenses = data.filter((t) => t.type === "expense");

  // 2. Kelompokkan berdasarkan deskripsi (Smart Grouping)
  const groupedData = expenses.reduce((acc: GroupedData[], t: Transaction) => {
    const found = acc.find((item) => item.name === t.desc);
    if (found) {
      found.value += t.amount;
    } else {
      acc.push({ name: t.desc, value: t.amount });
    }
    return acc;
  }, [] as GroupedData[]);

 // Ambil 5 pengeluaran terbesar saja biar gak penuh
  const finalData = groupedData.sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="w-full h-[300px] flex items-center justify-center mt-4">
      {finalData.length === 0 ? (
        <div className="text-gray-600 italic text-sm border-2 border-dashed border-gray-800 rounded-3xl w-full h-full flex items-center justify-center">
          No expense categories found.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={finalData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Ini yang bikin jadi Donat
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {finalData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid #374151', 
                borderRadius: '12px',
                color: '#fff' 
              }}
              formatter={(value: unknown) => 
                typeof value === 'number' 
                  ? `Rp ${value.toLocaleString("id-ID")}` 
                  : String(value)
              }
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value: unknown) => <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{String(value)}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```

### Integrasi ke Page Vault


**Buka `frontend/app/vault/page.tsx`**, cari bagian yang tadi kita pasang `TrendChart`, lalu ganti dengan struktur **Grid** ini:

```tsx
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
```

---

### 🧐 Kenapa Tampilan Ini "Mahal"?

1.  **InnerRadius (Donut):** Grafik donat lebih modern dibanding grafik kue (pie) biasa karena ada ruang kosong di tengah yang bikin tampilan "bersih".
2.  **PaddingAngle:** Memberi jarak kecil antar potongan donat agar tidak terlihat berdempetan.
3.  **Automatic Legend:** Recharts otomatis nampilin nama transaksi di bawah grafik, jadi kamu nggak perlu nebak-nebak warna ini punya siapa.
4.  **Data Filtering Sync:** Sama kayak Trend Chart, Donut ini juga **reaktif**. Kalau kamu ketik "Token" di search bar, donatnya bakal langsung berubah 100% cuma buat nampilin data Token.

---

### ✅ Checklist Akhir Chapter 9
* [ ] Komponen `CategoryChart.tsx` sudah siap.
* [ ] Layout di `vault/page.tsx` sudah pakai sistem Grid (2 kolom).
* [ ] Cek di browser: Apakah kedua grafik muncul berdampingan dengan animasi yang cakep?

---

# Interactive Step-by-Step Analysis

---

## 🛠️ Langkah 1: The Components (Modular Visualization)

Berbeda dengan Vault yang berada dalam satu file besar, Analytics Hub dibuat **modular**.

Artinya setiap grafik memiliki file sendiri:

```
components/
   TrendChart.tsx
   CategoryChart.tsx
```

Keuntungan pendekatan ini:

| Keuntungan   | Penjelasan                         |
| ------------ | ---------------------------------- |
| Reusable     | Chart bisa dipakai di halaman lain |
| Cleaner Code | Vault tidak menjadi file raksasa   |
| Easier Debug | Bug chart tidak merusak page utama |

### Mini Challenge

Tambahkan chart baru:

```
MonthlyChart.tsx
```

Yang menampilkan **income per bulan**.

---

✅ **Checkpoint 9.1:** Komponen visual kini modular dan scalable.

---

## 🛠️ Langkah 2: True Cash Flow Logic

Banyak aplikasi keuangan membuat grafik yang **tidak jujur**.

Pengeluaran tetap ditampilkan sebagai angka positif.

Akibatnya grafik terlihat **selalu naik**.

Di Finastriva kita menggunakan **True Cash Flow Logic**.

**Logikanya:** 
Kita mengubah angka pengeluaran menjadi **negatif**. Jika Anda belanja 50rb, grafik akan turun ke arah `-50.000`. Kita juga menambahkan `ReferenceLine` pada angka **0** sebagai jangkar visual.

**Kenapa ini penting?** 
Agar user bisa melihat secara instan apakah pengeluaran mereka lebih besar dari pemasukan dalam satu periode.

```ts
amount: t.type === "income" ? t.amount : -t.amount
```

Artinya:

| Transaksi   | Nilai Grafik |
| ----------- | ------------ |
| Income 100k | +100k        |
| Expense 50k | -50k         |

Grafik sekarang memiliki **arah naik dan turun**.

---

### Mini Challenge

Tambahkan warna berbeda:

```
income → green
expense → red
```

Pada chart.

---

✅ **Checkpoint 9.2:** Grafik kini merepresentasikan arus kas sebenarnya.

---

## 🛠️ Langkah 3: Smart Category Grouping

Jika user membeli kopi 3 kali:

```
kopi 15k
kopi 20k
kopi 10k
```

Kita tidak ingin donut chart memiliki **3 potongan berbeda**.

Kita ingin:

```
kopi = 45k
```

Inilah fungsi `.reduce()`.

```ts
const groupedData = expenses.reduce((acc, t) => {
```

Logika:

1️⃣ cek apakah kategori sudah ada
2️⃣ jika ada → tambah value
3️⃣ jika tidak → buat kategori baru

---

### Mini Challenge

Ubah sistem grouping agar:

```
kopi susu
kopi hitam
kopi latte
```

semua masuk kategori **"Kopi"**.

(Hint: gunakan `.includes()`)

---

✅ **Checkpoint 9.3:** Pengeluaran otomatis dikelompokkan.

---

## 🛠️ Langkah 4: Live Sync dengan Vault

Ini adalah **kekuatan terbesar arsitektur Finastriva**.

Vault mengirim data ke chart:

```tsx
<TrendChart data={filteredData} />
<CategoryChart data={filteredData} />
```

Karena datanya adalah `filteredData`:

| User Action | Chart Reaction           |
| ----------- | ------------------------ |
| Search      | Chart berubah            |
| Filter      | Chart berubah            |
| Pagination  | Tidak mempengaruhi chart |

Ini disebut:

### **Reactive Analytics System**

---

### Mini Challenge

Buat tombol:

```
Last 30 Days
```

yang memfilter data chart.

---

✅ **Checkpoint 9.4:** Chart kini mengikuti search dan filter secara live.

---

## 🛠️ Langkah 5: Empty State & Visual Polish

Jika tidak ada data:

* chart akan error
* layout bisa rusak

Karena itu kita tambahkan **fallback UI**.

```
No data for trend analysis
```

Selain itu kita memperbaiki **axis numbers** agar tidak terlalu panjang.

Contoh:

| Value     | Display |
| --------- | ------- |
| 1,000     | 1k      |
| 1,000,000 | 1M      |

---

### Mini Challenge

Tambahkan animasi:

```
animate-pulse
```

pada empty state.

---

✅ **Checkpoint 9.5:** Grafik tetap rapi bahkan tanpa data.

---

# 📌 Ringkasan Akhir Chapter 9

| Fitur                        | Status |
| ---------------------------- | ------ |
| Recharts Integration         | ✅      |
| True Cash Flow Visualization | ✅      |
| Automatic Category Grouping  | ✅      |
| Live Sync with Vault         | ✅      |
| Responsive Charts            | ✅      |
| Empty State Handling         | ✅      |

---

## ✅ Checkpoint Final Chapter 9

Dengan Analytics Hub selesai, Finastriva sekarang memiliki:

📊 **Visual Data Insight**
📈 **True Cash Flow Tracking**
🍩 **Smart Spending Breakdown**
⚡ **Real-time Reactive Charts**

Vault sekarang bukan hanya arsip data.

Vault telah berubah menjadi **Financial Intelligence Dashboard**. 🚀

---
