import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Field, TextInput, TextArea, ThemedSelect } from "@/components/ui-kit";
import { agents, phoneNumbers, importLists, campaigns } from "@/lib/mock-data";

type Mode = "Outbound" | "Inbound" | "One-Ring";

export function NewCampaignDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [mode, setMode] = useState<Mode>("Outbound");
  const [form, setForm] = useState({
    name: "",
    agent: "",
    phone: "",
    list: "",
    schedule: "",
    timezone: "America/New_York",
    concurrency: "5",
    retries: "2",
    callerId: "",
    voicemail: "leave",
    objective: "",
    greeting: "",
    // One-Ring
    ringDuration: "4",
    callerIdStrategy: "rotate",
    cooldownDays: "7",
    dailyCapPerNumber: "1",
    callbackHandler: "",
    // Compliance
    respectDnc: true,
    honorCarrierHours: true,
    autoStopOnComplaints: true,
    complaintThreshold: "2",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const isOneRing = mode === "One-Ring";
  const isOutbound = mode === "Outbound" || isOneRing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl shadow-elevated max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Set up your new campaign</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure every detail up front — call mode, agent, schedule, script, and compliance.
          </p>
        </DialogHeader>

        {/* Mode tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-2xl">
          {(["Outbound", "Inbound", "One-Ring"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "h-11 rounded-xl text-sm font-semibold transition-all",
                mode === m ? "bg-card shadow-card text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "One-Ring" ? "One-Ring" : `${m} Calling`}
            </button>
          ))}
        </div>

        {/* Basics */}
        <Section title="Basics">
          <Field label="Campaign Name">
            <TextInput
              placeholder="e.g. Summer Offer Campaign"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="AI Agent">
              <ThemedSelect
                placeholder="Select Agent"
                value={form.agent}
                onChange={(v) => update("agent", v)}
                options={agents.map((a) => ({ value: a.type, label: `${a.name} — ${a.type}` }))}
              />
            </Field>
            <Field label="Phone Number">
              <ThemedSelect
                placeholder="Select Phone Number"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                options={phoneNumbers.map((p) => ({ value: p.number, label: `${p.number} (${p.label})` }))}
              />
            </Field>
          </div>
        </Section>

        {/* Targeting & schedule */}
        {isOutbound && (
          <Section title="Targeting & Schedule">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact List">
                <ThemedSelect
                  placeholder="Select File"
                  value={form.list}
                  onChange={(v) => update("list", v)}
                  options={importLists.map((l) => ({ value: l.name, label: l.name }))}
                />
              </Field>
              <Field label="Schedule Date & Time">
                <TextInput
                  placeholder="mm/dd/yyyy, --:-- AM"
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
              <Field label="Max Concurrent Calls">
                <TextInput value={form.concurrency} onChange={(e) => update("concurrency", e.target.value)} />
              </Field>
            </div>
          </Section>
        )}

        {/* Call behavior */}
        <Section title="Call Behavior">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Caller ID">
              <TextInput
                placeholder="+1 ..."
                value={form.callerId}
                onChange={(e) => update("callerId", e.target.value)}
              />
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
                  <TextInput
                    value={form.dailyCapPerNumber}
                    onChange={(e) => update("dailyCapPerNumber", e.target.value)}
                  />
                </Field>
                <Field label="Callback Handler (Inbound Campaign)">
                  <ThemedSelect
                    placeholder="Select handler"
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
        </Section>

        {/* Script */}
        <Section title={isOneRing ? "Callback Handler Script" : "Script & Prompt"}>
          <Field label="Campaign Objective">
            <TextArea
              rows={2}
              placeholder="Qualify the lead, present the offer, and book a demo."
              value={form.objective}
              onChange={(e) => update("objective", e.target.value)}
            />
          </Field>
          <Field label="Opening Greeting">
            <TextArea
              rows={3}
              placeholder="Hi, this is Aria from Tunis Agent…"
              value={form.greeting}
              onChange={(e) => update("greeting", e.target.value)}
            />
          </Field>
        </Section>

        {/* Compliance */}
        {isOutbound && (
          <Section title="Compliance">
            <Toggle
              label="Respect DNC list"
              desc="Skip numbers on Do-Not-Call lists."
              checked={form.respectDnc}
              onChange={(v) => update("respectDnc", v)}
            />
            <Toggle
              label="Honor carrier calling hours"
              desc="Only dial within legally allowed hours per timezone."
              checked={form.honorCarrierHours}
              onChange={(v) => update("honorCarrierHours", v)}
            />
            <Toggle
              label="Auto-stop on complaints"
              desc="Pause campaign automatically when complaint threshold is hit."
              checked={form.autoStopOnComplaints}
              onChange={(v) => update("autoStopOnComplaints", v)}
            />
            {form.autoStopOnComplaints && (
              <Field label="Complaint Threshold">
                <TextInput
                  value={form.complaintThreshold}
                  onChange={(e) => update("complaintThreshold", e.target.value)}
                />
              </Field>
            )}
            {isOneRing && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                <strong>One-Ring mode:</strong> rings each number for ~{form.ringDuration}s then hangs up. Review local
                telemarketing laws before launching.
              </div>
            )}
          </Section>
        )}

        <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-card">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Close
          </Button>
          <Button variant="mint" onClick={() => onOpenChange(false)} className="rounded-xl">
            Create Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors shrink-0",
          checked ? "bg-mint-deep" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
