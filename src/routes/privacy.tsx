import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Tunis Agent Ai" },
      { name: "description", content: "Privacy Policy for Tunis Agent Ai." },
    ],
  }),
  component: PrivacyPage,
});

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Phone className="h-4 w-4" />
            </span>
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
            Privacy Policy
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>

          <motion.div variants={container} className="mt-10 space-y-10 text-sm leading-relaxed text-foreground/90">
            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">1. Information We Collect</h2>
              <p className="mt-3">
                We collect information you provide directly, such as your name, email, and account preferences.
                We also collect usage data and call metadata necessary to operate the service.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="mt-3">
                We use your information to provide, maintain, and improve our services; to communicate with you;
                and to ensure compliance with legal obligations.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">3. Data Sharing</h2>
              <p className="mt-3">
                We do not sell your personal data. We may share information with trusted service providers
                who assist in operating our platform, subject to strict confidentiality obligations.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">4. Data Security</h2>
              <p className="mt-3">
                We implement industry-standard security measures to protect your data. However, no method
                of transmission over the internet is 100% secure.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">5. Your Rights</h2>
              <p className="mt-3">
                You may access, update, or delete your personal information by contacting us.
                You can also request a copy of the data we hold about you.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">6. Cookies</h2>
              <p className="mt-3">
                We use cookies and similar technologies to enhance your experience and analyze usage.
                You can control cookie preferences through your browser settings.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">7. Changes to This Policy</h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. We will notify you of significant changes
                by posting the new policy on this page.
              </p>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="font-display text-lg font-semibold text-foreground">8. Contact Us</h2>
              <p className="mt-3">
                If you have any questions about this Privacy Policy, please contact us at privacy@tunisagentai.com.
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
