import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importLists } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/lists")({
  head: () => ({ meta: [{ title: "Import Lists — Tunis Agent Ai" }] }),
  component: ListsPage,
});

function ListsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Lists</h1>
          <p className="text-muted-foreground mt-1 text-sm">Upload CSV contact lists to power your campaigns.</p>
        </div>
        <Button className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
          <Upload className="size-4 mr-1.5" /> Upload List
        </Button>
      </header>

      <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/30 p-10 text-center hover:bg-mint-soft/50 transition-colors cursor-pointer">
        <div className="size-14 shrink-0 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow"><Upload className="size-6 shrink-0" /></div>
        <h3 className="font-display font-semibold text-lg">Drop your CSV here</h3>
        <p className="text-sm text-muted-foreground mt-1">or click to browse — up to 50k contacts per file</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {importLists.map((l) => (
          <div key={l.id} className="rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="size-11 shrink-0 rounded-xl bg-mint-soft grid place-items-center text-mint-deep"><FileSpreadsheet className="size-5 shrink-0" /></div>
              {l.status === "ready" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1"><CheckCircle2 className="size-3 shrink-0" /> Ready</span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1"><Loader2 className="size-3 shrink-0 animate-spin" /> Processing</span>
              )}
            </div>
            <h3 className="font-display font-semibold">{l.name}</h3>
            <div className="text-sm text-muted-foreground mt-1">{l.rows.toLocaleString()} contacts · {l.uploadedAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
