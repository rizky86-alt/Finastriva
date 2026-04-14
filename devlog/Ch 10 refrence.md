Siap, Rizky! Backend sudah punya "satpam", sekarang saatnya kita bangun **Gerbang Utama** di Frontend. Kita akan buat satu halaman cantik yang bisa berubah wujud dari **Login** ke **Register** dengan animasi halus.

Kita akan menggunakan **`localStorage`** untuk menyimpan token. Ini cara paling simpel dan efektif untuk level *development* agar browser ingat kalau kamu sudah login.

---

## 📘 Chapter 10 (Part 2): The Frontend Gate

### 🛠️ Langkah 1: Buat Halaman Auth
Buat file baru di **`frontend/app/auth/page.tsx`**. Halaman ini akan menangani dua fungsi sekaligus: Masuk dan Daftar.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/login" : "/api/register";
    const API_URL = process.env.NEXT_PUBLIC_API_URL + endpoint;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");

      if (isLogin) {
        // Simpan "Gelang Digital" (Token) di browser
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        router.push("/"); // Tendang ke Dashboard
      } else {
        alert("Registrasi sukses! Silakan login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-black">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            {isLogin ? "Welcome Back" : "Join Finastriva"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Masuk untuk mengelola brankasmu." : "Mulai perjalanan finansialmu sekarang."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Username"
              className="w-full bg-gray-800/50 border border-gray-700 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-gray-800/50 border border-gray-700 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center italic">
              ⚠ {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "PROCESSING..." : isLogin ? "LOGIN" : "CREATE ACCOUNT"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
```

---

### 🧐 Apa yang Baru Saja Terjadi?

1.  **Dynamic UI:** Kita pakai satu *state* `isLogin` untuk mengubah teks tombol, judul, bahkan endpoint API yang dipanggil. Jadi kodenya lebih efisien (DRY - *Don't Repeat Yourself*).
2.  **`localStorage.setItem`:** Begitu login sukses, kita titipkan Token di browser. Ini penting karena di Chapter 11 nanti, kita akan butuh token ini untuk membuktikan ke Backend kalau kita adalah pemilik data yang sah.
3.  **`useRouter`:** Begitu sukses, kita langsung "lempar" user ke halaman utama (`/`). Gak pake nunggu lama.
4.  **Glassmorphism Design:** Kita pakai `backdrop-blur-xl` dan radial gradient di background biar tampilannya kerasa sangat premium dan *secure*.

---

### 🛠️ Langkah 2: Middleware Sederhana (Proteksi Awal)
Sekarang, kita ingin kalau user **belum login**, dia gak bisa buka Dashboard.

Buka file **`frontend/app/layout.tsx`** atau komponen utama kamu, lalu tambahkan pengecekan ini di dalam `useEffect`:

```tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  const path = window.location.pathname;

  if (!token && path !== "/auth") {
    window.location.href = "/auth";
  }
}, []);
```

---

### ✅ Checkpoint Chapter 10
* [ ] Jalankan Backend Go kamu.
* [ ] Buka `localhost:3000/auth`.
* [ ] Coba **Register** dulu dengan username baru.
* [ ] Setelah sukses, coba **Login**.
* [ ] Cek apakah kamu otomatis pindah ke Dashboard.

**Gimana Rizky? Berhasil masuk ke Dashboard lewat pintu depan?** Kalau sudah, selamat! Finastriva sekarang bukan lagi aplikasi "bebas masuk", tapi sudah jadi **Private Wealth App** punya kamu sendiri.

**Mau lanjut ke Chapter 11: The AI Hub (Integrasi Gemini)?** Ini bagian yang bakal bikin aplikasi kamu bener-bener "pintar" karena bisa diajak ngobrol soal keuangan! **Gas?**

Siap, Rizky! Backend sudah punya "satpam", sekarang saatnya kita bangun **Gerbang Utama** di Frontend. Kita akan buat satu halaman cantik yang bisa berubah wujud dari **Login** ke **Register** dengan animasi halus.

Kita akan menggunakan **`localStorage`** untuk menyimpan token. Ini cara paling simpel dan efektif untuk level *development* agar browser ingat kalau kamu sudah login.

---

## 📘 Chapter 10 (Part 2): The Frontend Gate

### 🛠️ Langkah 1: Buat Halaman Auth
Buat file baru di **`frontend/app/auth/page.tsx`**. Halaman ini akan menangani dua fungsi sekaligus: Masuk dan Daftar.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/login" : "/api/register";
    const API_URL = process.env.NEXT_PUBLIC_API_URL + endpoint;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");

      if (isLogin) {
        // Simpan "Gelang Digital" (Token) di browser
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        router.push("/"); // Tendang ke Dashboard
      } else {
        alert("Registrasi sukses! Silakan login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-black">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            {isLogin ? "Welcome Back" : "Join Finastriva"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Masuk untuk mengelola brankasmu." : "Mulai perjalanan finansialmu sekarang."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Username"
              className="w-full bg-gray-800/50 border border-gray-700 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-gray-800/50 border border-gray-700 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center italic">
              ⚠ {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "PROCESSING..." : isLogin ? "LOGIN" : "CREATE ACCOUNT"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
```

---

### 🧐 Apa yang Baru Saja Terjadi?

1.  **Dynamic UI:** Kita pakai satu *state* `isLogin` untuk mengubah teks tombol, judul, bahkan endpoint API yang dipanggil. Jadi kodenya lebih efisien (DRY - *Don't Repeat Yourself*).
2.  **`localStorage.setItem`:** Begitu login sukses, kita titipkan Token di browser. Ini penting karena di Chapter 11 nanti, kita akan butuh token ini untuk membuktikan ke Backend kalau kita adalah pemilik data yang sah.
3.  **`useRouter`:** Begitu sukses, kita langsung "lempar" user ke halaman utama (`/`). Gak pake nunggu lama.
4.  **Glassmorphism Design:** Kita pakai `backdrop-blur-xl` dan radial gradient di background biar tampilannya kerasa sangat premium dan *secure*.

---

### 🛠️ Langkah 2: Middleware Sederhana (Proteksi Awal)
Sekarang, kita ingin kalau user **belum login**, dia gak bisa buka Dashboard.

Buka file **`frontend/app/layout.tsx`** atau komponen utama kamu, lalu tambahkan pengecekan ini di dalam `useEffect`:

```tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  const path = window.location.pathname;

  if (!token && path !== "/auth") {
    window.location.href = "/auth";
  }
}, []);
```

---

### ✅ Checkpoint Chapter 10
* [ ] Jalankan Backend Go kamu.
* [ ] Buka `localhost:3000/auth`.
* [ ] Coba **Register** dulu dengan username baru.
* [ ] Setelah sukses, coba **Login**.
* [ ] Cek apakah kamu otomatis pindah ke Dashboard.

**Gimana Rizky? Berhasil masuk ke Dashboard lewat pintu depan?** Kalau sudah, selamat! Finastriva sekarang bukan lagi aplikasi "bebas masuk", tapi sudah jadi **Private Wealth App** punya kamu sendiri.

**Mau lanjut ke Chapter 11: The AI Hub (Integrasi Gemini)?** Ini bagian yang bakal bikin aplikasi kamu bener-bener "pintar" karena bisa diajak ngobrol soal keuangan! **Gas?**