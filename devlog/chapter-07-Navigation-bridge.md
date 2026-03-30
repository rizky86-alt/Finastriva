

# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 7 – The Navigation Bridge

Setelah berhasil melakukan *refactoring* besar-besaran dan memberikan sentuhan visual yang modern di Chapter 6, sekarang saatnya kita melangkah lebih jauh. Finastriva tidak boleh selamanya menjadi "Web Satu Halaman". 

Di bab ini, kita akan mengubah arsitektur aplikasi menjadi **Sistem 3-Halaman** dengan navigasi samping (Sidebar) yang kokoh dan dinamis. Kita akan membangun "jembatan" yang menghubungkan Dashboard utama dengan fitur-fitur masa depan seperti *The Vault* dan *AI Hub*.

---

## 🗺️ Roadmap Chapter 7 (The Fresh Start)

| Langkah | Fokus Utama | Deskripsi |
| :--- | :--- | :--- |
| **1** | **Clean Config** | Menyiapkan `.env.local` agar alamat API terpusat. |
| **2** | **The Sidebar** | Membuat komponen menu samping dengan ikon Lucide. |
| **3** | **Layout Surgery** | Memasang Sidebar ke struktur utama (Global Layout). |
| **4** | **Routing Setup** | Membuat folder `/vault` dan `/hub` agar link tidak error. |
| **5** | **Dashboard Sync** | Merapikan tampilan `page.tsx` agar pas dengan Sidebar. |

---

## 🛠️ Langkah 1: Clean Config (Fondasi API)

Sebagai *engineer*, kita harus menghindari *hardcoding*. Mengetik `http://localhost:8080` berulang kali di setiap file itu berbahaya dan tidak efisien. 

Kita akan membuat **Pusat Komando** agar alamat API terpusat. Buat file baru bernama `.env.local` di folder `frontend/` (sejajar dengan `package.json`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Penting:** Setelah buat file ini, matikan terminal (**Ctrl+C**) lalu jalankan lagi `npm run dev` agar Next.js membaca variabel barunya.

✅ **Checkpoint 7.1:** File `.env.local` berhasil diinisialisasi.

---

## 🛠️ Langkah 2: The Sidebar Component (Pintu Navigasi)

Kita akan membuat Sidebar yang elegan dengan efek *active state* (berubah warna sesuai halaman yang dibuka). Pastikan kamu sudah install ikon: `npm install lucide-react`.

Buat file baru: `frontend/app/components/Sidebar.tsx`

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, BrainCircuit, Wallet } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { name: "The Vault", icon: <History size={20} />, path: "/vault" },
  { name: "AI Hub", icon: <BrainCircuit size={20} />, path: "/hub" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black border-r border-gray-800 flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Wallet className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tighter">FINASTRIVA</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" 
                : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <span className={`${isActive ? "text-blue-500" : "group-hover:text-white"}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-900">
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800/50">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Developer Mode</p>
          <p className="text-sm font-black truncate text-blue-400">Rizky Aziz</p>
        </div>
      </div>
    </aside>
  );
}
```

✅ **Checkpoint 7.2:** Komponen Sidebar siap digunakan.

---

## 🛠️ Langkah 3: Layout Surgery (Pemasangan Global)

Kita akan "membedah" struktur utama agar Sidebar muncul di sebelah kiri pada setiap halaman. Buka `frontend/app/layout.tsx` dan sesuaikan:

```tsx
import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex min-h-screen overflow-hidden">
        {/* 1. Pasang Sidebar di sisi kiri */}
        <Sidebar />

        {/* 2. Area Konten Utama di sisi kanan */}
        <main className="flex-1 overflow-y-auto h-screen bg-black relative custom-scrollbar">
          {children}
        </main>
      </body>
    </html>
  );
}
```

✅ **Checkpoint 7.3:** Sidebar berhasil terpasang secara global.

---

## 🛠️ Langkah 4: Routing Setup (Mencegah Error 404)

Kita buat "rumah kosong" untuk halaman baru agar navigasi Sidebar tidak *error*.

**1. Halaman Vault (`frontend/app/vault/page.tsx`):**
```tsx
export default function VaultPage() {
  return (
    <div className="p-20 text-center">
      <h1 className="text-4xl font-black">THE VAULT</h1>
      <p className="text-gray-500 mt-4">Halaman arsip transaksi akan dibangun di Chapter 8.</p>
    </div>
  );
}
```

**2. Halaman AI Hub (`frontend/app/hub/page.tsx`):**
```tsx
export default function HubPage() {
  return (
    <div className="p-20 text-center">
      <h1 className="text-4xl font-black">AI HUB</h1>
      <p className="text-gray-500 mt-4">Fitur cerdas Gemini akan dibangun di Chapter 11.</p>
    </div>
  );
}
```

✅ **Checkpoint 7.4:** Routing `/vault` dan `/hub` aktif.

---

# 📌 Ringkasan Chapter 7

| Feature | Status |
| :--- | :--- |
| Centralized API Config (`.env`) | ✅ |
| Sidebar Component | ✅ |
| Global Layout Integration | ✅ |
| Multi-page Routing | ✅ |
| Custom Modern Scrollbar | ✅ |

✅ **Checkpoint Final Chapter 7:** Finastriva kini memiliki sistem navigasi yang kokoh dan siap menampung fitur-fitur hebat di bab selanjutnya.

