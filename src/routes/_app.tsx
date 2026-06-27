import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { isAuthenticated, getSession } from "@/lib/mock-auth";
import { getActiveWorkspace, listWorkspaces, type Workspace } from "@/lib/mock-workspaces";
import { WorkspaceProvider } from "@/lib/workspace-context";

const SIDEBAR_STORAGE_KEY = "sidebar_open";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login", replace: true });
      return;
    }
    const session = getSession()!;
    const list = listWorkspaces(session.userId);
    if (list.length === 0) {
      navigate({ to: "/workspaces/new", replace: true });
      return;
    }
    const active = getActiveWorkspace(session.userId);
    if (!active) {
      navigate({ to: "/workspaces", replace: true });
      return;
    }
    setWorkspace(active);
    setReady(true);
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) setSidebarOpen(stored === "true");
  }, [navigate]);

  const handleOpenChange = useCallback((open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  }, []);

  if (!ready || !workspace) return null;

  return (
    <WorkspaceProvider workspace={workspace}>
      <SidebarProvider open={sidebarOpen} onOpenChange={handleOpenChange}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 px-4 h-14 border-b border-border bg-background/80 backdrop-blur">
              <SidebarTrigger />
              <span className="font-display font-semibold">{workspace.name}</span>
            </div>
            <main className="flex-1">
              <AnimatedOutlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}

function AnimatedOutlet() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
