import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getActiveWorkspace,
  listWorkspaces,
  readScopedList,
  setActiveWorkspace as persistActive,
  writeScopedList,
  type Workspace,
} from "./mock-workspaces";
import { getSession } from "./mock-auth";

type Ctx = {
  workspace: Workspace;
  workspaces: Workspace[];
  switchWorkspace: (id: string) => void;
  refresh: () => void;
};

const WorkspaceCtx = createContext<Ctx | null>(null);

export function WorkspaceProvider({ workspace, children }: { workspace: Workspace; children: ReactNode }) {
  const session = getSession();
  const userId = session?.userId ?? "";
  const [current, setCurrent] = useState<Workspace>(workspace);
  const [list, setList] = useState<Workspace[]>(() => listWorkspaces(userId));

  useEffect(() => {
    setCurrent(workspace);
  }, [workspace]);

  const refresh = useCallback(() => {
    setList(listWorkspaces(userId));
    const active = getActiveWorkspace(userId);
    if (active) setCurrent(active);
  }, [userId]);

  const switchWorkspace = useCallback(
    (id: string) => {
      if (!userId) return;
      persistActive(userId, id);
      const next = list.find((w) => w.id === id);
      if (next) setCurrent(next);
      // Force a hard navigation reset of in-memory state for scoped lists
      window.location.assign("/dashboard");
    },
    [userId, list]
  );

  const value = useMemo(() => ({ workspace: current, workspaces: list, switchWorkspace, refresh }), [current, list, switchWorkspace, refresh]);
  return <WorkspaceCtx.Provider value={value}>{children}</WorkspaceCtx.Provider>;
}

export function useWorkspace(): Ctx {
  const ctx = useContext(WorkspaceCtx);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}

// Per-workspace scoped list hook. Defaults to empty.
const SCOPED_EVENT = "tunis:scoped-update";

export function useScopedList<T>(key: string, fallback: T[] = []): [T[], (next: T[]) => void] {
  const { workspace } = useWorkspace();
  const [state, setState] = useState<T[]>(() => readScopedList<T>(workspace.id, key) ?? fallback);

  useEffect(() => {
    setState(readScopedList<T>(workspace.id, key) ?? fallback);
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ wsId: string; key: string }>;
      if (ce.detail?.wsId === workspace.id && ce.detail?.key === key) {
        setState(readScopedList<T>(workspace.id, key) ?? fallback);
      }
    };
    window.addEventListener(SCOPED_EVENT, handler as EventListener);
    return () => window.removeEventListener(SCOPED_EVENT, handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.id, key]);

  const update = useCallback(
    (next: T[]) => {
      setState(next);
      writeScopedList<T>(workspace.id, key, next);
      window.dispatchEvent(new CustomEvent(SCOPED_EVENT, { detail: { wsId: workspace.id, key } }));
    },
    [workspace.id, key]
  );

  return [state, update];
}
