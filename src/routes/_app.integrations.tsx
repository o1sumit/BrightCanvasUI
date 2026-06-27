import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Mail, Slack, Database, CreditCard, Webhook, MessageSquare, Cloud, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Tunis Agent Ai" }] }),
  component: IntegrationsPage,
});

const integrations = [
  { name: "Google Calendar", desc: "Auto-book meetings on connected calendars.", icon: Calendar, connected: true, color: "bg-blue-50 text-blue-600" },
  { name: "Microsoft Outlook", desc: "Sync events with Outlook and Microsoft 365.", icon: Calendar, connected: false, color: "bg-sky-50 text-sky-600" },
  { name: "Gmail", desc: "Send proposals and follow-ups via Gmail.", icon: Mail, connected: true, color: "bg-rose-50 text-rose-500" },
  { name: "HubSpot", desc: "Create leads and update contact records.", icon: Database, connected: true, color: "bg-orange-50 text-orange-600" },
  { name: "Salesforce", desc: "Push qualified leads into Salesforce pipelines.", icon: Cloud, connected: false, color: "bg-blue-50 text-blue-700" },
  { name: "Slack", desc: "Send live alerts to your sales channels.", icon: Slack, connected: true, color: "bg-violet-50 text-violet-600" },
  { name: "Twilio", desc: "Telephony, SMS, and number provisioning.", icon: MessageSquare, connected: true, color: "bg-rose-50 text-rose-600" },
  { name: "Stripe", desc: "Trigger payment links from voice agents.", icon: CreditCard, connected: false, color: "bg-indigo-50 text-indigo-600" },
  { name: "Custom Webhook", desc: "Send any event to your endpoint.", icon: Webhook, connected: false, color: "bg-mint-soft text-mint" },
];

function IntegrationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-1 text-sm">Connect Tunis Agent Ai to the tools your team already uses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((i) => (
          <div key={i.name} className="rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-glow transition-all">
            <div className="flex items-start justify-between">
              <div className={`size-11 shrink-0 rounded-xl grid place-items-center ${i.color}`}><i.icon className="size-5 shrink-0" /></div>
              {i.connected ? (
                <span className="text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint-soft text-mint border border-mint/30">
                  <Check className="size-3 shrink-0" /> Connected
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">Not connected</span>
              )}
            </div>
            <h3 className="font-semibold mt-4">{i.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{i.desc}</p>
            <div className="mt-4">
              {i.connected ? (
                <Button variant="outline" className="rounded-xl h-9 border-border w-full">Manage</Button>
              ) : (
                <Button className="rounded-xl h-9 w-full gradient-mint text-ink font-semibold shadow-glow hover:opacity-90"><Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Connect</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
