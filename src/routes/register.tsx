import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Lock, User, Building2, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Field, TextInput } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/mock-auth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Tunis Agent Ai" }] }),
  component: RegisterPage,
});

const formItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const strength = passwordStrength(form.password);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agree) return;
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const res = signUp(form);
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      navigate({ to: "/workspaces/new" });
    }, 500);
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start running AI-powered call campaigns in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name">
              <TextInput
                required
                placeholder="Jane Doe"
                value={form.name}
                onChange={update("name")}
                leftIcon={<User className="h-4 w-4" />}
              />
            </Field>
            <Field label="Company">
              <TextInput
                placeholder="Acme Inc."
                value={form.company}
                onChange={update("company")}
                leftIcon={<Building2 className="h-4 w-4" />}
              />
            </Field>
          </div>
        </motion.div>

        <motion.div variants={formItem}>
          <Field label="Work email">
            <TextInput
              type="email"
              required
              placeholder="you@company.com"
              value={form.email}
              onChange={update("email")}
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
          <Field
            label="Password"
            hint={form.password ? undefined : "At least 8 characters with letters and numbers."}
          >
            <TextInput
              type={showPw ? "text" : "password"}
              required
              placeholder="Create a password"
              value={form.password}
              onChange={update("password")}
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
            {form.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < strength.score ? strength.color : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
          </Field>
        </motion.div>

        <motion.label variants={formItem} className="flex items-start gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
          />
          <span className="text-muted-foreground">
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </span>
        </motion.label>

        <motion.div variants={formItem}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full" disabled={loading || !agree}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </motion.div>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short", color: "bg-rose-400" },
    { label: "Weak", color: "bg-rose-400" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-emerald-400" },
    { label: "Strong", color: "bg-emerald-500" },
  ];
  return { score, ...map[score] };
}
