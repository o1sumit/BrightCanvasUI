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
  transferEnabled?: boolean;
  transferNumber?: string;
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

export interface HumanNumber {
  id: string;
  number: string;
  name: string;
  label: string;
}

export const defaultHumanNumbers: HumanNumber[] = [
  { id: "hn-1", number: "+1 555-0199", name: "Sarah Connor", label: "Escalations" },
  { id: "hn-2", number: "+1 555-0244", name: "John Doe", label: "Sales Lead" },
  { id: "hn-3", number: "+1 555-0388", name: "Jane Smith", label: "Tech Support" },
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

export interface Call {
  id: string;
  contact: string;
  phone: string;
  campaign: string;
  agent: string;
  duration: string;
  sentiment: "pos" | "neu" | "neg";
  score: number;
  outcome: string;
  date: string;
  dir: "in" | "out";
  recordingUrl?: string;
  summary?: string;
  transcript?: { from: "agent" | "user"; initials: string; text: string; time: string }[];
  logs?: { id: string; contactId: string; level: string; category: string; message: string; raw: string }[];
}

export const defaultCalls: Call[] = [
  {
    id: "call-1",
    contact: "Alice Smith",
    phone: "+1 548-5684-584",
    campaign: "Summer Offer Campaign",
    agent: "Sales Agent",
    duration: "2m 15s",
    sentiment: "pos",
    score: 85,
    outcome: "Booked Demo",
    date: "27 Jun 2026 3:15 PM",
    dir: "in",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    summary: "Alice called inquiring about Professional plan pricing. She was interested in the CRM integration and auto-dialer features. Recommending the demo booking was successful; she scheduled a meeting for next Tuesday.",
    transcript: [
      { from: "agent", initials: "SA", text: "Hello, this is Aria from Tunis Agent. How can I help you today?", time: "3:15 PM" },
      { from: "user", initials: "AS", text: "Hi, I was looking at your Summer Offer and wanted to know about pricing for a team of 15.", time: "3:15 PM" },
      { from: "agent", initials: "SA", text: "Absolutely, Alice! Our Professional plan is $49 per user, but with the Summer discount it is currently $39. Would you like to book a quick demo to see how the integrations work?", time: "3:16 PM" },
      { from: "user", initials: "AS", text: "Yes, that sounds great. Can we do next Tuesday at 10 AM?", time: "3:16 PM" },
      { from: "agent", initials: "SA", text: "Perfect! I have scheduled that for you. Looking forward to speaking then!", time: "3:17 PM" },
    ],
    logs: [
      { id: "cl-1", contactId: "Jun 27, 15:15:00", level: "info", category: "System", message: "Call initiated", raw: "{}" },
      { id: "cl-2", contactId: "Jun 27, 15:15:05", level: "info", category: "Agent", message: "Greeting played", raw: "{}" },
      { id: "cl-3", contactId: "Jun 27, 15:16:10", level: "info", category: "System", message: "Demo scheduled", raw: "{}" },
    ]
  },
  {
    id: "call-2",
    contact: "Bob Jones",
    phone: "+1 546-8542-9862",
    campaign: "Renewal Reminders Q3",
    agent: "Retention Agent",
    duration: "1m 10s",
    sentiment: "neu",
    score: 50,
    outcome: "Needs Followup",
    date: "27 Jun 2026 2:10 PM",
    dir: "out",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    summary: "Bob was notified about his upcoming subscription renewal. He mentioned he needs to consult with his department head before making a decision. Followup is scheduled in 3 days.",
    transcript: [
      { from: "agent", initials: "RA", text: "Hi Bob, this is Retention Agent calling regarding your subscription renewal due next week.", time: "2:10 PM" },
      { from: "user", initials: "BJ", text: "Hi. Yes, I received the email. I'm not sure if we are renewing yet. I need to talk to my manager.", time: "2:10 PM" },
      { from: "agent", initials: "RA", text: "Understood. Should I call you back on Tuesday to check in?", time: "2:11 PM" },
      { from: "user", initials: "BJ", text: "Yes, call me then. Thank you.", time: "2:11 PM" },
    ],
    logs: [
      { id: "cl-4", contactId: "Jun 27, 14:10:00", level: "info", category: "System", message: "Call initiated", raw: "{}" },
    ]
  },
  {
    id: "call-3",
    contact: "Charlie Green",
    phone: "+44 20-7946-0958",
    campaign: "Summer Offer Campaign",
    agent: "Sales Agent",
    duration: "0m 45s",
    sentiment: "neg",
    score: 10,
    outcome: "DNC",
    date: "27 Jun 2026 1:05 PM",
    dir: "out",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    summary: "Charlie was upset about being called. He requested to be placed on the Do-Not-Call (DNC) list immediately.",
    transcript: [
      { from: "agent", initials: "SA", text: "Hello Charlie, this is Aria calling from Tunis Agent...", time: "1:05 PM" },
      { from: "user", initials: "CG", text: "Please take me off your calling list. I do not want these calls.", time: "1:05 PM" },
      { from: "agent", initials: "SA", text: "Of course, Charlie. I will add you to our Do-Not-Call list right now. Have a nice day.", time: "1:05 PM" },
    ],
    logs: [
      { id: "cl-5", contactId: "Jun 27, 13:05:00", level: "info", category: "System", message: "Added to DNC list", raw: "{}" },
    ]
  }
];

