import { CheckCircle2, AlertCircle, LogIn, Clock, Bell } from "lucide-react";

const activities = [
  {
    id: 1,
    time: "11:45 AM",
    title: "New appointment scheduled by John Doe",
    icon: Bell,
    color: "bg-[#C1FF72]",
    date: "Today"
  },
  {
    id: 2,
    time: "09:22 AM",
    title: "Patient Sarah Smith checked in",
    icon: CheckCircle2,
    color: "bg-emerald-400",
    date: "Today"
  },
  {
    id: 3,
    time: "07:15 AM",
    title: "Dr. Miller updated their availability",
    icon: Clock,
    color: "bg-[#C1FF72]",
    date: "Today"
  }
];

export function ActivityTimeline() {
  return (
    <div className="space-y-8">
      {activities.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className={`w-10 h-10 rounded-2xl ${item.color}/10 flex items-center justify-center shrink-0 border border-slate-50`}>
            <item.icon className={`w-5 h-5 ${item.id === 1 ? "text-[#0f172a]" : "text-slate-900"}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-300 mb-1">{item.time}</p>
            <p className="text-xs font-bold text-slate-600 leading-tight">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
