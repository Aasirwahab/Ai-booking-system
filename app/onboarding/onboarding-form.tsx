"use client";

import { useState } from "react";
import { completeOnboarding } from "@/actions/onboarding";
import { NICHE_PRESETS } from "@/lib/niches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Loader2, Globe, Building2 } from "lucide-react";

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
          {niches.map((niche) => (
            <div key={niche.niche_type}>
              <RadioGroupItem
                value={niche.niche_type}
                id={niche.niche_type}
                className="sr-only"
              />
              <Label
                htmlFor={niche.niche_type}
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 ${
                  selectedNiche === niche.niche_type
                    ? "border-teal-500 bg-teal-50/50 ring-1 ring-teal-500/20"
                    : "border-slate-100 bg-white"
                }`}
              >
                <span className="font-bold text-slate-900">{niche.display_name}</span>
                <span className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {niche.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <input type="hidden" name="niche_type" value={selectedNiche} />
      </div>

      {/* Business Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
            Business Name
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Smile Dental"
              className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">
            Booking Page URL
          </Label>
          <div className="flex items-center group">
            <div className="h-11 px-3 flex items-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-md text-slate-500 text-sm font-medium">
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
              className="rounded-l-none h-11 bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 ml-1">
            <Globe className="w-3 h-3" />
            Your customers will visit this link to book.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !name || !slug}
        className="w-full h-12 text-base font-bold gradient-brand hover:opacity-90 shadow-lg shadow-teal-500/20 group"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Setting up your business...
          </>
        ) : (
          <>
            Create my business
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
