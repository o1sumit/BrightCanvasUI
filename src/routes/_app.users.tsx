import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MoreHorizontal, Mail, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemedSelect } from "@/components/ui-kit/themed-select";
import { TextInput } from "@/components/ui-kit/text-input";
import { Field } from "@/components/ui-kit/field";

export const Route = createFileRoute("/_app/users")({
  head: () => ({ meta: [{ title: "Users — Tunis Agent Ai" }] }),
  component: UsersPage,
});

const users = [
  { name: "Siddhi Gandhi", email: "siddhi@vocara.ai", role: "Admin", status: "active", last: "Online" },
  { name: "Harsh Modi", email: "harsh@vocara.ai", role: "Manager", status: "active", last: "2h ago" },
  { name: "Priya Shah", email: "priya@vocara.ai", role: "Manager", status: "active", last: "Yesterday" },
  { name: "Aakash Verma", email: "aakash@vocara.ai", role: "Viewer", status: "invited", last: "—" },
  { name: "Neha Iyer", email: "neha@vocara.ai", role: "Viewer", status: "active", last: "3d ago" },
];

const roleColor: Record<string, string> = {
  Admin: "bg-mint-soft text-mint border-mint/30",
  Manager: "bg-blue-50 text-blue-600 border-blue-200",
  Viewer: "bg-slate-100 text-slate-600 border-slate-200",
};

function UsersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1 text-sm">Invite teammates and manage permissions.</p>
        </div>
        <Button
          onClick={() => setInviteOpen(true)}
          className="rounded-xl h-11 gradient-mint text-ink font-semibold shadow-glow hover:opacity-90"
        >
          <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Invite User
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Members", v: "5" },
          { l: "Admins", v: "1" },
          { l: "Managers", v: "2" },
          { l: "Pending Invites", v: "1" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="text-2xl font-bold mt-1.5">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
              {["User", "Email", "Role", "Status", "Last Active", ""].map((h) => <th key={h} className="px-5 py-3.5 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-t border-border hover:bg-mint-soft/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 shrink-0 rounded-full gradient-mint grid place-items-center text-ink text-xs font-bold">{u.name.split(" ").map(n=>n[0]).join("")}</div>
                    <div className="font-medium">{u.name}</div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground"><Mail className="size-3.5 inline mr-1.5 shrink-0" />{u.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${roleColor[u.role]}`}>
                    <Shield className="size-3 shrink-0" /> {u.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {u.status === "active" ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Active</span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Invited</span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{u.last}</td>
                <td className="px-5 py-4"><button className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-background"><MoreHorizontal className="size-4 shrink-0" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite User Dialog */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setInviteOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-elevated p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Invite User</h2>
              <button
                onClick={() => setInviteOpen(false)}
                className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Send an invitation email to add a new team member.</p>
            <div className="space-y-4">
              <Field label="Email Address">
                <TextInput
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="size-4 text-muted-foreground" />}
                />
              </Field>
              <Field label="Role">
                <ThemedSelect
                  id="invite-role"
                  value={role}
                  onChange={(v) => setRole(v)}
                  options={[
                    { value: "Admin", label: "Admin — Full access" },
                    { value: "Manager", label: "Manager — Can manage campaigns & agents" },
                    { value: "Viewer", label: "Viewer — Read-only access" },
                  ]}
                />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-border hover:bg-muted"
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl gradient-mint text-ink font-semibold shadow-glow hover:opacity-90"
                onClick={() => {
                  setInviteOpen(false);
                  setEmail("");
                  setRole("Viewer");
                }}
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
