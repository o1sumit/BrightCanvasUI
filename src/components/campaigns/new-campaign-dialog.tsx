import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User2,
  Users,
  Phone,
  MessageSquareQuote,
  ShieldAlert,
  Sparkles,
  PhoneOutgoing,
  PhoneIncoming,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Zap,
} from "lucide-react";
import { useScopedList } from "@/lib/workspace-context";
import type { Campaign } from "@/lib/mock-data";
import { Field, TextInput, TextArea, ThemedSelect } from "@/components/ui-kit";
import { agents, phoneNumbers, importLists, campaigns } from "@/lib/mock-data";

type Mode = "Outbound" | "Inbound" | "One-Ring";

type Step = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };

const STEPS: Step[] = [
  { id: "basics", label: "Basics", icon: User2 },
  { id: "targeting", label: "Targeting", icon: Users },
  { id: "behavior", label: "Call Behavior", icon: Phone },
  { id: "script", label: "Objective & Greeting", icon: MessageSquareQuote },
  { id: "compliance", label: "Compliance", icon: ShieldAlert },
  { id: "review", label: "Review", icon: Sparkles },
];

const MODE_TEMPLATES = [
  { id: "Outbound", name: "Outbound Calling", desc: "Dials numbers from a contact list on a schedule", icon: PhoneOutgoing },
  { id: "Inbound", name: "Inbound Calling", desc: "Receives incoming calls to your phone number", icon: PhoneIncoming },
  { id: "One-Ring", name: "One-Ring Mode", desc: "Rings contacts briefly then hangs up to prompt callbacks", icon: Zap },
];

export function NewCampaignDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [campaignsList, setCampaignsList] = useScopedList<Campaign>("campaigns", campaigns);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>("Outbound");
  const [oneRingToggle, setOneRingToggle] = useState(false);

  const [form, setForm] = useState({
    name: "",
    agent: "",
    phone: "",
    list: "",
    schedule: "",
    callerId: "",
    retries: "2",
    concurrency: "5",
    voicemail: "leave",
    timezone: "America/New_York",
    objective: "",
    greeting: "",
    // One-Ring specific
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

  const isOneRing = mode === "One-Ring" || (mode === "Outbound" && oneRingToggle);
  const isOutbound = mode === "Outbound" || isOneRing;

  // Determine which steps apply
  const isStepApplicable = (stepIndex: number) => {
    const s = STEPS[stepIndex];
    if (mode === "Inbound") {
      if (s.id === "targeting" || s.id === "compliance") return false;
    }
    return true;
  };

  const handleNext = () => {
    let next = step + 1;
    while (next < STEPS.length && !isStepApplicable(next)) {
      next++;
    }
    if (next < STEPS.length) {
      setStep(next);
    }
  };

  const handleBack = () => {
    let prev = step - 1;
    while (prev >= 0 && !isStepApplicable(prev)) {
      prev--;
    }
    if (prev >= 0) {
      setStep(prev);
    }
  };

  const handleCreate = () => {
    const newCampaign: Campaign = {
      id: `ca-${Date.now()}`,
      name: form.name || "Untitled Campaign",
      callId: `CA-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(10000 + Math.random() * 90005)}`,
      agent: form.agent || "Sales Agent",
      type: isOneRing ? "One-Ring" : mode === "Inbound" ? "Inbound" : "Outbound",
      phone: form.phone || "+1 548-5684-584",
      contacts: form.list === "Summer Leads 2026" ? 5000 : form.list === "Renewal Cohort Q3" ? 1240 : 1500,
      scheduledAt: form.schedule || "Immediately",
      createdBy: "Harsh Modi",
      status: "scheduled",
    };
    setCampaignsList([...campaignsList, newCampaign]);
    onOpenChange(false);
    // Reset steps
    setStep(0);
  };

  // Stepper pro tips
  const proTips = [
    "A clear campaign name helps track outcomes easily in metrics pages.",
    "Targeting a clean, opt-in contact list ensures a lower spam score.",
    "Optimizing concurrent calls balances wait times with server capacities.",
    "Keep greetings short and objectives focused for better agent conversion.",
    "Maintaining strict compliance parameters avoids carrier blocking.",
    "Verify phone numbers and caller ID parameters before launching.",
  ];

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) setStep(0); }}>
      <DialogContent className="max-w-5xl p-0 rounded-3xl shadow-elevated overflow-hidden gap-0 bg-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[640px]">
          {/* Left panel: Stepper */}
          <aside className="hidden md:flex flex-col bg-muted/40 border-r border-border p-6 justify-between">
            <div className="space-y-6">
              <div>
                <DialogTitle className="font-display text-xl font-bold tracking-tight">Create Campaign</DialogTitle>
                <div className="text-xs text-muted-foreground mt-1">Step {step + 1} of {STEPS.length}</div>
              </div>

              <ol className="space-y-1">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < step;
                  const active = i === step;
                  const applicable = isStepApplicable(i);

                  return (
                    <li key={s.id}>
                      <button
                        disabled={!applicable || i > step}
                        onClick={() => setStep(i)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all text-left",
                          active && "bg-card shadow-card text-foreground",
                          !active && done && "text-foreground hover:bg-card/50",
                          !active && !done && "text-muted-foreground/60 cursor-not-allowed",
                          !applicable && "opacity-40 line-through"
                        )}
                      >
                        <span className={cn(
                          "size-7 rounded-lg grid place-items-center transition-all shrink-0",
                          done && "bg-mint text-ink",
                          active && "gradient-mint text-ink shadow-glow",
                          !done && !active && "bg-muted text-muted-foreground/80",
                          !applicable && "bg-muted/30 text-muted-foreground/40"
                        )}>
                          {done && applicable ? <Check className="size-3.5" strokeWidth={3} /> : <Icon className="size-3.5" />}
                        </span>
                        <span className={cn("font-medium", active && "text-foreground")}>
                          {s.label} {!applicable && "(N/A)"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-6">
              <div className="rounded-2xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-mint-deep mb-1">
                  <Sparkles className="size-3.5 animate-pulse" /> Pro tip
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {proTips[step] || proTips[0]}
                </p>
              </div>
            </div>
          </aside>

          {/* Right panel: Content */}
          <section className="flex flex-col h-[640px] overflow-hidden bg-card">
            {/* Scrollable form view */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
              {/* Step 1: Basics */}
              {step === 0 && (
                <StepShell
                  title="Basics Config"
                  description="Define your campaign details and select the call strategy."
                >
                  <Field label="Campaign Name" hint="Shown in dashboard listings">
                    <TextInput
                      placeholder="e.g. Summer Offer Campaign"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </Field>

                  <div>
                    <label className="block text-sm font-medium mb-2.5">Call Mode</label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {MODE_TEMPLATES.map((t) => {
                        const Icon = t.icon;
                        const isSelected = mode === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setMode(t.id as Mode);
                              if (t.id === "One-Ring") {
                                setOneRingToggle(true);
                              } else {
                                setOneRingToggle(false);
                              }
                            }}
                            className={cn(
                              "text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 flex flex-col justify-between min-h-[140px]",
                              isSelected ? "border-mint bg-mint-soft shadow-card" : "border-border bg-card hover:border-mint/50"
                            )}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className={cn(
                                "size-9 rounded-xl grid place-items-center transition-all",
                                isSelected ? "gradient-mint text-ink shadow-glow" : "bg-muted text-foreground"
                              )}>
                                <Icon className="size-4.5" />
                              </div>
                              {isSelected && <Check className="size-4 text-mint-deep" strokeWidth={3} />}
                            </div>
                            <div>
                              <div className="font-semibold text-sm mt-3">{t.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

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
                </StepShell>
              )}

              {/* Step 2: Targeting (Outbound only) */}
              {step === 1 && (
                <StepShell
                  title="Targeting & Schedule"
                  description="Pick your contact database and set up campaign triggers."
                >
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
                </StepShell>
              )}

              {/* Step 3: Call Behavior */}
              {step === 2 && (
                <StepShell
                  title="Call Behavior Settings"
                  description="Configure custom caller IDs, retries, and mode-specific parameters."
                >
                  {mode === "Outbound" && (
                    <div className="mb-4">
                      <Toggle
                        label="One-Ring Calling Mode"
                        desc="Ring each contact briefly (e.g. 4 seconds) then automatically disconnect and proceed to the next contact."
                        checked={oneRingToggle}
                        onChange={(v) => {
                          setOneRingToggle(v);
                          if (v) update("ringDuration", "4");
                        }}
                      />
                    </div>
                  )}

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

                    {!isOneRing && mode !== "Inbound" && (
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
                        <div className="col-span-2">
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
                        </div>
                      </>
                    )}
                  </div>
                </StepShell>
              )}

              {/* Step 4: Objective & Greeting */}
              {step === 3 && (
                <StepShell
                  title={isOneRing ? "Callback Handler Script" : "Script & Prompt"}
                  description="Specify what the AI agent will accomplish and say when a call is connected."
                >
                  <Field label="Campaign Objective">
                    <TextArea
                      rows={3}
                      placeholder="Qualify the lead, present the offer, and book a demo."
                      value={form.objective}
                      onChange={(e) => update("objective", e.target.value)}
                    />
                  </Field>
                  <Field label="Opening Greeting">
                    <TextArea
                      rows={4}
                      placeholder="Hi, this is Aria from Tunis Agent…"
                      value={form.greeting}
                      onChange={(e) => update("greeting", e.target.value)}
                    />
                  </Field>
                </StepShell>
              )}

              {/* Step 5: Compliance (Outbound/One-Ring only) */}
              {step === 4 && (
                <StepShell
                  title="Compliance Settings"
                  description="Configure local calling rules, DNC registers, and safety filters."
                >
                  <div className="space-y-3">
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
                      <Field label="Complaint Threshold (%)">
                        <TextInput
                          value={form.complaintThreshold}
                          onChange={(e) => update("complaintThreshold", e.target.value)}
                        />
                      </Field>
                    )}
                    {isOneRing && (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
                        <strong>One-Ring mode:</strong> rings each number for ~{form.ringDuration}s then hangs up. Review local
                        telemarketing laws before launching.
                      </div>
                    )}
                  </div>
                </StepShell>
              )}

              {/* Step 6: Review */}
              {step === 5 && (
                <StepShell
                  title="Review & Confirm"
                  description="Double-check your configurations before launching the campaign."
                >
                  <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <span className="text-muted-foreground block text-xs">Campaign Name</span>
                        <span className="font-semibold text-foreground">{form.name || "Untitled Campaign"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">AI Agent</span>
                        <span className="font-semibold text-foreground">{form.agent || "Not Selected"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Call Mode</span>
                        <span className="font-semibold text-foreground capitalize">{mode}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Phone Number</span>
                        <span className="font-semibold text-foreground">{form.phone || "Not Selected"}</span>
                      </div>
                      {isOutbound && (
                        <>
                          <div>
                            <span className="text-muted-foreground block text-xs">Contact List</span>
                            <span className="font-semibold text-foreground">{form.list || "Not Selected"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">Schedule</span>
                            <span className="font-semibold text-foreground">{form.schedule || "Immediately"}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-border pt-3">
                      <span className="text-muted-foreground block text-xs">Greeting Preview</span>
                      <p className="text-foreground italic mt-1 leading-relaxed">
                        "{form.greeting || "No opening greeting configured."}"
                      </p>
                    </div>

                    {isOneRing && (
                      <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-3 text-[11px] text-amber-800">
                        Configured as <strong>One-Ring Mode</strong> with a {form.ringDuration}s ring duration.
                      </div>
                    )}
                  </div>
                </StepShell>
              )}
            </div>

            {/* Bottom nav bar */}
            <div className="border-t border-border p-6 flex justify-between bg-card shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={step === 0 ? () => onOpenChange(false) : handleBack}
                className="rounded-xl h-11 px-5 border-border"
              >
                {step === 0 ? "Cancel" : "Back"}
              </Button>

              {step === STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleCreate}
                  className="rounded-xl h-11 px-6 gradient-mint text-ink font-semibold shadow-glow hover:opacity-90 active:scale-95 transition-all"
                >
                  Create Campaign
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl h-11 px-6 gradient-mint text-ink font-semibold shadow-glow hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  Continue <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
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
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/10 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors shrink-0 outline-none",
          checked ? "gradient-mint shadow-glow" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-all",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
