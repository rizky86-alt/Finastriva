import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Import Sidebar yang baru kita buat

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
    <html lang="en">
      <body className="font-sans bg-black text-white flex min-h-screen overflow-hidden">
        {/* 1. Pasang Sidebar di sisi kiri */}
        <Sidebar />

        {/* 2. Area Konten Utama di sisi kanan */}
        <main className="flex-1 overflow-y-auto h-screen bg-black relative">
          {children}
        </main>
      </body>
    </html>
  );
}

