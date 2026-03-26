# 🚀 Finastriva Fullstack Project

Dokumentasi ini dibuat untuk **tracking progres coding step-by-step** dan penggunaan Git di project **Finastriva**.
Cocok untuk mahasiswa *Engineering* yang ingin melihat perkembangan kode secara bertahap saat mem-prompt AI.

---

# 📘 Chapter 6 – UI & UX (Revised)

Chapter ini fokus pada menyelesaikan objective utama Finastriva.

Sub-chapter saat ini:

1. **Fase 6.1**: Typography & Logo Integration
2. **Fase 6.2**: Bento Grid Layout & Responsive Design
3. **Fase 6.3**: Computed Dashboard Logic
4. **Fase 6.4**: Data Visualization (Charts)
5. **Fase 6.5**: Interaction Polish & Refactoring

**Goal Chapter:**
Membuat tampilan yang terasa seperti **produk fintech modern**.

---

# Chapter 6.1 – Typography & Logo Integration (Revised)

# Typography

Tipografi bukan sekadar memilih bentuk tulisan, melainkan instrumen utama dalam membangun keterbacaan data dan identitas profesional pada aplikasi finansial.

Pada bab ini kita akan mengonfigurasi **Montserrat** sebagai font utama untuk aplikasi **Finastriva**.

---

## **Step 1**: Analisis Pemilihan Font & Implementasi dengan `next/font`

Next.js menyediakan sistem font modern melalui `next/font/google`.

Keuntungan pendekatan ini:

* Font **self-hosted otomatis**
* Mengurangi **Cumulative Layout Shift**
* Tidak bergantung pada CDN Google Fonts
* Optimal untuk performa produksi

Aplikasi *fintech* membutuhkan font dengan karakteristik berikut:

### ~ Geometric Precision

Font bergaya geometris seperti **Montserrat** memberikan kesan stabil, modern, dan terpercaya.

### ~ Numerical Clarity

Angka transaksi harus mudah dibedakan untuk menghindari kesalahan membaca data finansial.

### ~ Scalability

Font harus tetap tajam pada berbagai ukuran layar, baik *mobile*, *tablet*, maupun *desktop*.

---

## **Step 2**: Konfigurasi `layout.tsx`

Buka:

```file
frontend/app/layout.tsx
```

Lalu konfigurasi font **Montserrat**.

```tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finastriva - Smart Finance Manager",
  description: "Track and optimize your financial assets",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
```

---

### Penjelasan

`montserrat.variable` akan membuat CSS variable:

```
--font-montserrat
```

Variable ini nantinya akan dipetakan ke utilitas Tailwind `font-sans`.

---

## **Step 3**: Integrasi dengan Tailwind

Buka:

```
frontend/app/globals.css
```

Konfigurasikan mapping font.

```css
@import "tailwindcss";

:root {
  --background: #0a0a0a;
  --foreground: #ededed;
}

@theme inline {

  --font-sans: var(--font-montserrat);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

⚠️ **Penting:**

Jangan menambahkan `font-family` manual pada `body`.

Contoh yang **salah**:

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

Hal ini akan **menimpa konfigurasi Tailwind** sehingga Montserrat tidak pernah digunakan.

---

## **Step 4**: Verifikasi Implementasi

Jalankan aplikasi:

```
npm run dev
```

Kemudian lakukan verifikasi berikut.

### 1️⃣ Network Tab

Buka **DevTools → Network → Filter: Font**

Anda akan melihat font dimuat dari path:

```
/_next/static/media/
```

Ini menandakan font telah **self-hosted oleh Next.js**.

---

### 2️⃣ Inspect Typography

Inspect teks di halaman dan periksa `font-family`.

Jika berhasil akan terlihat:

```
font-family: "__Montserrat_..."
```
Dengan pendekatan ini kita menciptakan **Single Source of Truth** untuk tipografi.

> Jika suatu saat Finastriva ingin mengganti font (misalnya ke **Inter** atau **Geist**), kita hanya perlu mengubah konfigurasi pada `layout.tsx`.

---

# Logo Integration



Setelah meningkatkan tipografi, langkah berikutnya adalah membangun **identitas visual yang kuat** dengan mengintegrasikan logo aplikasi ke dalam header.

## Step 0: Panduan Asset Logo
> Sebelum implementasi, kita membutuhkan asset logo.

Anda bebas mendesain konsep logo apa pun yang sesuai dengan identitas brand Finastriva.
Pastikan format file yang diekspor adalah **SVG (direkomendasikan)** atau **PNG/JPG**.

**SVG sangat direkomendasikan** karena:

* dapat diskalakan sempurna pada layar Retina / 4K
* tetap tajam pada resolusi apa pun
* ukuran file lebih kecil dibandingkan gambar raster
* terintegrasi dengan baik dengan framework frontend modern

File logo akhir harus diberi nama: **logo-finastriva.svg**


---
## Step 1: Persiapan Import
Buka file `frontend/app/page.tsx`. Di bagian paling atas, kita perlu menambahkan import `Image` dari Next.js untuk menangani logo `.svg` yang sudah ada di folder `public`.

> **Lokasi file**: frontend/public/logo-finastriva.svg

Kita akan menggunakan **Next.js Image component** karena menyediakan:

* optimisasi otomatis
* pencegahan layout shift
* kontrol prioritas loading

Buka:

```
frontend/app/page.tsx
```
>(atau komponen `Header` terpisah jika sudah dibuat)

Lalu tambahkan import Image di baris paling atas:

```tsx

import Image from "next/image";

```
---

## Step 2: Penyesuaian Main Container (Layout Dasar)
Kita ingin aplikasi terlihat lebih "tajam" (*sharp*). Ubah tag `<main>` agar memiliki fitur *anti-aliased* (penghalusan font) dan layout yang lebih fleksibel.

**Tempatkan di:** Bagian awal blok `return`.
```tsx
// Ganti tag <main> lama dengan ini:
<main className="flex min-h-screen flex-col bg-black text-white font-sans antialiased">
```
---

## Step 3: Implementasi Modern Header
Sekarang, kita akan **menghapus** baris `<h1>Finastriva Dashboard</h1>` yang lama dan menggantinya dengan struktur Header baru yang mencakup logo dan tanggal otomatis.

**Cari kode:**
```tsx
<h1 className="text-3xl font-bold text-blue-500 mb-6">
  Finastriva Dashboard
</h1>
```

**Ganti dengan blok Header ini:**
```tsx
{/* HEADER SECTION */}
<div className="w-full max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
  <header className="flex items-center gap-4 group">
    {/* Kotak Logo */}
    <div className="relative p-2 bg-gray-900 rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-2xl">
      <Image src="/logo-finastriva.svg" alt="Logo" width={42} height={42} priority />
    </div>
    
    {/* Nama & Tagline */}
    <div className="flex flex-col">
      <h1 className="text-2xl font-black tracking-tighter text-white leading-none">FINASTRIVA</h1>
      <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mt-1 opacity-80">
        Smart Assets Manager
      </span>
    </div>
  </header>

  {/* Info Tanggal (Sisi Kanan) */}
  <div className="hidden md:block text-right">
    <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Dashboard Overview</p>
    <p className="text-sm text-gray-400 font-mono">
      {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
  </div>
</div>
```

---

## Step 4: Penanganan dan Optimasi Logo SVG

Agar logo **Finastriva** tampil tajam, presisi, dan bebas masalah layout, lakukan beberapa pengecekan teknis pada file SVG.

---

### 4.1 Pastikan SVG Menggunakan `viewBox`

Beberapa file SVG memiliki atribut `width` dan `height` yang ditentukan langsung sehingga menghambat scaling.

Pastikan root SVG memiliki atribut `viewBox`.

Contoh struktur yang benar:

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
```

`viewBox` memungkinkan SVG diskalakan secara fleksibel ketika dirender menggunakan komponen `Image` pada Next.js.

Contoh implementasi yang sudah kita gunakan di header:

```tsx
<Image
  src="/logo-finastriva.svg"
  alt="Logo"
  width={42}
  height={42}
  priority
/>
```

Atribut `priority` memastikan logo dimuat **lebih awal dibandingkan gambar lain**, sehingga header langsung muncul tanpa delay.

---

### 4.2 Menghindari “Dead Space” pada Logo

Masalah umum pada SVG adalah adanya **ruang kosong di sekitar grafik**.

Hal ini biasanya terjadi karena:

* `viewBox` terlalu besar
* file hasil ekspor memiliki margin tambahan
* objek tidak memenuhi seluruh kanvas

Akibatnya akan muncul jarak aneh antara **logo dan teks FINASTRIVA**.

Karena ruang tersebut berada **di dalam file SVG**, CSS tidak dapat menghapusnya secara langsung.

---

### 4.3 Cara Memperbaiki SVG (Direkomendasikan)

Solusi terbaik adalah **memotong kanvas SVG agar sesuai dengan ukuran logo**.

Beberapa metode yang dapat digunakan:

**Tool Otomatis**

Gunakan tool seperti **SVG Crop** untuk menghitung ulang `viewBox`.

Upload file SVG, lalu unduh versi yang sudah dipangkas.

---

**Edit Manual**

Buka file di editor seperti **VS Code**, lalu cari atribut:

```xml
viewBox="0 0 100 100"
```

Format `viewBox` adalah:

```
viewBox="x y width height"
```

Kurangi nilai `width` dan `height` hingga margin kosong hilang.

---

**Menggunakan Software Grafis**

Jika menggunakan **Inkscape**, lakukan langkah berikut:

```
File → Document Properties
Resize Page to Content
Export → Plain SVG
```

Metode ini akan:

* menghapus metadata yang tidak diperlukan
* memangkas kanvas sesuai ukuran objek

---

### 4.4 Alternatif Jika SVG Tidak Bisa Diubah

Jika file SVG tidak dapat dimodifikasi, jarak dapat disesuaikan menggunakan CSS.

Contoh mengurangi jarak flex:

```
gap-1
```

atau

```
gap-0
```

Contoh menggunakan margin negatif:

```tsx
<h1 className="text-2xl font-black tracking-tighter text-white leading-none -ml-1">
  FINASTRIVA
</h1>
```

Teknik ini akan **menarik teks lebih dekat ke logo** untuk mengkompensasi padding SVG.

---

### 4.5 Verifikasi Visual Akhir

Setelah implementasi selesai, lakukan pengecekan berikut:

**Ketajaman**

Zoom browser hingga **200%**.
Logo SVG harus tetap tajam tanpa blur.

**Konsistensi Font**

Teks **FINASTRIVA** harus menggunakan font **Montserrat** yang sudah dikonfigurasi sebelumnya.

**Performa Loading**

Logo harus muncul **secara instan** karena menggunakan atribut `priority`.

---

### 🧐 Penjelasan Teknis Modifikasi

1. **Integrasi Font dengan `next/font`**
   Penggunaan `next/font/google` memungkinkan **font di-self host langsung oleh Next.js** tanpa perlu memuatnya dari CDN eksternal. Hal ini meningkatkan performa karena file font menjadi bagian dari build aplikasi dan mengurangi **Cumulative Layout Shift (CLS)** saat halaman pertama kali dirender.

2. **Single Source of Truth untuk Tipografi**
   Font Montserrat tidak langsung dipasang sebagai `font-family` di CSS. Sebaliknya, ia diubah menjadi **CSS Variable (`--font-montserrat`)** di `layout.tsx`, lalu dipetakan ke utilitas Tailwind `font-sans`.
   Alurnya:

   ```
   next/font
      ↓
   CSS Variable (--font-montserrat)
      ↓
   Tailwind Theme (font-sans)
      ↓
   Seluruh komponen aplikasi
   ```

   Dengan pendekatan ini, seluruh UI akan menggunakan font yang sama secara konsisten.

3. **Optimasi Asset Logo dengan `next/image`**
   Logo tidak dimasukkan sebagai `<img>` biasa, melainkan melalui **Next.js Image Component**. Komponen ini memberikan beberapa keuntungan:

   * optimasi loading otomatis
   * pencegahan layout shift
   * kontrol prioritas loading melalui atribut `priority`

4. **SVG sebagai Format Logo Utama**
   SVG dipilih karena **resolution-independent**. Artinya logo tetap tajam pada layar Retina, 4K, atau ketika browser di-zoom. Hal ini sangat penting untuk aplikasi dashboard yang sering ditampilkan pada monitor besar.

5. **Layout Header Responsif dengan Flexbox**
   Struktur header menggunakan `flex` dan `justify-between` agar elemen logo, teks brand, dan informasi tanggal dapat beradaptasi dengan berbagai ukuran layar. Informasi tanggal disembunyikan pada layar kecil menggunakan:

   ```
   hidden md:block
   ```

   sehingga layout tetap bersih di perangkat mobile.

**Status Proyek:**
Identitas visual **Finastriva** kini mulai terbentuk. Aplikasi sudah memiliki **tipografi global yang konsisten** serta **header profesional dengan logo dan informasi dashboard**.

### ✅ Checkpoint Akhir Chapter 6.1

* Font **Montserrat berhasil diintegrasikan secara global**
* Sistem tipografi menggunakan **CSS Variable + Tailwind mapping**
* Logo **Finastriva** berhasil ditampilkan menggunakan **Next.js Image**
* Header dashboard kini memiliki **branding + informasi tanggal**
* Struktur layout siap untuk pengembangan **UI dashboard berikutnya** 🚀

---

#  Chapter 6.2 — Bento Grid Layout & Responsive Design

Pada tahap ini kita akan membungkus seluruh konten utama ke dalam **layout grid 3 kolom** agar dashboard terlihat lebih terstruktur dan modern.

Layout ini akan mengatur posisi:

* Form input transaksi
* Grafik analitik
* Saldo utama
* Riwayat transaksi

Semua elemen tersebut akan tampil dalam **satu tampilan dashboard yang rapi dan responsif**.

---

## Step 1 — Menambahkan Global CSS (Custom Scrollbar)

Agar daftar riwayat transaksi memiliki **scrollbar yang estetik** dan tetap konsisten dengan tema **dark mode**, kita menambahkan styling menggunakan `styled-jsx`.

### 📍 Penempatan

Letakkan kode berikut **di bagian paling atas dalam blok `return`**, tepat setelah tag `<main>` dibuka dan **sebelum Header**.

Tujuannya agar daftar transaksi tetap terlihat rapi ketika di-scroll.

```tsx
<style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
`}</style>
```

---

## Step 2 — Container Grid Utama (Bento Layout)

Selanjutnya kita akan membungkus seluruh konten utama (setelah Header) ke dalam **container grid utama**.

Grid ini menggunakan:

```
grid-cols-1 (mobile)
grid-cols-3 (desktop / lg)
```

Sehingga layout akan **responsif secara otomatis**.

### 📍 Penempatan

Ganti struktur kode **di bawah penutup Header (`</div>`) hingga sebelum `</main>`** dengan struktur berikut.

---

```tsx
{/* 6.1: HEADER SECTION (Luar Grid) */}
<div className="w-full max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
    
  {/* Kode Header... */}
  {/* Area ini berisi kode header */}

  </header>

  <div className="hidden md:block text-right">
    <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
      Dashboard Overview
    </p>

    <p className="text-sm text-gray-400 font-mono">
      {new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </p>
  </div>

</div>
```

---

# Letakkan Grid Dashboard di Bawah Header

Tambahkan struktur grid berikut **tepat setelah kode header di atas**.

```tsx
{/* 6.2: GRID DASHBOARD UTAMA */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full mx-auto px-6 pb-20">
  
  {/* --- CARD 1: SALDO (Ch 6.3) --- */}
  <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center min-h-[350px]">
     <p className="text-gray-600 italic font-bold uppercase tracking-widest">
       Total Balance (Ch 6.3)
     </p>
  </div>

  {/* --- CARD 2: ANALYTICS (Ch 6.4) --- */}
  <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col min-h-[350px]">
     <p className="text-gray-600 italic font-bold uppercase tracking-widest">
       Alokasi Dana (Ch 6.4)
     </p>
  </div>

  {/* --- CARD 3: INPUT FORM --- */}
  <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-fit">
    
    <h3 className="text-xl font-black mb-8 tracking-tight">
      {editingId ? "Edit Transaction" : "New Transaction"}
    </h3>
    
    <div className="flex gap-2 mb-6 bg-black/50 p-1.5 rounded-2xl border border-gray-800">

      <button
        onClick={() => setType("income")}
        className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
          type === "income"
            ? "bg-green-600 text-white shadow-lg"
            : "text-gray-500 hover:text-white"
        }`}
      >
        Income
      </button>

      <button
        onClick={() => setType("expense")}
        className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
          type === "expense"
            ? "bg-red-600 text-white shadow-lg"
            : "text-gray-500 hover:text-white"
        }`}
      >
        Expense
      </button>

    </div>

    <div className="space-y-4">

      <div>
        <label className="text-[10px] text-gray-500 uppercase font-black ml-1">
          Keterangan
        </label>

        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all"
          placeholder="Beli Kopi..."
        />
      </div>

      <div>
        <label className="text-[10px] text-gray-500 uppercase font-black ml-1">
          Nominal (IDR)
        </label>

        <input
          value={amount === 0 ? "" : amount}
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all font-mono text-lg"
          placeholder="0"
        />
      </div>

    </div>

    <button
      onClick={tambahTransaksi}
      className="w-full mt-8 bg-blue-600 p-4 rounded-2xl font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30"
    >
      {editingId ? "UPDATE DATA" : "SAVE TRANSACTION"}
    </button>

    {editingId && (
      <button
        onClick={() => {
          setEditingId(null)
          setDesc("")
          setAmount(0)
        }}
        className="w-full mt-4 text-gray-500 text-xs font-bold hover:text-white transition"
      >
        CANCEL EDIT
      </button>
    )}

  </div>

  {/* --- CARD 4: RIWAYAT (Scrollable) --- */}
  <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-[488px] flex flex-col">

    <div className="flex justify-between items-center mb-8 flex-shrink-0">
      <h3 className="text-xl font-black tracking-tight">Recent History</h3>

      <span className="bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400">
        {transactions.length} items
      </span>
    </div>

    <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">

      {transactions.length === 0 ? (

        <div className="text-gray-600 text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-sm">
          No transaction records.
        </div>

      ) : (

        transactions
          .slice()
          .reverse()
          .map((t: any) => (

          <div
            key={t.id}
            className="bg-gray-800/30 p-5 rounded-2xl flex justify-between items-center border border-gray-800/50 hover:border-gray-700 transition-all group"
          >

            <div className="flex items-center gap-4">

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  t.type === "income"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {t.type === "income" ? "↓" : "↑"}
              </div>

              <div className="flex flex-col">
                <span className="text-white font-bold group-hover:text-blue-400 transition-colors">
                  {t.desc}
                </span>

                <span className="text-gray-500 text-[10px] font-medium font-mono">
                  {new Date(t.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>

            </div>

            <div className="flex items-center gap-6">

              <span
                className={`font-mono text-lg font-black ${
                  t.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {t.type === "income" ? "+ " : "- "} Rp {t.amount.toLocaleString()}
              </span>

              <div className="flex gap-3 lg:opacity-0 group-hover:opacity-100 transition-opacity">

                <button
                  onClick={() => startEdit(t)}
                  className="text-gray-500 hover:text-blue-400 transition"
                >
                  ✏️
                </button>

                <button
                  onClick={() => hapusTransaksi(t.id)}
                  className="text-gray-500 hover:text-red-400 transition"
                >
                  🗑
                </button>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

  </div>

</div> {/* Penutup Grid Dashboard */}
```

---

### 🧐 Penjelasan Teknis Modifikasi

1. **Bento Grid Layout dengan CSS Grid**
   Dashboard menggunakan **CSS Grid** untuk membangun layout *Bento-style*. Grid utama dikonfigurasi dengan:

   ```
   grid-cols-1 (mobile)
   lg:grid-cols-3 (desktop)
   ```

   Artinya pada layar kecil semua card akan **stack vertikal**, sedangkan pada layar besar akan berubah menjadi **layout 3 kolom** yang lebih padat dan informatif.

2. **Pengaturan Prioritas Konten dengan `col-span`**
   Beberapa card menggunakan `lg:col-span-2` agar mengambil dua kolom sekaligus.
   Ini memberi **hierarki visual** pada dashboard:

   * Grafik analytics lebih besar
   * Riwayat transaksi memiliki ruang lebih luas
   * Form input tetap ringkas di sisi kiri.

3. **Glassmorphism Dashboard Cards**
   Setiap card menggunakan kombinasi:

   ```
   bg-gray-900/40
   backdrop-blur-md
   border border-gray-800
   ```

   Teknik ini menghasilkan efek **glassmorphism ringan** yang membuat UI terlihat modern tanpa mengganggu keterbacaan data.

4. **Custom Scrollbar untuk Dark UI**
   Daftar riwayat transaksi menggunakan class `.custom-scrollbar` dengan pseudo-element `::-webkit-scrollbar`.
   Tujuannya agar scrollbar:

   * lebih tipis
   * konsisten dengan **tema dark mode**
   * tidak terlihat seperti scrollbar default browser.

5. **Scrollable Transaction History**
   Card riwayat menggunakan kombinasi:

   ```
   flex flex-col
   overflow-y-auto
   flex-1
   ```

   sehingga konten transaksi dapat **scroll secara independen** tanpa menggeser seluruh halaman dashboard.

**Status Proyek:**
Dashboard **Finastriva** kini memiliki struktur layout profesional. Semua komponen utama telah ditempatkan dalam **Bento Grid yang responsif dan modular**.

### ✅ Checkpoint Akhir Chapter 6.2

* Dashboard memiliki **layout Bento Grid modern**
* Responsif dari **mobile → desktop**
* Scroll history **lebih estetik**
* Struktur UI **lebih modular untuk chapter selanjutnya** 🚀

---
# Chapter 6.3: Computed Dashboard Logic

Kita akan menghidupkan kartu saldo yang sebelumnya kosong, menggunakan logika JavaScript (`reduce` dan `filter`) untuk menghitung total saldo, pemasukan, dan pengeluaran secara *real-time* dari data yang ada di state `transactions`.

Berikut adalah langkah-langkah detailnya:

## Step 1  —  Deklarasi Logika Kalkulasi
Sebelum bagian `return`, kita perlu membuat variabel konstanta yang menghitung angka-angka tersebut setiap kali ada perubahan pada data transaksi.

**Penempatan:** Letakkan di dalam fungsi `Home()`, tepat di atas baris `return`.

```tsx
// 6.3: LOGIKA KALKULASI SALDO
const totalBalance = transactions.reduce((acc, t: any) => 
  t.type === "income" ? acc + (t.amount || 0) : acc - (t.amount || 0), 0
);

const incomeTotal = transactions
  .filter((t: any) => t.type === "income")
  .reduce((acc, t: any) => acc + (t.amount || 0), 0);

const expenseTotal = transactions
  .filter((t: any) => t.type === "expense")
  .reduce((acc, t: any) => acc + (t.amount || 0), 0);
```

## Step 2  —  Implementasi Card Saldo (Bento Card 1)
Sekarang kita akan mengisi slot kosong "Card Saldo" yang kita buat di Chapter 6.2 dengan data hasil kalkulasi di atas.

**Cari blok ini:**
```tsx
{/* --- CARD 1: SALDO (Ch 6.3) --- */}
<div className="lg:col-span-1 ...">
   <p className="text-gray-600 italic ...">Total Balance (Ch 6.3)</p>
</div>
```

**Ganti dengan kode detail berikut:**
```tsx
{/* --- CARD 1: TOTAL BALANCE --- */}
<div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center min-h-[350px]">
  <h2 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Total Balance</h2>
  
  {/* Saldo Utama: Berubah warna jadi merah jika minus */}
  <p className={`text-5xl font-black tracking-tighter ${totalBalance < 0 ? 'text-red-500' : 'text-white'}`}>
    {totalBalance < 0 ? `- Rp ${Math.abs(totalBalance).toLocaleString()}` : `Rp ${totalBalance.toLocaleString()}`}
  </p>

  {/* Indikator Income & Expense di bawah saldo */}
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
```
---
### 🧐 Penjelasan Teknis Modifikasi

1. **Perhitungan Saldo dengan `.reduce()`**
   Metode `.reduce()` digunakan untuk menghitung **total saldo secara dinamis** dari array `transactions`.
   Setiap elemen transaksi akan diproses satu per satu:

   * Jika `type === "income"` → nilai ditambahkan ke accumulator.
   * Jika `type === "expense"` → nilai dikurangkan.
     Dengan pendekatan ini kita tidak perlu menyimpan saldo di database, karena saldo dapat **dihitung langsung dari data transaksi**.

2. **Pemanfaatan `.filter()` untuk Statistik Terpisah**
   Untuk menampilkan total **income** dan **expense** secara terpisah, kita menggunakan `.filter()` terlebih dahulu untuk memisahkan tipe transaksi.
   Setelah itu `.reduce()` digunakan kembali untuk menjumlahkan nominalnya.
   Pola ini membuat logika data menjadi:

   ```
   transactions
      ↓
   filter by type
      ↓
   reduce → total
   ```

3. **Reaktivitas State React**
   Karena `transactions` merupakan **state React**, setiap perubahan data (tambah, edit, hapus transaksi) akan memicu **re-render otomatis**.
   Akibatnya:

   * saldo utama
   * total income
   * total expense
     akan **langsung diperbarui secara real-time** tanpa perlu refresh halaman.

4. **Kondisional Styling untuk Saldo Negatif**
   Bagian berikut menggunakan **conditional class**:

   ```tsx
   totalBalance < 0 ? 'text-red-500' : 'text-white'
   ```

   Jika total saldo negatif, angka akan berubah menjadi **merah**, memberikan indikator visual bahwa pengeluaran melebihi pemasukan.

5. **Formatting Angka dengan `.toLocaleString()`**
   Angka transaksi diformat menggunakan:

   ```ts
   toLocaleString()
   ```

   Ini membuat angka seperti:

   ```
   1000000
   ```

   tampil menjadi:

   ```
   1.000.000
   ```

   sehingga lebih mudah dibaca dalam konteks finansial.

6. **Menghindari Duplikasi Tanda Minus dengan `Math.abs()`**
   Ketika saldo negatif, kita menambahkan tanda `-` secara manual untuk kontrol tampilan.
   Oleh karena itu kita menggunakan:

   ```ts
   Math.abs(totalBalance)
   ```

   agar angka tidak menjadi `--100000`.


**Status Proyek:**
Kartu **Total Balance** kini telah aktif. Dashboard Finastriva mampu menghitung dan menampilkan **saldo, pemasukan, dan pengeluaran secara real-time** dari data transaksi.

### ✅ Checkpoint Akhir Chapter 6.3

* Card **Total Balance** berhasil menampilkan saldo dinamis
* Statistik **Income & Expense** muncul otomatis
* Perubahan transaksi langsung memperbarui dashboard
* Saldo negatif memiliki **indikator visual merah**
* Sistem perhitungan finansial dashboard sudah **berfungsi penuh** 💰🚀

---

# Chapter 6.4: Data Visualization (Recharts)

Kita akan mengisi slot "Card Analytics" yang masih kosong dengan grafik lingkaran (*Pie Chart*). Grafik ini sangat penting dalam aplikasi *fintech* untuk memberikan gambaran visual kepada pengguna mengenai proporsi alokasi dana mereka.

Berikut adalah panduan detail langkah demi langkah untuk mengimplementasikannya:

## **Step 1**: Instalasi dan Import Library
Pertama, pastikan library `recharts` sudah terpasang di proyek kamu. Jika belum, jalankan `npm install recharts` di terminal. Setelah itu, tambahkan import di bagian paling atas file `page.tsx`.

**Penempatan:** Di baris paling atas, bersama import lainnya.

```tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
```

## **Step 2**: Menyiapkan Format Data Grafik
Library Recharts membutuhkan data dalam format array objek tertentu. Kita akan menggunakan nilai `incomeTotal` dan `expenseTotal` yang sudah kita buat di Chapter 6.3.

**Penempatan:** Letakkan di bawah logika kalkulasi saldo (Chapter 6.3), tepat sebelum baris `return`.

```tsx
// 6.4: FORMAT DATA UNTUK RECHARTS
const chartData = [
  { name: "Pemasukan", value: incomeTotal },
  { name: "Pengeluaran", value: expenseTotal },
];
```

### 3. Implementasi Card Analytics (Bento Card 2)
Sekarang kita akan mengganti slot kosong "Card Analytics" dengan komponen grafik yang interaktif.

**Cari blok ini:**
```tsx
{/* --- CARD 2: ANALYTICS (Ch 6.4) --- */}
<div className="lg:col-span-2 ...">
   <p className="text-gray-600 italic ...">Alokasi Dana (Ch 6.4)</p>
</div>
```

**Ganti dengan kode detail berikut:**
```tsx
{/* --- CARD 2: ANALYTICS (Visualisasi Data) --- */}
<div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col min-h-[350px]">
  <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Alokasi Dana</h2>
  
  {/* Kondisi jika data masih kosong */}
  {incomeTotal === 0 && expenseTotal === 0 ? (
    <div className="flex-1 flex items-center justify-center text-gray-600 italic text-sm">
      No transaction data yet.
    </div>
  ) : (
    <div className="flex-1 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={chartData} 
            cx="50%" 
            cy="45%" 
            innerRadius="65%" 
            outerRadius="85%" 
            paddingAngle={10} 
            dataKey="value"
          >
            {/* Warna Hijau untuk Pemasukan, Merah untuk Pengeluaran */}
            <Cell fill="#22c55e" stroke="none" />
            <Cell fill="#ef4444" stroke="none" />
          </Pie>
          
          {/* Tooltip saat kursor diarahkan ke grafik */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#000', 
              border: '1px solid #333', 
              borderRadius: '12px',
              fontSize: '12px'
            }} 
          />
          
          {/* Keterangan di bawah grafik */}
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            wrapperStyle={{ paddingTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</div>
```

### 🧐 Penjelasan Teknis Modifikasi

1. **Integrasi Library Recharts untuk Visualisasi Data**
   Library `recharts` digunakan untuk menampilkan **visualisasi data finansial secara interaktif**.
   Dibanding membuat chart manual dengan SVG atau Canvas, Recharts menyediakan komponen siap pakai seperti:

   * `PieChart`
   * `Pie`
   * `Tooltip`
   * `Legend`
   * `ResponsiveContainer`

   Pendekatan ini mempercepat development sekaligus menjaga **kode tetap modular dan readable**.

2. **Struktur Data Chart (`chartData`)**
   Recharts membutuhkan data dalam format **array objek** dengan key tertentu.
   Oleh karena itu kita membentuk struktur seperti:

   ```ts
   [
     { name: "Pemasukan", value: incomeTotal },
     { name: "Pengeluaran", value: expenseTotal }
   ]
   ```

   `name` digunakan oleh **Legend**, sedangkan `value` digunakan oleh `Pie` sebagai sumber data numerik.

3. **Responsivitas dengan `ResponsiveContainer`**
   Komponen `ResponsiveContainer` memastikan grafik **menyesuaikan ukuran parent container secara otomatis**.
   Artinya grafik akan tetap proporsional baik pada:

   * layar mobile
   * tablet
   * desktop besar

   tanpa perlu menghitung ulang dimensi chart secara manual.

4. **Donut Chart dengan `innerRadius`**
   Penggunaan kombinasi:

   ```
   innerRadius="65%"
   outerRadius="85%"
   ```

   mengubah Pie Chart menjadi **Donut Chart**.
   Desain ini sering digunakan pada dashboard *fintech* karena:

   * lebih modern secara visual
   * memberikan ruang kosong di tengah untuk potensi data tambahan di masa depan.

5. **Tooltip dan Legend untuk UX yang Lebih Baik**

   * **Tooltip** menampilkan informasi nilai saat pengguna mengarahkan kursor ke grafik.
   * **Legend** membantu pengguna memahami arti warna chart.

   Dalam implementasi ini:

   * **Hijau → Income**
   * **Merah → Expense**

6. **Empty State Handling**
   Kondisi berikut:

   ```tsx
   incomeTotal === 0 && expenseTotal === 0
   ```

   digunakan untuk mencegah chart menampilkan grafik kosong.
   Jika belum ada transaksi, dashboard akan menampilkan pesan:

   ```
   No transaction data yet.
   ```

   Ini merupakan praktik **UX penting pada dashboard data-driven**.

**Status Proyek:**
Dashboard Finastriva kini memiliki **visualisasi data finansial interaktif**. Pengguna dapat langsung memahami proporsi pemasukan dan pengeluaran melalui grafik analitik.

### ✅ Checkpoint Akhir Chapter 6.4

* Card **Analytics** berhasil menampilkan **Pie Chart interaktif**
* Data grafik terhubung langsung dengan **state transaksi**
* Chart otomatis **responsif terhadap ukuran layar**
* Tooltip dan Legend meningkatkan **keterbacaan data**
* Dashboard kini memiliki **lapisan analitik visual** 📊🚀
# Chapter 6.5: Interaction Polish & Refactoring

Tujuan kita adalah membuat kode lebih mudah dikelola (maintainable) dan memberikan pengalaman pengguna yang lebih halus.

---

## Chapter 6.5 — Langkah 1: Instalasi & Persiapan Library

Sebelum menyentuh kode, kita harus memastikan *tools* yang dibutuhkan sudah terpasang. Kita akan menggunakan:
1.  **Lucide React**: Library icon SVG yang ringan dan konsisten untuk menggantikan emoji.
2.  **Framer Motion**: Library standar industri untuk menangani animasi di React/Next.js.

#### 🛠️ Apa yang harus dilakukan:

1.  Buka **Terminal** kamu.
2.  Pastikan kamu berada di dalam direktori `frontend`.
3.  Jalankan perintah instalasi berikut:

```bash
npm install lucide-react framer-motion
```

#### 🧐 Kenapa langkah ini penting?
* **Emoji vs Icons**: Emoji (seperti ✏️ atau 🗑️) tampilannya berbeda-beda di setiap perangkat (Windows, Mac, Android punya desain sendiri). **Lucide Icons** memastikan tampilan icon kamu 100% sama di semua layar pengguna.
* **User Experience (UX)**: Tanpa **Framer Motion**, perubahan UI (seperti menghapus baris) akan terasa "kasar" atau patah. Animasi membuat aplikasi terasa lebih responsif dan premium.

---

**Status:** Library sudah siap digunakan di dalam kode.

---

## Chapter 6.5 — Langkah 2: Refactoring (Komponisasi)

Dalam dunia pemrograman, **Refactoring** adalah proses merapikan struktur kode tanpa mengubah fungsinya. Bayangkan `page.tsx` sebelumnya adalah sebuah gudang besar di mana semua barang (logika, saldo, grafik, form) ditumpuk jadi satu. **Komponisasi** adalah proses membagi gudang tersebut menjadi kamar-kamar khusus yang rapi.

### 🔍 1. Memahami Anatomi Komponen Baru
Ketika kita memindahkan sebuah blok `div` ke file baru, kita tidak bisa hanya "copy-paste" saja. Kita harus membungkusnya dalam sebuah **Fungsi React**. Berikut adalah penjelasan bagian-bagian yang mungkin membingungkan bagi pemula:

* **`export default function NamaKomponen`**: Ini adalah cara kita memberi tahu Next.js bahwa file ini adalah sebuah "cetakan" UI yang bisa digunakan di tempat lain (dalam hal ini, di `page.tsx`).
* **`{ total, income, expense }` (Props)**: Ini adalah "kabel penghubung". Karena data asli ada di `page.tsx`, kita butuh cara untuk mengirimkan data tersebut ke dalam komponen agar angka saldonya muncul.
* **`interface AnalyticsProps`**: Karena kita menggunakan TypeScript, kita harus membuat "kontrak" yang menjelaskan jenis data yang masuk (misal: `income` harus berupa angka/`number`, bukan teks).

### Persiapan: Struktur Folder Baru
Pastikan struktur folder kamu terlihat seperti ini sebelum memulai:

```text
frontend/app/
├── components/          <-- Buat folder ini
│   ├── Header.tsx
│   ├── BalanceCard.tsx
│   ├── AnalyticsCard.tsx
│   ├── TransactionForm.tsx
│   └── TransactionList.tsx
├── globals.css          <-- Update CSS di sini
└── page.tsx             <-- File utama (Otak)

```
---

### 📂 2. Pemisahan Komponen secara Detail

---

#### Langkah 1: Memindahkan Global Style
Pindahkan CSS custom scrollbar dari tag `<style>` di `page.tsx` ke file CSS global agar bisa dipakai di mana saja.


**Buka `app/globals.css`** dan tambahkan code berikut di bagian paling bawah:

```css
/* Custom scrollbar utility */
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
```

---

#### Langkah 2: Membuat Komponen Presentasional (Dumb Components)
Komponen ini tugasnya hanya menampilkan data yang dikirim dari `page.tsx`.

##### **2.1 Header.tsx**
Buat file `app/components/Header.tsx`:

* **Asal Kode**: HEADER SECTION & Info Tanggal (Sisi Kanan) di `page.tsx`,
* **Isi File (`frontend/app/components/Header.tsx`)**:
* **Tugas:** Menampilkan logo dan tanggal.
* **Kabel (Props):** Tidak butuh karena datanya statis.

```tsx
import Image from "next/image";

export default function Header() {
  return (
      {/* ... (Copy bagian Header section & Info Tanggal (Sisi Kanan) dari page.tsx lama) ... */}
      <div className="hidden md:block text-right">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Dashboard Overview</p>
        <p className="text-sm text-gray-400 font-mono">
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
```

##### **2.2 BalanceCard.tsx**
Buat file `app/components/BalanceCard.tsx`:
Kita memindahkan bagian yang menghitung dan menampilkan uang kamu.

* **Asal Kode**: Blok Card 1 di `page.tsx`.
* **Tugas:** Menampilkan ringkasan saldo.
* **Kabel (Props):** `total`, `income`, `expense`.
* **Isi File (`frontend/app/components/BalanceCard.tsx`)**:

```tsx
export default function BalanceCard({ total, income, expense }: { total: number, income: number, expense: number }) {
  return (
      {/* ... (Copy bagian Balance Card dari page.tsx lama) ... */}
  );
}
```
##### **2.3 AnalyticsCard.tsx `(Grafik Lingkaran)`**
Buat file `app/components/AnalyticsCard.tsx`:
Bagian ini lebih kompleks karena melibatkan library pihak ketiga.

* **Asal Kode**: Blok Card 2 di `page.tsx` yang menggunakan `recharts`.
* **Penting**: Baris `import { PieChart... }` harus dipindahkan dari `page.tsx` ke file ini agar komponen tahu cara menggambar grafik.
* **Tugas:** Menampilkan ringkasan saldo.
* **Kabel (Props):** `income`, `expense`,`chartData`.
* **Isi File (`frontend/app/components/AnalyticsCard.tsx`)**:

```tsx
// Library ini harus di-import di sini karena div di bawah membutuhkannya
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Kita mendefinisikan 'kontrak' data agar TypeScript tidak error
interface AnalyticsProps {
  income: number;
  expense: number;
  chartData: any[];
}

export default function AnalyticsCard({ income, expense, chartData }: AnalyticsProps) {
  return (
    <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col min-h-[350px]">
      <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Alokasi Dana</h2>
      
      {/* Logika pengecekan data kosong tetap dipertahankan */}
      {income === 0 && expense === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600 italic text-sm">No transaction data yet.</div>
      ) : (
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="45%" innerRadius="65%" outerRadius="85%" paddingAngle={10} dataKey="value">
                <Cell fill="#22c55e" stroke="none" />
                <Cell fill="#ef4444" stroke="none" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }} />
              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
```

---

---

#### Langkah 3: Membuat Komponen Interaktif (Smart Components)
Komponen ini butuh fungsi (function) agar tombolnya bisa bekerja.

##### **3.1 TransactionForm.tsx**
Buat file `app/components/TransactionForm.tsx`:
Card ini adalah yang paling kompleks karena memiliki banyak "kabel" (State dan Fungsi) yang harus disambungkan.

* **Asal Kode**: Blok Card 3 di `page.tsx`.
* **Kabel (Props):** State input (`desc`, `amount`, `type`) dan fungsi (`onSubmit`, `onCancel`).
* **Isi File (`app/components/TransactionForm.tsx`)**:

```tsx
import React from "react";

interface TransactionFormProps {
  editingId: number | null;
  desc: string;
  setDesc: (val: string) => void;
  amount: number;
  setAmount: (val: number) => void;
  type: string;
   // ... tambahkan props lainnya sesuai kode yang benar jika ada tambahan
  setType: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function TransactionForm({
  editingId,
  desc,
  setDesc,
  amount,
  setAmount,
  type,
  setType,
  onSubmit,
  onCancel,
  //...props yang lainnya
}: TransactionFormProps) {
  return (
    <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-fit">
      <h3 className="text-xl font-black mb-8 tracking-tight">
        {editingId ? "Edit Transaction" : "New Transaction"}
      </h3>
      
       {/* ... (Input fields tetap terhubung ke props) ... */}
      <div className="flex gap-2 mb-6 bg-black/50 p-1.5 rounded-2xl border border-gray-800">
        <button
          onClick={() => setType("income")}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
            type === "income" ? "bg-green-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setType("expense")}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
            type === "expense" ? "bg-red-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
          }`}
        >
          Expense
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Keterangan</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all"
            placeholder="Beli Kopi..."
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Nominal (IDR)</label>
          <input
            value={amount === 0 ? "" : amount}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all font-mono text-lg"
            placeholder="0"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-8 bg-blue-600 p-4 rounded-2xl font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30"
      >
        {editingId ? "UPDATE DATA" : "SAVE TRANSACTION"}
      </button>
      {editingId && (
        <button
          onClick={onCancel}
          className="w-full mt-4 text-gray-500 text-xs font-bold hover:text-white transition"
        >
          CANCEL EDIT
        </button>
      )}
    </div>
  );
}

```

##### **3.2 TransactionList.tsx**
Buat file `app/components/TransactionList.tsx`:
Card ini berfungsi untuk menampilkan (membaca) dan memberikan akses untuk menghapus/mengedit.

* **Asal Kode**: Blok Card 4 di `page.tsx`.
* **Kabel (Props):** `transactions` (array), `onEdit`, `onDelete`.
* **Isi File (`app/components/TransactionList.tsx`)**:



```tsx
import React from "react";

interface TransactionListProps {
  transactions: any[];
  onEdit: (t: any) => void;
  onDelete: (id: number) => void;
}
export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  return (
    <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-[488px] flex flex-col">
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <h3 className="text-xl font-black tracking-tight">Recent History</h3>
        <span className="bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400">
          {transactions.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-gray-600 text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-sm">
            No transaction records.
          </div>
        ) : (
          transactions
            .slice()
            .reverse()
            .map((t: any) => (
              <div
                key={t.id}
                className="bg-gray-800/30 p-5 rounded-2xl flex justify-between items-center border border-gray-800/50 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      t.type === "income"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "↓" : "↑"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold group-hover:text-blue-400 transition-colors">
                      {t.desc}
                    </span>
                    <span className="text-gray-500 text-[10px] font-medium font-mono">
                      {new Date(t.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`font-mono text-lg font-black ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+ " : "- "} Rp {t.amount.toLocaleString()}
                  </span>
                  <div className="flex gap-3 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(t)} className="text-gray-500 hover:text-blue-400 transition">
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

```

---

#### Langkah 4: Menyatukan Semuanya di `page.tsx` (The Brain)

Setelah membuat file-file di atas, kita harus "memanggil" mereka di file utama agar muncul di layar. Hapus semua HTML yang panjang dan ganti dengan komponen-komponen yang baru dibuat.

1.  **Hapus** baris `import { PieChart... }` dan sejenisnya dari bagian atas `page.tsx`.
2.  **Tambahkan** baris import untuk komponen baru kita:
    ```tsx
    import BalanceCard from "./components/BalanceCard";
    import AnalyticsCard from "./components/AnalyticsCard";
    ```
3.  **Ganti** kode Card 1 & Card 2 yang panjang di bagian `return` dengan baris singkat ini:


```tsx
"use client";
import { useState, useEffect } from "react";
// 1. Import semua komponen
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";
// ... import lainnya

export default function Home() {
  // 2. Simpan State & Logika API di sini (Tetap seperti kode lama)
  const [transactions, setTransactions] = useState([]);
  
  // 3. Render Komponen dengan mengoper Props
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

```

---

---

