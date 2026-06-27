import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Bot, ArrowLeft } from "lucide-react";
import { isAuthenticated, getSession, signOut } from "@/lib/mock-auth";
import { createWorkspace, listWorkspaces, WORKSPACE_COLORS } from "@/lib/mock-workspaces";
import { Field, TextInput } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { WorkspaceBuilderLoader } from "@/components/workspace/workspace-builder-loader";

export const Route = createFileRoute("/workspaces/new")({
  head: () => ({ meta: [{ title: "Create Workspace — Tunis Agent Ai" }] }),
  ssr: false,
  component: NewWorkspacePage,
});

function NewWorkspacePage() {
  const navigate = useNavigate();
  const session = getSession();
  const [name, setName] = useState("");
  const [color, setColor] = useState(WORKSPACE_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || !session) {
      navigate({ to: "/login", replace: true });
      return;
    }
    setHasExisting(listWorkspaces(session.userId).length > 0);
  }, [navigate, session]);

  if (!session) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
  }

  function handleBuildComplete() {
    createWorkspace(session!.userId, { name, color });
    navigate({ to: "/dashboard" });
  }


  function handleLogout() {
    signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl gradient-mint grid place-items-center shadow-glow">
            <Bot className="size-5 text-ink" strokeWidth={2.5} />
          </div>
          <div className="font-display font-bold text-lg">Tunis Agent Ai</div>
        </div>
        {hasExisting ? (
          <Link to="/workspaces" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="size-4" /> Back to picker
          </Link>
        ) : (
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display font-bold tracking-tight">Create your workspace</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {hasExisting ? "Add another workspace for a different team or project." : "Workspaces hold your agents, campaigns and call data. You can create more later."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-5">
            <Field label="Workspace name">
              <TextInput
                autoFocus
                required
                placeholder="e.g. Acme Sales Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
              />
            </Field>

            <div>
              <div className="text-sm font-medium mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                {WORKSPACE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`size-8 rounded-lg transition-all ${color === c ? "ring-2 ring-offset-2 ring-mint" : "hover:scale-110"}`}
                    style={{ background: c }}
                    aria-label={`Pick ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-mint-soft/30 border border-mint/20 p-3 flex items-center gap-3">
              <div className="size-10 rounded-lg grid place-items-center text-white font-bold" style={{ background: color }}>
                {(name || "WS").slice(0, 2).toUpperCase()}
              </div>
              <div className="text-sm">
                <div className="font-semibold">{name || "Your workspace"}</div>
                <div className="text-muted-foreground text-xs">Preview</div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
              {loading ? "Creating…" : "Create workspace"}
            </Button>
          </form>
        </motion.div>
      </main>

      <WorkspaceBuilderLoader
        open={loading}
        workspaceName={name}
        color={color}
        onComplete={handleBuildComplete}
      />
    </div>
  );
}
