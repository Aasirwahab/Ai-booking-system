"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Briefcase, 
  UserCog, 
  Clock, 
  Bot, 
  Settings,
  Bot as LogoIcon,
  HelpCircle,
  Inbox,
  Tags,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  orgName: string;
  industry: string;
  labels: {
    booking_label_plural: string;
    contact_label_plural: string;
    service_label_plural: string;
    staff_label_plural: string;
  };
}

export function DashboardSidebar({ orgName, industry, labels }: SidebarProps) {
  const pathname = usePathname();

  interface SidebarNavItem {
    href: string;
    label: string;
    icon: any;
    badge?: string;
  }

  const navItems: SidebarNavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/bookings", label: labels.booking_label_plural, icon: CalendarCheck },
    { href: "/dashboard/contacts", label: labels.contact_label_plural, icon: Users },
    { href: "/dashboard/services", label: labels.service_label_plural, icon: Briefcase },
    { href: "/dashboard/staff", label: labels.staff_label_plural, icon: UserCog },
    { href: "/dashboard/availability", label: "Availability", icon: Clock },
    { href: "/dashboard/inbox", label: "Inbox", icon: Inbox },
    { href: "/dashboard/promos", label: "Promos", icon: Tags },
    { href: "/dashboard/ai-agent", label: "AI Agent", icon: Bot },
    { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 glass-sidebar h-full flex flex-col p-4">
      <div className="px-2 py-4">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#C1FF72] flex items-center justify-center shadow-lg shadow-[#C1FF72]/20">
            <LogoIcon className="w-6 h-6 text-[#0f172a]" />
          </div>
          <span className="text-xl font-black text-[#0f172a] uppercase tracking-tighter">
            BookingAI
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all group",
                isActive 
                  ? "sidebar-item-active" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-[#0f172a]" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer or Spacer */}
      <div className="mt-auto pt-4 border-t border-slate-100/50">
        <p className="text-[10px] text-center text-slate-400 font-medium">
          © 2024 BookingAI
        </p>
      </div>
    </aside>
  );
}
