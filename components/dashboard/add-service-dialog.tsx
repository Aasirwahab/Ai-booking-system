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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Clock, DollarSign, Layers } from "lucide-react";

interface AddServiceDialogProps {
  labels: {
    service_label: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export function AddServiceDialog({ labels, onSubmit }: AddServiceDialogProps) {
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
          Add {labels.service_label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black text-[#0f172a] tracking-tight">
            New {labels.service_label}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-bold">
            Define the details for your new {labels.service_label.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g. Consultation" 
              required 
              className="rounded-2xl h-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Duration (Min)</Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="duration" 
                  name="duration_minutes" 
                  type="number" 
                  defaultValue={30} 
                  required 
                  className="rounded-2xl h-12 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="rounded-2xl h-12 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Category</Label>
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                id="category" 
                name="category" 
                placeholder="e.g. Consultation, Treatment, Surgery" 
                className="rounded-2xl h-12 pl-12 border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Provide a brief overview..." 
              className="rounded-2xl min-h-[100px] border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold py-4"
            />
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
              {loading ? "Creating..." : `Create ${labels.service_label}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
