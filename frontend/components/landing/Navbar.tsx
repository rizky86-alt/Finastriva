"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Welcome", path: "/", hash: "" },
  { label: "Tentang", path: "/#tentang", hash: "#tentang" },
  { label: "Layanan", path: "/#layanan", hash: "#layanan" },
  { label: "Kenapa Memilih", path: "/#kenapa-kami", hash: "#kenapa-kami" },
  { label: "Edukasi", path: "/#edukasi", hash: "#edukasi" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setHash(window.location.hash);
  }, [pathname]);

  const handleNavClick = (item: typeof navItems[0]) => {
    setIsOpen(false);
    if (item.hash) {
      setHash(item.hash);
    } else {
      setHash("");
    }
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.hash) return hash === item.hash;
    return pathname === item.path && !hash;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 border-b border-gray-800 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-sm"
          : "bg-black"
      }`}
    >
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-finastriva.svg" alt="Finastriva" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-white uppercase">FINASTRIVA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              onClick={() => handleNavClick(item)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item)
                  ? "text-blue-500 bg-blue-500/10 font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 text-white rounded-lg hover:bg-gray-900 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-black border-b border-gray-800 shadow-lg px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              onClick={() => handleNavClick(item)}
              className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive(item)
                  ? "text-blue-500 bg-blue-500/10 font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
