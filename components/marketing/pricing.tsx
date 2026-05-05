import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

const plans = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for solo service providers.",
    features: [
      "1 AI Agent",
      "Up to 100 bookings/mo",
      "Email Notifications",
      "Public Booking Link",
      "Standard Analytics",
    ],
    cta: "Start with Starter",
    popular: false,
  },
  {
    name: "Professional",
    price: "99",
    description: "Best for growing teams and clinics.",
    features: [
      "3 AI Agents",
      "Unlimited bookings",
      "SMS & Email Reminders",
      "Custom Embeddable Widget",
      "Advanced AI Insights",
      "Priority Support",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "299",
    description: "For large agencies and franchises.",
    features: [
      "Unlimited AI Agents",
      "White-label options",
      "API Access",
      "Dedicated Account Manager",
      "Custom AI Training",
      "SSO Integration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-teal-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Scale your automation
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Transparent pricing for every stage of your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-2xl border ${
                plan.popular 
                ? "border-teal-500 shadow-xl shadow-teal-500/10 bg-white ring-2 ring-teal-500/20 scale-105 z-10" 
                : "border-slate-200 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 mt-2">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                  <span className="ml-2 text-slate-500">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <SignUpButton mode="modal"><span className="contents"><Button
                  className={`w-full h-12 text-base font-semibold transition-all ${
                    plan.popular
                    ? "gradient-brand hover:opacity-90"
                    : "border-slate-200 hover:bg-slate-50"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >{plan.cta}</Button></span></SignUpButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
