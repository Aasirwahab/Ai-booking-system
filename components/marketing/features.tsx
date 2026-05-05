import { Card, CardContent } from "@/components/ui/button"; // Using Card from UI if available, otherwise just divs
import { 
  Bot, 
  LayoutDashboard, 
  Zap, 
  Smartphone, 
  Globe, 
  Lock 
} from "lucide-react";

const features = [
  {
    title: "Autonomous AI Agents",
    description: "Built on OpenAI GPT-4o, our agents understand context and handle complex booking flows naturally.",
    icon: Bot,
    color: "bg-teal-500",
  },
  {
    title: "Unified Dashboard",
    description: "Manage bookings, contacts, and staff performance for all your organizations in one place.",
    icon: LayoutDashboard,
    color: "bg-cyan-500",
  },
  {
    title: "Instant Integration",
    description: "Embed our booking widget on any website with a single line of code. Works with WordPress, Wix, and custom sites.",
    icon: Globe,
    color: "bg-emerald-500",
  },
  {
    title: "Niche Adaptation",
    description: "Switch between Clinic, Real Estate, or Agency modes. The system adapts its vocabulary and logic automatically.",
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    title: "Mobile Ready",
    description: "Our agents and dashboard are fully responsive, giving you control on the go.",
    icon: Smartphone,
    color: "bg-indigo-500",
  },
  {
    title: "Multi-tenant Security",
    description: "Enterprise-grade isolation ensures each organization's data remains private and secure.",
    icon: Lock,
    color: "bg-violet-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-teal-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything you need to automate bookings
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Our platform combines advanced AI with a powerful multi-tenant architecture 
            to streamline your service business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl border border-slate-100 hover-lift bg-slate-50/50"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-teal-500/10`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
