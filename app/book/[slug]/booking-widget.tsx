"use client";

import { useState } from "react";
import { 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Mail, 
  Phone,
  ArrowLeft,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
}

interface Slot {
  start_time: string;
  end_time: string;
  staff_id: string;
  staff_name: string;
}

interface Props {
  orgSlug: string;
  services: Service[];
  labels: { service: string; staff: string; booking: string };
}

type Step = "service" | "date" | "slot" | "details" | "done";

export function BookingWidget({ orgSlug, services, labels }: Props) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSlots(serviceId: string, dateStr: string) {
    setLoading(true);
    const res = await fetch(
      `/api/public/availability?org=${orgSlug}&serviceId=${serviceId}&date=${dateStr}`
    );
    const data = await res.json();
    setSlots(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleBook() {
    if (!selectedService || !selectedSlot) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/public/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationSlug: orgSlug,
        serviceId: selectedService.id,
        staffId: selectedSlot.staff_id,
        startTime: selectedSlot.start_time,
        endTime: selectedSlot.end_time,
        customer: { fullName: name, email, phone: phone || undefined },
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Failed to book");
      setLoading(false);
      return;
    }

    setStep("done");
    setLoading(false);
  }

  if (step === "done") {
    return (
      <div className="text-center py-12 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-[2.5rem] bg-[#C1FF72] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(193,255,114,0.4)]">
          <CheckCircle2 className="w-12 h-12 text-[#0f172a]" />
        </div>
        <h3 className="text-3xl font-black text-[#0f172a] mb-2">{labels.booking} Confirmed!</h3>
        <p className="text-slate-400 font-bold mb-8">
          We've scheduled your {selectedService?.name} for {new Date(selectedSlot!.start_time).toLocaleDateString()} at {new Date(selectedSlot!.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
        </p>
        <div className="bg-slate-50 rounded-[2rem] p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Client</span>
                <span className="text-xs font-black text-[#0f172a]">{name}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{labels.staff}</span>
                <span className="text-xs font-black text-[#0f172a]">{selectedSlot!.staff_name}</span>
            </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="rounded-2xl font-black border-slate-200"
        >
          Book Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {["service", "date", "slot", "details"].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
             <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${
               step === s ? "bg-[#C1FF72] text-[#0f172a]" : 
               (i < ["service", "date", "slot", "details"].indexOf(step) ? "bg-slate-100 text-slate-400" : "bg-slate-50 text-slate-300")
             }`}>
               {i + 1}
             </div>
             {i < 3 && <div className="w-4 h-0.5 bg-slate-100" />}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === "service" && (
        <div className="space-y-4">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedService(s);
                setStep("date");
              }}
              className="w-full text-left bg-slate-50 hover:bg-[#C1FF72]/5 border border-slate-100 hover:border-[#C1FF72]/30 rounded-[2rem] p-6 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center group-hover:shadow-lg transition-all">
                    <Clock className="w-6 h-6 text-[#0f172a]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#0f172a] mb-1">{s.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.duration_minutes} MIN</span>
                    {s.price != null && (
                      <span className="text-[10px] font-black text-[#0f172a] uppercase bg-[#C1FF72] px-2 py-0.5 rounded-lg">
                        ${s.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-[#0f172a] transition-all translate-x-0 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Date */}
      {step === "date" && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <Button variant="ghost" onClick={() => setStep("service")} className="text-slate-400 font-bold gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back to services
          </Button>
          <div className="bg-slate-50 rounded-[2.5rem] p-8">
            <Label htmlFor="booking-date" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1 mb-4 block">Select Date</Label>
            <input
              id="booking-date"
              type="date"
              value={date}
              placeholder="Select a date"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlot(null);
                fetchSlots(selectedService!.id, e.target.value);
                setStep("slot");
              }}
              className="w-full bg-white border border-slate-100 rounded-[1.5rem] h-16 px-6 font-black text-lg focus:ring-2 focus:ring-[#C1FF72] outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Step 3: Slot */}
      {step === "slot" && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
           <Button variant="ghost" onClick={() => setStep("date")} className="text-slate-400 font-bold gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back to date
          </Button>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-300 animate-pulse">
                <Clock className="w-12 h-12 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Finding availability...</p>
             </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem]">
               <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="font-black text-[#0f172a]">No slots found</p>
               <p className="text-xs font-bold text-slate-400 mt-1">Please try another date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep("details");
                  }}
                  className="bg-slate-50 hover:bg-[#C1FF72] border border-slate-100 hover:border-[#C1FF72] rounded-2xl p-4 transition-all group text-center"
                >
                  <p className="text-lg font-black text-[#0f172a]">
                    {new Date(slot.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 group-hover:text-[#0f172a]/70 uppercase mt-1">
                    {slot.staff_name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Details */}
      {step === "details" && selectedSlot && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
          <Button variant="ghost" onClick={() => setStep("slot")} className="text-slate-400 font-bold gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back to times
          </Button>

          <div className="bg-slate-900 text-white rounded-[2rem] p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#C1FF72]" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review Booking</p>
                  <p className="text-sm font-bold">{selectedService?.name} with {selectedSlot.staff_name}</p>
               </div>
            </div>
            <div className="text-xs text-slate-400 font-bold">
               {new Date(selectedSlot.start_time).toLocaleString()}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
               <Label htmlFor="customer-name" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Full Name</Label>
               <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="customer-name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-2xl h-14 pl-12 bg-slate-50 border-slate-100 font-bold focus-visible:ring-[#C1FF72]"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="customer-email" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Email Address</Label>
               <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="customer-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-2xl h-14 pl-12 bg-slate-50 border-slate-100 font-bold focus-visible:ring-[#C1FF72]"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="customer-phone" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Phone Number (Optional)</Label>
               <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="customer-phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-2xl h-14 pl-12 bg-slate-50 border-slate-100 font-bold focus-visible:ring-[#C1FF72]"
                  />
               </div>
            </div>

            {error && <p className="text-xs font-black text-destructive px-2 italic">{error}</p>}

            <Button
              onClick={handleBook}
              disabled={loading || !name || !email}
              className="w-full bg-[#C1FF72] hover:bg-[#C1FF72]/90 text-[#0f172a] font-black rounded-2xl h-16 text-lg shadow-xl shadow-[#C1FF72]/20"
            >
              {loading ? "Processing..." : `Confirm ${labels.booking}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
