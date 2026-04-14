"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function HubPage() {
  return (
    <main className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen font-sans antialiased text-white flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
          <BrainCircuit size={40} className="text-blue-500" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">AI HUB</h1>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Fitur cerdas Gemini untuk analisis finansial otomatis akan segera hadir di Chapter 11. Bersiaplah untuk asisten keuangan pribadimu.
        </p>
        
        <div className="mt-12 flex gap-4 justify-center">
          <div className="px-6 py-2 bg-gray-900 border border-gray-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            Coming Soon
          </div>
          <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
            Chapter 11
          </div>
        </div>
      </motion.div>
    </main>
  );
}
