// Simple localStorage-based mock auth. No real security — for prototype only.
const SESSION_KEY = "tunis_session";
const USERS_KEY = "tunis_users";

export type MockUser = {
  id: string;
  name: string;
  company?: string;
  email: string;
  password: string; // plain-text — mock only
};

export type MockSession = {
  userId: string;
  email: string;
  name: string;
};

function readUsers(): MockUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockSession) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function signIn(email: string, password: string): { ok: true; session: MockSession } | { ok: false; error: string } {
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, error: "No account found with this email." };
  if (user.password !== password) return { ok: false, error: "Incorrect password." };
  const session: MockSession = { userId: user.id, email: user.email, name: user.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function signUp(input: { name: string; company?: string; email: string; password: string }):
  | { ok: true; session: MockSession }
  | { ok: false; error: string } {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const user: MockUser = {
    id: crypto.randomUUID(),
    name: input.name,
    company: input.company,
    email: input.email,
    password: input.password,
  };
  users.push(user);
  writeUsers(users);
  const session: MockSession = { userId: user.id, email: user.email, name: user.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function resetPasswordRequest(email: string): { ok: boolean } {
  // Mock: just check existence
  const users = readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  return { ok: exists };
}

export function getCurrentUser(): MockUser | null {
  const session = getSession();
  if (!session) return null;
  return readUsers().find((u) => u.id === session.userId) ?? null;
}

export function updateProfile(input: { name?: string; email?: string; currentPassword?: string; newPassword?: string }):
  | { ok: true; session: MockSession }
  | { ok: false; error: string } {
  const session = getSession();
  if (!session) return { ok: false, error: "Not signed in." };
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === session.userId);
  if (idx === -1) return { ok: false, error: "Account not found." };
  const user = users[idx];

  if (input.email && input.email.toLowerCase() !== user.email.toLowerCase()) {
    if (users.some((u) => u.id !== user.id && u.email.toLowerCase() === input.email!.toLowerCase())) {
      return { ok: false, error: "Another account already uses this email." };
    }
    user.email = input.email;
  }
  if (input.name) user.name = input.name;

  if (input.newPassword) {
    if (!input.currentPassword || input.currentPassword !== user.password) {
      return { ok: false, error: "Current password is incorrect." };
    }
    user.password = input.newPassword;
  }

  users[idx] = user;
  writeUsers(users);
  const newSession: MockSession = { userId: user.id, email: user.email, name: user.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return { ok: true, session: newSession };
}
