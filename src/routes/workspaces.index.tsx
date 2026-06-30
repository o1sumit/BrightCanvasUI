import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogOut, Bot, ArrowRight, MoreVertical } from "lucide-react";
import { isAuthenticated, getSession, signOut } from "@/lib/mock-auth";
import { listWorkspaces, setActiveWorkspace, deleteWorkspace, type Workspace } from "@/lib/mock-workspaces";
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
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const session = getSession();
  const userId = session?.userId;

  useEffect(() => {
    if (!isAuthenticated() || !userId) {
      navigate({ to: "/login", replace: true });
      return;
    }
    const list = listWorkspaces(userId);
    if (list.length === 0) {
      navigate({ to: "/workspaces/new", replace: true });
      return;
    }
    setWorkspaces(list);
    setReady(true);
  }, [navigate, userId]);

  if (!ready || !session) return null;

  function enter(ws: Workspace) {
    setActiveWorkspace(session!.userId, ws.id);
    navigate({ to: "/dashboard" });
  }

  function handleLogout() {
    signOut();
    navigate({ to: "/login", replace: true });
  }

  function confirmDelete() {
    if (!deletingWorkspaceId || !session) return;
    deleteWorkspace(session.userId, deletingWorkspaceId);
    setDeletingWorkspaceId(null);
    const list = listWorkspaces(session.userId);
    if (list.length === 0) {
      navigate({ to: "/workspaces/new", replace: true });
    } else {
      setWorkspaces(list);
    }
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
              <motion.div
                key={ws.id}
                onClick={() => enter(ws)}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -2 }}
                className="group relative text-left rounded-2xl border border-border bg-card hover:shadow-elevated p-5 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="size-12 rounded-xl grid place-items-center text-white font-bold shadow-glow"
                    style={{ background: ws.color }}
                  >
                    {ws.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div onClick={(e) => e.stopPropagation()} className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === ws.id ? null : ws.id);
                      }}
                      aria-label="Workspace actions"
                      className="-mr-1 -mt-1 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 flex items-center justify-center cursor-pointer outline-none"
                    >
                      <MoreVertical className="size-4" />
                    </button>

                    {activeMenuId === ws.id && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                          }}
                        />
                        <div
                          className="absolute right-0 mt-1.5 z-40 w-36 rounded-xl border border-border bg-card p-1 text-foreground shadow-elevated animate-in fade-in-0 zoom-in-95 duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              navigate({ to: "/workspaces/new", search: { id: ws.id } });
                            }}
                            className="w-full text-left cursor-pointer rounded-lg px-2.5 py-1.5 text-xs hover:bg-muted transition-colors font-medium"
                          >
                            Edit details
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              setDeletingWorkspaceId(ws.id);
                            }}
                            className="w-full text-left cursor-pointer rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                          >
                            Delete workspace
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="font-display font-semibold">{ws.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Created {new Date(ws.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </motion.div>
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

      {deletingWorkspaceId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevated animate-in fade-in-50 zoom-in-95 duration-200">
            <h2 className="text-lg font-display font-semibold text-foreground">Are you absolutely sure?</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              This action cannot be undone. This will permanently delete the workspace and all of its agents, campaigns, and call history.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setDeletingWorkspaceId(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}