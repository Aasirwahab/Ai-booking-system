import { getCurrentUser } from "@/lib/auth";
import { getNicheSettings } from "@/lib/auth/niche";
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  MoreHorizontal,
  ArrowUpRight,
  Activity,
  CreditCard,
  Target
} from "lucide-react";
import { PremiumMetricCard } from "@/components/dashboard/premium-metric-card";
import { EfficiencyDonutChart, RevenueBarChart } from "@/components/dashboard/dashboard-charts";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { getDashboardStats } from "@/actions/analytics";
import { format } from "date-fns";

export default async function DashboardPage() {
  const ctx = await getCurrentUser({ requireOrg: true });
  const labels = await getNicheSettings(ctx.org!.id);
  const stats = await getDashboardStats();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">Overview</h1>
          <p className="text-slate-400 font-bold mt-1">
            Track your {ctx.org!.industry || "business"}'s performance and growth.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#f8fafc] bg-slate-200 overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-[#f8fafc] bg-[#C1FF72] flex items-center justify-center text-[10px] font-black text-[#0f172a]">
                 +12
              </div>
           </div>
           <div className="text-right">
              <p className="text-xs font-black text-[#0f172a] uppercase tracking-widest">Active Now</p>
              <p className="text-[10px] font-bold text-[#C1FF72] uppercase">Live Updates</p>
           </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumMetricCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          icon={TrendingUp} 
          description="Gross earnings this month"
        />
        <PremiumMetricCard 
          title={labels.contact_label_plural} 
          value={stats.totalClients.toString()} 
          trend="+5.2%" 
          icon={Users} 
          description={`Total registered ${labels.contact_label.toLowerCase()}s`}
        />
        <PremiumMetricCard 
          title={labels.booking_label_plural} 
          value={stats.totalBookings.toString()} 
          trend="+18.4%" 
          icon={CalendarCheck} 
          description="Total appointments booked"
        />
        <PremiumMetricCard 
          title="Growth Rate" 
          value="24.8%" 
          trend="+2.1%" 
          icon={Target} 
          description="Month over month expansion"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Charts & Tables */}
        <div className="xl:col-span-8 space-y-8">
          <div className="premium-card p-8">
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-[#0f172a]">Revenue Stream</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Weekly Performance</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-[#0f172a]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">Bookings</span>
                   </div>
                </div>
             </div>
             <RevenueBarChart />
          </div>

          <div className="premium-card p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#0f172a]">Recent {labels.contact_label_plural}</h3>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0f172a] transition-colors flex items-center gap-2">
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4">{labels.contact_label} Name</th>
                    <th className="pb-4">{labels.service_label_plural}</th>
                    <th className="pb-4">Date & Time</th>
                    <th className="pb-4">Fee</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-bold italic">
                        No recent activity found.
                      </td>
                    </tr>
                  )}
                  {stats.recentBookings.map((item: any, i: number) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5">
                        <p className="text-xs font-bold text-[#0f172a]">{item.contact?.full_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Verified</p>
                      </td>
                      <td className="py-5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{item.service?.name}</span>
                      </td>
                      <td className="py-5">
                        <p className="text-xs font-bold text-[#0f172a]">{format(new Date(item.start_time), "yyyy-MM-dd")}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{format(new Date(item.start_time), "HH:mm")}</p>
                      </td>
                      <td className="py-5 text-xs font-black text-[#0f172a]">${item.service?.price ?? 0}</td>
                      <td className="py-5">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                          item.status === 'confirmed' || item.status === 'completed' 
                            ? "bg-[#C1FF72]/20 text-[#0f172a]" 
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {item.status === 'confirmed' ? 'Confirmed' : item.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Health & Efficiency */}
        <div className="xl:col-span-4 space-y-8">
          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#0f172a]">Client Growth</h3>
              <Activity className="w-5 h-5 text-[#C1FF72]" />
            </div>
            <EfficiencyDonutChart />
          </div>

          {/* AI Performance Card */}
          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-[#0f172a]">AI Performance</h3>
              <MoreHorizontal className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Efficiency Rating</p>
            <h4 className="text-2xl font-black text-[#0f172a] mb-6">Excellent</h4>
            
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C1FF72] rounded-full shadow-[0_0_15px_rgba(193,255,114,0.5)] w-[92%]" 
                  role="progressbar"
                  aria-label="Efficiency Rating: 92%"
                />
            </div>
            <div className="flex justify-between mt-3">
               <span className="text-[10px] font-black text-slate-300">0%</span>
               <span className="text-sm font-black text-[#0f172a]">92%</span>
            </div>
          </div>

          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#0f172a]">Live Activity</h3>
              <span className="flex h-2 w-2 rounded-full bg-[#C1FF72] animate-pulse" />
            </div>
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
