import { ChatCompletionTool } from "openai/resources/chat/completions";

export const AGENT_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_business_info",
      description: "Get general information about the business, niche, and custom booking labels.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_faqs",
      description: "Get frequently asked questions and answers for this business.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_services",
      description: "List all available services and their details (duration, price).",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_service_categories",
      description: "Get a list of all unique service categories (e.g. Cardiology, Dermatology).",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_staff",
      description: "List all active staff members/doctors and their roles.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_available_days",
      description: "Get the next 5 available dates for booking (e.g. 'Monday, Oct 23')",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string", description: "The ID of the service" },
          staff_id: { type: "string", description: "Optional staff ID" },
        },
        required: ["service_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Check available time slots for a specific service, date, and optionally staff.",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string", description: "The ID of the service to check" },
          date: { type: "string", description: "The date in YYYY-MM-DD format" },
          staff_id: { type: "string", description: "Optional staff member ID" },
        },
        required: ["service_id", "date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_booking",
      description: "Finalize and create a new appointment booking.",
      parameters: {
        type: "object",
        properties: {
          service_id: { type: "string" },
          staff_id: { type: "string" },
          start_time: { type: "string", description: "ISO 8601 start time" },
          end_time: { type: "string", description: "ISO 8601 end time" },
          customer_name: { type: "string" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          customer_gender: { type: "string", enum: ["male", "female", "other"] },
          notes: { type: "string", description: "Reason for visit or extra notes" },
        },
        required: ["service_id", "staff_id", "start_time", "end_time", "customer_name", "customer_email"],
      },
    },
  },
];
