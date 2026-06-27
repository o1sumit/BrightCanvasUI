import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter, Columns3, MoreHorizontal, ChevronLeft, ChevronRight, ChevronDown, Search, Calendar, Phone, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Campaign, CampaignStatus } from "@/lib/mock-data";
import { useScopedList, useWorkspace } from "@/lib/workspace-context";
import { StatusBadge, statusOptions } from "@/components/campaigns/status-badge";
import { FilterBar } from "@/components/campaigns/filter-bar";
import { NewCampaignDialog } from "@/components/campaigns/new-campaign-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_app/campaigns/")({
  head: () => ({ meta: [{ title: "My Campaigns — Tunis Agent Ai" }, { name: "description", content: "Manage your AI voice campaigns." }] }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const [openNew, setOpenNew] = useState(false);
  const { workspace } = useWorkspace();
  const [campaigns] = useScopedList<Campaign>("campaigns");
  const [statuses, setStatuses] = useState<Record<string, CampaignStatus>>(() =>
    Object.fromEntries(campaigns.map((c) => [c.id, c.status]))
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
          <p className="text-muted-foreground mt-1 text-sm">Launch, monitor and orchestrate your voice campaigns.</p>
        </div>
        <Button onClick={() => setOpenNew(true)} className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow transition-all hover:scale-[1.02]">
          <Plus className="size-4 mr-1.5" strokeWidth={2.5} />
          New Campaign
        </Button>
      </header>

      {campaigns.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/20 p-12 text-center">
          <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow">
            <Megaphone className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-lg">No campaigns in {workspace.name} yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Launch your first AI voice campaign to start reaching your contacts.
          </p>
          <Button onClick={() => setOpenNew(true)} className="mt-5 rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow">
            <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Create your first campaign
          </Button>
        </div>
      ) : (
      <>
      <div className="rounded-2xl bg-card border border-border shadow-card p-5">
        <FilterBar
          fields={[
            { label: "Time Range", placeholder: "Time range", icon: <Calendar className="size-4 shrink-0" /> },
            { label: "Call Id", placeholder: "Call ID", icon: <Search className="size-4 shrink-0" /> },
            { label: "Phone Number", placeholder: "Phone number", icon: <Phone className="size-4 shrink-0" /> },
            { label: "Call Type", placeholder: "Call type" },
            { label: "Custom Number", placeholder: "Custom" },
          ]}
          right={
            <>
              <Button variant="outline" size="icon" className="rounded-xl size-10 border-border shrink-0"><Filter className="size-4 shrink-0" /></Button>
              <Button variant="outline" size="icon" className="rounded-xl size-10 border-border shrink-0"><Columns3 className="size-4 shrink-0" /></Button>
            </>
          }
        />
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
                {["Campaign Name", "Call Id", "AI Agent", "Type", "Phone", "Contacts", "Scheduled", "Created By", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const s = statuses[c.id];
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-mint-soft/40 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center gap-1 outline-none">
                            <StatusBadge status={s} />
                            <ChevronDown className="size-3 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="rounded-xl">
                            {statusOptions.map((opt) => (
                              <DropdownMenuItem key={opt.value} onClick={() => setStatuses((p) => ({ ...p, [c.id]: opt.value }))} className="rounded-lg cursor-pointer">
                                <span className={`size-2 rounded-full ${opt.dot} mr-2`} /> {opt.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Link to="/campaigns/$id" params={{ id: c.id }} className="font-medium hover:text-mint-deep transition-colors">{c.name}</Link>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{c.callId}</td>
                    <td className="px-5 py-4">{c.agent}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.type === "Inbound" ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>{c.type}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{c.phone}</td>
                    <td className="px-5 py-4 font-medium">{c.contacts.toLocaleString()}</td>
                    <td className="px-5 py-4 text-muted-foreground">{c.scheduledAt}</td>
                    <td className="px-5 py-4">{c.createdBy}</td>
                    <td className="px-5 py-4">
                      <button className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0"><MoreHorizontal className="size-4 shrink-0" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <span className="text-xs text-muted-foreground">1–{campaigns.length} of 128</span>
          <div className="flex items-center gap-1">
            <button className="size-8 rounded-lg grid place-items-center hover:bg-muted shrink-0"><ChevronLeft className="size-4 shrink-0" /></button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={`size-8 rounded-lg text-sm font-medium ${n === 1 ? "gradient-mint text-ink shadow-glow" : "hover:bg-muted"}`}>{n}</button>
            ))}
            <button className="size-8 rounded-lg grid place-items-center hover:bg-muted shrink-0"><ChevronRight className="size-4 shrink-0" /></button>
          </div>
        </div>
      </div>
      </>
      )}

      <NewCampaignDialog open={openNew} onOpenChange={setOpenNew} />
    </div>
  );
}
