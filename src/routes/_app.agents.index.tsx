import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Bot, Languages, Mic2, PhoneCall, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/mock-data";
import { useScopedList, useWorkspace } from "@/lib/workspace-context";
import { NewAgentDialog } from "@/components/agents/new-agent-dialog";
import { LiveCallDialog } from "@/components/calls/live-call-dialog";

export const Route = createFileRoute("/_app/agents/")({
  head: () => ({ meta: [{ title: "My Agents — Tunis Agent Ai" }] }),
  component: AgentsPage,
});

function AgentsPage() {
  const [openNew, setOpenNew] = useState(false);
  const [openCall, setOpenCall] = useState(false);
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const [agents] = useScopedList<Agent>("agents");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="text-muted-foreground mt-1 text-sm">Design, voice and deploy your AI agents in minutes.</p>
        </div>
        <Button onClick={() => setOpenNew(true)} className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow transition-all hover:scale-[1.02]">
          <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> New Agent
        </Button>
      </header>

      {agents.length === 0 ? (
        <EmptyState
          workspaceName={workspace.name}
          onCreate={() => setOpenNew(true)}
        />
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {agents.map((a) => (
          <div
            key={a.id}
            onClick={() => navigate({ to: "/agents/$agentId", params: { agentId: a.id } })}
            className="group cursor-pointer rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-elevated hover:-translate-y-0.5 hover:border-mint/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-2xl gradient-mint grid place-items-center text-ink font-bold shadow-glow">
                <Bot className="size-6" />
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${a.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                <span className={`size-1.5 rounded-full ${a.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                {a.status === "active" ? "Active" : "Draft"}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold group-hover:text-mint-deep transition-colors">{a.name}</h3>
            <p className="text-sm text-muted-foreground">{a.type}</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground"><Mic2 className="size-3.5" /> {a.voice}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Languages className="size-3.5" /> {a.language}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground col-span-2"><PhoneCall className="size-3.5" /> {a.calls.toLocaleString()} calls handled</div>
            </div>

            <div className="flex gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
              <Button onClick={() => setOpenCall(true)} className="flex-1 rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                <PhoneCall className="size-3.5 mr-1.5" /> Test call
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate({ to: "/agents/$agentId", params: { agentId: a.id } })}
                className="rounded-xl border-border shrink-0"
              >
                <Sparkles className="size-4 shrink-0" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      )}

      <NewAgentDialog open={openNew} onOpenChange={setOpenNew} />
      <LiveCallDialog open={openCall} onOpenChange={setOpenCall} />
    </div>
  );
}

function EmptyState({ workspaceName, onCreate }: { workspaceName: string; onCreate: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/20 p-12 text-center">
      <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow">
        <Bot className="size-6" />
      </div>
      <h3 className="font-display font-semibold text-lg">No agents in {workspaceName} yet</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
        Agents are the AI personalities that run your calls. Create your first one to get started.
      </p>
      <Button onClick={onCreate} className="mt-5 rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow">
        <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Create your first agent
      </Button>
    </div>
  );
}
