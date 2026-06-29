import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Tunis Agent Ai" },
      { name: "description", content: "Terms of Service for Tunis Agent Ai." },
    ],
  }),
  component: TermsPage,
});

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <div className="size-8 rounded-lg gradient-mint grid place-items-center shadow-glow shrink-0">
              <Bot className="size-4 text-ink" />
            </div>
            Tunis Agent Ai
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.h1 variants={item} className="font-display text-3xl font-semibold tracking-tight">
            Terms of Service
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>

          <motion.div variants={container} className="mt-10 space-y-10 text-sm leading-relaxed text-foreground/90">
            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="mt-3">
                By accessing or using Tunis Agent Ai, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">2. Description of Service</h2>
              <p className="mt-3">
                Tunis Agent Ai provides AI-powered voice agent and campaign management tools.
                We do not guarantee uninterrupted access and may modify or discontinue features at any time.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">3. User Accounts</h2>
              <p className="mt-3">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account. You agree to notify us immediately
                of any unauthorized use.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">4. Acceptable Use</h2>
              <p className="mt-3">
                You agree not to use the service for any unlawful purpose, to transmit any harmful code,
                or to interfere with the proper working of the service. All campaigns must comply with
                applicable telemarketing laws and regulations.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
              <p className="mt-3">
                Tunis Agent Ai shall not be liable for any indirect, incidental, special, or consequential
                damages arising out of or in connection with your use of the service.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">6. Changes to Terms</h2>
              <p className="mt-3">
                We reserve the right to modify these terms at any time. Continued use of the service
                after changes constitutes acceptance of the revised terms.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">7. Contact</h2>
              <p className="mt-3">
                For questions about these Terms, please contact us at support@tunisagentai.com.
              </p>
            </motion.section>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Tunis Agent Ai. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
