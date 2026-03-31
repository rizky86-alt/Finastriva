import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const SkeletonItem = () => (
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className="bg-gray-800/20 p-5 rounded-2xl flex justify-between items-center border border-gray-800/50 h-20 w-full"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-700/50" />

      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 bg-gray-700/50 rounded" />
        <div className="h-3 w-20 bg-gray-700/50 rounded" />
      </div>
    </div>

    <div className="h-6 w-24 bg-gray-700/50 rounded" />
  </motion.div>
);

// Update Props untuk menerima status loading
export default function TransactionList({ transactions, onEdit, onDelete, isLoading }: TransactionListProps & { isLoading: boolean }) {
  return (

    <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-[488px] flex flex-col">
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <h3 className="text-xl font-black tracking-tight">Recent History</h3>
        <span className="bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400">
          {transactions.length} items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">

      
      {isLoading ? (
        <div className="space-y-4">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </div>
        ) : transactions.length === 0 ? (

        <div className="text-gray-600 text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-sm">
          No transaction records.
        </div>
      ) : (  
      <AnimatePresence initial={false}> 
          {transactions.slice().map((t: Transaction) => (

             <motion.div
            key={t.id} // Key wajib sama dengan id database agar framer-motion tahu item mana yang beranimasi

                // Konfigurasi Animasi
                initial={{ opacity: 0, y: 15 }} // Muncul: Mulai dari pudar dan agak ke bawah
                animate={{ opacity: 1, y: 0 }}   // Masuk: Fade-in dan slide-up ke posisi asli
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} // Hapus: Pudar, mengecil, durasi cepat
                
                // Hover Effect Premium (Mengganti Tailwind hover)
                whileHover={{ 
                  scale: 1.01, 
                  backgroundColor: "rgba(31, 41, 55, 0.5)",
                  zIndex: 10   // Added zIndex to ensure the scaled item stays on top of neighbors
                }} // Sedikit membesar dan background lebih terang saat disorot
                
                // Tailwind class tetap sama, hanya hapus "hover:" yang manual
                  className="bg-gray-800/30 p-5 rounded-2xl flex justify-between items-center border border-gray-800/50 group cursor-pointer relative"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      t.type === "income"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {t.type === "income" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold group-hover:text-blue-400 transition-colors">
                      {t.desc}
                    </span>
                    <span className="text-gray-500 text-[10px] font-medium font-mono">
                      {new Date(t.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`font-mono text-lg font-black ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+ " : "- "} Rp {t.amount.toLocaleString()}
                  </span>
                  <div className="flex gap-3 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(t)} className="text-gray-500 hover:text-blue-400 transition">
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => onDelete(t.id)} className="text-gray-500 hover:text-red-400 transition">
                    <Trash2 size={18} />
                  </button>
                  </div>
                </div>
                </motion.div>
            ))}
          </AnimatePresence>
          )}
      </div>
    </div>
  );
}
