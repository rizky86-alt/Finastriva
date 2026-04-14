import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./context/AuthContext";

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
      <body className="font-sans min-h-screen flex bg-black text-white overflow-hidden">
        <AuthProvider>
          <AuthGuard>
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen bg-black relative custom-scrollbar">
              {children}
            </main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
