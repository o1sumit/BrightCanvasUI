import { CampaignStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const config: Record<CampaignStatus, { label: string; dot: string; bg: string; text: string }> = {
  active:    { label: "Active",    dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700" },
  failed:    { label: "Failed",    dot: "bg-rose-500",    bg: "bg-rose-50",     text: "text-rose-700" },
  paused:    { label: "Paused",    dot: "bg-slate-400",   bg: "bg-slate-100",   text: "text-slate-600" },
  scheduled: { label: "Scheduled", dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700" },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium", c.bg, c.text)}>
      <span className={cn("size-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

export const statusOptions = Object.entries(config).map(([k, v]) => ({ value: k as CampaignStatus, ...v }));
