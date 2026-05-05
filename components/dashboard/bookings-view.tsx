"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  Filter,
  Search,
  LayoutGrid,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsCalendar } from "./bookings-calendar";
import { BookingCard } from "./booking-card";

interface BookingsViewProps {
  bookings: any[];
  labels: any;
}

export function BookingsView({ bookings, labels }: BookingsViewProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [search, setSearch] = useState("");

  const filteredBookings = bookings.filter(b => 
    b.contact?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <Button 
            variant={view === "calendar" ? "default" : "ghost"} 
            onClick={() => setView("calendar")}
            className={`rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-wider transition-all ${
              view === "calendar" ? "bg-[#0f172a] text-white shadow-lg" : "text-slate-400"
            }`}
          >
            <CalendarDays className="w-4 h-4 mr-2" /> Calendar
          </Button>
          <Button 
            variant={view === "list" ? "default" : "ghost"} 
            onClick={() => setView("list")}
            className={`rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-wider transition-all ${
              view === "list" ? "bg-[#0f172a] text-white shadow-lg" : "text-slate-400"
            }`}
          >
            <List className="w-4 h-4 mr-2" /> List View
          </Button>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#0f172a] transition-colors" />
              <Input 
                placeholder={`Search ${labels.booking_label_plural.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl h-12 pl-12 pr-6 bg-white border-slate-100 font-bold w-full md:w-[300px] focus-visible:ring-[#C1FF72] shadow-sm transition-all"
              />
           </div>
           <Button className="bg-[#C1FF72] hover:bg-[#C1FF72]/90 text-[#0f172a] font-black rounded-2xl h-12 px-6 shadow-xl shadow-[#C1FF72]/20 text-xs uppercase tracking-widest transition-all active:scale-95">
              <Plus className="w-5 h-5 mr-2" /> New {labels.booking_label}
           </Button>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-500">
        {view === "calendar" ? (
          <BookingsCalendar bookings={filteredBookings} labels={labels} />
        ) : (
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="premium-card p-20 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                    <CalendarIcon className="w-10 h-10 text-slate-200" />
                 </div>
                 <h4 className="text-xl font-black text-[#0f172a] mb-2">No {labels.booking_label_plural} found</h4>
                 <p className="text-slate-400 font-bold text-sm">Try adjusting your search or add a new appointment.</p>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <BookingCard key={b.id} booking={b} labels={labels} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
