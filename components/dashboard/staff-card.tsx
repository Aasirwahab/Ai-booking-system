"use client";

import { Mail, Briefcase, MoreVertical, Trash2, Edit2, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteStaff } from "@/actions/staff";

interface StaffCardProps {
  member: {
    id: string;
    full_name: string;
    email?: string;
    role_title?: string;
    avatar_url?: string;
  };
  labels: {
    staff_label: string;
  };
}

export function StaffCard({ member, labels }: StaffCardProps) {
  const initials = member.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="premium-card p-6 flex flex-col group hover:border-[#C1FF72]/50">
      <div className="flex items-start justify-between mb-6">
        <Avatar className="h-16 w-16 rounded-[1.5rem] border-4 border-slate-50 group-hover:border-[#C1FF72]/10 transition-all">
          <AvatarImage src={member.avatar_url} />
          <AvatarFallback className="bg-slate-100 text-[#0f172a] font-black text-xl rounded-[1.5rem]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
            <DropdownMenuItem onClick={() => {}} className="text-xs font-bold gap-2">
              <Edit2 className="w-3.5 h-3.5" /> Edit {labels.staff_label}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteStaff(member.id)}
              className="text-xs font-bold gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 mb-6">
        <h3 className="text-lg font-black text-[#0f172a] leading-tight mb-1">{member.full_name}</h3>
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-400">{member.role_title ?? labels.staff_label}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C1FF72] shadow-[0_0_8px_rgba(193,255,114,0.6)]" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Now</span>
          </div>
          {member.email && (
            <div className="flex items-center gap-1.5 text-slate-400 hover:text-[#0f172a] transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Contact</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
