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
  Stethoscope,
  Scissors,
  Dumbbell,
  type LucideIcon,
  Sparkles
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: {
    type: "chips" | "staff_cards" | "service_cards" | "time_slots" | "date_chips";
    items: Array<{
      id?: string;
      label: string;
      subtitle?: string;
      value: string;
    }>;
  };
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
  booked?: boolean;
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

  async function handleSend(forcedInput?: string) {
    const textToSend = forcedInput || input.trim();
    if (!textToSend || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!forcedInput) setInput("");
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
          { role: "assistant", content: data.reply, options: data.options },
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
    <div className="flex items-center justify-center gap-1.5 py-2 bg-white border-b">
      {bookingSteps.map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all ${
            i <= currentStep ? "w-4 dynamic-bg" : "w-1.5 bg-slate-200"
          }`}
        />
      ))}
    </div>
  ) : null;

  const NicheIcon = NICHE_ICONS[industry?.toLowerCase()] || MessageSquare;

  const renderHome = () => (
    <div className="flex flex-col h-full items-center justify-center p-6 space-y-6 animate-in fade-in duration-500 bg-slate-50/50">
      <Avatar className="w-16 h-16 shadow-lg border-2 border-white">
        <AvatarFallback className="dynamic-bg">
          <NicheIcon className="w-8 h-8 text-slate-900" />
        </AvatarFallback>
      </Avatar>
      
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-slate-900">{orgName}</h2>
        <p className="text-sm text-slate-500 px-2 leading-relaxed">{welcomeMessage || `Welcome! How can we help you today?`}</p>
      </div>

      <div className="w-full space-y-2 mt-4">
        <Button 
          onClick={() => setView("booking-service")}
          className="w-full h-12 rounded-xl font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] dynamic-bg text-slate-900 flex items-center justify-center gap-2"
        >
          <LucideCalendar className="w-4 h-4" />
          Book {labels.booking}
        </Button>
        <Button 
          variant="outline"
          onClick={() => setView("chat")}
          className="w-full h-12 rounded-xl font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          Chat with AI Assistant
        </Button>
      </div>
    </div>
  );

  const renderOptions = (options: Message["options"]) => {
    if (!options || !options.items.length) return null;

    switch (options.type) {
      case "chips":
      case "date_chips":
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            {options.items.map((item, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="rounded-full border-primary/20 hover:bg-primary/5 dynamic-ring"
                onClick={() => handleSend(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        );

      case "time_slots":
        return (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {options.items.map((item, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="flex flex-col gap-0.5 h-auto py-2 dynamic-ring"
                onClick={() => handleSend(item.value)}
              >
                <span className="font-bold">{item.label}</span>
                {item.subtitle && <span className="text-[10px] opacity-60">{item.subtitle}</span>}
              </Button>
            ))}
          </div>
        );

      case "service_cards":
        return (
          <div className="grid grid-cols-1 gap-2 mt-3 w-full">
            {options.items.map((item, i) => (
              <div 
                key={i}
                className="cursor-pointer hover:border-primary/50 border border-slate-200 bg-white rounded-xl p-3 flex items-center justify-between transition-colors dynamic-ring"
                onClick={() => handleSend(item.value)}
              >
                <div>
                  <h5 className="font-bold text-sm text-slate-900">{item.label}</h5>
                  {item.subtitle && <p className="text-xs text-slate-500">{item.subtitle}</p>}
                </div>
                <ChevronRight className="w-4 h-4 opacity-30 text-slate-900" />
              </div>
            ))}
          </div>
        );

      case "staff_cards":
        return (
          <div className="flex gap-2 overflow-x-auto pb-2 mt-3 -mx-1 px-1 scrollbar-hide">
            {options.items.map((item, i) => (
              <div 
                key={i}
                className="min-w-[120px] cursor-pointer hover:border-primary/50 border border-slate-200 bg-white rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-colors dynamic-ring"
                onClick={() => handleSend(item.value)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10">
                    <User className="w-5 h-5 opacity-40 text-slate-900" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 truncate w-20">{item.label}</h5>
                  {item.subtitle && <p className="text-[10px] text-slate-500 truncate w-20">{item.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderChat = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 p-3 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("home")} className="h-8 w-8 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="dynamic-bg"><Sparkles className="w-4 h-4 text-slate-900" /></AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-sm text-slate-900">AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-slate-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <Avatar className="w-6 h-6 mr-2 mt-1 shrink-0">
                <AvatarFallback className="dynamic-bg text-[10px]"><Sparkles className="w-3 h-3 text-slate-900" /></AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-[85%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div 
                className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                  msg.role === "user" 
                    ? "text-slate-900 dynamic-bg rounded-br-sm" 
                    : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              {msg.options && renderOptions(msg.options)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-end">
            <Avatar className="w-6 h-6 mr-2 shrink-0">
              <AvatarFallback className="dynamic-bg text-[10px]"><Sparkles className="w-3 h-3 text-slate-900" /></AvatarFallback>
            </Avatar>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t">
        <div className="relative flex items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-10 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus-visible:ring-1 dynamic-ring"
          />
          <Button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            size="icon"
            className="absolute right-1 w-8 h-8 rounded-full transition-all dynamic-bg text-slate-900 hover:opacity-90"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBookingService = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-3 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("home")} className="h-8 w-8 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <h3 className="font-bold text-sm text-slate-900">Select {labels.service}</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white border border-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-6">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchServices()} className="rounded-full">
              Try Again
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <NicheIcon className="w-6 h-6 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 text-sm">No {labels.service.toLowerCase()}s found</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setView("home")} className="rounded-full">
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
              className="w-full group flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase">{s.duration_minutes} MIN • ${s.price}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderBookingStaff = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-3 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("booking-service")} className="h-8 w-8 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <h3 className="font-bold text-sm text-slate-900">Select {labels.staff}</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-white border border-slate-100 rounded-xl animate-pulse" />
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
              className="w-full group flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-slate-100 group-hover:scale-105 transition-transform">
                  <AvatarFallback className="bg-slate-50 text-slate-600 font-medium text-xs">
                    {s.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-slate-900 text-sm">{s.full_name}</p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase">{labels.staff}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          ))
        )}
      </div>
    </div>
  );

  const renderBookingDate = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-3 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => staffList.length > 1 ? setView("booking-staff") : setView("booking-service")} className="h-8 w-8 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <h3 className="font-bold text-sm text-slate-900">Choose Date</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(d) => {
              if (d) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                setDate(dateStr);
                fetchSlots(selectedService!.id, dateStr);
                setView("booking-slot");
              }
            }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-xl w-full flex justify-center"
          />
        </div>
        
        <p className="text-center text-[10px] font-medium text-slate-400 uppercase mt-4">
          Pick a date to see available {labels.staff.toLowerCase()} slots
        </p>
      </div>
    </div>
  );

  const renderBookingSlot = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-3 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("booking-date")} className="h-8 w-8 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <h3 className="font-bold text-sm text-slate-900">Available Slots</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-12 bg-white border border-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <LucideCalendar className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">No slots available</p>
              <p className="text-xs text-slate-500">Try another date</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot, i) => (
              <button
                key={i}
                disabled={slot.booked}
                onClick={() => {
                  if (!slot.booked) {
                    setSelectedSlot(slot);
                    setView("booking-details");
                  }
                }}
                className={`p-3 border rounded-xl text-center transition-all group ${
                  slot.booked
                    ? "bg-red-50 border-red-200 cursor-not-allowed opacity-75"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <p className={`font-semibold text-sm ${
                  slot.booked
                    ? "text-red-400 line-through"
                    : "text-slate-900 group-hover:scale-105 transition-transform"
                }`}>
                  {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className={`text-[9px] font-medium mt-0.5 truncate ${
                  slot.booked ? "text-red-400" : "text-slate-400"
                }`}>
                  {slot.booked ? "Booked" : slot.staff_name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBookingDetails = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 p-3 bg-white border-b">
        <Button variant="ghost" size="icon" onClick={() => setView("booking-slot")} className="h-8 w-8 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <h3 className="font-bold text-sm text-slate-900">Your Details</h3>
      </div>
      {renderProgress()}

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 dynamic-text" />
            <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide">Review {labels.booking}</p>
          </div>
          <p className="font-bold text-sm mb-0.5">{selectedService?.name}</p>
          <p className="text-xs text-slate-300">
            {new Date(selectedSlot!.start_time).toLocaleDateString()} at {new Date(selectedSlot!.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-slate-500 ml-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 pl-9 rounded-lg bg-white border-slate-200 text-sm outline-none focus-visible:ring-1 dynamic-ring"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-slate-500 ml-1">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 pl-9 rounded-lg bg-white border-slate-200 text-sm outline-none focus-visible:ring-1 dynamic-ring"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-slate-500 ml-1">Phone (Optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 pl-9 rounded-lg bg-white border-slate-200 text-sm outline-none focus-visible:ring-1 dynamic-ring"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-xs font-semibold text-red-500 px-1">{error}</p>}

        <Button 
          onClick={handleBook}
          disabled={loading || !name || !email}
          className="w-full h-12 rounded-xl font-bold shadow-sm transition-all active:scale-95 dynamic-bg text-slate-900"
        >
          {loading ? "Processing..." : `Confirm ${labels.booking}`}
        </Button>
      </div>
    </div>
  );

  const renderBookingDone = () => (
    <div className="flex flex-col h-full items-center justify-center p-6 text-center space-y-5 animate-in zoom-in-95 duration-500 bg-white">
      <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md dynamic-bg">
        <CheckCircle2 className="w-8 h-8 text-slate-900" />
      </div>
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">{labels.booking} Confirmed!</h2>
        <p className="text-sm text-slate-500">Your appointment has been successfully scheduled.</p>
      </div>

      <div className="w-full bg-slate-50 rounded-xl p-4 space-y-3 text-left border border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-medium text-slate-500 uppercase">{labels.service}</span>
          <span className="text-xs font-bold text-slate-900 truncate ml-2">{selectedService?.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-medium text-slate-500 uppercase">Date & Time</span>
          <span className="text-xs font-bold text-slate-900 text-right ml-2">
            {new Date(selectedSlot!.start_time).toLocaleDateString()} @ {new Date(selectedSlot!.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <Button 
        variant="outline"
        onClick={() => setView("home")}
        className="w-full h-10 rounded-lg font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
      >
        Done
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full relative font-sans">
      <style>{`
        :root {
          --dynamic-color: ${widgetColor};
        }
      `}</style>
      <div className="h-1 w-full shrink-0 dynamic-bg" />
      
      <div className="flex-1 relative overflow-hidden bg-slate-50/50">
        {view === "home" && renderHome()}
        {view === "chat" && renderChat()}
        {view === "booking-service" && renderBookingService()}
        {view === "booking-staff" && renderBookingStaff()}
        {view === "booking-date" && renderBookingDate()}
        {view === "booking-slot" && renderBookingSlot()}
        {view === "booking-details" && renderBookingDetails()}
        {view === "booking-done" && renderBookingDone()}
      </div>

      <div className="py-2 text-center border-t bg-white">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Powered by Antigravity AI</span>
      </div>
    </div>
  );
}

