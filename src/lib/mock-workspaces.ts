// Mock workspace layer — localStorage only.
const WS_KEY = "tunis_workspaces";
const ACTIVE_PREFIX = "tunis_active_ws_"; // per user

export type Workspace = {
  id: string;
  ownerId: string;
  name: string;
  color: string; // hex
  createdAt: number;
};

export const WORKSPACE_COLORS = [
  "#3DDC97", // mint
  "#6366F1", // indigo
  "#F59E0B", // amber
  "#EC4899", // pink
  "#0EA5E9", // sky
  "#8B5CF6", // violet
  "#EF4444", // rose
  "#10B981", // emerald
];

function readAll(): Workspace[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(list: Workspace[]) {
  localStorage.setItem(WS_KEY, JSON.stringify(list));
}

export function listWorkspaces(userId: string): Workspace[] {
  return readAll().filter((w) => w.ownerId === userId);
}

export function getWorkspace(id: string): Workspace | null {
  return readAll().find((w) => w.id === id) ?? null;
}

export function createWorkspace(userId: string, input: { name: string; color?: string }): Workspace {
  const ws: Workspace = {
    id: crypto.randomUUID(),
    ownerId: userId,
    name: input.name.trim(),
    color: input.color || WORKSPACE_COLORS[0],
    createdAt: Date.now(),
  };
  const all = readAll();
  all.push(ws);
  writeAll(all);
  setActiveWorkspace(userId, ws.id);
  return ws;
}

export function renameWorkspace(id: string, name: string) {
  const all = readAll();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], name: name.trim() };
  writeAll(all);
}

export function updateWorkspace(id: string, input: { name: string; color: string }) {
  const all = readAll();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], name: input.name.trim(), color: input.color };
  writeAll(all);
}

export function deleteWorkspace(userId: string, id: string) {
  const all = readAll().filter((w) => w.id !== id);
  writeAll(all);
  // clear scoped data
  if (typeof window !== "undefined") {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(`tunis_ws_${id}_`))
      .forEach((k) => localStorage.removeItem(k));
    if (getActiveWorkspaceId(userId) === id) {
      localStorage.removeItem(ACTIVE_PREFIX + userId);
    }
  }
}

export function getActiveWorkspaceId(userId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_PREFIX + userId);
}

export function getActiveWorkspace(userId: string): Workspace | null {
  const id = getActiveWorkspaceId(userId);
  if (!id) return null;
  const ws = getWorkspace(id);
  if (!ws || ws.ownerId !== userId) return null;
  return ws;
}

export function setActiveWorkspace(userId: string, workspaceId: string) {
  localStorage.setItem(ACTIVE_PREFIX + userId, workspaceId);
}

export function clearActiveWorkspace(userId: string) {
  localStorage.removeItem(ACTIVE_PREFIX + userId);
}

// ---- Scoped data helpers (per workspace) ----
function scopedKey(wsId: string, key: string) {
  return `tunis_ws_${wsId}_${key}`;
}

export function readScopedList<T>(wsId: string, key: string): T[] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(scopedKey(wsId, key));
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return null;
  }
}

export function writeScopedList<T>(wsId: string, key: string, value: T[]) {
  localStorage.setItem(scopedKey(wsId, key), JSON.stringify(value));
}
