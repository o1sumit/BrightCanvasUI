import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus, Phone, MapPin, Link2, Check, ChevronLeft, ChevronRight,
  Sparkles, Settings, Edit2, Trash2, Building2, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput, ThemedSelect } from "@/components/ui-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { phoneNumbers as defaultPhoneNumbers, agents as defaultAgents, type Agent } from "@/lib/mock-data";
import { useScopedList } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/phone-numbers")({
  head: () => ({ meta: [{ title: "Phone Numbers — Tunis Agent Ai" }] }),
  component: PhoneNumbersPage,
});

export interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  region: string;
  linked: string;
  provider: "twilio" | "vapi" | "telnyx";
  config: {
    accountSid?: string;
    authToken?: string;
    phoneSid?: string;
    phoneId?: string;
    apiKey?: string;
    connectionId?: string;
  };
}

const PROVIDERS = [
  { id: "twilio", name: "Twilio", desc: "Connect Twilio voice to provision and route SIP numbers.", icon: Phone },
  { id: "vapi", name: "Vapi", desc: "Integrate Vapi phone numbers for low-latency voice agents.", icon: Sparkles },
  { id: "telnyx", name: "Telnyx", desc: "Utilize Telnyx trunks for VoIP and SIP connections.", icon: Building2 },
] as const;

const STEPS = [
  { id: "provider", label: "Provider Selection", icon: Building2 },
  { id: "config", label: "Configuration", icon: Settings },
  { id: "review", label: "Review & Save", icon: Sparkles },
] as const;

function PhoneNumbersPage() {
  const [numbers, setNumbers] = useScopedList<PhoneNumber>("phoneNumbers", defaultPhoneNumbers as PhoneNumber[]);
  const [agents] = useScopedList<Agent>("agents", defaultAgents);

  // Add Wizard Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState<"twilio" | "vapi" | "telnyx">("twilio");
  const [numberInput, setNumberInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [regionInput, setRegionInput] = useState("United States");
  const [linkedAgent, setLinkedAgent] = useState("None");

  // Twilio configs
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioPhoneSid, setTwilioPhoneSid] = useState("");

  // Vapi configs
  const [vapiPhoneId, setVapiPhoneId] = useState("");
  const [vapiApiKey, setVapiApiKey] = useState("");

  // Telnyx configs
  const [telnyxApiKey, setTelnyxApiKey] = useState("");
  const [telnyxConnectionId, setTelnyxConnectionId] = useState("");

  // Edit Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNumberId, setEditingNumberId] = useState<string | null>(null);

  // Edit Inputs
  const [editNumber, setEditNumber] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editLinked, setEditLinked] = useState("");
  const [editProvider, setEditProvider] = useState<"twilio" | "vapi" | "telnyx">("twilio");
  const [editTwilioSid, setEditTwilioSid] = useState("");
  const [editTwilioToken, setEditTwilioToken] = useState("");
  const [editTwilioPhoneSid, setEditTwilioPhoneSid] = useState("");
  const [editVapiPhoneId, setEditVapiPhoneId] = useState("");
  const [editVapiApiKey, setEditVapiApiKey] = useState("");
  const [editTelnyxApiKey, setEditTelnyxApiKey] = useState("");
  const [editTelnyxConnectionId, setEditTelnyxConnectionId] = useState("");

  // Add Wizard handlers
  const handleOpenAdd = () => {
    setStep(0);
    setProvider("twilio");
    setNumberInput("");
    setLabelInput("");
    setRegionInput("United States");
    setLinkedAgent("None");
    setTwilioSid("");
    setTwilioToken("");
    setTwilioPhoneSid("");
    setVapiPhoneId("");
    setVapiApiKey("");
    setTelnyxApiKey("");
    setTelnyxConnectionId("");
    setAddModalOpen(true);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!numberInput.trim() || !labelInput.trim() || !regionInput.trim()) {
        alert("Please fill out the Phone Number, Label, and Region fields.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleCreate = () => {
    const config: PhoneNumber["config"] = {};
    if (provider === "twilio") {
      config.accountSid = twilioSid.trim();
      config.authToken = twilioToken.trim();
      config.phoneSid = twilioPhoneSid.trim();
    } else if (provider === "vapi") {
      config.phoneId = vapiPhoneId.trim();
      config.apiKey = vapiApiKey.trim();
    } else if (provider === "telnyx") {
      config.apiKey = telnyxApiKey.trim();
      config.connectionId = telnyxConnectionId.trim();
    }

    const newNumber: PhoneNumber = {
      id: `p-${Date.now()}`,
      number: numberInput.trim(),
      label: labelInput.trim(),
      region: regionInput.trim(),
      linked: linkedAgent,
      provider,
      config,
    };

    setNumbers([...numbers, newNumber]);
    setAddModalOpen(false);
  };

  // Edit Handlers
  const handleOpenEdit = (n: PhoneNumber) => {
    setEditingNumberId(n.id);
    setEditNumber(n.number);
    setEditLabel(n.label);
    setEditRegion(n.region);
    setEditLinked(n.linked);
    setEditProvider(n.provider);

    setEditTwilioSid(n.config?.accountSid ?? "");
    setEditTwilioToken(n.config?.authToken ?? "");
    setEditTwilioPhoneSid(n.config?.phoneSid ?? "");
    setEditVapiPhoneId(n.config?.phoneId ?? "");
    setEditVapiApiKey(n.config?.apiKey ?? "");
    setEditTelnyxApiKey(n.config?.apiKey ?? "");
    setEditTelnyxConnectionId(n.config?.connectionId ?? "");

    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNumberId) return;

    const config: PhoneNumber["config"] = {};
    if (editProvider === "twilio") {
      config.accountSid = editTwilioSid.trim();
      config.authToken = editTwilioToken.trim();
      config.phoneSid = editTwilioPhoneSid.trim();
    } else if (editProvider === "vapi") {
      config.phoneId = editVapiPhoneId.trim();
      config.apiKey = editVapiApiKey.trim();
    } else if (editProvider === "telnyx") {
      config.apiKey = editTelnyxApiKey.trim();
      config.connectionId = editTelnyxConnectionId.trim();
    }

    const updated = numbers.map(n => {
      if (n.id === editingNumberId) {
        return {
          ...n,
          number: editNumber.trim(),
          label: editLabel.trim(),
          region: editRegion.trim(),
          linked: editLinked,
          provider: editProvider,
          config,
        };
      }
      return n;
    });

    setNumbers(updated);
    setEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this phone number?")) {
      setNumbers(numbers.filter(n => n.id !== id));
      setEditModalOpen(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phone Numbers</h1>
          <p className="text-muted-foreground mt-1 text-sm">Provision and route phone numbers across your agents.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow transition-all hover:scale-[1.02]">
          <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Add Number
        </Button>
      </header>

      {numbers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/20 p-12 text-center">
          <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow">
            <Phone className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-lg">No phone numbers provisioned yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Add your telecom provider credentials to configure phone lines for your AI voice agents.
          </p>
          <Button onClick={handleOpenAdd} className="mt-5 rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow">
            <Plus className="size-4 mr-1.5" /> Add First Number
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {numbers.map((n) => {
            const providerInfo = PROVIDERS.find(p => p.id === n.provider);
            const ProviderIcon = providerInfo?.icon || Phone;

            return (
              <div key={n.id} className="group rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-elevated transition-all flex flex-col justify-between min-h-[170px]">
                <div>
                  <div className="flex items-start gap-3 mb-3 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-mint-soft text-mint-deep grid place-items-center shrink-0">
                        <ProviderIcon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-base truncate">{n.number}</div>
                        <div className="text-xs text-muted-foreground">{n.label}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenEdit(n)}
                      className="p-1.5 rounded-lg border border-border hover:border-mint hover:bg-mint-soft/30 hover:text-mint-deep text-muted-foreground transition-all cursor-pointer"
                      title="Edit Details"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground mt-4 border-t border-border/60 pt-3">
                    <div className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {n.region}</div>
                    <div className="flex items-center gap-1.5"><Link2 className="size-3.5" /> Linked to <span className="text-foreground font-medium">{n.linked}</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- DIALOGS ---- */}

      {/* 1. Add Phone Number Guided Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl gap-0 h-[560px] bg-card border border-border shadow-elevated">
          <div className="grid grid-cols-[240px_1fr] h-full">
            {/* Wizard Sidebar */}
            <aside className="border-r border-border p-6 flex flex-col justify-between bg-muted/20 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <div className="size-8 rounded-lg gradient-mint grid place-items-center text-ink shadow-glow">
                    <Phone className="size-4" />
                  </div>
                  <span className="font-display font-semibold text-sm">Add Number</span>
                </div>
                <ol className="space-y-4">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const done = i < step;
                    const active = i === step;
                    return (
                      <li key={s.id}>
                        <div className={cn(
                          "flex items-center gap-3 text-sm font-medium",
                          active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/55"
                        )}>
                          <span className={cn(
                            "size-7 rounded-lg grid place-items-center transition-all shrink-0",
                            done && "bg-mint text-ink",
                            active && "gradient-mint text-ink shadow-glow",
                            !done && !active && "bg-muted text-muted-foreground",
                          )}>
                            {done ? <Check className="size-3.5" strokeWidth={3} /> : <Icon className="size-3.5" />}
                          </span>
                          <span>{s.label}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">Step {step + 1} of 3</div>
            </aside>

            {/* Wizard Content */}
            <section className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {step === 0 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">Select Provider</h2>
                      <p className="text-sm text-muted-foreground mt-1">Choose the telecom gateway provider for this number.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {PROVIDERS.map((p) => {
                        const Icon = p.icon;
                        const selected = provider === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setProvider(p.id)}
                            className={cn(
                              "text-left flex items-start gap-4 p-4 rounded-2xl border transition-all hover:bg-muted/40",
                              selected ? "border-mint bg-mint-soft shadow-card" : "border-border bg-card"
                            )}
                          >
                            <div className={cn(
                              "size-10 rounded-xl grid place-items-center transition-all shrink-0",
                              selected ? "gradient-mint text-ink shadow-glow" : "bg-muted text-foreground",
                            )}>
                              <Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm flex items-center justify-between">
                                {p.name}
                                {selected && <Check className="size-4 text-mint-deep shrink-0" strokeWidth={3} />}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">Configuration</h2>
                      <p className="text-sm text-muted-foreground mt-1">Input the phone number details and provider credentials.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number</label>
                        <TextInput 
                          value={numberInput}
                          onChange={(e) => setNumberInput(e.target.value)}
                          placeholder="e.g. +1 555-0100" 
                          required
                          className="rounded-xl border-border h-10 bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Friendly Label</label>
                        <TextInput 
                          value={labelInput}
                          onChange={(e) => setLabelInput(e.target.value)}
                          placeholder="e.g. Primary Support Line" 
                          required
                          className="rounded-xl border-border h-10 bg-background"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Region/Country</label>
                        <TextInput 
                          value={regionInput}
                          onChange={(e) => setRegionInput(e.target.value)}
                          placeholder="e.g. United States" 
                          required
                          className="rounded-xl border-border h-10 bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Linked Agent</label>
                        <ThemedSelect
                          value={linkedAgent}
                          onChange={setLinkedAgent}
                          options={[
                            { value: "None", label: "None (Unassigned)" },
                            ...agents.map(a => ({ value: a.name, label: a.name }))
                          ]}
                        />
                      </div>
                    </div>

                    {/* Provider specifics */}
                    <div className="border-t border-border pt-3 mt-2 space-y-3">
                      <span className="block text-xs font-bold text-mint-deep uppercase tracking-wider">{provider} credentials</span>
                      
                      {provider === "twilio" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Account SID</label>
                            <TextInput 
                              value={twilioSid}
                              onChange={(e) => setTwilioSid(e.target.value)}
                              placeholder="AC..." 
                              className="rounded-xl border-border h-9"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Auth Token</label>
                              <TextInput 
                                value={twilioToken}
                                onChange={(e) => setTwilioToken(e.target.value)}
                                placeholder="Token" 
                                type="password"
                                className="rounded-xl border-border h-9"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number SID</label>
                              <TextInput 
                                value={twilioPhoneSid}
                                onChange={(e) => setTwilioPhoneSid(e.target.value)}
                                placeholder="PN..." 
                                className="rounded-xl border-border h-9"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {provider === "vapi" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number ID</label>
                            <TextInput 
                              value={vapiPhoneId}
                              onChange={(e) => setVapiPhoneId(e.target.value)}
                              placeholder="Vapi phone ID" 
                              className="rounded-xl border-border h-9"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Vapi API Key</label>
                            <TextInput 
                              value={vapiApiKey}
                              onChange={(e) => setVapiApiKey(e.target.value)}
                              placeholder="Vapi Key" 
                              type="password"
                              className="rounded-xl border-border h-9"
                            />
                          </div>
                        </div>
                      )}

                      {provider === "telnyx" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Telnyx API Key</label>
                            <TextInput 
                              value={telnyxApiKey}
                              onChange={(e) => setTelnyxApiKey(e.target.value)}
                              placeholder="Telnyx Key" 
                              type="password"
                              className="rounded-xl border-border h-9"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Connection ID</label>
                            <TextInput 
                              value={telnyxConnectionId}
                              onChange={(e) => setTelnyxConnectionId(e.target.value)}
                              placeholder="Telnyx connection ID" 
                              className="rounded-xl border-border h-9"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">Review & Confirmation</h2>
                      <p className="text-sm text-muted-foreground mt-1">Review your phone line configuration details before finalizing.</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-gradient-to-br from-mint-soft/60 to-card p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl gradient-mint grid place-items-center text-ink shadow-glow">
                          <Phone className="size-6" />
                        </div>
                        <div>
                          <div className="font-display font-semibold text-lg">{numberInput}</div>
                          <div className="text-xs text-muted-foreground">{labelInput} · {regionInput}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-border/60 pt-3">
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Provider</span>
                          <span className="font-semibold uppercase text-mint-deep">{provider}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Linked Agent</span>
                          <span className="font-semibold">{linkedAgent}</span>
                        </div>

                        {provider === "twilio" && (
                          <>
                            <div className="flex justify-between py-1 border-b border-border/40 col-span-2">
                              <span className="text-muted-foreground">Account SID</span>
                              <span className="font-mono text-xs">{twilioSid.slice(0,8)}...</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-border/40 col-span-2">
                              <span className="text-muted-foreground">Auth Token</span>
                              <span className="font-mono text-xs">••••••••••••</span>
                            </div>
                          </>
                        )}

                        {provider === "vapi" && (
                          <>
                            <div className="flex justify-between py-1 border-b border-border/40 col-span-2">
                              <span className="text-muted-foreground">Phone ID</span>
                              <span className="font-mono text-xs">{vapiPhoneId.slice(0,8)}...</span>
                            </div>
                          </>
                        )}

                        {provider === "telnyx" && (
                          <>
                            <div className="flex justify-between py-1 border-b border-border/40 col-span-2">
                              <span className="text-muted-foreground">Connection ID</span>
                              <span className="font-mono text-xs">{telnyxConnectionId.slice(0,8)}...</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer */}
              <footer className="border-t border-border px-8 py-4 flex items-center justify-between bg-card mt-auto">
                <Button variant="ghost" onClick={() => setAddModalOpen(false)} className="rounded-xl text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <Button variant="outline" onClick={handleBack} className="rounded-xl h-10">
                      <ChevronLeft className="size-4 mr-1" /> Back
                    </Button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <Button onClick={handleNext} className="rounded-xl h-10 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                      Continue <ChevronRight className="size-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleCreate} className="rounded-xl h-10 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                      Create Phone Number
                    </Button>
                  )}
                </div>
              </footer>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Edit Phone Number Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border border-border shadow-elevated">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <Settings className="size-5 text-mint-deep" /> Edit Phone Line Details
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
              <TextInput 
                value={editNumber}
                onChange={(e) => setEditNumber(e.target.value)}
                placeholder="e.g. +1 555-0100" 
                required
                className="rounded-xl border-border bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Friendly Label</label>
                <TextInput 
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="e.g. Sales Line" 
                  required
                  className="rounded-xl border-border bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Region/Country</label>
                <TextInput 
                  value={editRegion}
                  onChange={(e) => setEditRegion(e.target.value)}
                  placeholder="e.g. United Kingdom" 
                  required
                  className="rounded-xl border-border bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Provider</label>
                <ThemedSelect
                  value={editProvider}
                  onChange={(v) => setEditProvider(v as "twilio" | "vapi" | "telnyx")}
                  options={[
                    { value: "twilio", label: "Twilio" },
                    { value: "vapi", label: "Vapi" },
                    { value: "telnyx", label: "Telnyx" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Linked Agent</label>
                <ThemedSelect
                  value={editLinked}
                  onChange={setEditLinked}
                  options={[
                    { value: "None", label: "None" },
                    ...agents.map(a => ({ value: a.name, label: a.name }))
                  ]}
                />
              </div>
            </div>

            {/* Provider spec inputs */}
            <div className="border-t border-border pt-3 mt-2 space-y-3 bg-muted/20 p-3.5 rounded-xl border">
              <span className="block text-xs font-bold text-mint-deep uppercase tracking-wider">{editProvider} credentials</span>
              
              {editProvider === "twilio" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Account SID</label>
                    <TextInput 
                      value={editTwilioSid}
                      onChange={(e) => setEditTwilioSid(e.target.value)}
                      placeholder="AC..." 
                      className="rounded-xl border-border h-9 bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Auth Token</label>
                      <TextInput 
                        value={editTwilioToken}
                        onChange={(e) => setEditTwilioToken(e.target.value)}
                        placeholder="Token" 
                        type="password"
                        className="rounded-xl border-border h-9 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone SID</label>
                      <TextInput 
                        value={editTwilioPhoneSid}
                        onChange={(e) => setEditTwilioPhoneSid(e.target.value)}
                        placeholder="PN..." 
                        className="rounded-xl border-border h-9 bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editProvider === "vapi" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone ID</label>
                    <TextInput 
                      value={editVapiPhoneId}
                      onChange={(e) => setEditVapiPhoneId(e.target.value)}
                      placeholder="Phone ID" 
                      className="rounded-xl border-border h-9 bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">API Key</label>
                    <TextInput 
                      value={editVapiApiKey}
                      onChange={(e) => setEditVapiApiKey(e.target.value)}
                      placeholder="API Key" 
                      type="password"
                      className="rounded-xl border-border h-9 bg-background"
                    />
                  </div>
                </div>
              )}

              {editProvider === "telnyx" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">API Key</label>
                    <TextInput 
                      value={editTelnyxApiKey}
                      onChange={(e) => setEditTelnyxApiKey(e.target.value)}
                      placeholder="API Key" 
                      type="password"
                      className="rounded-xl border-border h-9 bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Connection ID</label>
                    <TextInput 
                      value={editTelnyxConnectionId}
                      onChange={(e) => setEditTelnyxConnectionId(e.target.value)}
                      placeholder="Connection ID" 
                      className="rounded-xl border-border h-9 bg-background"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => editingNumberId && handleDelete(editingNumberId)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="size-3.5" /> Delete number
              </button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditModalOpen(false)} className="rounded-xl text-xs h-9">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow text-xs h-9 px-4">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
