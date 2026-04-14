export default function BalanceCard({ total, income, expense }: { total: number; income: number; expense: number }) {
  return (
    <div className="lg:col-span-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center min-h-[350px]">
      <h2 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Total Balance</h2>
      
      <p className={`text-5xl font-black tracking-tighter ${total < 0 ? 'text-red-500' : 'text-white'}`}>
        {total < 0 ? `- Rp ${Math.abs(total).toLocaleString()}` : `Rp ${total.toLocaleString()}`}
      </p>

      <div className="mt-8 flex items-center gap-6 border-t border-gray-800 pt-6">
        <div className="flex flex-col">
          <span className="text-gray-500 text-[10px] uppercase font-bold">Income</span>
          <span className="text-green-400 font-mono font-bold">↑ Rp {income.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[10px] uppercase font-bold">Expense</span>
          <span className="text-red-400 font-mono font-bold">↓ Rp {expense.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
