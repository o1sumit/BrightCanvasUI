import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Plus, Layers } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const { workspace, workspaces, switchWorkspace } = useWorkspace();

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="size-9 rounded-xl grid place-items-center text-white font-bold shadow-glow shrink-0"
          style={{ background: workspace.color }}
          aria-label="Switch workspace"
        >
          {workspace.name.slice(0, 2).toUpperCase()}
        </DropdownMenuTrigger>
        <WorkspaceMenu workspaces={workspaces} activeId={workspace.id} onSwitch={switchWorkspace} />
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 min-w-0 rounded-xl px-2 py-1.5 hover:bg-mint-soft/50 transition-colors flex-1 text-left">
        <div
          className="size-9 rounded-xl grid place-items-center text-white font-bold shadow-glow shrink-0"
          style={{ background: workspace.color }}
        >
          {workspace.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-medium">Workspace</div>
          <div className="font-display font-semibold text-sm truncate">{workspace.name}</div>
        </div>
        <ChevronDown className="size-4 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <WorkspaceMenu workspaces={workspaces} activeId={workspace.id} onSwitch={switchWorkspace} />
    </DropdownMenu>
  );
}

function WorkspaceMenu({
  workspaces,
  activeId,
  onSwitch,
}: {
  workspaces: { id: string; name: string; color: string }[];
  activeId: string;
  onSwitch: (id: string) => void;
}) {
  return (
    <DropdownMenuContent align="start" className="w-64 rounded-xl">
      <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground/80">
        Your workspaces
      </DropdownMenuLabel>
      {workspaces.map((ws) => (
        <DropdownMenuItem
          key={ws.id}
          onSelect={() => ws.id !== activeId && onSwitch(ws.id)}
          className="flex items-center gap-2 py-2 cursor-pointer"
        >
          <div
            className="size-7 rounded-md grid place-items-center text-white text-[11px] font-bold shrink-0"
            style={{ background: ws.color }}
          >
            {ws.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="flex-1 truncate text-sm">{ws.name}</span>
          {ws.id === activeId && <Check className="size-4 text-mint shrink-0" />}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/workspaces/new" className="flex items-center gap-2 py-2">
          <Plus className="size-4" /> Create workspace
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/workspaces" className="flex items-center gap-2 py-2">
          <Layers className="size-4" /> View all workspaces
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
