"use client";

import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  User, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Check,
  X,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateBookingStatus } from "@/actions/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: any;
  labels: any;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-rose-50 text-rose-600 border-rose-100", icon: XCircle },
  completed: { label: "Completed", color: "bg-blue-50 text-blue-600 border-blue-100", icon: CheckCircle2 },
};

export function BookingCard({ booking, labels }: BookingCardProps) {
  const router = useRouter();
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  async function handleStatusChange(newStatus: string) {
    try {
      await updateBookingStatus(booking.id, newStatus);
      toast.success(`Booking ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl ${status.color} flex items-center justify-center border transition-transform group-hover:scale-105`}>
           <StatusIcon className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black text-[#0f172a]">{booking.contact?.full_name ?? "Unknown Patient"}</h4>
            <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-none ${status.color}`}>
              {status.label}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
               <Stethoscope className="w-3.5 h-3.5" />
               <span className="text-[11px] font-bold">{booking.service?.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
               <Calendar className="w-3.5 h-3.5" />
               <span className="text-[11px] font-bold">{format(new Date(booking.start_time), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
               <Clock className="w-3.5 h-3.5" />
               <span className="text-[11px] font-bold">{format(new Date(booking.start_time), "h:mm a")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center">
        {booking.status === "pending" && (
          <>
            <Button 
              size="sm" 
              onClick={() => handleStatusChange("confirmed")}
              className="bg-[#C1FF72] hover:bg-[#C1FF72]/90 text-[#0f172a] font-black rounded-xl h-10 px-4"
            >
              <Check className="w-4 h-4 mr-1.5" /> Confirm
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStatusChange("cancelled")}
              className="rounded-xl h-10 border-slate-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 font-bold"
            >
              <X className="w-4 h-4 mr-1.5" /> Cancel
            </Button>
          </>
        )}
        
        {booking.status === "confirmed" && (
          <Button 
            size="sm" 
            onClick={() => handleStatusChange("completed")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl h-10 px-4"
          >
            Mark Complete
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-300 hover:text-[#0f172a]">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100">
            <DropdownMenuItem className="rounded-xl font-bold text-xs p-3">View Details</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl font-bold text-xs p-3">Edit Appointment</DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl font-bold text-xs p-3 text-rose-500 focus:text-rose-600 focus:bg-rose-50">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
