import type { ChatCompletionTool } from "openai/resources/chat/completions";

/**
 * OpenAI function-calling tool definitions for the booking agent.
 */
export const AGENT_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_services",
      description: "List all active services/treatments offered by this business",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Check available time slots for a specific service on a given date",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string", description: "UUID of the service" },
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
          staff_id: { type: "string", description: "Optional staff UUID to filter by" },
        },
        required: ["service_id", "date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_booking",
      description: "Create a new booking/appointment for a customer",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string", description: "UUID of the service" },
          staff_id: { type: "string", description: "UUID of the staff member" },
          start_time: { type: "string", description: "ISO 8601 start time" },
          end_time: { type: "string", description: "ISO 8601 end time" },
          customer_name: { type: "string", description: "Customer full name" },
          customer_email: { type: "string", description: "Customer email" },
          customer_phone: { type: "string", description: "Customer phone (optional)" },
        },
        required: ["service_id", "staff_id", "start_time", "end_time", "customer_name", "customer_email"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_business_info",
      description: "Get basic information about this business (name, industry, labels)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];
