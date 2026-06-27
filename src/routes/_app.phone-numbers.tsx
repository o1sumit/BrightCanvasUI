import { createFileRoute } from "@tanstack/react-router";
import { Plus, Phone, MapPin, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phoneNumbers } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/phone-numbers")({
  head: () => ({ meta: [{ title: "Phone Numbers — Tunis Agent Ai" }] }),
  component: PhoneNumbersPage,
});

function PhoneNumbersPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phone Numbers</h1>
          <p className="text-muted-foreground mt-1 text-sm">Provision and route phone numbers across your agents.</p>
        </div>
        <Button className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
          <Plus className="size-4 mr-1.5" /> Add Number
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {phoneNumbers.map((n) => (
          <div key={n.id} className="rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-elevated transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-11 rounded-xl gradient-mint grid place-items-center text-ink shadow-glow"><Phone className="size-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-lg truncate">{n.number}</div>
                <div className="text-xs text-muted-foreground">{n.label}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-3.5" /> {n.region}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Link2 className="size-3.5" /> Linked to <span className="text-foreground font-medium">{n.linked}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
