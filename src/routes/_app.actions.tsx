import { createFileRoute } from "@tanstack/react-router";
import { Plus, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actions } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/actions")({
  head: () => ({ meta: [{ title: "Actions — Tunis Agent Ai" }] }),
  component: ActionsPage,
});

function ActionsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Automate what happens after a call — booking, SMS, handoffs and more.</p>
        </div>
        <Button className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
          <Plus className="size-4 mr-1.5" /> New Action
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {actions.map((a) => (
          <div key={a.id} className="rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all">
            <div className="size-11 rounded-xl bg-mint-soft grid place-items-center text-mint-deep mb-3"><Zap className="size-5" /></div>
            <h3 className="font-display font-semibold text-lg">{a.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">Trigger: {a.trigger}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
              <Activity className="size-3.5" /> {a.uses.toLocaleString()} runs this month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
