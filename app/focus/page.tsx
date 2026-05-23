"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlarmClock, Pause, Play, RotateCcw, Volume2, Waves } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { NeonPanel } from "@/components/neon-panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { focusHistory } from "@/lib/mock-data";

export default function FocusPage() {
  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const secondsLeft = minutes * 60;
  const display = useMemo(() => `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:00`, [secondsLeft]);

  return (
    <AppShell>
      <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-pulse/40 bg-black/45 p-5 shadow-neon">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(159,92,255,.35),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(50,230,255,.12),transparent_34%)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan/40 shadow-cyan" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center py-10 text-center">
          <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-cyan">Immersive Focus Mode</p>
          <h1 className="mt-3 pixel-title text-4xl font-black uppercase text-white sm:text-6xl">Deep work chamber</h1>

          <motion.div
            className="focus-ring mt-10 grid h-72 w-72 place-items-center rounded-full border border-pulse/60 sm:h-96 sm:w-96"
            animate={{ boxShadow: running ? "0 0 90px rgba(159,92,255,.55)" : "0 0 42px rgba(159,92,255,.32)" }}
          >
            <div>
              <AlarmClock className="mx-auto h-10 w-10 text-cyan" />
              <p className="mt-4 font-display text-6xl font-black text-white neon-text sm:text-7xl">{display}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                {running ? "Session in progress" : "Ready when you are"}
              </p>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setRunning((value) => !value)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </Button>
            <Button variant="ghost" onClick={() => setRunning(false)}>
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
                <Slider value={[minutes]} min={15} max={90} step={5} onValueChange={(value) => setMinutes(value[0])} />
                <div className="flex justify-between text-xs uppercase text-slate-300">
                  <span>15m</span>
                  <span>{minutes}m selected</span>
                  <span>90m</span>
                </div>
              </div>
            </NeonPanel>
            <NeonPanel title="Focus Statistics" kicker="Today">
              <div className="space-y-3 text-left">
                {[
                  ["Deep work", 82],
                  ["Distraction shield", 91],
                  ["Energy", 76]
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex justify-between text-xs uppercase text-slate-300">
                      <span>{label as string}</span>
                      <span>{value as number}%</span>
                    </div>
                    <Progress value={value as number} />
                  </div>
                ))}
              </div>
            </NeonPanel>
            <NeonPanel title="Session History" kicker="Recent">
              <div className="space-y-2">
                {focusHistory.map((session) => (
                  <div key={session.label} className="flex items-center justify-between rounded border border-white/10 bg-black/25 p-3">
                    <span className="flex items-center gap-2 text-sm text-slate-200">
                      <Waves className="h-4 w-4 text-cyan" />
                      {session.label}
                    </span>
                    <span className="font-display text-sm font-black text-white">{session.minutes}m</span>
                  </div>
                ))}
              </div>
            </NeonPanel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
