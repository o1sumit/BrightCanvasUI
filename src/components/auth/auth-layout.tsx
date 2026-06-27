import { type ReactNode } from "react";
import { Phone, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="hidden lg:flex relative flex-col justify-between p-10 bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative flex items-center gap-2 font-display text-lg font-semibold"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Phone className="h-5 w-5" />
          </span>
          Tunis Agent Ai
        </motion.div>

        <div className="relative space-y-6 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
            className="font-display text-4xl font-semibold leading-tight"
          >
            AI voice agents that talk like your best rep.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="text-primary-foreground/80 text-base"
          >
            Launch campaigns, route calls, and qualify leads — all from one calm, focused workspace.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
            }}
            className="space-y-3 pt-4"
          >
            <Feature icon={<Sparkles className="h-4 w-4" />} text="Hyper-realistic conversational AI" />
            <Feature icon={<ShieldCheck className="h-4 w-4" />} text="Compliance-first by design" />
            <Feature icon={<Phone className="h-4 w-4" />} text="One-Ring, Outbound & Inbound modes" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          className="relative text-xs text-primary-foreground/70"
        >
          © {new Date().getFullYear()} Tunis Agent Ai. All rights reserved.
        </motion.div>
      </motion.div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="w-full max-w-md space-y-8"
        >
          <div className="lg:hidden flex items-center gap-2 font-display text-lg font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Phone className="h-5 w-5" />
            </span>
            Tunis Agent Ai
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          {footer && <div className="text-sm text-muted-foreground text-center">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -12 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
      }}
      className="flex items-center gap-3 text-sm text-primary-foreground/90"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
        {icon}
      </span>
      {text}
    </motion.div>
  );
}
