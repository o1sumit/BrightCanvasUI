import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, FileSpreadsheet, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Tunis Agent Ai" }] }),
  component: AnalyticsPage,
});

const agentPerf = [
  { name: "Aria", calls: 1240, conv: 32, score: 91 },
  { name: "Milo", calls: 860, conv: 28, score: 84 },
  { name: "Luna", calls: 412, conv: 22, score: 76 },
  { name: "Kai", calls: 188, conv: 18, score: 71 },
];

function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Performance, outcomes and trends.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-10 border-border"><FileType className="size-4 mr-1.5" /> PDF</Button>
          <Button variant="outline" className="rounded-xl h-10 border-border"><FileSpreadsheet className="size-4 mr-1.5" /> Excel</Button>
          <Button variant="outline" className="rounded-xl h-10 border-border"><FileText className="size-4 mr-1.5" /> CSV</Button>
          <Button className="rounded-xl h-10 gradient-mint text-ink font-semibold shadow-glow"><Download className="size-4 mr-1.5" strokeWidth={2.5} /> Export</Button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Calls", v: "12,840" },
          { l: "Conversion", v: "31.2%" },
          { l: "Avg Sentiment", v: "+0.42" },
          { l: "Revenue Attributed", v: "$184.6k" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="text-2xl font-bold mt-1.5">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-card border border-border shadow-card p-6">
          <h2 className="font-semibold mb-5">Conversion Trend</h2>
          <svg viewBox="0 0 300 120" className="w-full h-40">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--mint)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--mint)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,90 C30,80 50,60 80,55 C110,50 130,75 160,60 C190,45 210,30 240,28 C260,26 280,18 300,15 L300,120 L0,120 Z" fill="url(#g)" />
            <path d="M0,90 C30,80 50,60 80,55 C110,50 130,75 160,60 C190,45 210,30 240,28 C260,26 280,18 300,15" fill="none" stroke="var(--mint)" strokeWidth="2" />
          </svg>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-card p-6">
          <h2 className="font-semibold mb-5">Call Outcomes</h2>
          <div className="space-y-3">
            {[
              { l: "Booked Meeting", v: 42 },
              { l: "Qualified", v: 28 },
              { l: "Follow Up", v: 18 },
              { l: "Voicemail", v: 8 },
              { l: "Not Interested", v: 4 },
            ].map((o) => (
              <div key={o.l}>
                <div className="flex justify-between text-sm mb-1"><span>{o.l}</span><span className="text-muted-foreground">{o.v}%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-mint" style={{ width: `${o.v * 2}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-semibold">Agent Performance</h2></div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              {["Agent", "Calls", "Conversion", "Quality Score", "Trend"].map((h) => <th key={h} className="px-5 py-3.5 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {agentPerf.map((a) => (
              <tr key={a.name} className="border-t border-border hover:bg-mint-soft/30 transition-colors">
                <td className="px-5 py-4 font-medium">{a.name}</td>
                <td className="px-5 py-4 tabular-nums">{a.calls.toLocaleString()}</td>
                <td className="px-5 py-4 tabular-nums">{a.conv}%</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-mint" style={{ width: `${a.score}%` }} /></div>
                    <span className="text-xs font-semibold tabular-nums">{a.score}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <svg viewBox="0 0 80 24" className="w-20 h-6"><polyline fill="none" stroke="var(--mint)" strokeWidth="2" points="0,18 12,14 24,16 36,10 48,12 60,6 72,8 80,4" /></svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
