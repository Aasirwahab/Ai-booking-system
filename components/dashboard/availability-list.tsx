"use client";

import { Trash2, Clock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DAYS } from "@/lib/constants";
import { deleteAvailability } from "@/actions/availability";

interface AvailabilityListProps {
  rules: any[];
  labels: {
    staff_label: string;
  };
}

export function AvailabilityList({ rules, labels }: AvailabilityListProps) {
  // Group rules by staff member
  const groupedRules = rules.reduce((acc, rule) => {
    const staffName = rule.staff?.full_name || "Unknown";
    if (!acc[staffName]) acc[staffName] = [];
    acc[staffName].push(rule);
    return acc;
  }, {} as Record<string, any[]>);

  if (rules.length === 0) {
    return (
      <div className="premium-card p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100">
        <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-2xl font-black text-[#0f172a] mb-2">No availability rules yet</h3>
        <p className="text-slate-400 font-bold max-w-xs mx-auto">
          Add rules above to set the working hours for your {labels.staff_label.toLowerCase()} team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedRules).map(([staffName, staffRules]) => (
        <div key={staffName} className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <User className="w-4 h-4 text-[#C1FF72]" />
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest">{staffName}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(staffRules as any[]).map((rule: any) => (
              <div 
                key={rule.id} 
                className="premium-card p-6 flex items-center justify-between group hover:border-[#C1FF72]/50 transition-all bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#0f172a] group-hover:bg-[#C1FF72]/10 transition-colors">
                    {DAYS[rule.day_of_week].substring(0, 3)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0f172a]">{DAYS[rule.day_of_week]}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-400">
                        {rule.start_time} - {rule.end_time}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteAvailability(rule.id)}
                  className="h-10 w-10 text-slate-300 hover:text-destructive hover:bg-destructive/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
