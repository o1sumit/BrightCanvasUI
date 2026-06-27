import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Bot, PhoneCall, Save, Trash2, Sparkles, Mic2, Languages,
  MessageSquareQuote, Wand2, Volume2, Play, Gauge, BookOpen, Wrench,
  UploadCloud, FileText, Globe, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { agents as defaultAgents, voices, type Agent } from "@/lib/mock-data";
import { LiveCallDialog } from "@/components/calls/live-call-dialog";
import { useScopedList } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";
import { ThemedSelect } from "@/components/ui-kit";

export const Route = createFileRoute("/_app/agents/$agentId")({
  head: () => ({ meta: [{ title: "Agent Details — Tunis Agent Ai" }] }),
  component: AgentDetailPage,
});

const DEFAULT_PROMPT = `# Identity
You are a friendly and professional AI assistant.

# Goal
Engage the caller, understand their need, and guide them to the next step.

# Style
- Warm, concise, curious
- Mirror the caller's tone
- Defer to the knowledge base for facts

# Rules
1. Greet by name when known.
2. Ask one question at a time.
3. Confirm before booking or sending anything.`;

const TABS = [
  { id: "basics", label: "Basics", icon: Bot },
  { id: "voice", label: "Voice", icon: Mic2 },
  { id: "prompt", label: "Prompt", icon: MessageSquareQuote },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "tools", label: "Tools", icon: Wrench },
] as const;

function AgentDetailPage() {
  const { agentId } = Route.useParams();
  const navigate = useNavigate();
  const [agentsList, setAgentsList] = useScopedList<Agent>("agents", defaultAgents);
  const agent = useMemo(() => agentsList.find((a) => a.id === agentId), [agentsList, agentId]);

  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("basics");
  const [openCall, setOpenCall] = useState(false);

  const [name, setName] = useState(agent?.name ?? "");
  const [type, setType] = useState(agent?.type ?? "Sales Agent");
  const [status, setStatus] = useState<"active" | "draft">(agent?.status ?? "draft");
  const [voice, setVoice] = useState(agent?.voice ?? "Nova");
  const [language, setLanguage] = useState(agent?.language ?? "English");
  const [speed, setSpeed] = useState(1);
  const [greeting, setGreeting] = useState(
    `Hi! This is ${agent?.name ?? "your assistant"} — do you have a quick minute to chat?`,
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([
    { name: "Product-Overview.pdf", size: "1.2 MB" },
  ]);
  const [urlDraft, setUrlDraft] = useState("");
  const [urls, setUrls] = useState<string[]>(["https://acme.com/pricing"]);
  const [tools, setTools] = useState<Record<string, boolean>>({
    transfer: true, schedule: true, email: false, crm: true,
  });
  const [maxDuration, setMaxDuration] = useState(8);
  const [interruption, setInterruption] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!agent) {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Agent not found</h1>
        <p className="text-muted-foreground">We couldn't find an agent with id "{agentId}".</p>
        <Link to="/agents"><Button variant="outline" className="rounded-xl"><ArrowLeft className="size-4 mr-1.5" /> Back to agents</Button></Link>
      </div>
    );
  }

  const handleSave = () => {
    const updatedList = agentsList.map((a) => {
      if (a.id === agentId) {
        return {
          ...a,
          name,
          type,
          status,
          voice,
          language,
        };
      }
      return a;
    });
    setAgentsList(updatedList);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const handleDelete = () => {
    const updatedList = agentsList.filter((a) => a.id !== agentId);
    setAgentsList(updatedList);
    navigate({ to: "/agents" });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/agents" })}
            className="size-10 rounded-xl border border-border bg-card grid place-items-center hover:border-mint hover:text-mint-deep transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="size-12 rounded-2xl gradient-mint grid place-items-center text-ink shadow-glow shrink-0">
            <Bot className="size-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight truncate">{name || "Untitled agent"}</h1>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
              )}>
                <span className={cn("size-1.5 rounded-full", status === "active" ? "bg-emerald-500" : "bg-amber-500")} />
                {status === "active" ? "Active" : "Draft"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{type} · {agent.calls.toLocaleString()} calls handled</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOpenCall(true)} className="rounded-xl h-11 px-4 border-border">
            <PhoneCall className="size-4 mr-1.5" /> Test call
          </Button>
          <Button onClick={handleSave} className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
            <Save className="size-4 mr-1.5" /> {saved ? "Saved!" : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-card border border-border shadow-card w-fit max-w-full overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all whitespace-nowrap",
                active ? "gradient-mint text-ink shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-mint-soft/60",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-5">
          {tab === "basics" && (
            <>
              <Field label="Agent name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-base" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Type">
                  <ThemedSelect
                    value={type}
                    onChange={setType}
                    options={[
                      { value: "Sales Agent", label: "Sales Agent" },
                      { value: "Support Agent", label: "Support Agent" },
                      { value: "Retention Agent", label: "Retention Agent" },
                      { value: "Research Agent", label: "Research Agent" },
                      { value: "Booking Agent", label: "Booking Agent" },
                    ]}
                  />
                </Field>
                <Field label="Status">
                  <ThemedSelect
                    value={status}
                    onChange={(v) => setStatus(v as "active" | "draft")}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "draft", label: "Draft" },
                    ]}
                  />
                </Field>
              </div>
            </>
          )}

          {tab === "voice" && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Voice">
                  <ThemedSelect
                    value={voice}
                    onChange={setVoice}
                    options={voices.map((v) => ({ value: v, label: v }))}
                  />
                </Field>
                <Field label="Language">
                  <ThemedSelect
                    value={language}
                    onChange={setLanguage}
                    options={[
                      { value: "English", label: "English" },
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
                <input type="range" min={0.75} max={1.25} step={0.05} value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-[oklch(0.78_0.16_175)]" />
              </Field>
              <div className="rounded-2xl border border-border bg-mint-soft/40 p-4 flex items-center gap-3">
                <button className="size-11 shrink-0 rounded-xl gradient-mint text-ink grid place-items-center shadow-glow hover:opacity-90 transition-all">
                  <Play className="size-4 shrink-0" fill="currentColor" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Preview "{voice}"</div>
                  <div className="text-xs text-muted-foreground truncate">Hi! This is {voice} — looking forward to chatting with you today.</div>
                </div>
                <Volume2 className="size-4 text-muted-foreground shrink-0" />
              </div>
            </>
          )}

          {tab === "prompt" && (
            <>
              <Field label="Opening greeting" hint="The first line the agent says when the call connects">
                <div className="relative">
                  <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)}
                    className="input-base !h-auto py-3 min-h-[88px] resize-y pr-24" />
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
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-transparent outline-none p-4 font-mono text-[13px] leading-relaxed min-h-[280px] resize-y"
                    spellCheck={false} />
                </div>
              </Field>
            </>
          )}

          {tab === "knowledge" && (
            <>
              <div className="w-full rounded-2xl border-2 border-dashed border-border bg-mint-soft/30 hover:border-mint hover:bg-mint-soft/60 transition-all p-8 grid place-items-center text-center">
                <div className="size-12 rounded-2xl gradient-mint grid place-items-center text-ink shadow-glow mb-3">
                  <UploadCloud className="size-5" />
                </div>
                <div className="font-semibold">Drop files or click to upload</div>
                <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, MD · up to 20 MB each</div>
              </div>

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
                  <input value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)}
                    placeholder="https://example.com/docs" className="input-base flex-1" />
                  <Button onClick={() => { if (urlDraft) { setUrls((p) => [...p, urlDraft]); setUrlDraft(""); } }}
                    className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
                {urls.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {urls.map((u, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Globe className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate flex-1">{u}</span>
                        <button onClick={() => setUrls((p) => p.filter((_, j) => j !== i))}
                          className="p-1 rounded text-muted-foreground hover:text-rose-600">
                          <Trash2 className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {tab === "tools" && (
            <>
              <div className="space-y-2">
                {[
                  { id: "transfer", label: "Transfer to human", desc: "Hand off when the caller asks for an agent" },
                  { id: "schedule", label: "Schedule meeting", desc: "Book a slot on the connected calendar" },
                  { id: "email", label: "Send email follow-up", desc: "Email a summary after the call" },
                  { id: "crm", label: "Sync to CRM", desc: "Push contact and call notes to your CRM" },
                ].map((t) => (
                  <label key={t.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 cursor-pointer hover:border-mint/50 transition-all">
                    <input type="checkbox" checked={tools[t.id]}
                      onChange={(e) => setTools((p) => ({ ...p, [t.id]: e.target.checked }))}
                      className="mt-1 size-4 accent-[oklch(0.78_0.16_175)]" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={`Max call duration — ${maxDuration} min`}>
                  <input type="range" min={1} max={30} value={maxDuration}
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                    className="w-full accent-[oklch(0.78_0.16_175)]" />
                </Field>
                <Field label="Allow user to interrupt">
                  <label className="flex items-center gap-2 input-base cursor-pointer">
                    <input type="checkbox" checked={interruption}
                      onChange={(e) => setInterruption(e.target.checked)}
                      className="size-4 accent-[oklch(0.78_0.16_175)]" />
                    <span className="text-sm">Yes, let the user cut in mid-response</span>
                  </label>
                </Field>
              </div>
            </>
          )}
        </div>

        {/* Side summary */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Summary</div>
            <dl className="space-y-2.5 text-sm">
              <SummaryRow icon={Bot} label="Type" value={type} />
              <SummaryRow icon={Mic2} label="Voice" value={voice} />
              <SummaryRow icon={Languages} label="Language" value={language} />
              <SummaryRow icon={Gauge} label="Speed" value={`${speed.toFixed(2)}x`} />
              <SummaryRow icon={PhoneCall} label="Calls" value={agent.calls.toLocaleString()} />
            </dl>
          </div>

          <div className="rounded-2xl border border-border p-5 bg-gradient-to-br from-mint-soft/60 to-card">
            <div className="flex items-center gap-2 text-xs font-semibold text-mint-deep mb-1.5">
              <Sparkles className="size-3.5" /> Pro tip
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Test your agent after each prompt change. Small tweaks to greeting wording often lift answer-rate by 10–20%.
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/40 hover:bg-rose-50 px-4 py-2.5 text-sm font-medium transition-all"
          >
            <Trash2 className="size-4" /> Delete agent
          </button>
        </aside>
      </div>

      <LiveCallDialog open={openCall} onOpenChange={setOpenCall} />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </dt>
      <dd className="font-medium truncate max-w-[60%] text-right">{value}</dd>
    </div>
  );
}
