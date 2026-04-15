"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Smartphone, Target, Eye, Heart, User, Zap, CheckCircle } from "lucide-react";
import ArticleCard from "@/components/landing/ArticleCard";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollToTop from "@/components/landing/ScrollToTop";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

const features = [
  {
    image: "/assets/feature-tracking.png",
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Pencatatan Transaksi Cerdas",
    description: "Input mudah dengan form responsif dan validasi instan untuk setiap pengeluaran harian Anda.",
    detail: "Catat setiap pengeluaran harian Anda dengan mudah melalui antarmuka form yang intuitif. Sistem validasi otomatis memastikan data yang Anda masukkan selalu akurat dan terformat dengan baik.",
  },
  {
    image: "/assets/feature-vault.png",
    icon: <Shield className="h-5 w-5" />,
    title: "The Vault: Arsip Finansial Aman",
    description: "Data historis Anda aman di dalam The Vault, didukung infrastruktur backend yang solid.",
    detail: "Ruang penyimpanan terorganisir yang memungkinkan Anda mengakses kembali riwayat transaksi yang telah diproses kapan saja.",
  },
  {
    image: "/assets/feature-responsive.png",
    icon: <Smartphone className="h-5 w-5" />,
    title: "Desain Responsif & Rapi",
    description: "Tampilan bersih dan konsisten di semua ukuran layar untuk pengalaman pengguna terbaik.",
    detail: "Dirancang dengan pendekatan mobile-first, Finastriva memastikan pengalaman yang optimal di smartphone, tablet, maupun desktop.",
  },
];

const missions = [
  { icon: <Target className="h-5 w-5" />, text: "Menyederhanakan pencatatan keuangan pribadi" },
  { icon: <Eye className="h-5 w-5" />, text: "Menyediakan platform yang aman dan transparan" },
  { icon: <Heart className="h-5 w-5" />, text: "Mendorong kebiasaan finansial yang lebih baik bagi mahasiswa, freelancer, dan profesional muda" },
];

const advantages = [
  { icon: <Zap size={24} />, title: "Kecepatan Backend (Golang)", description: "Performa tinggi dan efisien berkat arsitektur Golang. Setiap request diproses dalam hitungan milidetik." },
  { icon: <Shield size={24} />, title: "Keamanan Data", description: "Data tersimpan aman dengan infrastruktur yang handal. Validasi berlapis di sisi klien dan server." },
  { icon: <CheckCircle size={24} />, title: "Kemudahan Penggunaan", description: "Form sederhana dengan umpan balik langsung. Tidak perlu pengalaman teknis untuk menggunakannya." },
];

const articles = [
  { title: "5 Cara Menghemat di Akhir Bulan", date: "10 April 2026", description: "Tips praktis mengatur pengeluaran agar tetap stabil hingga gajian berikutnya.", emoji: "💰" },
  { title: "Mengenal Arus Kas pribadi: Panduan Pemula", date: "5 April 2026", description: "Dasar memahami pemasukan dan pengeluaran untuk pemula yang ingin mulai mencatat keuangan.", emoji: "📊" },
  { title: "Investasi vs Menabung: Mana yang Tepat untuk Anda?", date: "1 April 2026", description: "Perbandingan strategi keuangan untuk membantu Anda memilih langkah yang paling sesuai.", emoji: "📈" },
];

export default function RootLandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-black text-white flex flex-col min-h-screen font-sans antialiased">
      <ScrollToTop />
      {!isAuthenticated && <Navbar />}
      <main className={`flex-1 ${!isAuthenticated ? "pt-16" : ""}`}>
        {/* Hero Section */}
        <section id="hero" className="section-padding min-h-[calc(100vh-4rem)] flex items-center">
          <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full max-w-7xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <p className="text-sm font-black text-blue-500 uppercase tracking-[0.2em] mb-3">Platform Keuangan Pribadi</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6 uppercase italic tracking-tighter">
                Kelola Finansial<br /><span className="text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">Tanpa Batas</span>
              </h1>
              <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-medium">
                Finastriva membantu Anda mencatat, menganalisis, dan mengelola keuangan pribadi dengan mudah melalui platform yang modern dan aman.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl h-14 px-8 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#tentang">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white font-black uppercase tracking-widest rounded-2xl h-14 px-8 transition-all active:scale-95">Pelajari Selengkapnya</Button>
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <img src="/assets/hero-illustration.png" alt="Finastriva platform illustration" className="relative w-full max-w-sm md:max-w-md lg:max-w-lg" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tentang Section */}
        <section id="tentang" className="section-padding bg-gray-900/20 border-y border-gray-900/50">
          <div className="container-main max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Tentang Kami</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Visi Finastriva</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
                Finastriva hadir untuk meningkatkan literasi keuangan di Indonesia melalui teknologi yang sederhana namun powerful.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {missions.map((m) => (
                <div key={m.text} className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2rem] p-8 text-center shadow-lg hover:border-blue-500/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-6 group-hover:scale-110 transition-transform">{m.icon}</div>
                  <p className="text-sm text-gray-400 leading-relaxed font-bold">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <div className="inline-flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/20 to-gray-900 border border-blue-500/20 flex items-center justify-center mb-4 shadow-2xl">
                  <User size={48} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Muh Nur Fahkri Rizky</h3>
                <p className="text-xs text-blue-500 font-black uppercase tracking-widest mt-1 opacity-70">Calon Anggota COCONUT 015</p>
              </div>
            </div>
          </div>
        </section>

        {/* Layanan Section */}
        <section id="layanan" className="section-padding bg-black">
          <div className="container-main max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Produk</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Layanan Kami</h2>
            </div>
            <div className="space-y-12">
              {features.map((f, i) => (
                <motion.div 
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl hover:border-gray-700 transition-all grid grid-cols-1 md:grid-cols-2 gap-0 group"
                >
                  <div className={`h-64 md:h-auto bg-gray-900/50 flex items-center justify-center p-12 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <img src={f.image} alt={f.title} className="h-full max-h-56 w-auto object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className={`p-8 sm:p-12 flex flex-col justify-center ${i % 2 === 1 ? "md:order-1 border-r border-gray-800" : "border-l border-gray-800"}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">{f.icon}</div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">{f.title}</h3>
                    </div>
                    <p className="text-blue-500/80 text-sm font-black uppercase tracking-widest mb-4">{f.description}</p>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">{f.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Kenapa Kami Section */}
        <section id="kenapa-kami" className="section-padding bg-gray-900/20 border-y border-gray-900/50">
          <div className="container-main max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Keunggulan</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Mengapa Memilih Kami?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {advantages.map((a) => (
                <div key={a.title} className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2.5rem] p-10 text-center shadow-lg hover:border-blue-500/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-gray-900 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-8 group-hover:rotate-12 transition-all">{a.icon}</div>
                  <h3 className="text-xl font-black text-white mb-4 uppercase italic tracking-tight">{a.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Edukasi Section */}
        <section id="edukasi" className="section-padding bg-black">
          <div className="container-main max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Blog</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Berita & Edukasi</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.title} {...article} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding bg-blue-600 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-blue-700 opacity-50"></div>
          <div className="container-main max-w-3xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 uppercase italic tracking-tighter">Siap Menguasai Keuangan?</h2>
            <p className="mb-10 opacity-90 text-lg sm:text-xl font-medium">Beralihlah ke manajemen finansial yang lebih cerdas dan terukur bersama Finastriva.</p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-black uppercase tracking-widest rounded-2xl h-16 px-12 shadow-2xl transition-all active:scale-95">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
}
