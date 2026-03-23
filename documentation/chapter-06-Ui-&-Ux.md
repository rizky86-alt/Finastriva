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
