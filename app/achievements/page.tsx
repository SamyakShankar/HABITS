"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/shell/app-shell";
import { NeonPanel } from "@/components/neon-panel";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const rarityStyles = {
  Common: "border-cyan/35 bg-cyan/10 text-cyan",
  Rare: "border-mint/40 bg-mint/10 text-mint",
  Epic: "border-pulse/50 bg-pulse/15 text-pulse",
  Legendary: "border-warning/50 bg-warning/10 text-warning"
};

export default function AchievementsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-cyan">Collectibles</p>
          <h1 className="mt-2 pixel-title text-3xl font-black uppercase text-white">Achievement vault</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, rotateX: 4 }}
                className={cn(
                  "relative overflow-hidden rounded-lg border p-5 backdrop-blur-xl",
                  rarityStyles[achievement.rarity],
                  achievement.unlocked ? "shadow-neon" : "opacity-75 grayscale"
                )}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-current opacity-20 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="grid h-14 w-14 place-items-center rounded-lg border border-current bg-black/40">
                      <Icon className="h-8 w-8" />
                    </div>
                    <span className="rounded border border-current bg-black/30 px-2 py-1 text-[10px] font-black uppercase">
                      {achievement.rarity}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-black uppercase text-white">{achievement.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{achievement.description}</p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs uppercase text-slate-300">
                      <span>{achievement.unlocked ? "Unlocked" : "Progress"}</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <NeonPanel title="Milestone Unlocks" kicker="Next Rewards">
          <div className="grid gap-3 md:grid-cols-3">
            {["Streak Freeze Slot", "Aurora Theme", "Level-up Animation"].map((reward) => (
              <div key={reward} className="rounded border border-pulse/30 bg-black/25 p-4 text-sm text-slate-200">
                {reward}
              </div>
            ))}
          </div>
        </NeonPanel>
      </div>
    </AppShell>
  );
}
