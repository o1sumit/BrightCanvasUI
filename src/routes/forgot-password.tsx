import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field, TextInput } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Tunis Agent Ai" }] }),
  component: ForgotPasswordPage,
});

const formItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Forgot your password?"}
      subtitle={
        sent
          ? `We sent password reset instructions to ${email}.`
          : "Enter the email tied to your account and we'll send you a reset link."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="space-y-5"
        >
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Email sent</p>
              <p className="text-emerald-800/80 mt-1">
                The link will expire in 30 minutes. If you don't see it, check your spam folder.
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Use a different email
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          className="space-y-5"
          onSubmit={onSubmit}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          <motion.div variants={formItem}>
            <Field label="Email">
              <TextInput
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </Field>
          </motion.div>
          <motion.div variants={formItem}>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      )}
    </AuthLayout>
  );
}
