import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, PhoneOff, Pause, ArrowRightLeft, AlertTriangle, Sparkles, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/calls/live")({
  head: () => ({ meta: [{ title: "Live Call — Tunis Agent Ai" }] }),
  component: LiveCallPage,
});

const messages = [
  { from: "agent", text: "Hi, this is Aria from Tunis Agent Ai. Is this a good time to chat for two minutes?", time: "00:04" },
  { from: "user", text: "Sure, what is this about?", time: "00:08" },
  { from: "agent", text: "I'm calling about your recent inquiry on our Professional plan. Would you like a quick walkthrough?", time: "00:14" },
  { from: "user", text: "Yes please, what's included?", time: "00:22" },
  { from: "agent", text: "Great. You'll get unlimited AI calling, CRM integrations and advanced analytics. Should I book a demo?", time: "00:31" },
];

function LiveCallPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Olivia Rhye · +1 (415) 555-0132</h1>
        </div>
        <div className="text-sm text-muted-foreground tabular-nums">Duration <span className="text-foreground font-semibold ml-1">00:42</span></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="flex items-end gap-1 h-32">
              {Array.from({ length: 60 }).map((_, i) => {
                const h = 20 + Math.abs(Math.sin(i * 0.6)) * 80;
                return <div key={i} className="flex-1 rounded-full gradient-mint" style={{ height: `${h}%` }} />;
              })}
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="outline" size="icon" className="size-12 rounded-full border-border"><Mic className="size-5" /></Button>
              <Button variant="outline" size="icon" className="size-12 rounded-full border-border"><Pause className="size-5" /></Button>
              <Button variant="outline" size="icon" className="size-12 rounded-full border-border"><ArrowRightLeft className="size-5" /></Button>
              <Button size="icon" className="size-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg"><PhoneOff className="size-6" /></Button>
              <Button variant="outline" size="icon" className="size-12 rounded-full border-border"><MicOff className="size-5" /></Button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <h2 className="font-semibold mb-4">Call Transcript</h2>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.from === "agent" ? "" : "flex-row-reverse"}`}>
                  <div className={`size-8 rounded-full grid place-items-center text-xs font-bold shrink-0 ${m.from === "agent" ? "gradient-mint text-ink" : "bg-muted"}`}>
                    {m.from === "agent" ? "AI" : "U"}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "agent" ? "bg-mint-soft" : "bg-muted"}`}>
                    <div>{m.text}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">{m.time}</div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <div className="size-8 rounded-full gradient-mint grid place-items-center text-xs font-bold text-ink">AI</div>
                <div className="bg-mint-soft rounded-2xl px-4 py-3 flex gap-1">
                  <span className="size-1.5 rounded-full bg-mint animate-pulse" />
                  <span className="size-1.5 rounded-full bg-mint animate-pulse [animation-delay:120ms]" />
                  <span className="size-1.5 rounded-full bg-mint animate-pulse [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="flex items-center gap-2 mb-4"><Sparkles className="size-4 text-mint" /><h2 className="font-semibold">Live Intelligence</h2></div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5"><span>Sentiment</span><span className="text-emerald-600 font-semibold inline-flex items-center gap-1"><Smile className="size-3.5" /> Positive</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-mint" style={{ width: "74%" }} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5"><span>Lead Score</span><span className="font-semibold text-foreground">86</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-mint" style={{ width: "86%" }} /></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Intent Detected</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Pricing", "Demo Request", "Decision Maker"].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-mint-soft text-mint border border-mint/30">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="flex items-center gap-2 mb-4"><AlertTriangle className="size-4 text-amber-500" /><h2 className="font-semibold">Alerts</h2></div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700">Customer mentioned competitor — opportunity to highlight differentiator.</div>
              <div className="rounded-xl border border-mint/30 bg-mint-soft p-3 text-mint">High-intent moment detected. Suggest closing for demo booking.</div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <h2 className="font-semibold mb-3">Recommended Actions</h2>
            <div className="space-y-2">
              {["Book Meeting", "Send Pricing Proposal", "Tag as Hot Lead"].map((a) => (
                <button key={a} className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-left hover:bg-mint-soft hover:border-mint/40 transition-all">{a}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
