import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function AnalyticsCard({ income, expense, chartData }: { income: number; expense: number; chartData: any[] }) {
  return (
    <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2rem] shadow-2xl flex flex-col min-h-[350px]">
      <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Alokasi Dana</h2>
      {income === 0 && expense === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600 italic text-sm">No transaction data yet.</div>
      ) : (
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="45%" innerRadius="65%" outerRadius="85%" paddingAngle={10} dataKey="value">
                <Cell fill="#22c55e" stroke="none" />
                <Cell fill="#ef4444" stroke="none" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }} />
              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}