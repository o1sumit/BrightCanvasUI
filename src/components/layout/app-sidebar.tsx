import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { signOut, getSession } from "@/lib/mock-auth";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import {
  Bot,
  Megaphone,
  Phone,
  Zap,
  PanelLeft,
  Pencil,
  Play,
  LayoutDashboard,
  Users,
  PhoneCall,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const groups: { label: string; items: { title: string; url: string; icon: any }[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "My Agent", url: "/agents", icon: Bot },
      { title: "My Campaign", url: "/campaigns", icon: Megaphone },
      { title: "Calls", url: "/calls", icon: PhoneCall },
      { title: "Contacts", url: "/contacts", icon: Users },
    ],
  },
  {
    label: "Configure",
    items: [
      { title: "Phone Number", url: "/phone-numbers", icon: Phone },
      { title: "Human Number", url: "/human-numbers", icon: Users },
      { title: "Action", url: "/actions", icon: Zap },
    ],
  },
  {
    label: "Insights",
    items: [{ title: "Analytics", url: "/analytics", icon: BarChart3 }],
  },
  {
    label: "Admin",
    items: [
      { title: "Users", url: "/users", icon: UserCog },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => path === url || path.startsWith(url + "/");
  const navigate = useNavigate();
  const session = getSession();
  const initials = session?.name
    ? session.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "JD";
  const handleLogout = () => {
    signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="px-3 pt-5 pb-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-4">
        {/* Branding */}
        <div className="flex items-center gap-2 mb-3 group-data-[collapsible=icon]:mb-3 group-data-[collapsible=icon]:justify-center">
          <div className="size-8 rounded-lg gradient-mint grid place-items-center shadow-glow shrink-0">
            <Bot className="size-4 text-ink" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight group-data-[collapsible=icon]:hidden">
            Tunis Agent Ai
          </span>
        </div>

        {/* Workspace switcher + toggle */}
        <div className="flex w-full items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <WorkspaceSwitcher />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <WorkspaceSwitcher collapsed />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="size-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        {groups.map((g) => (
          <SidebarGroup key={g.label} className="group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="px-3 text-xs uppercase tracking-widest text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
              {g.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                {g.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:w-auto">
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className="h-11 rounded-xl py-0 transition-all data-[active=true]:gradient-mint data-[active=true]:text-ink data-[active=true]:shadow-glow data-[active=true]:font-semibold hover:bg-mint-soft group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                      >
                        <Link to={item.url} className="flex items-center gap-3 py-0 leading-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                          <item.icon className="size-[18px] shrink-0" />
                          <span className="text-sm leading-none relative top-[1px] group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/60 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-mint-soft transition-colors group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:p-0">
          <div className="size-9 rounded-full gradient-mint grid place-items-center text-ink font-semibold shrink-0 shadow-glow">
            {initials}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold truncate">{session?.name ?? "Guest"}</div>
          </div>
          <div className="flex gap-1 shrink-0 group-data-[collapsible=icon]:hidden">
            <Link
              to="/profile"
              title="Edit profile"
              className="size-7 rounded-md grid place-items-center text-muted-foreground hover:bg-background hover:text-foreground"
            >
              <Pencil className="size-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="size-7 rounded-md grid place-items-center text-muted-foreground hover:bg-background hover:text-foreground"
              title="Logout"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="hidden size-8 rounded-md group-data-[collapsible=icon]:grid place-items-center text-muted-foreground hover:bg-background hover:text-foreground"
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

