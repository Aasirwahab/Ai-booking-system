import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Users, Briefcase, TrendingUp } from "lucide-react";

interface MetricsProps {
  stats: {
    totalBookings: number;
    totalContacts: number;
    totalServices: number;
  };
  labels: {
    booking_label_plural: string;
    contact_label_plural: string;
    service_label_plural: string;
  };
}

export function MetricsCards({ stats, labels }: MetricsProps) {
  const cards = [
    {
      title: `Total ${labels.booking_label_plural}`,
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "text-teal-600",
      bg: "bg-teal-50",
      trend: "+12% from last month",
    },
    {
      title: `Total ${labels.contact_label_plural}`,
      value: stats.totalContacts,
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      trend: "+5 new today",
    },
    {
      title: `Total ${labels.service_label_plural}`,
      value: stats.totalServices,
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "Active now",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-none shadow-sm hover-lift overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 stat-number">{card.value}</div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-teal-500" />
              {card.trend}
            </p>
          </CardContent>
          <div className={`h-1 w-full bg-gradient-to-r ${card.bg.replace('bg-', 'from-').replace('50', '500')} to-transparent opacity-20`} />
        </Card>
      ))}
    </div>
  );
}
