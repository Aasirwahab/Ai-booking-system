"use client";

import { useState } from "react";
import { completeOnboarding } from "@/actions/onboarding";
import { NICHE_PRESETS } from "@/lib/niches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowRight, 
  Loader2, 
  Globe, 
  Building2, 
  Stethoscope, 
  Sparkles, 
  Dumbbell, 
  GraduationCap, 
  Home, 
  Scale, 
  Briefcase, 
  Plus,
  Check 
} from "lucide-react";

const NICHE_ICONS: Record<string, any> = {
  clinic: Stethoscope,
  salon: Sparkles,
  fitness: Dumbbell,
  tutoring: GraduationCap,
  real_estate: Home,
  legal: Scale,
  agency: Briefcase,
  custom: Plus,
};


const niches = Object.values(NICHE_PRESETS);

export function OnboardingForm() {
  const [selectedNiche, setSelectedNiche] = useState("custom");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    // Auto-generate slug from name
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60)
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await completeOnboarding(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-10">
      {/* Niche picker */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">
          What type of business are you?
        </Label>
        <RadioGroup
          defaultValue="custom"
          value={selectedNiche}
          onValueChange={setSelectedNiche}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {niches.map((niche) => {
            const Icon = NICHE_ICONS[niche.niche_type] || Plus;
            const isSelected = selectedNiche === niche.niche_type;
            
            return (
              <div key={niche.niche_type} className="relative group">
                <RadioGroupItem
                  value={niche.niche_type}
                  id={niche.niche_type}
                  className="peer absolute opacity-0 w-0 h-0"
                />
                <Label
                  htmlFor={niche.niche_type}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/30 shadow-md ring-1 ring-teal-500/20"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50 hover:shadow-sm"
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="block font-bold text-slate-900 text-base mb-0.5">{niche.display_name}</span>
                    <span className="block text-xs text-slate-500 leading-relaxed">
                      {niche.description}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center animate-in zoom-in slide-in-from-top-2 duration-300 shadow-lg shadow-teal-500/30">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
                    </div>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        <input type="hidden" name="niche_type" value={selectedNiche} />
      </div>

      {/* Business Details */}
      <div className="space-y-6 pt-2">
        <div className="space-y-2.5">
          <Label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">
            Business Name
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Building2 className="w-4.5 h-4.5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Smile Dental"
              className="pl-11 h-12 bg-white border-slate-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-base"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="slug" className="text-sm font-bold text-slate-700 ml-1">
            Booking Page URL
          </Label>
          <div className="flex items-center group">
            <div className="h-12 px-4 flex items-center bg-slate-50 border border-r-0 border-slate-200 rounded-l-2xl text-slate-500 text-sm font-bold transition-colors group-focus-within:border-teal-500 group-focus-within:bg-teal-50/50 group-focus-within:text-teal-600">
              /book/
            </div>
            <Input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="smile-dental"
              className="rounded-l-none h-12 bg-white border-slate-200 rounded-r-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-base"
            />
          </div>
          <p className="text-[12px] text-slate-400 flex items-center gap-2 ml-2">
            <Globe className="w-3.5 h-3.5" />
            Your customers will visit this link to book.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !name || !slug}
        className="w-full h-14 text-lg font-bold gradient-brand hover:opacity-90 shadow-xl shadow-teal-500/25 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Setting up your business...
          </>
        ) : (
          <>
            Create my business
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
          </>
        )}
      </Button>

    </form>
  );
}
