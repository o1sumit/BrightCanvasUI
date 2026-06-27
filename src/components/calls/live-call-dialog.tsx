import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, Pause, ArrowLeftRight, PhoneOff } from "lucide-react";
import { transcript } from "@/lib/mock-data";

export function LiveCallDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded-3xl shadow-elevated p-0 overflow-hidden">
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="font-display text-2xl text-center">Live call & transcript</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 p-8 pt-4">
          {/* Call card */}
          <div className="rounded-3xl bg-gradient-to-br from-mint-soft to-card border border-border p-8 flex flex-col items-center text-center relative">
            <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-700 text-xs font-semibold px-3 py-1">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>

            {/* Waveform halo */}
            <div className="relative size-32 my-4">
              <div className="absolute inset-0 rounded-full gradient-mint animate-pulse opacity-30 blur-2xl" />
              <div className="relative size-32 rounded-full gradient-mint grid place-items-center text-ink text-2xl font-bold shadow-glow">HM</div>
            </div>

            <div className="font-display text-xl font-semibold">Nova — Sales Agent</div>
            <div className="text-muted-foreground text-sm mt-1">+1 548-5684-584</div>

            <div className="w-full mt-6">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[55%] gradient-mint" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>2:45</span><span>5:00</span>
              </div>
            </div>

            <div className="flex gap-3 mt-8 w-full justify-center">
              {[
                { icon: Mic, label: "Mute" },
                { icon: Pause, label: "Hold" },
                { icon: ArrowLeftRight, label: "Transfer" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-1 group">
                  <span className="size-12 shrink-0 rounded-2xl bg-card border border-border grid place-items-center group-hover:border-mint group-hover:shadow-card transition-all">
                    <Icon className="size-4 shrink-0" />
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </button>
              ))}
              <button onClick={() => onOpenChange(false)} className="flex flex-col items-center gap-1 group">
                <span className="size-12 shrink-0 rounded-2xl bg-rose-500 grid place-items-center group-hover:bg-rose-600 shadow-card transition-all">
                  <PhoneOff className="size-4 shrink-0 text-white" />
                </span>
                <span className="text-xs text-rose-600 font-medium">End</span>
              </button>
            </div>
          </div>

          {/* Transcript */}
          <div className="rounded-3xl border border-border bg-card flex flex-col max-h-[520px]">
            <div className="px-6 py-4 border-b border-border">
              <div className="font-display font-semibold">Transcript Chats</div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {transcript.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`size-8 shrink-0 rounded-full grid place-items-center text-xs font-semibold ${m.from === "user" ? "bg-emerald-500 text-white" : "gradient-mint text-ink"}`}>
                    {m.initials}
                  </div>
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "user" ? "bg-mint-soft text-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
