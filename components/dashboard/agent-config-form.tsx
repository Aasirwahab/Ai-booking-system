"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, 
  Sparkles, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  Activity,
  Palette,
  Clock,
  Plus,
  Trash2,
  HelpCircle,
  Wand2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateAgentConfig } from "@/actions/agent";
import { addFaq, deleteFaq } from "@/actions/faqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AgentConfigFormProps {
  initialConfig: {
    agent_instructions: string;
    agent_enabled: boolean;
    name: string;
    industry: string;
    widget_color: string;
    welcome_message: string;
    booking_instructions: string;
    ai_tone: string;
    slot_duration: number;
  };
  initialFaqs: any[];
  slug: string;
  appUrl: string;
}

const PRESET_COLORS = [
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#1d4ed8', // Blue
  '#7c3aed', // Violet
  '#C1FF72', // Lime (Default)
  '#ea580c', // Orange
  '#16a34a', // Green
  '#0f172a', // Slate
];

const COLOR_TO_CLASS: Record<string, string> = {
  '#db2777': 'bg-preset-pink',
  '#0891b2': 'bg-preset-cyan',
  '#1d4ed8': 'bg-preset-blue',
  '#7c3aed': 'bg-preset-violet',
  '#C1FF72': 'bg-preset-lime',
  '#ea580c': 'bg-preset-orange',
  '#16a34a': 'bg-preset-green',
  '#0f172a': 'bg-preset-slate',
};

export function AgentConfigForm({ initialConfig, initialFaqs, slug, appUrl }: AgentConfigFormProps) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedColor, setSelectedColor] = useState(initialConfig.widget_color || "#C1FF72");
  
  // FAQ state
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const chatUrl = `${appUrl}/embed/chat/${slug}`;
  const chatScript = `<script src="${appUrl}/widgets/chat.js" data-org="${slug}"></script>`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("widget_color", selectedColor);
    
    try {
      await updateAgentConfig(formData);
      toast.success("Configuration updated successfully!");
    } catch (error) {
      toast.error("Failed to update configuration");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFaq() {
    if (!newQuestion || !newAnswer) return;
    startTransition(async () => {
      try {
        await addFaq(newQuestion, newAnswer);
        setNewQuestion("");
        setNewAnswer("");
        toast.success("FAQ added!");
      } catch (error) {
        toast.error("Failed to add FAQ");
      }
    });
  }

  async function handleDeleteFaq(id: string) {
    startTransition(async () => {
      try {
        await deleteFaq(id);
        toast.success("FAQ removed");
      } catch (error) {
        toast.error("Failed to remove FAQ");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column: Configuration */}
      <div className="xl:col-span-8 space-y-8">
        <Tabs defaultValue="brain" className="w-full">
          <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8">
            <TabsTrigger value="brain" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bot className="w-3.5 h-3.5 mr-2" /> Agent Brain
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Palette className="w-3.5 h-3.5 mr-2" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="faqs" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <HelpCircle className="w-3.5 h-3.5 mr-2" /> FAQ Center
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="brain" className="space-y-6 focus-visible:outline-none">
              <div className="premium-card p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#C1FF72]/10">
                      <Bot className="w-6 h-6 text-[#0f172a]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#0f172a]">Intelligence & Behavior</h3>
                      <p className="text-xs font-bold text-slate-400">Define how your agent thinks and books.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                    <Switch 
                      name="agent_enabled" 
                      defaultChecked={initialConfig.agent_enabled} 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">System Instructions</Label>
                    <Textarea 
                      name="agent_instructions"
                      defaultValue={initialConfig.agent_instructions}
                      className="min-h-[150px] rounded-[2rem] border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold p-6 text-sm leading-relaxed"
                      placeholder="General personality and behavior..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Booking Specific Behavior</Label>
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#C1FF72] uppercase">
                        <Wand2 className="w-3 h-3" /> Booking Expert
                      </div>
                    </div>
                    <Textarea 
                      name="booking_instructions"
                      defaultValue={initialConfig.booking_instructions}
                      className="min-h-[150px] rounded-[2rem] border-slate-100 bg-slate-50 focus-visible:ring-[#C1FF72] font-bold p-6 text-sm leading-relaxed"
                      placeholder="Rules for handling slots, cancellations, etc..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Communication Tone</Label>
                    <Select name="ai_tone" defaultValue={initialConfig.ai_tone}>
                      <SelectTrigger className="rounded-2xl border-slate-100 bg-slate-50 font-bold h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100">
                        <SelectItem value="Professional & Friendly">Professional & Friendly</SelectItem>
                        <SelectItem value="Casual & Energetic">Casual & Energetic</SelectItem>
                        <SelectItem value="Formal & Precise">Formal & Precise</SelectItem>
                        <SelectItem value="Empathetic & Caring">Empathetic & Caring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Default Slot Duration</Label>
                    <div className="relative">
                      <Select name="slot_duration" defaultValue={initialConfig.slot_duration?.toString()}>
                        <SelectTrigger className="rounded-2xl border-slate-100 bg-slate-50 font-bold h-12 pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100">
                          <SelectItem value="15">15 Minutes</SelectItem>
                          <SelectItem value="30">30 Minutes</SelectItem>
                          <SelectItem value="45">45 Minutes</SelectItem>
                          <SelectItem value="60">60 Minutes</SelectItem>
                          <SelectItem value="90">90 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 focus-visible:outline-none">
              <div className="premium-card p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#C1FF72]/10">
                    <Palette className="w-6 h-6 text-[#0f172a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a]">Widget Branding</h3>
                    <p className="text-xs font-bold text-slate-400">Match the widget to your brand identity.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Primary Brand Color</Label>
                    <div className="flex flex-wrap gap-3">
                      <style>{`
                        :root {
                          --dynamic-color: ${selectedColor};
                        }
                      `}</style>
                      <div 
                        className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl cursor-pointer transition-transform hover:scale-110 flex items-center justify-center overflow-hidden dynamic-bg"
                      >
                         <input 
                           type="color" 
                           value={selectedColor} 
                           onChange={(e) => setSelectedColor(e.target.value)}
                           className="w-[200%] h-[200%] cursor-pointer opacity-0"
                           title="Pick custom color"
                           aria-label="Pick custom color"
                         />
                      </div>
                      <div className="w-[1px] h-12 bg-slate-100 mx-2" />
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95 ${selectedColor === color ? 'ring-4 ring-slate-100 scale-110' : ''} ${COLOR_TO_CLASS[color] || ''}`}
                          title={`Set color to ${color}`}
                          aria-label={`Set color to ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Welcome Message</Label>
                    <Input 
                      name="welcome_message"
                      defaultValue={initialConfig.welcome_message}
                      className="rounded-2xl border-slate-100 bg-slate-50 font-bold h-14 px-6"
                      placeholder="Hi! I'm your AI assistant..."
                    />
                    <p className="text-[10px] font-bold text-slate-400 px-2 italic mt-1">
                      This is the first message customers see when opening the widget.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-6 focus-visible:outline-none">
              <div className="premium-card p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#C1FF72]/10">
                    <HelpCircle className="w-6 h-6 text-[#0f172a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a]">Knowledge Base (FAQs)</h3>
                    <p className="text-xs font-bold text-slate-400">Help the AI answer common questions accurately.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Question</Label>
                      <Input 
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="rounded-2xl border-white bg-white font-bold h-12 shadow-sm"
                        placeholder="e.g. What are your opening hours?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Response</Label>
                      <Textarea 
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        className="rounded-2xl border-white bg-white font-bold min-h-[100px] p-4 shadow-sm"
                        placeholder="Provide the exact answer for the AI to use..."
                      />
                    </div>
                    <Button 
                      type="button"
                      onClick={handleAddFaq}
                      disabled={isPending || !newQuestion || !newAnswer}
                      className="w-full bg-[#C1FF72] hover:bg-[#C1FF72]/90 text-[#0f172a] font-black rounded-2xl h-12 shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add to Knowledge Base
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Current FAQs ({initialFaqs.length})</Label>
                    <div className="space-y-3">
                      {initialFaqs.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                          <p className="text-xs font-bold text-slate-400">No FAQs added yet.</p>
                        </div>
                      ) : (
                        initialFaqs.map((faq) => (
                          <div key={faq.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start justify-between group">
                            <div className="space-y-1">
                              <p className="text-sm font-black text-[#0f172a]">{faq.question}</p>
                              <p className="text-xs font-bold text-slate-400 line-clamp-2">{faq.answer}</p>
                            </div>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <div className="pt-8 flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white font-black rounded-2xl px-12 h-14 shadow-2xl text-lg transition-all active:scale-95"
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                     <Activity className="w-5 h-5 animate-spin" /> Saving...
                   </span>
                ) : (
                   <span className="flex items-center gap-2">
                     <Sparkles className="w-5 h-5" /> Deploy Changes
                   </span>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>

      {/* Right Column: Preview & Integration */}
      <div className="xl:col-span-4 space-y-8">
        <div className="premium-card p-8 bg-[#0f172a] text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black">Live Simulation</h3>
            <Badge className="bg-white/10 text-white border-white/20 font-black text-[10px] uppercase">Widget</Badge>
          </div>
          <div className="aspect-[4/5] rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
             {/* Mock Widget Header */}
             <div 
               className="absolute top-0 left-0 right-0 h-16 flex items-center px-6 gap-3 transition-colors duration-500 dynamic-bg"
             >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                   <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                   <p className="text-[10px] font-black text-white/70 leading-none">AI Assistant</p>
                   <p className="text-xs font-black text-white">Online</p>
                </div>
             </div>

             <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Bot className="w-10 h-10 text-white" />
             </div>
             <h4 className="text-lg font-black mb-2">Test Your Agent</h4>
             <p className="text-xs font-bold text-slate-400 mb-8 max-w-xs">
                Preview how your agent interacts with {initialConfig.industry === 'clinic' ? 'patients' : 'customers'} using the current configuration.
             </p>
             <Button 
               asChild
               className="bg-white hover:bg-white/90 text-[#0f172a] font-black rounded-2xl px-8 h-12 w-full shadow-lg"
             >
               <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                 Open Preview <ExternalLink className="w-4 h-4 ml-2" />
               </a>
             </Button>
          </div>
        </div>

        <div className="premium-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-slate-50">
              <Code2 className="w-6 h-6 text-[#0f172a]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0f172a]">Integration</h3>
              <p className="text-xs font-bold text-slate-400">Embed on your site.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0f172a] rounded-[2rem] p-6 overflow-hidden relative group">
              <code className="text-[#C1FF72] font-mono text-[10px] block leading-relaxed break-all">
                {chatScript}
              </code>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(chatScript);
                  toast.success("Code copied!");
                }}
                className="absolute top-2 right-2 text-slate-500 hover:text-white hover:bg-white/5 h-7 text-[8px] font-black uppercase"
              >
                Copy
              </Button>
            </div>
            <div className="flex items-center gap-2 px-2">
              <Terminal className="w-3 h-3 text-slate-300" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Add to your <span className="text-slate-600">&lt;/body&gt;</span> tag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
