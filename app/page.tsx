"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  CheckCircle2,
  Flame,
  NotebookPen,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { NeonPanel } from "@/components/neon-panel";
import { ConsistencyHeatmap } from "@/components/heatmap";
import { WeeklyChart } from "@/components/charts";
import { Progress } from "@/components/ui/progress";

const leftRail = [
  { icon: Target, title: "Goals", text: "Set goals. Crush tasks. Earn XP." },
  { icon: Activity, title: "Real Progress", text: "Track everything. See signals. Stay on track." },
  { icon: Brain, title: "Focus", text: "Cut distractions. Build habits. Stay in flow." }
];

const rightRail = [
  { icon: Trophy, title: "Achievements", text: "Unlock levels. Earn badges. Level up." },
  { icon: NotebookPen, title: "Notes", text: "Capture ideas. Review days. Plan better." },
  { icon: Shield, title: "Discipline", text: "Protect streaks. Recover fast. Keep moving." }
];

export default function LandingPage() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/onboarding">Onboarding</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Enter OS</Link>
          </Button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-6 pt-10 lg:grid-cols-[170px_1fr_170px] lg:pt-14">
        <FeatureRail items={leftRail} />

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-5xl"
          >
            <p className="font-display text-sm font-black uppercase tracking-[0.3em] text-cyan neon-text">HABITS</p>
            <h1 className="mt-5 pixel-title text-4xl font-black uppercase leading-tight text-white sm:text-6xl lg:text-7xl">
              You procrastinate because no one is watching.
            </h1>
            <p className="mt-5 font-display text-2xl font-black uppercase text-pulse neon-text sm:text-4xl">
              HABITS changes that.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto mt-8 max-w-4xl"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-pulse/25 blur-3xl" />
            <div className="relative rounded-xl border border-pulse/60 bg-[#050712] p-3 shadow-neon">
              <div className="rounded-lg border border-cyan/20 bg-gradient-to-br from-[#111749] to-[#050713] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <Logo className="scale-75 origin-left" />
                  <div className="flex gap-2 text-[10px] uppercase text-slate-400">
                    <span className="rounded border border-pulse/30 px-2 py-1">EN</span>
                    <span className="rounded border border-pulse/30 px-2 py-1">Offline</span>
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-pulse/70 to-cyan/25 p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Level 12</p>
                  <h2 className="font-display text-2xl font-black uppercase text-white">Disciplined</h2>
                  <p className="text-xs text-purple-100">3 day streak / 420 XP to next level</p>
                  <Progress value={82} className="mt-4 h-2 bg-black/30" />
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.05fr_1fr]">
                  <NeonPanel title="Goals" kicker="Personal" className="min-h-48 text-left">
                    <div className="space-y-3 text-sm text-slate-300">
                      <Progress value={74} />
                      <p>Deep work / Mobility / Reading</p>
                      <ConsistencyHeatmap />
                    </div>
                  </NeonPanel>
                  <NeonPanel title="Summary" kicker="Today" className="min-h-48 text-left">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["Total XP", "130"],
                        ["Tasks Done", "3"],
                        ["Focus", "145m"],
                        ["Score", "86%"]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded border border-white/10 bg-black/25 p-3">
                          <p className="text-[10px] uppercase text-slate-400">{label}</p>
                          <p className="font-display text-xl font-black text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-32">
                      <WeeklyChart className="h-32" />
                    </div>
                  </NeonPanel>
                  <NeonPanel title="Insights" kicker="Private" className="min-h-48 text-left">
                    <div className="space-y-3">
                      {["Peak focus: 9:20 AM", "Best habit: Deep Work", "Mood: Calm", "Freeze charges: 2"].map((item) => (
                        <div key={item} className="rounded border border-pulse/25 bg-pulse/10 p-3 text-xs text-slate-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </NeonPanel>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="default">
              <Link href="/dashboard">
                <Zap className="h-4 w-4" />
                Launch Dashboard
              </Link>
            </Button>
            <Button asChild variant="cyan">
              <Link href="/focus">
                <Flame className="h-4 w-4" />
                Start Focus
              </Link>
            </Button>
          </div>
        </div>

        <FeatureRail items={rightRail} />
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-4 md:grid-cols-3">
        {[
          ["Every completed task becomes points.", CheckCircle2],
          ["Every streak compounds your identity.", Sparkles],
          ["Every review upgrades tomorrow.", Trophy]
        ].map(([title, Icon]) => {
          const FeatureIcon = Icon as typeof CheckCircle2;
          return (
            <NeonPanel key={title as string} className="text-center">
              <FeatureIcon className="mx-auto h-8 w-8 text-pulse" />
              <p className="mt-4 font-display text-sm font-black uppercase text-white">{title as string}</p>
            </NeonPanel>
          );
        })}
      </section>
    </main>
  );
}

function FeatureRail({
  items
}: {
  items: { icon: typeof Target; title: string; text: string }[];
}) {
  return (
    <div className="hidden flex-col justify-center gap-10 lg:flex">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.04 }}
            className="relative text-center"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-pulse/50 bg-black/45 shadow-neon">
              <Icon className="h-8 w-8 text-pulse" />
            </div>
            <h3 className="mt-3 font-display text-sm font-black uppercase text-pulse neon-text">{item.title}</h3>
            <p className="mt-2 text-sm leading-snug text-slate-200">{item.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
