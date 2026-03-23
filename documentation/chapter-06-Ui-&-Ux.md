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

Biasanya ada **1 pola navbar branding yang sangat clean** dan cocok untuk fintech dashboard.
