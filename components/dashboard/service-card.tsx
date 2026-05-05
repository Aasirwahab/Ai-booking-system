"use client";

import { Clock, DollarSign, Layers, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description?: string;
    duration_minutes: number;
    price?: number;
    category?: string;
    buffer_minutes: number;
  };
  labels: {
    service_label: string;
  };
  onDelete: (id: string) => Promise<void>;
  onEdit: (service: any) => void;
}

export function ServiceCard({ service, labels, onDelete, onEdit }: ServiceCardProps) {
  return (
    <div className="premium-card p-6 flex flex-col h-full group hover:border-[#C1FF72]/50">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-[#C1FF72]/10 transition-colors">
          <Layers className="w-5 h-5 text-[#0f172a]" />
        </div>
        <div className="flex items-center gap-2">
          {service.category && (
            <Badge variant="secondary" className="bg-slate-100 text-[10px] font-black uppercase tracking-widest px-2">
              {service.category}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
              <DropdownMenuItem onClick={() => onEdit(service)} className="text-xs font-bold gap-2">
                <Edit2 className="w-3.5 h-3.5" /> Edit {labels.service_label}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(service.id)}
                className="text-xs font-bold gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 mb-6">
        <h3 className="text-lg font-black text-[#0f172a] leading-tight mb-2">{service.name}</h3>
        <p className="text-xs font-bold text-slate-400 line-clamp-2">
          {service.description ?? `Standard ${labels.service_label.toLowerCase()} session.`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#0f172a]" />
            <span className="text-xs font-black text-[#0f172a]">{service.duration_minutes}m</span>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Price</p>
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs font-black text-[#0f172a]">
              {service.price != null ? `$${service.price}` : "Free"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
