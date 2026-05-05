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

const areaData = [
  { name: "Sun", count: 4 },
  { name: "Mon", count: 3 },
  { name: "Tue", count: 9 },
  { name: "Wed", count: 4 },
  { name: "Thu", count: 5 },
  { name: "Fri", count: 8 },
  { name: "Sat", count: 6 },
];

const barData = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 2000 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 1890 },
  { name: "Sat", revenue: 2390 },
  { name: "Sun", revenue: 3490 },
];

const pieData = [
  { name: "Consultations", value: 50, color: "#1e293b" },
  { name: "Procedures", value: 30, color: "#C1FF72" },
  { name: "Follow-ups", value: 20, color: "#cbd5e1" },
];

export function RevenueBarChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
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

export function MainAreaChart({ bookingLabel }: { bookingLabel: string }) {
  return (
    <div className="premium-card p-8 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-[#0f172a]">Appointment Trends</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">Total Bookings <span className="text-[#0f172a]">156</span></p>
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
          <AreaChart data={areaData}>
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

export function EfficiencyDonutChart() {
  return (
    <div className="h-[200px] w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Capacity</p>
        <p className="text-2xl font-black text-[#0f172a]">100%</p>
        <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
          ↑ 1.5%
        </p>
      </div>
    </div>
  );
}
