import React from "react";

interface TransactionListProps {
  transactions: any[];
  onEdit: (t: any) => void;
  onDelete: (id: number) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  return (
    <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-[488px] flex flex-col">
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <h3 className="text-xl font-black tracking-tight">Recent History</h3>
        <span className="bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400">
          {transactions.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-gray-600 text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-sm">
            No transaction records.
          </div>
        ) : (
          transactions
            .slice()
            .reverse()
            .map((t: any) => (
              <div
                key={t.id}
                className="bg-gray-800/30 p-5 rounded-2xl flex justify-between items-center border border-gray-800/50 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      t.type === "income"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "↓" : "↑"}
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
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
