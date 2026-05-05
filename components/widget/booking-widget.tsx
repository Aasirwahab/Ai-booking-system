"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Calendar as LucideCalendar,
  MessageSquare,
  ChevronRight,
  Clock,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  Phone,
  X,
  Minimize2,
  Maximize2,
  Stethoscope,
  Scissors,
  Dumbbell,
  type LucideIcon
} from "lucide-react";

const NICHE_ICONS: Record<string, LucideIcon> = {
  clinic: Stethoscope,
  medical: Stethoscope,
  healthcare: Stethoscope,
  salon: Scissors,
  barbershop: Scissors,
  spa: Scissors,
  fitness: Dumbbell,
  gym: Dumbbell,
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
  orgName: string;
  industry: string;
  widgetColor: string;
  welcomeMessage: string;
  labels: {
    service: string;
    staff: string;
    booking: string;
    patient: string;
  };
}

interface Staff {
  id: string;
  full_name: string;
}

type View = "home" | "chat" | "booking-service" | "booking-staff" | "booking-date" | "booking-slot" | "booking-details" | "booking-done";

export function UnifiedBookingWidget({ 
  orgSlug, 
  orgName, 
  industry, 
  widgetColor = "#C1FF72", 
  welcomeMessage,
  labels 
}: Props) {
  const [view, setView] = useState<View>("home");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: welcomeMessage || `Hi! I'm the booking assistant for ${orgName}. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, view]);

  // Fetch services when entering booking flow
  useEffect(() => {
    if (view === "booking-service" && services.length === 0) {
      fetchServices();
    }
  }, [view]);

  async function fetchServices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/public/services?org=${orgSlug}`);
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data || []);
    } catch (err) {
      console.error("Failed to fetch services", err);
      setError("We couldn't load the services. Please try again.");
    }
    setLoading(false);
  }

  async function fetchStaff() {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/staff?org=${orgSlug}`);
      const data = await res.json();
      const list: Staff[] = data || [];
      setStaffList(list);
      if (list.length <= 1) {
        setSelectedStaff(list[0] || null);
        setView("booking-date");
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
      setView("booking-date");
    }
    setLoading(false);
  }

  async function fetchSlots(serviceId: string, dateStr: string) {
    setLoading(true);
    setError("");
    try {
      const staffParam = selectedStaff ? `&staffId=${selectedStaff.id}` : "";
      const res = await fetch(
        `/api/public/availability?org=${orgSlug}&serviceId=${serviceId}&date=${dateStr}${staffParam}`
      );
      if (!res.ok) throw new Error("Failed to load availability");
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setError("Could not load available times.");
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgSlug, messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    }

    setLoading(false);
  }

  async function handleBook() {
    if (!selectedService || !selectedSlot) return;
    setLoading(true);
    setError("");

    try {
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
        setError(body.error || "Failed to book");
      } else {
        setView("booking-done");
      }
    } catch {
      setError("Failed to connect. Please try again.");
    }
    setLoading(false);
  }

  const bookingSteps = ["booking-service", "booking-staff", "booking-date", "booking-slot", "booking-details"] as const;
  const currentStep = bookingSteps.indexOf(view as any);

  const renderProgress = () => currentStep >= 0 ? (
    <div className="flex items-center justify-center gap-1.5 py-2">
      {bookingSteps.map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all ${
            i <= currentStep ? "w-6 dynamic-bg" : "w-1.5 bg-slate-200"
          }`}
        />
      ))}
    </div>
  ) : null;

  const NicheIcon = NICHE_ICONS[industry.toLowerCase()] || MessageSquare;

  const renderHome = () => (
    <div className="flex flex-col h-full items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-lg dynamic-bg">
        <NicheIcon className="w-10 h-10 text-slate-900" />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">{orgName}</h2>
        <p className="text-slate-500 font-medium px-4">{welcomeMessage || `Welcome! How can we help you today?`}</p>
      </div>

      <div className="w-full space-y-3">
        <Button 
          onClick={() => setView("booking-service")}
          className="w-full h-16 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] dynamic-bg text-slate-900"
        >
          <LucideCalendar className="w-5 h-5 mr-2" />
          Book {labels.booking}
        </Button>
        <Button 
          variant="outline"
          onClick={() => setView("chat")}
          className="w-full h-16 rounded-2xl font-black text-lg border-2 border-slate-100 hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquare className="w-5 h-5 mr-2 text-slate-400" />
          Chat with AI
        </Button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("home")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="font-black text-sm text-slate-900">AI Assistant</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium shadow-sm ${
                msg.role === "user" 
                  ? "text-slate-900 dynamic-bg" 
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-400 font-bold animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="relative flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 h-12 pl-4 pr-12 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 transition-all dynamic-ring"
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="icon"
            className="absolute right-1 w-10 h-10 rounded-lg transition-all dynamic-bg text-slate-900"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBookingService = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("home")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-black text-sm text-slate-900">Select {labels.service}</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
            <p className="text-sm font-bold text-red-500">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => fetchServices()}
              className="rounded-xl font-bold"
            >
              Try Again
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center">
              <NicheIcon className="w-10 h-10 text-slate-200" />
            </div>
            <div className="space-y-2">
              <p className="font-black text-slate-900">No {labels.service.toLowerCase()}s found</p>
              <p className="text-xs font-bold text-slate-400">This organization hasn't added any {labels.service.toLowerCase()}s yet.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setView("home")}
              className="rounded-xl font-bold"
            >
              Go Back
            </Button>
          </div>
        ) : (
          services.map(s => (
            <button 
              key={s.id}
              onClick={() => {
                setSelectedService(s);
                setView("booking-staff");
                fetchStaff();
              }}
              className="w-full group flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">{s.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.duration_minutes} MIN • ${s.price}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all" />
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderBookingStaff = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("booking-service")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-black text-sm text-slate-900">Select {labels.staff}</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          staffList.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStaff(s);
                setView("booking-date");
              }}
              className="w-full group flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">{s.full_name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labels.staff}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all" />
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderBookingDate = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => staffList.length > 1 ? setView("booking-staff") : setView("booking-service")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-black text-sm text-slate-900">Choose Date</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-[320px] bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(d) => {
              if (d) {
                const dateStr = d.toISOString().split("T")[0];
                setDate(dateStr);
                fetchSlots(selectedService!.id, dateStr);
                setView("booking-slot");
              }
            }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-2xl"
          />
        </div>
        
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-6">
          Pick a date to see available {labels.staff.toLowerCase()} slots
        </p>
      </div>
    </div>
  );

  const renderBookingSlot = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("booking-date")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-black text-sm text-slate-900">Available Slots</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <LucideCalendar className="w-8 h-8 text-slate-200" />
            </div>
            <div>
              <p className="font-black text-slate-900">No slots available</p>
              <p className="text-xs font-bold text-slate-400">Try another date</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {slots.map((slot, i) => (
              <button 
                key={i}
                onClick={() => {
                  setSelectedSlot(slot);
                  setView("booking-details");
                }}
                className="p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl text-center transition-all hover:shadow-md group"
              >
                <p className="font-black text-slate-900 group-hover:scale-110 transition-transform">
                  {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tight mt-1">{slot.staff_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBookingDetails = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("booking-slot")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-black text-sm text-slate-900">Your Details</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 dynamic-text" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review {labels.booking}</p>
          </div>
          <p className="font-black text-sm mb-1">{selectedService?.name}</p>
          <p className="text-xs font-bold text-slate-400">
            {new Date(selectedSlot!.start_time).toLocaleDateString()} at {new Date(selectedSlot!.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 pl-10 rounded-xl bg-slate-50 border-none font-bold outline-none focus-visible:ring-2 dynamic-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-10 rounded-xl bg-slate-50 border-none font-bold outline-none focus-visible:ring-2 dynamic-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Phone (Optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 pl-10 rounded-xl bg-slate-50 border-none font-bold outline-none focus-visible:ring-2 dynamic-ring"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-xs font-bold text-red-500 px-1">{error}</p>}

        <Button 
          onClick={handleBook}
          disabled={loading || !name || !email}
          className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 dynamic-bg text-slate-900"
        >
          {loading ? "Processing..." : `Confirm ${labels.booking}`}
        </Button>
      </div>
    </div>
  );

  const renderBookingDone = () => (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl dynamic-bg">
        <CheckCircle2 className="w-12 h-12 text-slate-900" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900">{labels.booking} Confirmed!</h2>
        <p className="text-slate-500 font-bold">Your appointment has been successfully scheduled.</p>
      </div>

      <div className="w-full bg-slate-50 rounded-3xl p-6 space-y-4 text-left border border-slate-100">
        <div className="flex justify-between">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{labels.service}</span>
          <span className="text-xs font-black text-slate-900">{selectedService?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Date & Time</span>
          <span className="text-xs font-black text-slate-900">
            {new Date(selectedSlot!.start_time).toLocaleDateString()} @ {new Date(selectedSlot!.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <Button 
        variant="outline"
        onClick={() => setView("home")}
        className="h-14 px-8 rounded-2xl font-black text-slate-400 hover:text-slate-900 border-2 border-slate-100 transition-all"
      >
        Done
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 relative">
      <style>{`
        :root {
          --dynamic-color: ${widgetColor};
        }
      `}</style>
      {/* Header bar for all views (optional decoration) */}
      <div className="h-1.5 w-full shrink-0 dynamic-bg" />
      
      <div className="flex-1 relative overflow-hidden">
        {view === "home" && renderHome()}
        {view === "chat" && renderChat()}
        {view === "booking-service" && renderBookingService()}
        {view === "booking-staff" && renderBookingStaff()}
        {view === "booking-date" && renderBookingDate()}
        {view === "booking-slot" && renderBookingSlot()}
        {view === "booking-details" && renderBookingDetails()}
        {view === "booking-done" && renderBookingDone()}
      </div>

      {/* Powered by tag */}
      <div className="py-2 text-center border-t bg-slate-50/50">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Powered by Antigravity AI</span>
      </div>
    </div>
  );
}
