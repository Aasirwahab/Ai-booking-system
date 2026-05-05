import OpenAI from "openai";
import { AGENT_TOOLS } from "./tools";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAvailableSlots } from "@/lib/slots";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

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
        .select("id, name, description, duration_minutes, price")
        .eq("organization_id", ctx.orgId)
        .eq("is_active", true);
      return JSON.stringify(data ?? []);
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
      // Find or create contact
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

/**
 * Run the agent loop: send messages to OpenAI, execute tool calls, repeat until done.
 */
export async function runAgent(
  messages: ChatCompletionMessageParam[],
  ctx: AgentContext
): Promise<string> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  
  // Use custom instructions if available, otherwise fallback to default
  const baseInstructions = ctx.agentInstructions || 
    `You are a helpful booking assistant for ${ctx.orgName} (a ${ctx.orgIndustry} business).
Help customers find services, check availability, and book appointments.
Be friendly, concise, and professional.`;

  const faqContext = ctx.faqs && ctx.faqs.length > 0
    ? `\n\nFREQUENTLY ASKED QUESTIONS:\n${ctx.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}`
    : "";

  const bookingContext = ctx.bookingInstructions
    ? `\n\nBOOKING INSTRUCTIONS:\n${ctx.bookingInstructions}`
    : "";

  const systemPrompt = `${baseInstructions}${faqContext}${bookingContext}

When a customer wants to book, collect: which service, preferred date/time, and their name + email.
Use the tools provided to check real availability and create bookings.
Never make up availability — always check with the check_availability tool.
If no slots are available, suggest the next day.`;

  const allMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];


  // Tool-calling loop (max 5 iterations to prevent runaway)
  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model,
      messages: allMessages,
      tools: AGENT_TOOLS,
    });

    const choice = response.choices[0];
    const message = choice.message;

    allMessages.push(message);

    // If no tool calls, return the final text
    if (!message.tool_calls || message.tool_calls.length === 0) {
      return message.content ?? "";
    }

    // Execute each tool call
    for (const toolCall of message.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await executeTool(toolCall.function.name, args, ctx);

      allMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  return "I'm having trouble processing your request. Please try again.";
}
