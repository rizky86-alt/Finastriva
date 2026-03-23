Tutorial Anda sebenarnya **sudah hampir benar**, tetapi ada **satu kesalahan penting yang menyebabkan implementasi gagal di banyak proyek**: bagian `globals.css` pada tutorial tidak memperingatkan bahwa **`font-family` di `body` akan mengoverride Tailwind**. Itu yang tadi terjadi pada kode Anda.

Saya akan **memperbaiki tutorialnya agar sesuai praktik produksi di Next.js + Tailwind CSS** dan tidak menimbulkan bug yang sama lagi.

---

# 📘 Chapter 6.1 – Typography & Font Selection (Revised)

Tipografi bukan sekadar memilih bentuk tulisan, melainkan instrumen utama dalam membangun keterbacaan data dan identitas profesional pada aplikasi finansial.

Pada bab ini kita akan mengonfigurasi **Montserrat** sebagai font utama untuk aplikasi **Finastriva**.

---

# 1️⃣ Analisis Pemilihan Font

Aplikasi *fintech* membutuhkan font dengan karakteristik berikut:

### Geometric Precision

Font bergaya geometris seperti Montserrat memberikan kesan stabil, modern, dan terpercaya.

### Numerical Clarity

Angka transaksi harus mudah dibedakan untuk menghindari kesalahan membaca data finansial.

### Scalability

Font harus tetap tajam pada berbagai ukuran layar, baik *mobile*, *tablet*, maupun *desktop*.

---

# 2️⃣ Implementasi dengan `next/font`

Next.js menyediakan sistem font modern melalui `next/font/google`.
Keuntungan pendekatan ini:

* Font **self-hosted otomatis**
* Mengurangi **Cumulative Layout Shift**
* Tidak bergantung pada CDN Google Fonts
* Optimal untuk performa produksi

---

# 3️⃣ Langkah 1 — Konfigurasi `layout.tsx`

Buka:

```
frontend/app/layout.tsx
```

Lalu konfigurasi font Montserrat.

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
```

### Penjelasan

`montserrat.variable` akan membuat CSS variable:

```
--font-montserrat
```

Variable ini nantinya akan dipetakan ke utilitas Tailwind `font-sans`.

---

# 4️⃣ Langkah 2 — Integrasi dengan Tailwind

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

# 5️⃣ Verifikasi Implementasi

Jalankan aplikasi:

```
npm run dev
```

Kemudian lakukan verifikasi berikut.

### 1. Network Tab

Buka DevTools → Network → Filter **Font**

Anda akan melihat font dimuat dari path:

```
/_next/static/media/
```

Ini menandakan font telah **self-hosted oleh Next.js**.

---

### 2. Inspect Typography

Inspect teks di halaman dan periksa `font-family`.

Jika berhasil akan terlihat:

```
font-family: "__Montserrat_..."
```

---

# 6️⃣ Arsitektur Typography

Dengan pendekatan ini kita menciptakan **Single Source of Truth** untuk tipografi.

Struktur kontrol font:

```
layout.tsx
   ↓
CSS Variable (--font-montserrat)
   ↓
Tailwind Theme (font-sans)
   ↓
Seluruh komponen UI
```

Jika suatu saat Finastriva ingin mengganti font (misalnya ke Inter atau Geist), kita hanya perlu mengubah konfigurasi pada `layout.tsx`.

---

✅ Hasil akhir:

```
font-sans
→ Montserrat
→ diterapkan ke seluruh aplikasi
```

---

🚀 **Rekomendasi engineering (opsional untuk fintech UI)**

Banyak dashboard finansial menambahkan fitur:

```
font-variant-numeric: tabular-nums;
```

Ini membuat **angka transaksi sejajar secara vertikal**, sehingga laporan finansial lebih mudah dibaca.

---

Jika Anda mau, saya juga bisa bantu **menulis ulang Chapter 6.2** supaya logo **Finastriva** nanti mengikuti standar layout yang dipakai produk seperti:

* Stripe
* Vercel
* Linear

Below is a **clean `.md` documentation version** of your chapter.
I also **rewrote and fixed the highlighted prompts**, making them clearer, more professional, and consistent with technical documentation standards.

I preserved your structure but improved:

* Prompt wording
* Technical clarity
* Markdown formatting
* Code block formatting
* Consistency between sections
* Grammar

---

---
---
---

# Chapter 6.2 – Brand Identity & Logo Integration

After improving typography in **Chapter 6.1**, the next step is to establish a **strong visual identity** by integrating the application logo into the header.

The goal is to implement the logo following **modern UI engineering standards** (similar to products built by companies like Stripe or Vercel), ensuring:

* Proper scaling
* Consistent spacing
* Accessibility compliance
* Zero layout shift
* Clean visual hierarchy

---

# Logo Asset Guidelines

Before implementation, we need a logo asset.

**Logo Generation Prompt (Improved)**

> You may design any logo concept that fits the Finastriva brand identity.
> Ensure the exported file format is **SVG (recommended)** or **PNG/JPG**.
>
> **SVG is strongly recommended** because it:
>
> * scales perfectly on Retina / 4K displays
> * maintains sharpness at any resolution
> * has smaller file size compared to raster images
> * integrates well with modern frontend frameworks
>
> The final logo file should be named:
>
> ```
> logo-finastriva.svg
> ```

---

# 1️⃣ Asset Preparation

Place the logo inside the **public directory** so it can be served directly by the browser.

```bash
# File location
frontend/public/logo-finastriva.svg
```

The `public` folder allows static assets to be accessed directly via URL:

```
/logo-finastriva.svg
```

---

# 2️⃣ Implementing the Logo in the Header

We will use the **Next.js Image component** because it provides:

* automatic optimization
* layout shift prevention
* priority loading control

Open:

```
frontend/app/page.tsx
```

(or your separated `Header` component if already created)

Then implement the following structure.

```tsx
import Image from "next/image"; // Do not foget to put it ontop of your code

// inside Home()

<header className="flex items-center gap-4 mb-10 group">

  {/* Logo Container */}
  <div className="relative p-2 bg-gray-900 rounded-xl border border-gray-800 
                  group-hover:border-blue-500/50 transition-all duration-300 
                  shadow-2xl shadow-blue-500/10">

    <Image 
      src="/logo-finastriva.svg"
      alt="Finastriva Logo"
      width={32}
      height={32}
      priority
    />

  </div>

  {/* Brand Text */}
  <div className="flex flex-col">
    <h1 className="text-2xl font-bold tracking-tight font-montserrat text-white leading-none">
      FINASTRIVA
    </h1>

    <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-semibold mt-1 opacity-80">
      Smart Assets Manager
    </span>
  </div>

</header>
```

---

# 3️⃣ Engineering Layout Analysis

Why does this structure follow **production-level UI standards**?

## Visual Balance

### Optical Alignment

Using:

```
leading-none
```

ensures the text aligns visually with the logo vertically.

Default browser line-height often introduces invisible spacing, causing the header to feel slightly misaligned.

Removing it creates **precise optical alignment**.

---

### Negative Space

```
gap-4
```

creates breathing room between:

* the **symbol (logo)**
* the **brand identity (text)**

Proper spacing improves readability and prevents visual clutter.

---

## Interactive Branding

### Group Hover

Adding `group` to the parent container allows hover interactions to propagate to children.

```css
group-hover:border-blue-500/50
```

Result:

* when the user hovers anywhere on the header
* the logo border reacts

This subtle interaction gives the interface a **responsive and polished feel**.

---

# 4️⃣ SVG Handling (Important)

⚠️ **Technical Note**

Some SVG files contain **hardcoded width/height attributes** that prevent proper scaling.

Your SVG should contain a `viewBox` attribute instead.

Example of a correct SVG root element:

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
```

The `viewBox` allows the SVG to scale correctly when rendered using:

```tsx
width={32}
height={32}
```

in the Next.js Image component.

---

# 5️⃣ Visual Verification

After saving your changes, verify the following:

### 1️⃣ Sharpness

Zoom the browser to **200%**.

The logo should remain perfectly sharp (a key advantage of SVG).

---

### 2️⃣ Font Check

Confirm the **FINASTRIVA** text uses the **Montserrat font** configured in **Chapter 6.1**.

---

### 3️⃣ Loading Performance

The logo should load instantly because the `priority` attribute ensures it loads **before other images**.

---

# 6️⃣ Common Mistake: Logo “Dead Space”

One of the most common problems when integrating SVG logos is **invisible padding around the graphic**.

This usually happens when:

* the SVG **viewBox is too large**
* the exported file contains **extra whitespace**
* the graphic does not fill the canvas

This creates **"dead space"** between the logo and the text.

CSS cannot easily remove this space because it exists **inside the SVG file itself**.

Below are the best ways to fix it.

---

# 6.1 Fix the SVG File (Recommended)

The best solution is to **trim the SVG canvas** so that the bounding box tightly fits the logo.

This improves:

* alignment
* layout precision
* rendering performance

---

## Option A — Automated Tool

Upload the SVG to an online tool like **SVG Crop**.

The tool automatically recalculates the `viewBox` so it fits the paths perfectly.

Download the **trimmed SVG** and replace the original file.

---

## Option B — Manual ViewBox Adjustment

Open the `.svg` file in a code editor like **VS Code**.

Find the `viewBox` attribute.

Example:

```xml
<svg viewBox="0 0 100 100">
```

The values represent:

```
viewBox="x y width height"
```

You can manually reduce the **width and height** to remove empty margins.

---

## Option C — Graphic Software

Using **Inkscape**:

1. Select the logo artwork
2. Go to:

```
File → Document Properties
```

3. Click:

```
Resize Page to Content
```

4. Export as:

```
Plain SVG
```

This removes unnecessary metadata and trims the canvas.

---

# 6.2 Fix Using CSS (Code-Level Workaround)

If you cannot modify the SVG file, you can compensate using CSS utilities.

---

### Reduce Flex Gap

If your container uses:

```css
gap-4
```

you can reduce it:

```css
gap-1
```

or

```css
gap-0
```

to bring the text closer.

---

### Negative Margin Technique

You can pull the text closer using a negative margin.

```tsx
<div className="flex items-center">
  <Image src="/logo-finastriva.svg" width={32} height={32} alt="Finastriva Logo"/>

  <h1 className="text-2xl font-bold -ml-2">
    FINASTRIVA
  </h1>
</div>
```

```
-ml-2
```

moves the text **2 units left**, compensating for the invisible SVG padding.

---

### Remove Text Leading

Sometimes the spacing is caused by text line height.

Use:

```
leading-none
```

to remove unnecessary vertical spacing.

---

# 6.3 Next.js Image Verification

When using the **Next.js Image component**, ensure that:

```
width
height
```

match the **actual rendered size**, not the original SVG canvas size.

Example:

```tsx
<Image
  src="/logo-finastriva.svg"
  width={32}
  height={32}
  alt="Finastriva Logo"
/>
```

This allows the browser to **reserve layout space immediately**, preventing layout shift.

---

# Final Visual Verification

After applying fixes, confirm:

1️⃣ **Sharpness**
Zoom the browser to **200%** — the SVG should remain perfectly crisp.

2️⃣ **Font Consistency**
The **FINASTRIVA** title should use **Montserrat** from Chapter 6.1.

3️⃣ **Loading Speed**
The logo should appear instantly due to the `priority` attribute.

---

# ✅ Chapter 6.2 Final Checkpoint

Confirm the following before proceeding:

* [ ] SVG logo appears in the **top-left corner**
* [ ] Brand text is **vertically aligned** with the logo
* [ ] Hover effect on the logo border works correctly

---

✅ **Result**

Your application now has a **professional brand header** with:

* scalable vector logo
* clean visual hierarchy
* responsive hover interaction
* optimized loading behavior

---

If you want, I can also help you make **Chapter 6.3** which usually comes next in professional UI systems:

**“Navigation Architecture & Header Layout System”**

(the step where your header becomes a reusable component like in Stripe/Vercel dashboards).
---
---
---
--
Biasanya ada **1 pola navbar branding yang sangat clean** dan cocok untuk fintech dashboard.



---
---
---

Berikut dokumentasi **GitHub `.md`** yang sudah disusun dari **materi utama + referensi (1) + referensi (2)**. Struktur ini dibuat rapi seperti dokumentasi engineering agar mudah dibaca di GitHub.

---

# 📘 Chapter 6.3 — Layout Modernization (Bento Grid)

Pada tahap ini, kita mengubah layout dashboard dari **single vertical layout** menjadi **Bento Grid Layout**.

Layout Bento adalah pola desain yang umum digunakan pada **dashboard fintech modern** karena mampu menampilkan banyak informasi tanpa membuat tampilan terasa penuh.

Dashboard akan dibagi menjadi beberapa **tiles/cards** yang terstruktur.

---

# 🧩 Bento Grid Architecture

Untuk aplikasi **Finastriva**, kita menggunakan **3-column responsive layout** dengan **4 area utama**:

| Card   | Area           | Fungsi                                         |
| ------ | -------------- | ---------------------------------------------- |
| Card 1 | Summary Card   | Menampilkan **Total Balance** secara real-time |
| Card 2 | Analytics Card | Tempat **Pie Chart visualisasi data**          |
| Card 3 | Action Card    | Form untuk **menambahkan transaksi**           |
| Card 4 | Activity Card  | **Riwayat transaksi** dengan scroll            |

Layout ini menjaga **hierarchy visual** agar pengguna langsung melihat informasi penting.

---

# 🧱 Implementing the Grid Skeleton

Buka file:

```
frontend/app/page.tsx
```

Kemudian ganti layout lama dengan struktur **Bento Grid** berikut.

```tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

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

        {/* CARD 2: ANALYTICS */}
        <div className="md:col-span-2 bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl flex items-center justify-center">
          <p className="text-gray-500 italic">Visualisasi Chart akan muncul di sini (Chapter 6.4)</p>
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
```

---

# ⚙️ Real-Time Balance (Derived State)

Total saldo dihitung secara **real-time** dari state transaksi.

```ts
const totalBalance = transactions.reduce((acc, t: any) =>
  t.type === "income"
    ? acc + t.amount
    : acc - t.amount,
  0
);
```

### Keuntungan pendekatan ini

**Instant Feedback**

Saldo langsung berubah ketika transaksi ditambah atau dihapus.

**Zero Latency**

Perhitungan dilakukan di browser tanpa perlu request ke server.

---

# 📱 Responsiveness Strategy

Grid menggunakan prinsip **mobile-first design**.

```
grid-cols-1 md:grid-cols-3
```

Artinya:

Mobile View

Semua card ditampilkan **vertikal dalam 1 kolom**

Desktop View

Grid berubah menjadi **3 kolom**

Distribusi card:

| Card          | Span       |
| ------------- | ---------- |
| Total Balance | col-span-1 |
| Analytics     | col-span-2 |
| Form          | col-span-1 |
| History       | col-span-2 |

Ini memberikan ruang lebih untuk **grafik dan history**.

---

# ⚠️ Common Mistakes (Critical)

Beberapa kesalahan yang sering terjadi saat membuat Bento Grid:

### 1️⃣ Mapping di luar Card

Salah:

```tsx
transactions.map(...)
```

diletakkan **di luar container grid**.

Akibatnya:

* transaksi muncul di bawah halaman
* layout grid rusak

Solusi:

Pastikan mapping berada **di dalam Card 4**.

---

### 2️⃣ Input Fields Tidak Terhubung State

Jika `value` tidak terhubung ke state:

```tsx
value={desc}
value={amount}
```

maka form tidak bisa:

* edit data
* update transaksi

---

### 3️⃣ Placeholder Input Tidak Diganti

Kadang input diganti dengan komentar:

```
{/* ... existing form inputs ... */}
```

Akibatnya form tidak muncul.

---

# 🎨 UI Styling Details

Dashboard menggunakan efek **glassmorphism**.

Tailwind classes yang digunakan:

```
bg-gray-900/50
border-gray-800
rounded-3xl
shadow-xl
```

Hasilnya:

* tampilan modern
* depth visual
* konsisten dengan fintech UI

---

# ✅ Final Checkpoint 6.3

Pastikan semua kondisi berikut terpenuhi:

* [ ] Dashboard terbagi menjadi **4 card Bento Grid**
* [ ] Total Balance berubah **secara real-time**
* [ ] Form transaksi bekerja **100%**
* [ ] History transaksi memiliki **scroll**
* [ ] Layout **responsive**
* [ ] Mapping transaksi berada **di dalam Card 4**

---

# 🚀 Next Step

Pada **Chapter 6.4** kita akan mengisi **Card 2 (Analytics)** dengan **Pie Chart interaktif** menggunakan library:

```
recharts
```

Grafik ini akan menampilkan **proporsi income vs expense** secara visual.


