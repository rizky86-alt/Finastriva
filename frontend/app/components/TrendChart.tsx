"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

interface TrendChartProps {
  data: Transaction[];
}

export default function TrendChart({ data }: TrendChartProps) {
  // Ambil 10 data terakhir untuk tren
  const chartData = data.slice(0, 10).reverse().map(t => ({
    name: new Date(t.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' }),
    amount: t.type === 'income' ? t.amount : -t.amount,
    type: t.type
  }));

  return (
    <div className="w-full h-[300px] mt-4 flex items-center justify-center">
      {chartData.length === 0 ? (
        <div className="text-gray-600 italic text-sm border-2 border-dashed border-gray-800 rounded-3xl w-full h-full flex items-center justify-center">
          No data for trend analysis.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 30, bottom: 20 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => {
                if (value >= 1000000 || value <= -1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000 || value <= -1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
            />
            <ReferenceLine y={0} stroke="#4b5563" strokeWidth={2} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827', 
                border: '1px solid #374151', 
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
              formatter={(value: unknown) => typeof value === 'number' ? `Rp ${value.toLocaleString("id-ID")}` : String(value)}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
