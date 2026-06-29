import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Play, Pause, Download, Volume2, Clock, Calendar, Phone,
  Smile, Meh, Frown, MessageSquareQuote, FileText, Database, ShieldAlert
} from "lucide-react";
import type { Call } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CallDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  call: Call | null;
}

const sentimentIcon = {
  pos: <Smile className="size-4 text-emerald-500" />,
  neu: <Meh className="size-4 text-amber-500" />,
  neg: <Frown className="size-4 text-rose-500" />,
} as const;

export function CallDetailDialog({ open, onOpenChange, call }: CallDetailDialogProps) {
  const [tab, setTab] = useState<"transcript" | "summary" | "logs">("transcript");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset player states when a different call is selected
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [call?.id]);

  if (!call) return null;

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 135); // fallback to 2m15s
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleDownload = () => {
    // Create a mock audio download
    const sampleAudioUrl = call.recordingUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    const link = document.createElement("a");
    link.href = sampleAudioUrl;
    link.target = "_blank";
    link.download = `recording-${call.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded-3xl shadow-elevated p-0 overflow-hidden bg-card border border-border">
        {/* Hidden Audio element */}
        <audio
          ref={audioRef}
          src={call.recordingUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="font-display text-2xl flex items-center justify-between">
            <span>Call Details & Recording</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-[340px_1fr] gap-6 p-8 pt-4 h-[580px] overflow-hidden">
          {/* Left panel: Info & Audio Player */}
          <div className="flex flex-col justify-between border-r border-border/60 pr-6 overflow-y-auto space-y-5">
            <div className="space-y-4">
              {/* Contact Details */}
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Contact Info</div>
                <div className="font-display font-semibold text-lg">{call.contact}</div>
                <div className="text-xs text-muted-foreground font-mono flex items-center gap-1"><Phone className="size-3" /> {call.phone}</div>
              </div>

              {/* Call Stats */}
              <div className="space-y-2 text-xs border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Campaign</span>
                  <span className="font-medium">{call.campaign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Agent</span>
                  <span className="font-medium">{call.agent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outcome</span>
                  <span className={cn(
                    "font-semibold rounded-full px-2 py-0.5 text-[10px]",
                    call.outcome === "Booked Demo" ? "bg-emerald-50 text-emerald-700" :
                    call.outcome === "DNC" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                  )}>{call.outcome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sentiment</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {sentimentIcon[call.sentiment]}
                    <span className="capitalize">{call.sentiment === "pos" ? "Positive" : call.sentiment === "neu" ? "Neutral" : "Negative"}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Score</span>
                  <span className="font-bold text-mint-deep">{call.score}/100</span>
                </div>
              </div>
            </div>

            {/* Premium Audio Player */}
            <div className="rounded-2xl bg-muted/30 border border-border p-4 space-y-4">
              <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Volume2 className="size-3.5" /> Call Recording</div>
              
              {/* Playback Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="size-10 rounded-xl gradient-mint text-ink grid place-items-center shadow-glow shrink-0 hover:opacity-90 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4 ml-0.5" fill="currentColor" />}
                </button>
                <div className="flex-1 min-w-0">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-mint-deep"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Speed controls & Download button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div className="flex gap-1">
                  {[1, 1.25, 1.5].map(s => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={cn(
                        "text-[10px] font-semibold px-2 py-1 rounded-md border border-border/80 transition-all",
                        playbackSpeed === s ? "bg-mint text-ink border-transparent" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-mint-deep bg-mint-soft hover:bg-mint/20 px-2.5 py-1.5 rounded-lg transition-all"
                >
                  <Download className="size-3" /> Download
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Content Tabs */}
          <div className="flex flex-col h-full overflow-hidden">
            {/* Tab buttons */}
            <div className="inline-flex p-1 bg-muted rounded-xl self-start mb-4 shrink-0">
              {[
                { id: "transcript", label: "Transcript", icon: MessageSquareQuote },
                { id: "summary", label: "AI Summary", icon: FileText },
                { id: "logs", label: "Technical Logs", icon: Database },
              ].map(t => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as typeof tab)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all",
                      active ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="size-3.5" /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content containers */}
            <div className="flex-1 overflow-y-auto p-0.5 space-y-4">
              {tab === "transcript" && (
                <div className="space-y-4 pr-2">
                  {call.transcript && call.transcript.length > 0 ? (
                    call.transcript.map((m, i) => (
                      <div key={i} className={cn("flex gap-3", m.from === "user" ? "flex-row-reverse" : "")}>
                        <div className={cn(
                          "size-8 rounded-full grid place-items-center text-[10px] font-bold shrink-0 shadow-sm",
                          m.from === "user" ? "bg-emerald-500 text-white" : "gradient-mint text-ink"
                        )}>
                          {m.initials}
                        </div>
                        <div className="space-y-1">
                          <div className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm max-w-[420px] shadow-sm leading-relaxed",
                            m.from === "user" ? "bg-mint-soft text-foreground rounded-tr-sm" : "bg-muted/70 text-foreground rounded-tl-sm"
                          )}>
                            {m.text}
                          </div>
                          <div className={cn("text-[10px] text-muted-foreground px-1", m.from === "user" ? "text-right" : "text-left")}>
                            {m.time}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground text-sm">No transcript available for this call.</div>
                  )}
                </div>
              )}

              {tab === "summary" && (
                <div className="space-y-4 bg-muted/20 border border-border p-5 rounded-2xl">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">AI-Generated Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{call.summary || "No summary available."}</p>
                  </div>
                  <div className="border-t border-border/60 pt-4 space-y-2">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Key Details extracted</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                      <div className="bg-card p-3 rounded-xl border border-border/40">
                        <div className="text-xs text-muted-foreground">Follow-up action</div>
                        <div className="font-semibold mt-0.5 text-foreground">{call.outcome === "Booked Demo" ? "Prepare demo environment" : "Schedule call back"}</div>
                      </div>
                      <div className="bg-card p-3 rounded-xl border border-border/40">
                        <div className="text-xs text-muted-foreground">Sentiment confidence</div>
                        <div className="font-semibold mt-0.5 text-foreground">96% Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "logs" && (
                <div className="space-y-3 font-mono text-xs pr-2">
                  {call.logs && call.logs.length > 0 ? (
                    call.logs.map((log) => (
                      <div key={log.id} className="border border-border/50 bg-muted/20 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span className="bg-muted px-2 py-0.5 rounded font-bold uppercase">{log.category}</span>
                          <span>{log.contactId}</span>
                        </div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          {log.level === "warn" && <ShieldAlert className="size-4 text-amber-500" />}
                          {log.message}
                        </div>
                        <pre className="text-[10px] overflow-x-auto bg-card p-2 rounded border border-border/30 text-muted-foreground max-h-[100px]">{log.raw}</pre>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground text-sm">No technical logs available.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
