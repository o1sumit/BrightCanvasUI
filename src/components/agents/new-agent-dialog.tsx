import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { voices, defaultHumanNumbers, type Agent, type HumanNumber } from "@/lib/mock-data";
import { useScopedList } from "@/lib/workspace-context";
import {
  Play,
  Pause,
  Check,
  ChevronLeft,
  ChevronRight,
  User2,
  Mic2,
  MessageSquareQuote,
  BookOpen,
  Wrench,
  Sparkles,
  UploadCloud,
  FileText,
  Globe,
  Link2,
  Trash2,
  Plus,
  Wand2,
  Bot,
  Volume2,
  Gauge,
  Clock,
  PhoneIncoming,
  PhoneOutgoing,
  CalendarClock,
  Mail,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemedSelect, TextInput, TextArea } from "@/components/ui-kit";

type Step = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };

const STEPS: Step[] = [
  { id: "basics", label: "Basics", icon: User2 },
  { id: "voice", label: "Voice", icon: Mic2 },
  { id: "prompt", label: "Greeting & Prompt", icon: MessageSquareQuote },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "tools", label: "Tools & Behavior", icon: Wrench },
  { id: "review", label: "Review", icon: Sparkles },
];

const TEMPLATES = [
  { id: "sales", name: "Outbound Sales", desc: "Qualifies leads and books meetings", icon: PhoneOutgoing },
  { id: "support", name: "Customer Support", desc: "Resolves tickets and FAQs", icon: PhoneIncoming },
  { id: "booking", name: "Appointment Booking", desc: "Schedules and confirms appointments", icon: CalendarClock },
  { id: "custom", name: "Start from scratch", desc: "Blank canvas, fully customizable", icon: Wand2 },
];

const DEFAULT_PROMPT = `# Identity
You are Nova, a friendly and professional AI sales assistant for Acme Inc.

# Goal
Qualify the lead by understanding their needs, then book a 15-min demo.

# Style
- Warm, concise, and curious
- Mirror the caller's tone
- Never invent product details — defer to the knowledge base

# Rules
1. Always greet by name if known.
2. Ask one question at a time.
3. If unsure, say "let me get back to you on that".`;

export function NewAgentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [voicePickerOpen, setVoicePickerOpen] = useState(false);
  const [agents, setAgents] = useScopedList<Agent>("agents");

  // form state (UI-only)
  const [name, setName] = useState("Nova Sales Agent");
  const [template, setTemplate] = useState("sales");
  const [voice, setVoice] = useState("Nova");
  const [language, setLanguage] = useState("English (US)");
  const [speed, setSpeed] = useState(1);
  const [greeting, setGreeting] = useState("Hi! This is Nova from Acme — do you have a quick minute to chat?");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [files, setFiles] = useState<{ name: string; size: string; type: "pdf" | "doc" | "txt" }[]>([
    { name: "Product-Overview.pdf", size: "1.2 MB", type: "pdf" },
  ]);
  const [urls, setUrls] = useState<string[]>(["https://acme.com/pricing"]);
  const [urlDraft, setUrlDraft] = useState("");
  const [tools, setTools] = useState<Record<string, boolean>>({
    transfer: false,
    schedule: true,
    email: false,
    crm: true,
  });
  const [humanNumbers] = useScopedList<HumanNumber>("humanNumbers", defaultHumanNumbers);
  const [transferNumber, setTransferNumber] = useState("");
  const [maxDuration, setMaxDuration] = useState(8);
  const [interruption, setInterruption] = useState(true);

  useEffect(() => {
    if (humanNumbers.length > 0 && !transferNumber) {
      setTransferNumber(humanNumbers[0].number);
    }
  }, [humanNumbers, transferNumber]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const isPlaying = playingVoice !== null;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const langCodeMap: Record<string, string> = {
    "English (US)": "en-US",
    "English (UK)": "en-GB",
    Spanish: "es-ES",
    French: "fr-FR",
    German: "de-DE",
    Hindi: "hi-IN",
  };

  const playPreview = (voiceToPlay?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const targetVoice = voiceToPlay || voice;

    if (playingVoice !== null) {
      synth.cancel();
      if (playingVoice === targetVoice) {
        setPlayingVoice(null);
        return;
      }
    }

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(
      `Hi! This is ${targetVoice}. Looking forward to chatting with you today.`,
    );
    const targetLang = langCodeMap[language] ?? "en-US";
    utter.lang = targetLang;
    utter.rate = speed;
    // Try to pick a matching voice; bias female-sounding for Nova/Aria, male for others
    const synthVoices = synth.getVoices();
    const langMatches = synthVoices.filter((v) => v.lang.toLowerCase().startsWith(targetLang.slice(0, 2)));
    const preferFemale = /nova|aria|luna|mia|sophia/i.test(targetVoice);
    const picked =
      langMatches.find((v) => (preferFemale ? /female|samantha|victoria|google.*us.*english/i.test(v.name) : /male|daniel|alex|google.*uk/i.test(v.name))) ||
      langMatches[0] ||
      synthVoices[0];
    if (picked) utter.voice = picked;
    utter.onend = () => setPlayingVoice(null);
    utter.onerror = () => setPlayingVoice(null);
    setPlayingVoice(targetVoice);
    synth.speak(utter);
  };

  const reset = () => setStep(0);
  const close = () => { onOpenChange(false); setTimeout(reset, 300); };
  const launch = () => {
    const newAgent: Agent = {
      id: `ag-${Date.now()}`,
      name: name || "Untitled Agent",
      type: template === "sales" ? "Sales Agent" : template === "support" ? "Support Agent" : template === "booking" ? "Booking Agent" : "Custom Agent",
      voice,
      language,
      calls: 0,
      status: "active",
      transferEnabled: tools.transfer,
      transferNumber: tools.transfer ? transferNumber : undefined,
    };
    setAgents([newAgent, ...agents]);
    close();
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onPickFiles = (list: FileList | null) => {
    if (!list) return;
    const mapped = Array.from(list).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      type: (f.name.split(".").pop() || "txt").toLowerCase() as "pdf" | "doc" | "txt",
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
        <DialogContent className="max-w-5xl p-0 rounded-3xl shadow-elevated overflow-hidden gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Agent</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-[640px]">
            {/* Sidebar stepper */}
            <aside className="hidden md:flex flex-col bg-mint-soft/40 border-r border-border p-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="size-9 rounded-xl gradient-mint grid place-items-center text-ink shadow-glow">
                  <Bot className="size-4.5" />
                </div>
                <div>
                  <div className="font-display font-semibold leading-tight">New Agent</div>
                  <div className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</div>
                </div>
              </div>

              <ol className="space-y-1">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < step;
                  const active = i === step;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => i <= step && setStep(i)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                          active && "bg-card shadow-card",
                          !active && done && "text-foreground hover:bg-card/60",
                          !active && !done && "text-muted-foreground cursor-not-allowed",
                        )}
                      >
                        <span className={cn(
                          "size-7 rounded-lg grid place-items-center transition-all shrink-0",
                          done && "bg-mint text-ink",
                          active && "gradient-mint text-ink shadow-glow",
                          !done && !active && "bg-muted text-muted-foreground",
                        )}>
                          {done ? <Check className="size-3.5" strokeWidth={3} /> : <Icon className="size-3.5" />}
                        </span>
                        <span className={cn("font-medium", active && "text-foreground")}>{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-auto pt-6">
                <div className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-mint-deep mb-1">
                    <Sparkles className="size-3.5" /> Pro tip
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Strong greetings and a focused goal in your prompt lift conversion by up to 28%.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main panel */}
            <section className="flex flex-col">
              <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 max-h-[680px]">
                {step === 0 && (
                  <StepShell
                    title="Let's start with the basics"
                    description="Give your agent a name and pick a starting template. You can customize everything later."
                  >
                    <Field label="Agent name" hint="Shown in dashboards and call logs">
                      <TextInput value={name} onChange={(e) => setName(e.target.value)} />
                    </Field>

                    <div>
                      <label className="block text-sm font-medium mb-2">Template</label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {TEMPLATES.map((t) => {
                          const Icon = t.icon;
                          const selected = template === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTemplate(t.id)}
                              className={cn(
                                "text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5",
                                selected ? "border-mint bg-mint-soft shadow-card" : "border-border bg-card hover:border-mint/50",
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div className={cn(
                                  "size-10 rounded-xl grid place-items-center transition-all",
                                  selected ? "gradient-mint text-ink shadow-glow" : "bg-muted text-foreground",
                                )}>
                                  <Icon className="size-5" />
                                </div>
                                {selected && <Check className="size-4 text-mint-deep" strokeWidth={3} />}
                              </div>
                              <div className="mt-3 font-semibold">{t.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </StepShell>
                )}

                {step === 1 && (
                  <StepShell
                    title="Pick a voice"
                    description="Choose a voice persona and language. You can preview each one before deciding."
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Voice">
                        <button onClick={() => setVoicePickerOpen(true)} className="input-base text-left flex items-center justify-between">
                          <span className="flex items-center gap-2"><Volume2 className="size-4 text-mint-deep" /> {voice}</span>
                          <span className="text-mint-deep text-xs font-medium">Change</span>
                        </button>
                      </Field>
                      <Field label="Language">
                        <ThemedSelect
                          value={language}
                          onChange={setLanguage}
                          options={[
                            { value: "English (US)", label: "English (US)" },
                            { value: "English (UK)", label: "English (UK)" },
                            { value: "Spanish", label: "Spanish" },
                            { value: "French", label: "French" },
                            { value: "German", label: "German" },
                            { value: "Hindi", label: "Hindi" },
                          ]}
                        />
                      </Field>
                    </div>

                    <Field label={`Speaking speed — ${speed.toFixed(2)}x`} hint="Slower for clarity, faster for energy">
                      <input
                        type="range" min={0.75} max={1.25} step={0.05}
                        value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full accent-[oklch(0.78_0.16_175)]"
                      />
                    </Field>

                    <div className="rounded-2xl border border-border bg-mint-soft/40 p-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playPreview()}
                        aria-label={isPlaying ? "Stop preview" : "Play preview"}
                        className="size-11 shrink-0 rounded-xl gradient-mint text-ink grid place-items-center shadow-glow hover:opacity-90 active:scale-95 transition-all"
                      >
                        {isPlaying ? (
                          <Pause className="size-4 shrink-0" fill="currentColor" />
                        ) : (
                          <Play className="size-4 shrink-0" fill="currentColor" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center gap-2">
                          Preview "{voice}"
                          {isPlaying && (
                            <span className="inline-flex items-end gap-0.5 h-3">
                              <span className="w-0.5 bg-mint-deep rounded-full animate-[soundbar_0.9s_ease-in-out_infinite]" style={{ height: "60%" }} />
                              <span className="w-0.5 bg-mint-deep rounded-full animate-[soundbar_0.9s_ease-in-out_infinite_0.15s]" style={{ height: "100%" }} />
                              <span className="w-0.5 bg-mint-deep rounded-full animate-[soundbar_0.9s_ease-in-out_infinite_0.3s]" style={{ height: "75%" }} />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">Hi! This is {voice} — looking forward to chatting with you today.</div>
                      </div>
                      <Gauge className="size-4 text-muted-foreground" />
                    </div>

                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell
                    title="Greeting & system prompt"
                    description="Define how the agent opens the call and how it should behave throughout."
                  >
                    <Field label="Opening greeting" hint="The first line the agent says when the call connects">
                      <div className="relative">
                        <TextArea
                          value={greeting}
                          onChange={(e) => setGreeting(e.target.value)}
                          className="pr-24"
                        />
                        <button className="absolute right-2 top-2 inline-flex items-center gap-1 text-xs font-medium text-mint-deep bg-mint-soft px-2.5 py-1 rounded-lg hover:bg-mint/20 transition-all">
                          <Wand2 className="size-3" /> AI rewrite
                        </button>
                      </div>
                    </Field>

                    <Field label="System prompt" hint="Markdown supported · variables like {{customer_name}} work">
                      <div className="rounded-xl border border-border bg-card overflow-hidden focus-within:border-mint focus-within:ring-4 focus-within:ring-mint/15 transition-all">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-mint-soft/40">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageSquareQuote className="size-3.5" />
                            <span className="font-medium text-foreground">prompt.md</span>
                            <span>·</span>
                            <span>{prompt.length} chars</span>
                          </div>
                          <button className="text-xs font-medium text-mint-deep inline-flex items-center gap-1 hover:underline">
                            <Wand2 className="size-3" /> Generate with AI
                          </button>
                        </div>
                        <TextArea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="w-full bg-transparent border-0 focus:ring-0 shadow-none p-4 font-mono text-[13px] leading-relaxed min-h-[260px] resize-y"
                          spellCheck={false}
                        />
                      </div>
                    </Field>

                    <div className="grid sm:grid-cols-3 gap-2">
                      {["Be more concise", "Add objection handling", "Add booking flow"].map((s) => (
                        <button key={s} className="rounded-xl border border-dashed border-border text-xs font-medium px-3 py-2 hover:border-mint hover:bg-mint-soft/60 hover:text-mint-deep transition-all">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell
                    title="Knowledge base"
                    description="Upload documents or link pages your agent can reference during the call."
                  >
                    <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => onPickFiles(e.target.files)} />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-2xl border-2 border-dashed border-border bg-mint-soft/30 hover:border-mint hover:bg-mint-soft/60 transition-all p-8 grid place-items-center text-center"
                    >
                      <div className="size-12 rounded-2xl gradient-mint grid place-items-center text-ink shadow-glow mb-3">
                        <UploadCloud className="size-5" />
                      </div>
                      <div className="font-semibold">Drop files or click to upload</div>
                      <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, MD · up to 20 MB each</div>
                    </button>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documents</div>
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                            <div className="size-9 shrink-0 rounded-lg bg-mint-soft text-mint-deep grid place-items-center">
                              <FileText className="size-4 shrink-0" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{f.name}</div>
                              <div className="text-xs text-muted-foreground">{f.size} · indexed</div>
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
                            <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all">
                              <Trash2 className="size-4 shrink-0" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="size-4 text-mint-deep" />
                        <div className="font-semibold text-sm">Crawl a website</div>
                      </div>
                      <div className="flex gap-2">
                        <TextInput
                          value={urlDraft}
                          onChange={(e) => setUrlDraft(e.target.value)}
                          placeholder="https://docs.yourcompany.com"
                          leftIcon={<Link2 className="size-4" />}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => { if (urlDraft.trim()) { setUrls((p) => [...p, urlDraft.trim()]); setUrlDraft(""); } }}
                          className="rounded-xl gradient-mint text-ink font-semibold shadow-glow hover:opacity-90"
                        >
                          <Plus className="size-4 mr-1" /> Add
                        </Button>
                      </div>
                      {urls.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {urls.map((u, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 bg-mint-soft/40">
                              <Globe className="size-3.5 text-mint-deep shrink-0" />
                              <span className="flex-1 truncate">{u}</span>
                              <button onClick={() => setUrls((p) => p.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-rose-600">
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </StepShell>
                )}

                {step === 4 && (
                  <StepShell
                    title="Tools & behavior"
                    description="Enable real-world actions your agent can take and tune call behavior."
                  >
                    <div>
                      <div className="text-sm font-medium mb-2">Tools the agent can use</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <ToolToggle id="transfer" icon={PhoneOutgoing} title="Transfer to human" desc="Hand off to a live agent when needed" tools={tools} setTools={setTools} />
                        <ToolToggle id="schedule" icon={CalendarClock} title="Schedule meeting" desc="Book on connected calendar" tools={tools} setTools={setTools} />
                        <ToolToggle id="email" icon={Mail} title="Send follow-up email" desc="Trigger templated email after call" tools={tools} setTools={setTools} />
                        <ToolToggle id="crm" icon={Database} title="Update CRM record" desc="Log call notes to your CRM" tools={tools} setTools={setTools} />
                      </div>
                    </div>

                    {tools.transfer && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Field label="Human transfer destination" hint="Select the phone number to forward calls to.">
                          <ThemedSelect
                            value={transferNumber}
                            onChange={setTransferNumber}
                            options={humanNumbers.map((hn) => ({
                              value: hn.number,
                              label: `${hn.name} (${hn.number}) - ${hn.label}`,
                            }))}
                          />
                        </Field>
                      </div>
                    )}

                    <Field label={`Max call duration — ${maxDuration} min`} hint="Auto-ends the call if exceeded">
                      <input
                        type="range" min={2} max={20} step={1}
                        value={maxDuration} onChange={(e) => setMaxDuration(Number(e.target.value))}
                        className="w-full accent-[oklch(0.78_0.16_175)]"
                      />
                    </Field>

                    <label className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-mint-soft text-mint-deep grid place-items-center">
                          <Clock className="size-4.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Allow interruptions</div>
                          <div className="text-xs text-muted-foreground">Agent pauses when the caller starts speaking</div>
                        </div>
                      </div>
                      <Switch checked={interruption} onChange={setInterruption} />
                    </label>
                  </StepShell>
                )}

                {step === 5 && (
                  <StepShell
                    title="Review & launch"
                    description="Double-check your agent. You can edit anything from its profile after launch."
                  >
                    <div className="rounded-2xl border border-border bg-gradient-to-br from-mint-soft/60 to-card p-5 flex items-center gap-4">
                      <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink shadow-glow">
                        <Bot className="size-7" />
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-xl font-semibold">{name}</div>
                        <div className="text-sm text-muted-foreground">{TEMPLATES.find((t) => t.id === template)?.name} · {voice} · {language}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" /> Ready to launch
                      </span>
                    </div>

                    <ReviewRow label="Greeting" value={greeting} />
                    <ReviewRow label="Prompt" value={`${prompt.slice(0, 140)}${prompt.length > 140 ? "…" : ""}`} mono />
                    <ReviewRow label="Knowledge" value={`${files.length} docs · ${urls.length} URLs`} />
                    <ReviewRow label="Tools" value={Object.entries(tools).filter(([, v]) => v).map(([k]) => k).join(", ") || "None"} />
                    <ReviewRow label="Max duration" value={`${maxDuration} min · interruptions ${interruption ? "on" : "off"}`} />
                  </StepShell>
                )}
              </div>

              {/* Footer */}
              <footer className="border-t border-border px-6 md:px-10 py-4 flex items-center justify-between bg-card">
                <Button variant="ghost" onClick={close} className="rounded-xl text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <Button variant="outline" onClick={back} className="rounded-xl">
                      <ChevronLeft className="size-4 mr-1" /> Back
                    </Button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <Button onClick={next} className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                      Continue <ChevronRight className="size-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={launch} className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                      <Sparkles className="size-4 mr-1.5" /> Launch agent
                    </Button>
                  )}
                </div>
              </footer>
            </section>
          </div>

          
        </DialogContent>
      </Dialog>

      <VoiceSelectDialog
        open={voicePickerOpen}
        onOpenChange={setVoicePickerOpen}
        selected={voice}
        onSelect={(v) => setVoice(v)}
        playingVoice={playingVoice}
        onPlayPreview={playPreview}
      />
    </>
  );
}

function StepShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="block text-sm font-medium">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ToolToggle({
  id, icon: Icon, title, desc, tools, setTools,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tools: Record<string, boolean>;
  setTools: (u: (p: Record<string, boolean>) => Record<string, boolean>) => void;
}) {
  const on = !!tools[id];
  return (
    <label className={cn(
      "flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all",
      on ? "border-mint bg-mint-soft shadow-card" : "border-border bg-card hover:border-mint/50",
    )}>
      <div className={cn(
        "size-10 rounded-xl grid place-items-center shrink-0 transition-all",
        on ? "gradient-mint text-ink shadow-glow" : "bg-muted text-foreground",
      )}>
        <Icon className="size-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <Switch checked={on} onChange={(v) => setTools((p) => ({ ...p, [id]: v }))} />
    </label>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors shrink-0",
        checked ? "bg-mint" : "bg-muted",
      )}
    >
      <span className={cn(
        "absolute top-0.5 size-5 rounded-full bg-white shadow-card transition-all",
        checked ? "left-[22px]" : "left-0.5",
      )} />
    </button>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-border last:border-0">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("text-sm", mono && "font-mono text-[13px]")}>{value}</div>
    </div>
  );
}

export function VoiceSelectDialog({
  open,
  onOpenChange,
  selected,
  onSelect,
  playingVoice,
  onPlayPreview,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  selected: string;
  onSelect: (v: string) => void;
  playingVoice: string | null;
  onPlayPreview: (v: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl shadow-elevated">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Choose your voice</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {voices.map((v) => (
            <div
              key={v}
              onClick={() => onSelect(v)}
              className={cn(
                "flex items-center justify-between rounded-2xl border h-14 px-4 transition-all hover:border-mint hover:shadow-card group cursor-pointer",
                selected === v ? "border-mint bg-mint-soft" : "border-border bg-card",
              )}
            >
              <span className="font-medium">{v}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPreview(v);
                }}
                className="size-8 rounded-full bg-mint/10 flex items-center justify-center text-mint-deep group-hover:gradient-mint group-hover:text-ink transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                {playingVoice === v ? (
                  <Pause className="size-3.5" fill="currentColor" />
                ) : (
                  <Play className="size-3.5" fill="currentColor" />
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-xl gradient-mint text-ink font-semibold shadow-glow hover:opacity-90 px-6 h-10 flex items-center justify-center"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
