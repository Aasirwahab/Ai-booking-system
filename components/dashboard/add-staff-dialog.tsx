"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Mail, User, Briefcase } from "lucide-react";

interface AddStaffDialogProps {
  labels: {
    staff_label: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AddStaffDialog({ labels, onSubmit }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await onSubmit(formData);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#C1FF72] hover:bg-[#C1FF72]/90 text-[#0f172a] font-black rounded-2xl gap-2 px-6 h-12 shadow-lg shadow-[#C1FF72]/20">
          <Plus className="w-5 h-5" />
          Add {labels.staff_label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black text-[#0f172a] tracking-tight">
            New {labels.staff_label}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-bold">
            Add a new {labels.staff_label.toLowerCase()} member to your organization.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="full_name" 
                name="full_name" 
                placeholder="e.g. John Smith" 
                required 
                className="rounded-2xl h-12 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="john@example.com" 
                className="rounded-2xl h-12 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role_title" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{labels.staff_label} Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="role_title" 
                name="role_title" 
                placeholder={`e.g. Senior ${labels.staff_label}`} 
                className="rounded-2xl h-12 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="rounded-2xl font-bold text-slate-400"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#C1FF72] hover:bg-[#C1FF72]/90 text-[#0f172a] font-black rounded-2xl px-8 h-12"
            >
              {loading ? "Adding..." : `Add ${labels.staff_label}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
