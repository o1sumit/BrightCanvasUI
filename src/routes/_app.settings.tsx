import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Tunis Agent Ai" }] }),
  component: SettingsPage,
});

const tabs = [
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "locale", label: "Locale", icon: Globe },
];

function SettingsPage() {
  const [active, setActive] = useState("notifications");
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your workspace, preferences and security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
        <nav className="rounded-2xl bg-card border border-border shadow-card p-2 h-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active === t.key ? "gradient-mint text-ink font-semibold shadow-glow" : "hover:bg-mint-soft text-muted-foreground"}`}
            >
              <t.icon className="size-4 shrink-0" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="space-y-5">
          {active === "notifications" && (
            <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Notifications</h2>
              {[
                { l: "Email — Daily campaign digest", d: true },
                { l: "Slack — Hot lead alerts", d: true },
                { l: "SMS — Missed call recovery", d: false },
                { l: "Microsoft Teams — Live escalation alerts", d: false },
              ].map((n) => (
                <div key={n.l} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                  <span className="text-sm">{n.l}</span>
                  <Switch defaultChecked={n.d} />
                </div>
              ))}
            </div>
          )}

          {active === "appearance" && (
            <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Appearance</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {["Light", "Dark", "System"].map((t, i) => (
                  <button key={t} className={`rounded-xl border p-4 text-left transition-all ${i === 0 ? "border-mint shadow-glow bg-mint-soft" : "border-border hover:bg-mint-soft/40"}`}>
                    <div className="h-16 rounded-lg bg-gradient-to-br from-background to-muted mb-3" />
                    <div className="text-sm font-semibold">{t}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "locale" && (
            <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Locale</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs">Language</Label><Input defaultValue="English (US)" className="mt-1.5 rounded-xl h-10 bg-background" /></div>
                <div><Label className="text-xs">Currency</Label><Input defaultValue="USD" className="mt-1.5 rounded-xl h-10 bg-background" /></div>
                <div><Label className="text-xs">Date Format</Label><Input defaultValue="MMM D, YYYY" className="mt-1.5 rounded-xl h-10 bg-background" /></div>
                <div><Label className="text-xs">Time Format</Label><Input defaultValue="12-hour" className="mt-1.5 rounded-xl h-10 bg-background" /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
