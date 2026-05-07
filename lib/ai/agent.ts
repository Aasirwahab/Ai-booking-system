import OpenAI from "openai";
import { AGENT_TOOLS } from "./tools";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAvailableSlots } from "@/lib/slots";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface ChatOption {
  id?: string;
  label: string;
  subtitle?: string;
  value: string;
}

export interface ChatOptions {
  type: "chips" | "staff_cards" | "service_cards" | "time_slots" | "date_chips";
  items: ChatOption[];
}

export interface AgentResponse {
  reply: string;
  options?: ChatOptions;
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, 
});

interface AgentContext {
  orgId: string;
  orgName: string;
  orgIndustry: string;
  agentInstructions?: string;
  bookingInstructions?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

/**
 * Execute a tool call and return the result as a string.
 */
async function executeTool(
  name: string,
  args: Record<string, unknown>,
  ctx: AgentContext
): Promise<string> {
  const supabase = createAdminClient();

  switch (name) {
    case "get_business_info": {
      const { data: niche } = await supabase
        .from("niche_settings")
        .select("*")
        .eq("organization_id", ctx.orgId)
        .single();
      return JSON.stringify({
        name: ctx.orgName,
        industry: ctx.orgIndustry,
        labels: niche,
        bookingInstructions: ctx.bookingInstructions,
      });
    }

    case "get_faqs": {
      return JSON.stringify(ctx.faqs ?? []);
    }

    case "get_services": {
      const { data } = await supabase
        .from("services")
        .select("id, name, description, duration_minutes, price, category")
        .eq("organization_id", ctx.orgId)
        .eq("is_active", true);
      return JSON.stringify(data ?? []);
    }

    case "get_service_categories": {
      const { data } = await supabase
        .from("services")
        .select("category")
        .eq("organization_id", ctx.orgId)
        .eq("is_active", true)
        .not("category", "is", null);
      const categories = [...new Set((data ?? []).map((s: any) => s.category).filter(Boolean))];
      return JSON.stringify(categories);
    }

    case "get_staff": {
      const { data } = await supabase
        .from("staff_profiles")
        .select("id, full_name, role_title, avatar_url")
        .eq("organization_id", ctx.orgId)
        .eq("is_active", true)
        .order("full_name");
      return JSON.stringify(data ?? []);
    }

    case "get_available_days": {
      const service_id = args.service_id as string;
      const staff_id = args.staff_id as string | undefined;
      const days: { date: string; label: string }[] = [];
      
      // Check next 14 days for availability
      for (let i = 0; i < 14 && days.length < 5; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() + i);
        
        // Format as YYYY-MM-DD in local time
        const yyyy = checkDate.getFullYear();
        const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
        const dd = String(checkDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        const slots = await getAvailableSlots(ctx.orgId, service_id, dateStr, staff_id);
        if (slots.length > 0) {
          days.push({
            date: dateStr,
            label: checkDate.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })
          });
        }
      }
      return JSON.stringify(days);
    }

    case "check_availability": {
      const slots = await getAvailableSlots(
        ctx.orgId,
        args.service_id as string,
        args.date as string,
        args.staff_id as string | undefined
      );
      return JSON.stringify(slots);
    }

    case "create_booking": {
      const email = args.customer_email as string;
      let contactId: string;

      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("organization_id", ctx.orgId)
        .eq("email", email)
        .is("deleted_at", null)
        .single();

      if (existing) {
        contactId = existing.id;
      } else {
        const { data: created } = await supabase
          .from("contacts")
          .insert({
            organization_id: ctx.orgId,
            full_name: args.customer_name as string,
            email,
            phone: (args.customer_phone as string) || null,
            source: "widget",
            custom_fields: args.customer_gender ? { gender: args.customer_gender } : null,
          })
          .select("id")
          .single();
        contactId = created!.id;
      }

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          organization_id: ctx.orgId,
          contact_id: contactId,
          service_id: args.service_id as string,
          staff_id: args.staff_id as string,
          start_time: args.start_time as string,
          end_time: args.end_time as string,
          source: "widget",
          status: "pending",
          notes: (args.notes as string) || null,
        })
        .select("id, start_time, end_time, status")
        .single();

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ success: true, booking });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

export async function runAgent(
  messages: ChatCompletionMessageParam[],
  ctx: AgentContext
): Promise<AgentResponse> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  const baseInstructions = ctx.agentInstructions || 
    `You are a helpful booking assistant for ${ctx.orgName} (a ${ctx.orgIndustry} business).
Current Context: Today is ${dateStr}, time is ${timeStr}.
Use these details to calculate "today", "tomorrow", and "next week".

Help customers find services, check availability, and book appointments.
Be friendly, concise, and professional.`;

  const faqContext = ctx.faqs && ctx.faqs.length > 0
    ? `\n\nFREQUENTLY ASKED QUESTIONS:\n${ctx.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}`
    : "";

  const bookingInstructions = ctx.bookingInstructions ? `\n\nBOOKING INSTRUCTIONS:\n${ctx.bookingInstructions}` : "";

  const systemPrompt = `${baseInstructions}${faqContext}${bookingInstructions}

When a customer wants to book:
1. Use get_services or get_service_categories to show options.
2. Use get_staff to show staff cards.
3. Use get_available_days to show selectable dates as chips.
4. Use check_availability to show time slots as chips.
5. Collect user details (name, email, gender, notes) ONLY via text.

Niche Specifics:
- Clinic: Call staff "Doctors".
- Salon: Call staff "Stylists".
- Fitness: Call staff "Coaches".

Always prefer calling tools to show visual options rather than asking the user to type dates or staff names.`;

  const allMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  let lastToolName = "";
  let lastToolResult = "";

  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model,
      messages: allMessages,
      tools: AGENT_TOOLS,
    });

    const choice = response.choices[0];
    const message = choice.message;
    allMessages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      const reply = message.content ?? "";
      const options = buildOptionsFromToolResult(lastToolName, lastToolResult);
      return { reply, options };
    }

    for (const toolCall of message.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await executeTool(toolCall.function.name, args, ctx);
      lastToolName = toolCall.function.name;
      lastToolResult = result;
      allMessages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
    }
  }

  return { reply: "I'm having trouble processing your request. Please try again." };
}

function buildOptionsFromToolResult(toolName: string, result: string): ChatOptions | undefined {
  try {
    const data = JSON.parse(result);
    if (!Array.isArray(data) || data.length === 0) return undefined;

    switch (toolName) {
      case "get_services":
        return {
          type: "service_cards",
          items: data.map((s: any) => ({
            id: s.id,
            label: s.name,
            subtitle: `${s.duration_minutes} min${s.price ? ` · $${s.price}` : ""}`,
            value: s.name,
          })),
        };
      case "get_service_categories":
        return {
          type: "chips",
          items: data.map((cat: string) => ({ label: cat, value: cat })),
        };
      case "get_staff":
        return {
          type: "staff_cards",
          items: data.map((s: any) => ({
            id: s.id,
            label: s.full_name,
            subtitle: s.role_title || undefined,
            value: s.full_name,
          })),
        };
      case "get_available_days":
        return {
          type: "date_chips",
          items: data.map((d: any) => ({ label: d.label, value: d.date })),
        };
      case "check_availability":
        return {
          type: "time_slots",
          items: data.slice(0, 12).map((s: any) => ({
            id: s.staff_id,
            label: new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            subtitle: s.staff_name,
            value: `${new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} with ${s.staff_name}`,
          })),
        };
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}
