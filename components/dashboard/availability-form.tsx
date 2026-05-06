"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock, Calendar, User, Plus } from "lucide-react";
import { DAYS } from "@/lib/constants";

interface AvailabilityFormProps {
  staff: any[];
  labels: {
    staff_label: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AvailabilityForm({ staff, labels, onSubmit }: AvailabilityFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const handleToggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };

  const handleSelectAll = () => {
    if (selectedDays.length === 7) {
      setSelectedDays([]);
    } else {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSelectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      alert("Please select at least one day.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Append all selected days
    selectedDays.forEach(day => formData.append("days", day.toString()));
    
    try {
      await onSubmit(formData);
      setSelectedDays([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card p-8 bg-white border-none shadow-xl rounded-[2.5rem] mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-[#C1FF72]/10">
          <Calendar className="w-6 h-6 text-[#0f172a]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Set Availability</h2>
          <p className="text-sm font-bold text-slate-400">Add working hours for your team members.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">
              Select {labels.staff_label}
            </Label>
            <Select name="staff_id" required>
              <SelectTrigger className="rounded-2xl h-14 border-slate-100 bg-slate-50 focus:ring-[#C1FF72] font-bold">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder={`Select a ${labels.staff_label.toLowerCase()}`} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                {staff.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="font-bold py-3">
                    {s.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">
                Start Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  name="start_time" 
                  type="time" 
                  defaultValue="09:00" 
                  required 
                  className="rounded-2xl h-14 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">
                End Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  name="end_time" 
                  type="time" 
                  defaultValue="17:00" 
                  required 
                  className="rounded-2xl h-14 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Select Days
            </Label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={handleSelectWeekdays}
                className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:text-[#C1FF72] transition-colors"
              >
                Weekdays
              </button>
              <button 
                type="button" 
                onClick={handleSelectAll}
                className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:text-[#C1FF72] transition-colors"
              >
                {selectedDays.length === 7 ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {DAYS.map((day, index) => {
              const isSelected = selectedDays.includes(index);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(index)}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-300 font-bold text-sm
                    ${isSelected 
                      ? "bg-[#C1FF72] border-[#C1FF72] text-[#0f172a] shadow-lg shadow-[#C1FF72]/20" 
                      : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                    }
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? "border-[#0f172a] bg-[#0f172a]" : "border-slate-300"}
                  `}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#C1FF72]" />}
                  </div>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button 
            disabled={loading || selectedDays.length === 0}
            className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-[#C1FF72] font-black rounded-2xl px-12 h-16 text-lg shadow-xl"
          >
            {loading ? "Adding..." : (
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Rule
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
