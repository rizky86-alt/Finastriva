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

