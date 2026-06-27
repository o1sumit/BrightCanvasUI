import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Save,
  Play,
  Pause,
  Trash2,
  Phone,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Calendar,
  Copy,
} from "lucide-react";
import { campaigns, agents, phoneNumbers, importLists, CampaignStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Field, TextInput, TextArea, ThemedSelect } from "@/components/ui-kit";
import { StatusBadge } from "@/components/campaigns/status-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/campaigns/$id")({
  head: () => ({ meta: [{ title: "Campaign Detail — Tunis Agent Ai" }] }),
  component: CampaignDetail,
});

function CampaignDetail() {
  const { id } = useParams({ from: "/_app/campaigns/$id" });
  const campaign = useMemo(() => campaigns.find((x) => x.id === id) ?? campaigns[0], [id]);

  const [tab, setTab] = useState<"overview" | "settings" | "schedule" | "script" | "compliance">("overview");
  const [form, setForm] = useState({
    name: campaign.name,
    agent: campaign.agent,
    phone: campaign.phone,
    type: campaign.type as "Inbound" | "Outbound" | "One-Ring",
    list: "Summer Leads 2026",
    schedule: campaign.scheduledAt,
    status: campaign.status as CampaignStatus,
    concurrency: "5",
    retries: "2",
    callerId: campaign.phone,
    timezone: "America/New_York",
    voicemail: "leave",
    greeting:
      "Hi, this is Aria calling from Tunis Agent. I'm reaching out about a quick offer that might interest you — do you have a moment?",
    objective:
      "Qualify the lead, present the Summer Offer, and book a follow-up demo if interested.",
    // One-Ring specific
    ringDuration: "4",
    callerIdStrategy: "rotate",
    cooldownDays: "7",
    dailyCapPerNumber: "1",
    callbackHandler: "ca-1",
    // Compliance
    respectDnc: true,
    honorCarrierHours: true,
    autoStopOnComplaints: true,
    complaintThreshold: "2",
  });

  const isOneRing = form.type === "One-Ring";

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const stats = [
    { label: "Total Contacts", value: campaign.contacts.toLocaleString(), icon: Users, tint: "bg-mint-soft text-mint-deep" },
    { label: "Calls Made", value: "3,482", icon: Phone, tint: "bg-sky-50 text-sky-700" },
    { label: "Connected", value: "2,914", icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-700" },
    { label: "Failed", value: "568", icon: XCircle, tint: "bg-rose-50 text-rose-700" },
    { label: "Avg Duration", value: "2m 14s", icon: Clock, tint: "bg-violet-50 text-violet-700" },
    { label: "Conversion", value: "18.4%", icon: TrendingUp, tint: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4 shrink-0" /> All campaigns
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-card border border-border shadow-card p-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">{form.name}</h1>
            <StatusBadge status={form.status} />
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                form.type === "Inbound"
                  ? "bg-sky-50 text-sky-700"
                  : form.type === "Outbound"
                  ? "bg-violet-50 text-violet-700"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {form.type}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{campaign.callId}</span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 text-mint-deep shrink-0" /> {form.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" /> {form.schedule}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10">
            <Copy className="size-4 mr-1.5" /> Duplicate
          </Button>
          {form.status === "active" ? (
            <Button
              variant="outline"
              className="rounded-xl h-10"
              onClick={() => update("status", "paused")}
            >
              <Pause className="size-4 mr-1.5" /> Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-xl h-10"
              onClick={() => update("status", "active")}
            >
              <Play className="size-4 mr-1.5" /> Resume
            </Button>
          )}
          <Button className="rounded-xl h-10 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
            <Save className="size-4 mr-1.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border shadow-card p-4">
            <div className={cn("size-9 rounded-xl grid place-items-center mb-3", s.tint)}>
              <s.icon className="size-4" />
            </div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-xl font-bold tracking-tight mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 bg-muted rounded-2xl flex-wrap">
        {[
          { key: "overview", label: "Overview" },
          { key: "settings", label: "Settings" },
          { key: "schedule", label: "Schedule" },
          { key: "script", label: isOneRing ? "Callback Handler" : "Script & Prompt" },
          { key: "compliance", label: "Compliance" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={cn(
              "h-10 px-4 rounded-xl text-sm font-medium transition-all",
              tab === t.key
                ? "bg-card shadow-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-card border border-border shadow-card p-6 lg:col-span-2">
            <h3 className="font-display font-semibold text-lg mb-4">Campaign Progress</h3>
            <div className="space-y-4">
              {(isOneRing
                ? [
                    { label: "Rang Successfully", pct: 71, color: "bg-emerald-500" },
                    { label: "Picked Up Too Fast", pct: 6, color: "bg-amber-500" },
                    { label: "Invalid Number", pct: 4, color: "bg-slate-400" },
                    { label: "Called Back", pct: 17, color: "bg-mint-deep" },
                    { label: "DNC / Complaint", pct: 2, color: "bg-rose-500" },
                  ]
                : [
                    { label: "Connected", pct: 84, color: "bg-emerald-500" },
                    { label: "Voicemail", pct: 9, color: "bg-amber-500" },
                    { label: "No Answer", pct: 5, color: "bg-slate-400" },
                    { label: "Failed", pct: 2, color: "bg-rose-500" },
                  ]
              ).map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground/80">{r.label}</span>
                    <span className="font-semibold">{r.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", r.color)} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Assigned</h3>
            <div className="space-y-4 text-sm">
              <Row label="AI Agent" value={form.agent} />
              <Row label="Phone Number" value={form.phone} />
              <Row label="Contact List" value={form.list} />
              <Row label="Created By" value={campaign.createdBy} />
              <Row label="Timezone" value={form.timezone} />
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-5 max-w-4xl">
          <Field label="Campaign Name">
            <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="AI Agent">
              <ThemedSelect
                value={form.agent}
                onChange={(v) => update("agent", v)}
                options={agents.map((a) => ({ value: a.type, label: `${a.name} — ${a.type}` }))}
              />
            </Field>
            <Field label="Phone Number">
              <ThemedSelect
                value={form.phone}
                onChange={(v) => update("phone", v)}
                options={phoneNumbers.map((p) => ({ value: p.number, label: `${p.number} (${p.label})` }))}
              />
            </Field>
            <Field label="Call Type">
              <ThemedSelect
                value={form.type}
                onChange={(v) => update("type", v as typeof form.type)}
                options={[
                  { value: "Inbound", label: "Inbound" },
                  { value: "Outbound", label: "Outbound" },
                  { value: "One-Ring", label: "One-Ring (ring & hangup)" },
                ]}
              />
            </Field>
            <Field label="Contact List">
              <ThemedSelect
                value={form.list}
                onChange={(v) => update("list", v)}
                options={importLists.map((l) => ({ value: l.name, label: l.name }))}
              />
            </Field>
            <Field label="Max Concurrent Calls">
              <TextInput value={form.concurrency} onChange={(e) => update("concurrency", e.target.value)} />
            </Field>
            <Field label="Retry Attempts">
              <TextInput value={form.retries} onChange={(e) => update("retries", e.target.value)} />
            </Field>
            {!isOneRing && (
              <Field label="Voicemail Behavior">
                <ThemedSelect
                  value={form.voicemail}
                  onChange={(v) => update("voicemail", v)}
                  options={[
                    { value: "leave", label: "Leave a message" },
                    { value: "skip", label: "Skip & retry later" },
                    { value: "hangup", label: "Hang up" },
                  ]}
                />
              </Field>
            )}
            <Field label="Caller ID">
              <TextInput value={form.callerId} onChange={(e) => update("callerId", e.target.value)} />
            </Field>
            {isOneRing && (
              <>
                <Field label="Ring Duration (seconds)">
                  <TextInput value={form.ringDuration} onChange={(e) => update("ringDuration", e.target.value)} />
                </Field>
                <Field label="Caller ID Strategy">
                  <ThemedSelect
                    value={form.callerIdStrategy}
                    onChange={(v) => update("callerIdStrategy", v)}
                    options={[
                      { value: "fixed", label: "Fixed number" },
                      { value: "rotate", label: "Rotate from pool" },
                    ]}
                  />
                </Field>
                <Field label="Per-Number Cooldown (days)">
                  <TextInput value={form.cooldownDays} onChange={(e) => update("cooldownDays", e.target.value)} />
                </Field>
                <Field label="Daily Cap per Number">
                  <TextInput value={form.dailyCapPerNumber} onChange={(e) => update("dailyCapPerNumber", e.target.value)} />
                </Field>
                <Field label="Callback Handler (Inbound Campaign)">
                  <ThemedSelect
                    value={form.callbackHandler}
                    onChange={(v) => update("callbackHandler", v)}
                    options={campaigns
                      .filter((c) => c.type === "Inbound")
                      .map((c) => ({ value: c.id, label: `${c.name} — ${c.agent}` }))}
                  />
                </Field>
              </>
            )}
          </div>
          {isOneRing && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              <strong>One-Ring mode:</strong> system rings each number for ~{form.ringDuration}s and hangs up before pickup. Callbacks route to the selected handler. Review local telemarketing laws and the Compliance tab before launching.
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button variant="outline" className="rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
              <Trash2 className="size-4 mr-1.5" /> Delete Campaign
            </Button>
            <Button className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
              <Save className="size-4 mr-1.5" /> Save Changes
            </Button>
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-5 max-w-3xl">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Start Date & Time">
              <TextInput
                value={form.schedule}
                onChange={(e) => update("schedule", e.target.value)}
                rightIcon={<Calendar className="size-4" />}
              />
            </Field>
            <Field label="Timezone">
              <ThemedSelect
                value={form.timezone}
                onChange={(v) => update("timezone", v)}
                options={[
                  { value: "America/New_York", label: "America/New_York (EST)" },
                  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
                  { value: "Europe/London", label: "Europe/London (GMT)" },
                  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
                ]}
              />
            </Field>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Calling Window</div>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <button
                  key={d}
                  className={cn(
                    "h-10 rounded-xl text-xs font-semibold transition-all border",
                    i < 5
                      ? "gradient-mint text-ink border-transparent shadow-glow"
                      : "bg-card text-muted-foreground border-border hover:border-mint"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="From">
              <TextInput defaultValue="09:00 AM" />
            </Field>
            <Field label="To">
              <TextInput defaultValue="06:00 PM" />
            </Field>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
              <Save className="size-4 mr-1.5" /> Save Schedule
            </Button>
          </div>
        </div>
      )}

      {tab === "script" && (
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-5 max-w-4xl">
          <Field label="Campaign Objective">
            <TextArea
              rows={3}
              value={form.objective}
              onChange={(e) => update("objective", e.target.value)}
            />
          </Field>
          <Field label="Opening Greeting">
            <TextArea
              rows={4}
              value={form.greeting}
              onChange={(e) => update("greeting", e.target.value)}
            />
          </Field>
          <div className="rounded-xl bg-mint-soft/40 border border-border p-4 text-sm text-foreground/80">
            <strong className="text-mint-deep">Tip:</strong> Keep your opening under 15 seconds and clearly identify who you are and why you're calling.
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
              <Save className="size-4 mr-1.5" /> Save Script
            </Button>
          </div>
        </div>
      )}

      {tab === "compliance" && (
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-5 max-w-3xl">
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900">
            <strong>Important:</strong> Telemarketing and automated calling are regulated. Verify local laws, carrier policies, and consent rules before launching — especially for One-Ring campaigns.
          </div>

          <ToggleRow
            label="Respect Do-Not-Call (DNC) list"
            description="Skip any number on the global or campaign DNC list. Required."
            checked={form.respectDnc}
            onChange={(v) => update("respectDnc", v)}
            locked
          />
          <ToggleRow
            label="Honor carrier calling hours"
            description="Only dial within the schedule window and local time-of-day rules."
            checked={form.honorCarrierHours}
            onChange={(v) => update("honorCarrierHours", v)}
          />
          <ToggleRow
            label="Auto-stop on high complaint rate"
            description="Pause the campaign automatically if the complaint rate exceeds the threshold."
            checked={form.autoStopOnComplaints}
            onChange={(v) => update("autoStopOnComplaints", v)}
          />
          {form.autoStopOnComplaints && (
            <Field label="Complaint Threshold (%)">
              <TextInput
                value={form.complaintThreshold}
                onChange={(e) => update("complaintThreshold", e.target.value)}
              />
            </Field>
          )}

          <div className="flex justify-end pt-4 border-t border-border">
            <Button className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
              <Save className="size-4 mr-1.5" /> Save Compliance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  locked,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div className="min-w-0">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
      <button
        type="button"
        disabled={locked}
        onClick={() => !locked && onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "gradient-mint shadow-glow" : "bg-muted",
          locked && "opacity-70 cursor-not-allowed"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-card shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

