"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell, Calendar, User, MessageSquare, AlertCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { getActivityLogs } from "@/actions/activity";

const typeConfig: Record<string, { icon: any; color: string }> = {
  booking_created: { icon: Calendar, color: "bg-[#C1FF72]" },
  booking_pending: { icon: AlertCircle, color: "bg-amber-400" },
  booking_updated: { icon: Calendar, color: "bg-blue-400" },
  booking_cancelled: { icon: AlertCircle, color: "bg-red-400" },
  contact_created: { icon: User, color: "bg-blue-400" },
  contact_updated: { icon: User, color: "bg-blue-400" },
  ai_interaction: { icon: MessageSquare, color: "bg-[#C1FF72]" },
  default: { icon: Bell, color: "bg-slate-400" }
};

interface NotificationCenterProps {
  orgId: string;
  initialNotifications: any[];
}

export function NotificationCenter({ orgId, initialNotifications }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastViewed, setLastViewed] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  // Initialize lastViewed from localStorage and calculate unread
  useEffect(() => {
    const saved = localStorage.getItem(`last_viewed_logs_${orgId}`);
    const lastTime = saved ? parseInt(saved) : 0;
    setLastViewed(lastTime);

    const unread = initialNotifications.filter(
      n => new Date(n.created_at).getTime() > lastTime
    ).length;
    setUnreadCount(unread);
  }, [orgId, initialNotifications]);

  // Update notifications when initialNotifications prop changes (from server refresh)
  useEffect(() => {
    setNotifications(initialNotifications);
    
    const saved = localStorage.getItem(`last_viewed_logs_${orgId}`);
    const lastTime = saved ? parseInt(saved) : 0;
    const unread = initialNotifications.filter(
      n => new Date(n.created_at).getTime() > lastTime
    ).length;
    setUnreadCount(unread);
  }, [initialNotifications, orgId]);

  // Poll for new notifications every 10 seconds (server-side fetch bypasses RLS)
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(async () => {
        try {
          const freshLogs = await getActivityLogs();
          setNotifications(freshLogs);

          const saved = localStorage.getItem(`last_viewed_logs_${orgId}`);
          const lastTime = saved ? parseInt(saved) : 0;
          const unread = freshLogs.filter(
            (n: any) => new Date(n.created_at).getTime() > lastTime
          ).length;
          setUnreadCount(unread);
        } catch {
          // silently fail — will retry on next interval
        }
      });
    }, 10_000);

    return () => clearInterval(interval);
  }, [orgId]);

  const handleOpen = () => {
    const now = Date.now();
    setLastViewed(now);
    setUnreadCount(0);
    localStorage.setItem(`last_viewed_logs_${orgId}`, now.toString());
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpen()}>
      <DropdownMenuTrigger asChild>
        <button 
          aria-label="Notifications"
          title="Notifications"
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0f172a] transition-colors relative group"
        >
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white leading-none shadow-sm animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-2xl border-slate-100 bg-white/95 backdrop-blur-xl">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-bold text-slate-900 flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <span className="text-[10px] bg-[#C1FF72] text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
              {unreadCount} New
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50 mx-2" />
        <div className="max-h-[400px] overflow-y-auto py-1 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-slate-200" />
              </div>
              <p className="text-xs font-medium text-slate-400">All caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type] || typeConfig.default;
              const Icon = config.icon;
              const isUnread = new Date(notification.created_at).getTime() > lastViewed;

              return (
                <DropdownMenuItem 
                  key={notification.id}
                  className={`px-3 py-3 rounded-xl focus:bg-slate-50 cursor-pointer flex gap-3 transition-colors mb-1 last:mb-0 ${isUnread ? 'bg-[#C1FF72]/5 border border-[#C1FF72]/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${config.color}/10 flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[11px] font-bold text-slate-900 truncate">{notification.title}</span>
                      <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      {notification.description}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator className="bg-slate-50 mx-2 mt-2" />
        <div className="p-2">
          <button className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-[#0f172a] uppercase tracking-widest transition-colors">
            View All Activity
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
