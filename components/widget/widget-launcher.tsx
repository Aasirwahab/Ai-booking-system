"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedBookingWidget } from "./booking-widget";

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

export function WidgetLauncher(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">
      {/* Widget Container */}
      <div 
        className={`absolute bottom-[calc(100%+1rem)] right-0 transition-all duration-300 ease-in-out transform origin-bottom-right ${
          isOpen 
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" 
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-[calc(100vw-3rem)] sm:w-[400px] h-[calc(100dvh-120px)] sm:max-h-[700px] shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-900/5 bg-white flex flex-col">
          <UnifiedBookingWidget {...props} />
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-0"
        style={{ backgroundColor: props.widgetColor || "#0f172a", color: "#fff" }}
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in spin-in-90 duration-300" />
        ) : (
          <MessageSquare className="w-6 h-6 animate-in zoom-in duration-300" />
        )}
      </Button>
    </div>
  );
}
