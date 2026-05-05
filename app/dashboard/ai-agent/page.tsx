import { getCurrentUser } from "@/lib/auth";
import { getAgentConfig } from "@/actions/agent";
import { getFaqs } from "@/actions/faqs";
import { AgentConfigForm } from "@/components/dashboard/agent-config-form";

export default async function AiAgentPage() {
  const ctx = await getCurrentUser({ requireOrg: true });
  const [config, faqs] = await Promise.all([
    getAgentConfig(),
    getFaqs()
  ]);

  const defaultConfig = {
    agent_instructions: "You are a helpful booking assistant. Help customers find services and book appointments.",
    agent_enabled: true,
    name: ctx.org!.name,
    industry: ctx.org!.industry,
    widget_color: "#C1FF72",
    welcome_message: "Welcome to our AI booking assistant. How can I help you today?",
    booking_instructions: "Guide customers through the booking process smoothly. Always suggest the nearest available slot.",
    ai_tone: "Professional & Friendly",
    slot_duration: 45
  };

  const finalConfig = config ?? defaultConfig;
  const slug = ctx.org!.slug;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">AI Command Center</h1>
        <p className="text-slate-400 font-bold mt-1">
          Train and deploy your automated booking assistant.
        </p>
      </div>

      <AgentConfigForm 
        initialConfig={finalConfig as any} 
        initialFaqs={faqs}
        slug={slug} 
        appUrl={appUrl} 
      />
    </div>
  );
}
