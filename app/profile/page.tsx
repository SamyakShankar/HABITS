"use client";

import { Brain, Flame, Gem, ShieldCheck, Star, Trophy, Zap } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { NeonPanel } from "@/components/neon-panel";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { useAppStore } from "@/store/app-store";

export default function ProfilePage() {
  const profile = useAppStore(state => state.profile);
  const achievements = useAppStore(state => state.achievements);
  
  const level = profile?.level ?? 1;
  const title = profile?.title ?? "Novice";
  const xp = profile?.xp ?? 0;
  const nextLevelXp = profile?.next_level_xp ?? 100;
  const streak = profile?.streak ?? 0;
  const focusMinutes = profile?.focusMinutes ?? 0;
  const freezeCharges = profile?.freeze_charges ?? 0;
  const name = profile?.name ?? "User";
  
  const unlockedBadgesCount = achievements.filter(a => a.unlocked).length;

  return (
    <AppShell>
      <div className="min-w-0 space-y-5">
        <section className="relative overflow-hidden rounded-xl border border-pulse/45 bg-gradient-to-br from-pulse/30 via-black/65 to-cyan/10 p-6 shadow-neon">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-pulse/20 blur-3xl" />
          <div className="relative z-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-cyan">Profile / Progress</p>
              <h1 className="mt-3 pixel-title text-4xl font-black uppercase text-white">{name}</h1>
              <p className="mt-2 text-slate-300">Level {level} - {title}. Private progression profile, no public leaderboard.</p>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs uppercase text-slate-300">
                  <span>{xp} XP</span>
                  <span>{nextLevelXp - xp} XP remaining</span>
                </div>
                <Progress value={(xp / nextLevelXp) * 100} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Title" value={title} icon={ShieldCheck} />
              <StatCard label="Streak" value={`${streak} days`} icon={Flame} accent="text-danger" />
              <StatCard label="Badges" value={String(unlockedBadgesCount)} icon={Trophy} accent="text-warning" />
              <StatCard label="Focus" value={`${focusMinutes}m`} icon={Brain} accent="text-cyan" />
            </div>
          </div>
        </section>
        <div className="grid min-w-0 gap-5 lg:grid-cols-3">
          <NeonPanel title="Progression Path" kicker="RPG Track" className="lg:col-span-2">
            <div className="space-y-4">
              {[
                [`Level ${level}`, title, 100],
                [`Level ${level + 1}`, "Next Rank", 0],
                [`Level ${level + 2}`, "Future Rank", 0]
              ].map(([lvl, rank, progress]) => (
                <div key={lvl as string} className="rounded border border-pulse/25 bg-black/25 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-display text-sm font-black uppercase text-white">{lvl as string}</p>
                      <p className="text-sm text-slate-400">{rank as string}</p>
                    </div>
                    <Gem className="h-5 w-5 text-cyan" />
                  </div>
                  <Progress value={progress as number} />
                </div>
              ))}
            </div>
          </NeonPanel>
          <NeonPanel title="Streak Freeze" kicker="Recovery System">
            <div className="grid place-items-center py-6 text-center">
              <div className="focus-ring grid h-32 w-32 place-items-center rounded-full">
                <p className="font-display text-5xl font-black text-white">{freezeCharges}</p>
              </div>
              <p className="mt-4 text-sm text-slate-300">Charges available for planned recovery without identity damage.</p>
            </div>
          </NeonPanel>
        </div>
        <NeonPanel title="Recent Unlocks" kicker="Badges">
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.filter((achievement) => achievement.unlocked).map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.title} className="rounded border border-pulse/35 bg-pulse/10 p-4">
                  <Icon className="h-7 w-7 text-pulse" />
                  <p className="mt-3 font-display text-sm font-black uppercase text-white">{achievement.title}</p>
                  <p className="text-xs text-slate-400">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </NeonPanel>
        <NeonPanel title="Sound Effect Placeholders" kicker="Reward Feedback">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["XP Claim", Zap],
              ["Level Up", Star],
              ["Badge Unlock", Trophy]
            ].map(([label, Icon]) => {
              const SoundIcon = Icon as typeof Zap;
              return (
                <div key={label as string} className="rounded border border-white/10 bg-black/25 p-4 text-sm text-slate-200">
                  <SoundIcon className="mb-3 h-5 w-5 text-cyan" />
                  {label as string}
                </div>
              );
            })}
          </div>
        </NeonPanel>
      </div>
    </AppShell>
  );
}
