## Workspace Layer

A workspace is the top-level container a user enters before reaching the app. Each user owns one or more workspaces, each holding its own agents, campaigns, contacts, calls, lists, and phone numbers. The active workspace is stored in localStorage; routes stay clean (`/dashboard`, not `/w/$id/dashboard`).

### Flow

1. **Register** → redirected to `/workspaces/new` (forced naming).
2. **Login** → if no workspaces, `/workspaces/new`; if workspaces exist, `/workspaces` picker.
3. **Pick a workspace** → active workspace saved to localStorage, navigate to `/dashboard`.
4. **Switch workspace** → dropdown in the sidebar header (replaces the static "Tunis Agent Ai" label) lists workspaces, "Create new", and "Back to picker".

### Data model (localStorage, mock)

New `src/lib/mock-workspaces.ts`:

```text
tunis_workspaces  -> Workspace[]      { id, ownerId, name, color, createdAt }
tunis_active_ws   -> workspaceId      (per-user key: tunis_active_ws_<userId>)
```

Helpers: `listWorkspaces(userId)`, `createWorkspace(userId, {name,color})`, `getActiveWorkspace(userId)`, `setActiveWorkspace(userId, wsId)`, `renameWorkspace`, `deleteWorkspace`.

### Per-workspace data scoping

`src/lib/mock-data.ts` currently exports static arrays. Refactor to read/write namespaced localStorage per workspace:

- Keys become `tunis_ws_<wsId>_agents`, `..._campaigns`, `..._contacts`, `..._calls`, `..._lists`, `..._phoneNumbers`.
- On first read for a workspace, seed empty arrays (fresh workspaces show empty states). The existing demo data stays as a seed used only for a "Demo Workspace" auto-created on first login of pre-existing accounts so the prototype doesn't feel empty for the user testing now.
- Export `useWorkspaceData()` hook + read/write helpers; pages that currently import the static arrays switch to these.

### Routes

New:
- `src/routes/workspaces.tsx` — picker (auth-guarded, outside `_app` so the sidebar isn't shown). Grid of workspace cards + "Create new".
- `src/routes/workspaces.new.tsx` — create form (name + color swatch picker), themed UI kit.

Updated:
- `src/routes/index.tsx` — redirect logic: not signed in → `/login`; signed in but no workspaces → `/workspaces/new`; signed in with workspaces but no active → `/workspaces`; otherwise `/dashboard`.
- `src/routes/_app.tsx` — in addition to the auth check, require an active workspace; if missing redirect to `/workspaces`. Expose active workspace via a lightweight context (`WorkspaceProvider`) so child routes can read it without re-reading localStorage.
- `src/routes/register.tsx` — on success, navigate to `/workspaces/new` instead of `/dashboard`.
- `src/routes/login.tsx` — on success, route through the same logic as `/`.

### Sidebar

`src/components/layout/app-sidebar.tsx`:
- Replace the "Tunis Agent Ai" title block with a `WorkspaceSwitcher` (themed dropdown using the existing `ThemedSelect` styling): shows active workspace name + color dot, opens a menu of other workspaces, "Create new workspace", "View all workspaces".
- When collapsed, only the color dot/avatar shows.
- Selecting another workspace calls `setActiveWorkspace`, invalidates the workspace context, and routes to `/dashboard`.

### Empty states

For each scoped page (Agents, Campaigns, Contacts, Calls, Lists, Phone Numbers), if the workspace's array is empty, render the existing page chrome plus a centered empty state: icon, "No X yet in <Workspace Name>", primary action button (e.g. "Create your first agent") that opens the existing new-X dialog. No layout changes beyond this conditional block.

### Out of scope (explicit)

- Invitations / multi-user workspace membership — noted as future work.
- Server-side persistence — everything remains localStorage mock.
- URL-based workspace routing — confirmed not needed.

### Technical notes

- All new screens use the existing themed UI kit (`TextInput`, `ThemedSelect`, `Field`, `Button`) and `AuthLayout`-style framer-motion entrance for the picker.
- Mock-data refactor is the largest piece: keep the existing exported names so consumer pages need minimal edits (swap `import { agents } from "@/lib/mock-data"` for `const agents = useAgents()` or `getAgents()` reading the active workspace).
- `getSession()` gains no changes; workspace state is a separate concern keyed by `session.userId`.
