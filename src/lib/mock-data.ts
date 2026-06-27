export type CampaignStatus = "active" | "failed" | "paused" | "scheduled";

export interface Campaign {
  id: string;
  name: string;
  callId: string;
  agent: string;
  type: "Inbound" | "Outbound" | "One-Ring";
  phone: string;
  contacts: number;
  scheduledAt: string;
  createdBy: string;
  status: CampaignStatus;
}

export const campaigns: Campaign[] = [
  { id: "ca-1", name: "Summer Offer Campaign", callId: "CA-250611-10001", agent: "Sales Agent", type: "Inbound", phone: "+1 548-5684-584", contacts: 5000, scheduledAt: "15 Jun 2026 10:00 AM", createdBy: "Harsh Modi", status: "active" },
  { id: "ca-2", name: "Renewal Reminders Q3", callId: "CA-250611-10002", agent: "Retention Agent", type: "Outbound", phone: "+1 548-5684-585", contacts: 1240, scheduledAt: "16 Jun 2026 09:30 AM", createdBy: "Harsh Modi", status: "failed" },
  { id: "ca-3", name: "Onboarding Welcome Calls", callId: "CA-250611-10003", agent: "Support Agent", type: "Inbound", phone: "+1 548-5684-586", contacts: 320, scheduledAt: "17 Jun 2026 11:00 AM", createdBy: "Siddhi Gandhi", status: "paused" },
  { id: "ca-4", name: "Black Friday Pre-Sale", callId: "CA-250611-10004", agent: "Sales Agent", type: "Outbound", phone: "+1 548-5684-587", contacts: 8200, scheduledAt: "20 Jun 2026 08:00 AM", createdBy: "Harsh Modi", status: "scheduled" },
  { id: "ca-5", name: "Survey: NPS Q2", callId: "CA-250611-10005", agent: "Research Agent", type: "Outbound", phone: "+1 548-5684-588", contacts: 1500, scheduledAt: "18 Jun 2026 02:00 PM", createdBy: "Harsh Modi", status: "active" },
  { id: "ca-6", name: "Demo Booking Followup", callId: "CA-250611-10006", agent: "Sales Agent", type: "Inbound", phone: "+1 548-5684-589", contacts: 410, scheduledAt: "19 Jun 2026 03:30 PM", createdBy: "Siddhi Gandhi", status: "active" },
];

export const voices = ["Nova", "Shimmer", "Arial", "Fable", "Onyx", "Echo", "Alloy", "Shizu"];

export interface Agent {
  id: string;
  name: string;
  type: string;
  voice: string;
  language: string;
  calls: number;
  status: "active" | "draft";
}

export const agents: Agent[] = [
  { id: "ag-1", name: "Aria", type: "Sales Agent", voice: "Nova", language: "English", calls: 1240, status: "active" },
  { id: "ag-2", name: "Milo", type: "Support Agent", voice: "Onyx", language: "English", calls: 860, status: "active" },
  { id: "ag-3", name: "Luna", type: "Retention Agent", voice: "Shimmer", language: "English", calls: 412, status: "draft" },
  { id: "ag-4", name: "Kai", type: "Research Agent", voice: "Echo", language: "Spanish", calls: 188, status: "active" },
];

export const phoneNumbers = [
  { id: "p-1", number: "+1 548-5684-584", label: "Sales US", region: "United States", linked: "Aria" },
  { id: "p-2", number: "+1 546-8542-9862", label: "Support US", region: "United States", linked: "Milo" },
  { id: "p-3", number: "+44 20-7946-0958", label: "Sales UK", region: "United Kingdom", linked: "Luna" },
];

export const importLists = [
  { id: "l-1", name: "Summer Leads 2026", rows: 5000, uploadedAt: "10 Jun 2026", status: "ready" },
  { id: "l-2", name: "Renewal Cohort Q3", rows: 1240, uploadedAt: "11 Jun 2026", status: "ready" },
  { id: "l-3", name: "NPS Survey Targets", rows: 1500, uploadedAt: "12 Jun 2026", status: "processing" },
];

export const actions = [
  { id: "a-1", name: "Book Meeting", trigger: "Customer requests demo", uses: 482 },
  { id: "a-2", name: "Send SMS Followup", trigger: "Call ends without sale", uses: 1210 },
  { id: "a-3", name: "Transfer to Human", trigger: "Customer asks for agent", uses: 96 },
];

export const transcript = [
  { from: "agent", initials: "HM", text: "Hi! Thank you for reaching out. I'm Aria, your AI sales assistant. How can I help you today?", time: "3:15 PM" },
  { from: "user", initials: "U", text: "I would like to know more about your pricing plans.", time: "3:15 PM" },
  { from: "agent", initials: "HM", text: "Absolutely. We offer Starter, Professional, and Enterprise plans. May I know the size of your business so I can recommend the best option?", time: "3:15 PM" },
  { from: "user", initials: "U", text: "We have around 25 employees.", time: "3:16 PM" },
  { from: "agent", initials: "HM", text: "Great! Based on your team size, our Professional plan would be most suitable. It includes unlimited AI calling, CRM integrations, and advanced analytics.", time: "3:16 PM" },
];

export const logs = Array.from({ length: 12 }).map((_, i) => ({
  id: `log-${i}`,
  contactId: `Jun 13, 15:15:${(35 + i).toString().padStart(2, "0")}.128`,
  level: i % 5 === 0 ? "warn" : "log",
  category: i % 3 === 0 ? "Agent" : "System",
  message: "New Turn Started",
  raw: `{ "category": "System", "CallId": "019ec05f-5a19-7004-8e20-0a247c045a75", "OrgId": "019ec05f-5a19-7004-8e20-0a24..." }`,
}));
