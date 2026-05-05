"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search, Settings, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardHeader({ userName }: { userName: string }) {
  return (
    <header className="h-20 bg-[#f8fafc] flex items-center justify-between px-10 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0f172a] transition-colors" />
          <Input 
            placeholder="Search anything..." 
            aria-label="Search"
            title="Search"
            className="pl-12 h-12 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-[#C1FF72] w-full text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button 
            aria-label="Inbox"
            title="Inbox"
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0f172a] transition-colors relative"
          >
            <Inbox className="w-5 h-5" />
          </button>
          <button 
            aria-label="Notifications"
            title="Notifications"
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0f172a] transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200" />
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0f172a]">{userName}</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
