import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  description: string;
}

export function PremiumMetricCard({ title, value, trend, icon: Icon, description }: MetricCardProps) {
  const isPositive = trend.startsWith("+");

  return (
    <div className="premium-card p-6 flex flex-col gap-4 group hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#C1FF72]/10 group-hover:text-[#0f172a] transition-colors duration-500">
           <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter",
          isPositive ? "bg-[#C1FF72]/20 text-[#0f172a]" : "bg-rose-50 text-rose-500"
        )}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {trend}
        </div>
      </div>
      
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">{value}</h2>
        <p className="text-[11px] font-bold text-slate-400 mt-2">{description}</p>
      </div>
    </div>
  );
}
