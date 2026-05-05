"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import { Clock, User, Stethoscope } from "lucide-react";

interface BookingsCalendarProps {
  bookings: any[];
  labels: any;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#fbbf24", // amber-400
  confirmed: "#10b981", // emerald-500
  cancelled: "#f43f5e", // rose-500
  completed: "#3b82f6", // blue-500
};

export function BookingsCalendar({ bookings, labels }: BookingsCalendarProps) {
  const events = bookings.map((b) => ({
    id: b.id,
    title: `${b.contact?.full_name || "Patient"} - ${b.service?.name}`,
    start: b.start_time,
    end: b.end_time,
    backgroundColor: STATUS_COLORS[b.status] || STATUS_COLORS.pending,
    borderColor: "transparent",
    extendedProps: {
      patient: b.contact?.full_name,
      service: b.service?.name,
      status: b.status,
      staff: b.staff?.full_name,
    },
  }));

  return (
    <div className="premium-card p-8 min-h-[700px] calendar-container">
      <style jsx global>{`
        .fc {
          --fc-button-bg-color: #0f172a;
          --fc-button-border-color: #0f172a;
          --fc-button-hover-bg-color: #1e293b;
          --fc-button-active-bg-color: #334155;
          --fc-border-color: #f1f5f9;
          --fc-today-bg-color: rgba(193, 255, 114, 0.05);
          font-family: inherit;
        }
        .fc .fc-toolbar-title {
          font-weight: 900;
          font-size: 1.5rem;
          color: #0f172a;
        }
        .fc .fc-button {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.1em;
          border-radius: 12px;
          padding: 8px 16px;
        }
        .fc .fc-col-header-cell-cushion {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 10px;
          color: #94a3b8;
          padding: 12px 0;
        }
        .fc-v-event {
          border-radius: 12px;
          padding: 4px 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: none !important;
        }
        .fc-event-main {
          padding: 2px;
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="auto"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        expandRows={true}
        handleWindowResize={true}
        eventContent={(eventInfo) => {
          return (
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="font-black text-[10px] truncate">{eventInfo.event.extendedProps.patient}</span>
              </div>
              <div className="flex items-center gap-1 opacity-80">
                <Stethoscope className="w-2.5 h-2.5" />
                <span className="text-[9px] font-bold truncate">{eventInfo.event.extendedProps.service}</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
