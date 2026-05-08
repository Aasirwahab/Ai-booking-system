import { CheckCircle2, AlertCircle, LogIn, Clock, Bell, Calendar, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  created_at: string;
  type: string;
  title: string;
  description?: string;
}

interface ActivityTimelineProps {
  activities: ActivityLog[];
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  booking_created: { icon: Calendar, color: "bg-[#C1FF72]" },
  booking_cancelled: { icon: AlertCircle, color: "bg-red-400" },
  contact_created: { icon: User, color: "bg-blue-400" },
  contact_updated: { icon: User, color: "bg-blue-400" },
  ai_interaction: { icon: MessageSquare, color: "bg-[#C1FF72]" },
  default: { icon: Bell, color: "bg-slate-400" }
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
        <Bell className="w-8 h-8 mb-2 opacity-20" />
        <p className="text-xs font-medium">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activities.map((item) => {
        const config = typeConfig[item.type] || typeConfig.default;
        const Icon = config.icon;
        
        return (
          <div key={item.id} className="flex gap-4">
            <div className={`w-10 h-10 rounded-2xl ${config.color}/10 flex items-center justify-center shrink-0 border border-slate-50`}>
              <Icon className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 mb-1">
                {format(new Date(item.created_at), "h:mm a")}
              </p>
              <p className="text-xs font-bold text-slate-600 leading-tight">{item.title}</p>
              {item.description && (
                <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
