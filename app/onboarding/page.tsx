import { OnboardingForm } from "./onboarding-form";
import { Bot } from "lucide-react";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-6 shadow-xl shadow-teal-500/20">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Let&apos;s set up your business
          </h1>
          <p className="text-slate-500 text-lg">
            A few details to personalize your AI booking experience.
          </p>
        </div>

        <OnboardingForm />
      </div>
    </main>
  );
}
