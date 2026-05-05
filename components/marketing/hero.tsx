import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Sparkles, ShieldCheck } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 gradient-mesh opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="outline" className="mb-6 py-1.5 px-4 bg-white/50 backdrop-blur-sm border-teal-200 text-teal-700 hover:bg-white/80 transition-all">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-teal-500" />
          AI-Powered Appointment Scheduling
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          The AI Agent that <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600">
            Fills Your Calendar
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop losing bookings to busy lines. Our multi-tenant AI agents handle conversations, 
          manage availability, and book clients 24/7 across any niche.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal"><span className="contents"><Button size="lg" className="h-14 px-8 text-lg font-semibold gradient-brand hover:opacity-90 shadow-lg shadow-teal-500/20 w-full sm:w-auto group">Start Free Trial<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button></span></SignUpButton>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-white/50 backdrop-blur-sm w-full sm:w-auto">
            Watch Demo
          </Button>
        </div>

        {/* Social Proof / Features Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center text-slate-500 text-sm font-medium">
            <Calendar className="w-5 h-5 text-teal-600" />
            Instant Availability Sync
          </div>
          <div className="flex items-center gap-3 justify-center text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Enterprise Multi-tenancy
          </div>
          <div className="flex items-center gap-3 justify-center text-slate-500 text-sm font-medium">
            <Sparkles className="w-5 h-5 text-teal-600" />
            OpenAI GPT-4o Powered
          </div>
        </div>
      </div>
    </section>
  );
}
