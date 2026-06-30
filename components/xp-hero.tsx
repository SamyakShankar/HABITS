"use client";

import { motion } from "framer-motion";
import { Flame, Gem, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { smoothTransition } from "@/lib/motion";
import { useAppStore } from "@/store/app-store";

export function XpHero() {
  const profile = useAppStore(state => state.profile);
  
  const level = profile?.level ?? 1;
  const title = profile?.title ?? "Novice";
  const xp = profile?.xp ?? 0;
  const nextLevelXp = profile?.next_level_xp ?? 100;
  const quote = profile?.quote ?? "Small wins compound into identity.";
  const streak = profile?.streak ?? 0;
  const weeklyConsistency = profile?.weeklyConsistency ?? 0;
  const freezeCharges = profile?.freeze_charges ?? 0;

  const progress = Math.round((xp / nextLevelXp) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={smoothTransition}
      className="relative max-w-full overflow-hidden rounded-lg border border-pulse/40 bg-gradient-to-br from-pulse/45 via-[#161b54]/85 to-black/90 p-4 shadow-neon sm:p-5"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/15 to-transparent"
        animate={{ opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="relative z-10 grid min-w-0 gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-cyan/50 bg-cyan/10 text-cyan">
              <ShieldCheck className="mr-2 h-3 w-3" />
              Level {level}
            </Badge>
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple-100">
              {title}
            </span>
          </div>
          <h1 className="mt-4 max-w-full break-words pixel-title text-[2rem] font-black leading-tight text-white sm:text-5xl">
            Discipline console online
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-purple-100 sm:text-base">{quote}</p>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-200 sm:text-xs">
              <span className="shrink-0">{xp} XP</span>
              <span className="hidden min-w-0 text-right sm:inline">
                {nextLevelXp - xp} XP to next level
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-black/35" />
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:w-80">
          <div className="min-w-0 rounded-lg border border-white/10 bg-black/25 p-4 text-center">
            <Flame className="mx-auto h-6 w-6 text-danger" />
            <p className="mt-2 font-display text-2xl font-black">{streak}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">Day Streak</p>
          </div>
          <div className="min-w-0 rounded-lg border border-white/10 bg-black/25 p-4 text-center">
            <Gem className="mx-auto h-6 w-6 text-cyan" />
            <p className="mt-2 font-display text-2xl font-black">{weeklyConsistency}%</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">Consistency</p>
          </div>
          <div className="col-span-2 min-w-0 rounded-lg border border-white/10 bg-black/25 p-4 text-center sm:col-span-1">
            <p className="font-display text-2xl font-black text-mint">{freezeCharges}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">Freeze Charges</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
