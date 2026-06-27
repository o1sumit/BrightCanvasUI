import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSession, isAuthenticated } from "@/lib/mock-auth";
import { getActiveWorkspace, listWorkspaces } from "@/lib/mock-workspaces";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login", replace: true });
      return;
    }
    const session = getSession()!;
    const list = listWorkspaces(session.userId);
    if (list.length === 0) {
      navigate({ to: "/workspaces/new", replace: true });
      return;
    }
    const active = getActiveWorkspace(session.userId);
    if (!active) {
      navigate({ to: "/workspaces", replace: true });
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }, [navigate]);
  return null;
}
