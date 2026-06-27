import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogOut, Bot, ArrowRight } from "lucide-react";
import { isAuthenticated, getSession, signOut } from "@/lib/mock-auth";
import { listWorkspaces, setActiveWorkspace, type Workspace } from "@/lib/mock-workspaces";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/workspaces/")({
  head: () => ({ meta: [{ title: "Choose Workspace — Tunis Agent Ai" }] }),
  ssr: false,
  component: WorkspacesPicker,
});

function WorkspacesPicker() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const session = getSession();

  useEffect(() => {
    if (!isAuthenticated() || !session) {
      navigate({ to: "/login", replace: true });
      return;
    }
    const list = listWorkspaces(session.userId);
    if (list.length === 0) {
      navigate({ to: "/workspaces/new", replace: true });
      return;
    }
    setWorkspaces(list);
    setReady(true);
  }, [navigate, session]);

  if (!ready || !session) return null;

  function enter(ws: Workspace) {
    setActiveWorkspace(session!.userId, ws.id);
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
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight">Hi {session.name.split(" ")[0]}, pick a workspace</h1>
            <p className="text-muted-foreground mt-2">Workspaces hold your agents, campaigns and call data — separately.</p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {workspaces.map((ws) => (
              <motion.button
                key={ws.id}
                onClick={() => enter(ws)}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -2 }}
                className="group text-left rounded-2xl border border-border bg-card hover:shadow-elevated p-5 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="size-12 rounded-xl grid place-items-center text-white font-bold shadow-glow"
                    style={{ background: ws.color }}
                  >
                    {ws.name.slice(0, 2).toUpperCase()}
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4 font-display font-semibold">{ws.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Created {new Date(ws.createdAt).toLocaleDateString()}
                </div>
              </motion.button>
            ))}

            <Link
              to="/workspaces/new"
              className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/30 hover:bg-mint-soft/60 p-5 flex flex-col items-center justify-center text-center transition-colors"
            >
              <div className="size-12 rounded-xl gradient-mint grid place-items-center shadow-glow">
                <Plus className="size-5 text-ink" strokeWidth={2.5} />
              </div>
              <div className="mt-3 font-display font-semibold">Create new workspace</div>
              <div className="text-xs text-muted-foreground mt-0.5">Start fresh with a clean slate</div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}