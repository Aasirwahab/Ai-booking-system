"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

interface ChartData {
  name: string;
  revenue?: number;
  count?: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

export function RevenueBarChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Bar 
            dataKey="revenue" 
            fill="#0f172a" 
            radius={[6, 6, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MainAreaChart({ data, totalBookings }: { data: ChartData[], totalBookings: number }) {
  return (
    <div className="premium-card p-8 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-[#0f172a]">Appointment Trends</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">Total Bookings <span className="text-[#0f172a]">{totalBookings}</span></p>
        </div>
        <select 
          aria-label="Filter chart by time"
          title="Filter chart by time"
          className="bg-slate-50 border-none text-xs font-bold rounded-xl px-4 py-2 outline-none"
        >
          <option>Last 7 Days</option>
        </select>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C1FF72" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C1FF72" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#C1FF72" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EfficiencyDonutChart({ data }: { data: PieData[] }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <div className="h-[200px] w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Capacity</p>
        <p className="text-2xl font-black text-[#0f172a]">{total > 0 ? "100%" : "0%"}</p>
        {total > 0 && (
          <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
            ↑ 1.5%
          </p>
        )}
      </div>
    </div>
  );
}
