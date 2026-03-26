import React from "react";

interface TransactionFormProps {
  editingId: number | null;
  desc: string;
  setDesc: (val: string) => void;
  amount: number;
  setAmount: (val: number) => void;
  type: string;
  setType: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function TransactionForm({
  editingId,
  desc,
  setDesc,
  amount,
  setAmount,
  type,
  setType,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  return (
    <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl h-fit">
      <h3 className="text-xl font-black mb-8 tracking-tight">
        {editingId ? "Edit Transaction" : "New Transaction"}
      </h3>

      <div className="flex gap-2 mb-6 bg-black/50 p-1.5 rounded-2xl border border-gray-800">
        <button
          onClick={() => setType("income")}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
            type === "income" ? "bg-green-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setType("expense")}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
            type === "expense" ? "bg-red-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
          }`}
        >
          Expense
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Keterangan</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all"
            placeholder="Beli Kopi..."
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Nominal (IDR)</label>
          <input
            value={amount === 0 ? "" : amount}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 outline-none transition-all font-mono text-lg"
            placeholder="0"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-8 bg-blue-600 p-4 rounded-2xl font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30"
      >
        {editingId ? "UPDATE DATA" : "SAVE TRANSACTION"}
      </button>
      {editingId && (
        <button
          onClick={onCancel}
          className="w-full mt-4 text-gray-500 text-xs font-bold hover:text-white transition"
        >
          CANCEL EDIT
        </button>
      )}
    </div>
  );
}
