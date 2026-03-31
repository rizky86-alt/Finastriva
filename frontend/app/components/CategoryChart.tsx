"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

interface CategoryChartProps {
  data: Transaction[];
}

interface GroupedData {
  name: string;
  value: number;
}

// Warna-warna futuristik untuk tiap potongan donat
const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export default function CategoryChart({ data }: CategoryChartProps) {
  // 1. Filter hanya pengeluaran (expense)
  const expenses = data.filter((t) => t.type === "expense");

  // 2. Kelompokkan berdasarkan deskripsi (sebagai kategori sementara)
  const groupedData = expenses.reduce((acc: GroupedData[], t: Transaction) => {
    const found = acc.find((item) => item.name === t.desc);
    if (found) {
      found.value += t.amount;
    } else {
      acc.push({ name: t.desc, value: t.amount });
    }
    return acc;
  }, [] as GroupedData[]);

  // Ambil 5 pengeluaran terbesar saja biar gak penuh
  const finalData = groupedData.sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="w-full h-[300px] flex items-center justify-center mt-4">
      {finalData.length === 0 ? (
        <div className="text-gray-600 italic text-sm border-2 border-dashed border-gray-800 rounded-3xl w-full h-full flex items-center justify-center">
          No expense categories found.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={finalData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Ini yang bikin jadi Donat
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {finalData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid #374151', 
                borderRadius: '12px',
                color: '#fff' 
              }}
              formatter={(value: unknown) => 
                typeof value === 'number' 
                  ? `Rp ${value.toLocaleString("id-ID")}` 
                  : String(value)
              }
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value: unknown) => <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{String(value)}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}