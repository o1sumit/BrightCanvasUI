import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Loader2, Bot, Database, Phone, Sparkles, Users, ShieldCheck } from "lucide-react";

export type BuilderStep = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
};

const DEFAULT_STEPS: BuilderStep[] = [
  { icon: Database, label: "Provisioning workspace", detail: "Allocating secure storage & encryption keys" },
  { icon: Bot, label: "Assembling AI agents", detail: "Configuring voice models and personalities" },
  { icon: Phone, label: "Wiring call infrastructure", detail: "Connecting telephony and routing layers" },
  { icon: Users, label: "Arranging team seats", detail: "Setting up roles and permissions" },
  { icon: ShieldCheck, label: "Applying compliance rules", detail: "DNC lists, carrier hours, retention" },
  { icon: Sparkles, label: "Finalizing your space", detail: "Polishing the dashboard for first launch" },
];

interface Props {
  open: boolean;
  workspaceName: string;
  color: string;
  steps?: BuilderStep[];
  stepDuration?: number;
  onComplete?: () => void;
}

export function WorkspaceBuilderLoader({
  open,
  workspaceName,
  color,
  steps = DEFAULT_STEPS,
  stepDuration = 700,
  onComplete,
}: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!open) {
      setCurrent(0);
      return;
    }
    if (current >= steps.length) {
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrent((c) => c + 1), stepDuration);
    return () => clearTimeout(t);
  }, [open, current, steps.length, stepDuration, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background/80 backdrop-blur-xl px-4"
        >
          {/* Ambient glow */}
          <motion.div
            aria-hidden
            className="absolute size-[520px] rounded-full blur-3xl opacity-30"
            style={{ background: color }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative w-full max-w-lg rounded-3xl border border-border/60 bg-card/95 shadow-2xl p-7 overflow-hidden"
          >
            {/* Top orbit / workspace badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative size-20 mb-4">
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: color, boxShadow: `0 12px 40px -10px ${color}` }}
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 grid place-items-center text-white font-display font-bold text-2xl">
                  {(workspaceName || "WS").slice(0, 2).toUpperCase()}
                </div>
                {/* Orbiting dots */}
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute top-1/2 left-1/2 size-2 rounded-full bg-mint"
                    style={{ marginTop: -4, marginLeft: -4 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: "linear" }}
                  >
                    <span
                      className="block size-2 rounded-full bg-mint"
                      style={{ transform: `translateX(${42 + i * 6}px)` }}
                    />
                  </motion.span>
                ))}
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight">
                Building {workspaceName || "your workspace"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Hang tight — we're assembling everything you need
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-mint to-mint/70"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.min(current, steps.length) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Step list */}
            <ul className="space-y-2.5">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const done = idx < current;
                const active = idx === current;
                return (
                  <motion.li
                    key={s.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: done || active ? 1 : 0.45, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-mint/40 bg-mint-soft/30"
                        : done
                          ? "border-border/40 bg-card"
                          : "border-border/30 bg-card"
                    }`}
                  >
                    <div
                      className={`size-9 shrink-0 rounded-lg grid place-items-center transition-colors ${
                        done
                          ? "bg-mint text-ink"
                          : active
                            ? "bg-mint/15 text-mint"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        >
                          <Check className="size-4.5" strokeWidth={3} />
                        </motion.span>
                      ) : active ? (
                        <Loader2 className="size-4.5 animate-spin" />
                      ) : (
                        <Icon className="size-4.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{s.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.detail}</div>
                    </div>
                    {active && (
                      <motion.span
                        className="text-[11px] font-medium text-mint shrink-0"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        working…
                      </motion.span>
                    )}
                    {done && <span className="text-[11px] font-medium text-mint shrink-0">done</span>}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
