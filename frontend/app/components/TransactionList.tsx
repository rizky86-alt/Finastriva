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
  isLoading?: boolean;
}

export default function TransactionList({ transactions, onEdit, onDelete, isLoading }: TransactionListProps) {
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
           <div className="text-gray-600 text-center py-20 animate-pulse font-bold tracking-widest uppercase text-[10px]">
             Loading Transactions...
           </div>
        ) : transactions.length === 0 ? (
          <div className="text-gray-600 text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-sm">
            No transaction records.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {transactions.map((t: Transaction) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ 
                  scale: 1.01, 
                  backgroundColor: "rgba(31, 41, 55, 0.5)",
                  zIndex: 10
                }}
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
                    <button onClick={() => onEdit(t)} className="text-gray-500 hover:text-blue-400 transition p-2">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-gray-500 hover:text-red-400 transition p-2"
                    >
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
