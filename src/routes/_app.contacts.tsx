import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Upload, MoreHorizontal, Mail, Phone, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScopedList, useWorkspace } from "@/lib/workspace-context";

export const Route = createFileRoute("/_app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — Tunis Agent Ai" }] }),
  component: ContactsPage,
});

type Contact = { name: string; phone: string; email: string; list: string; score: number; tag: string };

const tagColor: Record<string, string> = {
  Hot: "bg-rose-50 text-rose-600 border-rose-200",
  Qualified: "bg-mint-soft text-mint border-mint/30",
  Warm: "bg-amber-50 text-amber-600 border-amber-200",
  Cold: "bg-slate-100 text-slate-600 border-slate-200",
};

function ContactsPage() {
  const { workspace } = useWorkspace();
  const [contacts] = useScopedList<Contact>("contacts");
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage every person your agents talk to.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-11 border-border"><Upload className="size-4 mr-1.5" /> Import CSV</Button>
          <Button className="rounded-xl h-11 gradient-mint text-ink font-semibold shadow-glow hover:opacity-90"><Plus className="size-4 mr-1.5" strokeWidth={2.5} /> New Contact</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: "Total Contacts", v: "12,480" },
          { l: "Hot Leads", v: "942" },
          { l: "Qualified", v: "612" },
          { l: "Active Lists", v: "8" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="text-2xl font-bold mt-1.5">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card p-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts, phone or email…" className="pl-9 h-10 rounded-xl bg-background border-border" />
        </div>
        <Button variant="outline" className="rounded-xl h-10 border-border"><Tag className="size-4 mr-1.5" /> All tags</Button>
        <Button variant="outline" className="rounded-xl h-10 border-border">All lists</Button>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/20 p-12 text-center">
          <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow">
            <Users className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-lg">No contacts in {workspace.name} yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Import a CSV or add contacts manually to start running campaigns.
          </p>
          <Button className="mt-5 rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow">
            <Upload className="size-4 mr-1.5" /> Import contacts
          </Button>
        </div>
      ) : (
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              {["Contact", "Phone", "Email", "List", "Lead Score", "Tag", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.email} className="border-t border-border hover:bg-mint-soft/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full gradient-mint grid place-items-center text-ink text-xs font-bold">{c.name.split(" ").map(n=>n[0]).join("")}</div>
                    <div className="font-medium">{c.name}</div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground"><Phone className="size-3.5 inline mr-1.5" />{c.phone}</td>
                <td className="px-5 py-4 text-muted-foreground"><Mail className="size-3.5 inline mr-1.5" />{c.email}</td>
                <td className="px-5 py-4">{c.list}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-mint" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold tabular-nums">{c.score}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColor[c.tag]}`}>{c.tag}</span>
                </td>
                <td className="px-5 py-4">
                  <button className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-background shrink-0"><MoreHorizontal className="size-4 shrink-0" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
