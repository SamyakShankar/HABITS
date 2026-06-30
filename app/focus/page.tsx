"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlarmClock, CheckCircle2, Pause, Play, RotateCcw, Volume2, Waves } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { NeonPanel } from "@/components/neon-panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/store/app-store";
import { createClient } from "@/lib/supabase/client";

export default function FocusPage() {
  const focusHistory = useAppStore((state) => state.focusHistory);
  const saveFocusSession = useAppStore((state) => state.saveFocusSession);

  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createClient();

  const totalSeconds = minutes * 60;
  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  const display = useMemo(
    () =>
      `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`,
    [secondsLeft]
  );

  const handleComplete = useCallback(async () => {
    setRunning(false);
    setCompleted(true);
    await saveFocusSession(supabase, minutes);
  }, [saveFocusSession, supabase, minutes]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, handleComplete]);

  const handleStartPause = () => {
    if (completed) return;
    setRunning((prev) => !prev);
  };

  const handleReset = () => {
    setRunning(false);
    setCompleted(false);
    setSecondsLeft(minutes * 60);
  };

  // Update timer when slider changes (only if not running)
  const handleMinutesChange = (value: number[]) => {
    if (!running) {
      setMinutes(value[0]);
      setSecondsLeft(value[0] * 60);
      setCompleted(false);
    }
  };

  return (
    <AppShell>
      <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-pulse/40 bg-black/45 p-5 shadow-neon">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(159,92,255,.35),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(50,230,255,.12),transparent_34%)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan/40 shadow-cyan" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center py-10 text-center">
          <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-cyan">Immersive Focus Mode</p>
          <h1 className="mt-3 pixel-title text-4xl font-black uppercase text-white sm:text-6xl">Deep work chamber</h1>

          {/* Circular Progress Ring */}
          <div className="relative mt-10">
            <motion.div
              className="focus-ring grid h-72 w-72 place-items-center rounded-full border border-pulse/60 sm:h-96 sm:w-96"
              animate={{
                boxShadow: completed
                  ? "0 0 90px rgba(66,255,186,.65)"
                  : running
                  ? "0 0 90px rgba(159,92,255,.55)"
                  : "0 0 42px rgba(159,92,255,.32)"
              }}
            >
              {/* SVG progress circle */}
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(159,92,255,0.12)" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke={completed ? "#42ffba" : "#9f5cff"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div>
                <AnimatePresence mode="wait">
                  {completed ? (
                    <motion.div
                      key="done"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <CheckCircle2 className="h-14 w-14 text-mint" />
                      <p className="font-display text-xl font-black uppercase text-mint">Session Complete!</p>
                    </motion.div>
                  ) : (
                    <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <AlarmClock className="mx-auto h-10 w-10 text-cyan" />
                      <p className="mt-4 font-display text-6xl font-black text-white neon-text sm:text-7xl">
                        {display}
                      </p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                        {running ? "Session in progress" : "Ready when you are"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={handleStartPause} disabled={completed}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : completed ? "Done" : "Start"}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="cyan">
              <Volume2 className="h-4 w-4" />
              Ambient
            </Button>
          </div>

          <div className="mt-10 grid w-full gap-5 lg:grid-cols-3">
            <NeonPanel title="Session Length" kicker="Pomodoro">
              <div className="space-y-4">
                <Slider
                  value={[minutes]}
                  min={5}
                  max={90}
                  step={5}
                  onValueChange={handleMinutesChange}
                  disabled={running}
                />
                <div className="flex justify-between text-xs uppercase text-slate-300">
                  <span>5m</span>
                  <span className="text-cyan font-bold">{minutes}m selected</span>
                  <span>90m</span>
                </div>
              </div>
            </NeonPanel>
            <NeonPanel title="Focus Statistics" kicker="Today">
              <div className="space-y-3 text-left">
                {[
                  ["Sessions today", focusHistory[0]?.sessions ?? 0, 100],
                  ["Minutes today", focusHistory[0]?.minutes ?? 0, Math.min(100, ((focusHistory[0]?.minutes ?? 0) / 120) * 100)],
                  ["This week", focusHistory.reduce((a, f) => a + f.minutes, 0), 100]
                ].map(([label, value, pct]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex justify-between text-xs uppercase text-slate-300">
                      <span>{label as string}</span>
                      <span className="text-cyan">{value as number}{label === "Sessions today" ? "" : "m"}</span>
                    </div>
                    <Progress value={pct as number} />
                  </div>
                ))}
              </div>
            </NeonPanel>
            <NeonPanel title="Session History" kicker="Recent">
              <div className="space-y-2">
                {focusHistory.length === 0 ? (
                  <p className="text-xs text-slate-500">No sessions recorded yet.</p>
                ) : (
                  focusHistory.map((session) => (
                    <div
                      key={session.label}
                      className="flex items-center justify-between rounded border border-white/10 bg-black/25 p-3"
                    >
                      <span className="flex items-center gap-2 text-sm text-slate-200">
                        <Waves className="h-4 w-4 text-cyan" />
                        {session.label}
                      </span>
                      <span className="font-display text-sm font-black text-white">{session.minutes}m</span>
                    </div>
                  ))
                )}
              </div>
            </NeonPanel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
