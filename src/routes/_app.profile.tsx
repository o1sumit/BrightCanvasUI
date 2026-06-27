import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui-kit";
import { getCurrentUser, updateProfile } from "@/lib/mock-auth";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — Tunis Agent Ai" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  const initials = name
    ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSavingProfile(true);
    const result = updateProfile({ name: name.trim(), email: email.trim() });
    setSavingProfile(false);
    if (!result.ok) setError(result.error);
    else setSuccess("Profile updated.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!currentPassword || !newPassword) {
      setError("Enter your current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setSavingPassword(true);
    const result = updateProfile({ currentPassword, newPassword });
    setSavingPassword(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-4xl">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account details and password.
        </p>
      </motion.header>

      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-mint/30 bg-mint-soft text-ink"
          }`}
        >
          {error ? <AlertCircle className="size-4 shrink-0" /> : <Check className="size-4 shrink-0" />}
          <span>{error ?? success}</span>
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-2xl bg-card border border-border shadow-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 rounded-full gradient-mint grid place-items-center text-ink text-xl font-bold shadow-glow shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-lg font-semibold">{name || "Your account"}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full name" >
            <TextInput
              id="name"
              leftIcon={<User className="size-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>
          <Field label="Email" >
            <TextInput
              id="email"
              type="email"
              leftIcon={<Mail className="size-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </Field>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={savingProfile} className="gap-2">
              <Save className="size-4" />
              {savingProfile ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border shadow-card p-6"
      >
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Use at least 6 characters. You'll stay signed in after updating.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Current password"  className="md:col-span-2">
            <TextInput
              id="current"
              type="password"
              leftIcon={<Lock className="size-4" />}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Field label="New password" >
            <TextInput
              id="new"
              type="password"
              leftIcon={<Lock className="size-4" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Field label="Confirm new password" >
            <TextInput
              id="confirm"
              type="password"
              leftIcon={<Lock className="size-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={savingPassword} className="gap-2">
              <Save className="size-4" />
              {savingPassword ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </motion.section>
    </div>
  );
}
