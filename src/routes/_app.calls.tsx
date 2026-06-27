import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Filter, PhoneIncoming, PhoneOutgoing, Smile, Meh, Frown, Radio, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui-kit";
import { useScopedList, useWorkspace } from "@/lib/workspace-context";
import { defaultCalls, type Call } from "@/lib/mock-data";
import { CallDetailDialog } from "@/components/calls/call-detail-dialog";
import { useState } from "react";

export const Route = createFileRoute("/_app/calls")({
  head: () => ({ meta: [{ title: "Calls — Tunis Agent Ai" }] }),
  component: CallsPage,
});

const sentimentIcon = { pos: <Smile className="size-4 text-emerald-500" />, neu: <Meh className="size-4 text-amber-500" />, neg: <Frown className="size-4 text-rose-500" /> } as const;

function CallsPage() {
  const { workspace } = useWorkspace();
  const [calls] = useScopedList<Call>("calls", defaultCalls);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calls</h1>
          <p className="text-muted-foreground mt-1 text-sm">Browse live and historical conversations.</p>
        </div>
        <Link to="/calls/live">
          <Button className="rounded-xl h-11 gradient-mint text-ink font-semibold shadow-glow hover:opacity-90">
            <Radio className="size-4 mr-1.5" strokeWidth={2.5} /> Monitor Live
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Live Now", v: "7", c: "text-mint" },
          { l: "Today's Calls", v: "412" },
          { l: "Connected", v: "318" },
          { l: "Avg Duration", v: "2:48" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`text-2xl font-bold mt-1.5 ${s.c ?? ""}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {calls.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/20 p-12 text-center">
          <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow">
            <PhoneCall className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-lg">No calls in {workspace.name} yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Call history will appear here once your agents start dialing.
          </p>
        </div>
      ) : (
      <>
        <div className="rounded-2xl bg-card border border-border shadow-card p-5 flex flex-wrap gap-3 items-center">
          <TextInput
            placeholder="Search by contact, campaign or call ID…"
            leftIcon={<Search className="size-4" />}
            className="flex-1 min-w-[240px]"
          />
          <Button variant="outline" className="rounded-xl h-10 border-border"><Filter className="size-4 mr-1.5" /> Filters</Button>
        </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              {["Contact", "Campaign", "Agent", "Duration", "Sentiment", "Lead Score", "Outcome", "Date"].map((h) => (
                <th key={h} className="px-5 py-3.5 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calls.map((c) => (
              <tr 
                key={c.id} 
                onClick={() => { setSelectedCall(c); setDetailOpen(true); }}
                className="border-t border-border hover:bg-mint-soft/30 cursor-pointer transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 shrink-0 rounded-lg grid place-items-center ${c.dir === "in" ? "bg-mint-soft text-mint" : "bg-blue-50 text-blue-600"}`}>
                      {c.dir === "in" ? <PhoneIncoming className="size-4 shrink-0" /> : <PhoneOutgoing className="size-4 shrink-0" />}
                    </div>
                    <div>
                      <div className="font-medium">{c.contact}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">{c.campaign}</td>
                <td className="px-5 py-4">{c.agent}</td>
                <td className="px-5 py-4 tabular-nums">{c.duration}</td>
                <td className="px-5 py-4">{sentimentIcon[c.sentiment as keyof typeof sentimentIcon]}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-mint" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums">{c.score}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{c.outcome}</td>
                <td className="px-5 py-4 text-muted-foreground">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      )}

      <CallDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        call={selectedCall}
      />
    </div>
  );
}
