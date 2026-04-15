"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-finastriva.svg" alt="Finastriva" className="h-8 w-8" />
              <span className="text-lg font-bold tracking-tight text-white uppercase">FINASTRIVA</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              Platform manajemen keuangan pribadi yang modern, aman, dan mudah digunakan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-white">Menu</h4>
            <ul className="space-y-2">
              {[
                { label: "Welcome", path: "/" },
                { label: "Tentang", path: "/#tentang" },
                { label: "Layanan", path: "/#layanan" },
                { label: "Kenapa Memilih", path: "/#kenapa-kami" },
                { label: "Edukasi", path: "/#edukasi" },
                { label: "Dashboard", path: "/dashboard" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.path} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-white">Pengembang</h4>
            <p className="text-sm text-gray-500">Muh Nur Fahkri Rizky</p>
            <p className="text-sm text-gray-500 italic">Calon Anggota COCONUT 015</p>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-700">© 2026 Finastriva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
