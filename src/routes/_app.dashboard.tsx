import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate as mAnimate } from "framer-motion";
import { Phone, PhoneCall, PhoneMissed, Users, TrendingUp, Calendar, Sparkles, ArrowUpRight, ArrowDownRight, Clock, Target, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Tunis Agent Ai" }] }),
  component: DashboardPage,
});

const kpis = [
  { label: "Total Contacts", value: 12480, display: (n: number) => n.toLocaleString(), delta: "+8.2%", up: true, icon: Users },
  { label: "Calls Completed", value: 4128, display: (n: number) => n.toLocaleString(), delta: "+12.4%", up: true, icon: PhoneCall },
  { label: "Connected Calls", value: 3012, display: (n: number) => n.toLocaleString(), delta: "+6.1%", up: true, icon: Phone },
  { label: "Interested Leads", value: 942, display: (n: number) => n.toLocaleString(), delta: "+18.3%", up: true, icon: Target },
  { label: "Conversion Rate", value: 31.2, display: (n: number) => `${n.toFixed(1)}%`, delta: "+2.4%", up: true, icon: TrendingUp },
  { label: "Avg Call Duration", value: 168, display: (n: number) => `${Math.floor(n / 60)}m ${Math.round(n % 60).toString().padStart(2, "0")}s`, delta: "-0:12", up: false, icon: Clock },
  { label: "Missed Calls", value: 118, display: (n: number) => Math.round(n).toLocaleString(), delta: "-4.0%", up: true, icon: PhoneMissed },
  { label: "Appointments", value: 286, display: (n: number) => Math.round(n).toLocaleString(), delta: "+22.1%", up: true, icon: Calendar },
  { label: "Revenue Influenced", value: 84.2, display: (n: number) => `$${n.toFixed(1)}k`, delta: "+14.0%", up: true, icon: DollarSign },
];

const insights = [
  { title: "Top performing campaign", body: "Summer Offer Campaign generated 37 qualified leads this week.", tag: "Campaign" },
  { title: "Best agent", body: "Aria converted 28% of conversations into booked meetings.", tag: "Agent" },
  { title: "Sentiment trend", body: "Positive sentiment up 12% across renewal calls.", tag: "Sentiment" },
];

const funnel = [
  { label: "Contacts", value: 12480, pct: 100 },
  { label: "Connected", value: 3012, pct: 75 },
  { label: "Interested", value: 942, pct: 52 },
  { label: "Qualified", value: 612, pct: 34 },
  { label: "Converted", value: 286, pct: 18 },
];

const callVolumeData = {
  Day: {
    label: "Last 24 hours",
    bars: [
      { label: "12 AM", value: 4 }, { label: "2 AM", value: 2 }, { label: "4 AM", value: 1 },
      { label: "6 AM", value: 6 }, { label: "8 AM", value: 18 }, { label: "10 AM", value: 32 },
      { label: "12 PM", value: 41 }, { label: "2 PM", value: 38 }, { label: "4 PM", value: 44 },
      { label: "6 PM", value: 27 }, { label: "8 PM", value: 14 }, { label: "10 PM", value: 8 },
    ],
  },
  Week: {
    label: "Last 13 days",
    bars: [
      { label: "Jun 4", value: 142 }, { label: "Jun 5", value: 178 }, { label: "Jun 6", value: 124 },
      { label: "Jun 7", value: 236 }, { label: "Jun 8", value: 198 }, { label: "Jun 9", value: 284 },
      { label: "Jun 10", value: 220 }, { label: "Jun 11", value: 312 }, { label: "Jun 12", value: 256 },
      { label: "Jun 13", value: 328 }, { label: "Jun 14", value: 274 }, { label: "Jun 15", value: 362 },
      { label: "Jun 16", value: 340 },
    ],
  },
  Month: {
    label: "Last 12 months",
    bars: [
      { label: "Jul", value: 1840 }, { label: "Aug", value: 2120 }, { label: "Sep", value: 1980 },
      { label: "Oct", value: 2480 }, { label: "Nov", value: 2640 }, { label: "Dec", value: 2280 },
      { label: "Jan", value: 2920 }, { label: "Feb", value: 3120 }, { label: "Mar", value: 3460 },
      { label: "Apr", value: 3240 }, { label: "May", value: 3820 }, { label: "Jun", value: 4128 },
    ],
  },
} as const;

type RangeKey = keyof typeof callVolumeData;

function CountUp({ to, format, duration = 1.2 }: { to: number; format: (n: number) => string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => format(v));
  useEffect(() => {
    if (!inView) return;
    const controls = mAnimate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, duration, mv]);
  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return () => unsub();
  }, [rounded]);
  return <span ref={ref}>{format(0)}</span>;
}

function CallVolumeChart({ range }: { range: RangeKey }) {
  const bars = callVolumeData[range].bars;
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="relative flex-1 min-h-0 flex items-end gap-2">
      {bars.map((b, i) => {
        const h = Math.max((b.value / max) * 100, 4);
        return (
          <div key={`${range}-${i}`} className="group relative flex-1 h-full flex flex-col justify-end">
            <motion.div
              className="relative w-full"
              initial={{ height: "0%" }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full h-full rounded-t-md gradient-mint opacity-90 group-hover:opacity-100 transition-all" />
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="rounded-lg bg-ink text-white text-xs font-medium px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                  <div className="font-semibold tabular-nums">{b.value.toLocaleString()} calls</div>
                  <div className="text-[10px] text-white/70">{b.label}</div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function SentimentDonut() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="flex items-center justify-center my-6">
      <div className="relative size-40">
        <svg viewBox="0 0 36 36" className="size-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted)" strokeWidth="3.5" />
          <motion.circle
            cx="18" cy="18" r="15.9" fill="none" stroke="var(--mint)" strokeWidth="3.5" strokeLinecap="round"
            initial={{ strokeDasharray: "0 100" }}
            animate={inView ? { strokeDasharray: "68 100" } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted-foreground)" strokeWidth="3.5" strokeDashoffset="-68" strokeLinecap="round" opacity="0.4"
            initial={{ strokeDasharray: "0 100" }}
            animate={inView ? { strokeDasharray: "22 100" } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="18" cy="18" r="15.9" fill="none" stroke="#fb7185" strokeWidth="3.5" strokeDashoffset="-90" strokeLinecap="round"
            initial={{ strokeDasharray: "0 100" }}
            animate={inView ? { strokeDasharray: "10 100" } : {}}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <motion.div
          className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold">
              <CountUp to={68} format={(n) => `${Math.round(n)}%`} duration={1.1} />
            </div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState<RangeKey>("Week");
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">A live look at your AI voice operations.</p>
        </div>
        <Button className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow hover:opacity-90 hover:scale-[1.02] transition-all">
          <Sparkles className="size-4 mr-1.5" strokeWidth={2.5} /> AI Insights
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((k, idx) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-glow transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="size-9 rounded-xl bg-mint-soft grid place-items-center text-mint shrink-0">
                <k.icon className="size-4 shrink-0" />
              </div>
              <span className={`text-xs font-semibold inline-flex items-center gap-0.5 ${k.up ? "text-emerald-600" : "text-rose-500"}`}>
                {k.up ? <ArrowUpRight className="size-3 shrink-0" /> : <ArrowDownRight className="size-3 shrink-0" />} {k.delta}
              </span>
            </div>
            <div className="mt-4 text-2xl font-bold tracking-tight tabular-nums">
              <CountUp to={k.value} format={k.display} duration={1.2 + idx * 0.05} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-card p-6 flex flex-col min-h-80">
          <div className="flex items-center justify-between mb-5 gap-4 shrink-0">
            <div className="min-w-0">
              <h2 className="font-semibold text-lg">Call Volume</h2>
              <p className="text-xs text-muted-foreground">{callVolumeData[range].label}</p>
            </div>
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg text-xs shrink-0">
              {(Object.keys(callVolumeData) as RangeKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setRange(t)}
                  className={`px-3 py-1 rounded-md transition-colors ${range === t ? "bg-card shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <CallVolumeChart range={range} />
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-4 text-mint" />
            <h2 className="font-semibold">AI Insights</h2>
          </div>
          <div className="space-y-3">
            {insights.map((i, idx) => (
              <motion.div
                key={i.title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.08 }}
                className="rounded-xl border border-border p-4 hover:bg-mint-soft/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-mint uppercase tracking-wider">{i.tag}</span>
                </div>
                <div className="text-sm font-semibold">{i.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{i.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-card p-6">
          <h2 className="font-semibold text-lg mb-5">Lead Funnel</h2>
          <div className="space-y-3">
            {funnel.map((f, idx) => (
              <div key={f.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{f.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    <CountUp to={f.value} format={(n) => Math.round(n).toLocaleString()} duration={1.1 + idx * 0.08} />
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full gradient-mint rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${f.pct}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-card p-6">
          <h2 className="font-semibold text-lg mb-5">Sentiment</h2>
          <SentimentDonut />
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div><div className="size-2 rounded-full bg-mint mx-auto mb-1" /> Positive 68%</div>
            <div><div className="size-2 rounded-full bg-muted-foreground/40 mx-auto mb-1" /> Neutral 22%</div>
            <div><div className="size-2 rounded-full bg-rose-400 mx-auto mb-1" /> Negative 10%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
