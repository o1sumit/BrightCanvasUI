import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field, TextInput } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/mock-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Tunis Agent Ai" }] }),
  component: LoginPage,
});

const formItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const res = signIn(email, password);
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      navigate({ to: "/" });
    }, 400);
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your campaigns and agents."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div variants={formItem}>
          <Field label="Password">
            <TextInput
              type={showPw ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </Field>
        </motion.div>

        <motion.div variants={formItem} className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Forgot password?
          </Link>
        </motion.div>

        <motion.div variants={formItem}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={formItem} className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          {/* <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
              or continue with
            </span>
          </div> */}
        </motion.div>

        {/* <motion.div variants={formItem}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button type="button" variant="outline" className="w-full gap-2">
              <GoogleIcon /> Sign in with Google
            </Button>
          </motion.div>
        </motion.div> */}
      </motion.form>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
