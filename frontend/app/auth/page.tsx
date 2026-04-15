"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Helper untuk mendapatkan URL API yang valid
  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Hapus trailing slash dari base
    const cleanBase = base.replace(/\/+$/, "");
    // Pastikan endpoint mulai dengan satu slash
    const cleanEndpoint = `/${endpoint.replace(/^\/+/, "")}`;
    return `${cleanBase}${cleanEndpoint}`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/login" : "/api/register";
    const url = getApiUrl(endpoint);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const rawText = await res.text();
        console.error("Non-JSON Response from", url, ":", rawText);
        throw new Error(`Server returned non-JSON response (${res.status}). Check if backend is running correctly.`);
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Terjadi kesalahan");

      if (isLogin) {
        login(data.token, data.username, data.roles || []);
      } else {
        alert("Registrasi sukses! Silakan login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(`Auth error at ${url}:`, err);
      setError(err.message || "Koneksi ke server gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 bg-black font-sans antialiased text-white">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Image 
              src="/logo-finastriva.svg" 
              alt="Finastriva Logo" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
            {isLogin ? "Welcome Back" : "Join Finastriva"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
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
