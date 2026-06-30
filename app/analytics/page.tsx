"use client";

import { Activity, AlarmClock, BadgeCheck, Brain, CalendarDays, Flame, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { NeonPanel } from "@/components/neon-panel";
import { StatCard } from "@/components/stat-card";
import { ConsistencyHeatmap } from "@/components/heatmap";
import { DisciplineLineChart, TrendChart, WeeklyChart } from "@/components/charts";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/app-store";

export default function AnalyticsPage() {
  const categoryScores = useAppStore(state => state.categoryScores);
  const focusHistory = useAppStore(state => state.focusHistory);
  const profile = useAppStore(state => state.profile);

  const dailyProgress = profile?.dailyProgress ?? 0;
  const streak = profile?.streak ?? 0;
  const focusMinutes = profile?.focusMinutes ?? 0;
  
  return (
    <AppShell>
      <div className="min-w-0 space-y-5">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-cyan">Private Analytics</p>
          <h1 className="mt-2 pixel-title text-3xl font-black uppercase text-white">Your improvement telemetry</h1>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-4">
          <StatCard label="Completion" value={`${dailyProgress}%`} icon={BadgeCheck} accent="text-mint" />
          <StatCard label="Focus Total" value={`${focusMinutes}m`} icon={AlarmClock} accent="text-cyan" />
          <StatCard label="Best Streak" value={`${streak} days`} icon={Flame} accent="text-danger" />
          <StatCard label="XP Velocity" value="+18%" icon={TrendingUp} accent="text-pulse" />
        </div>
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
          <NeonPanel title="Weekly Consistency Graph" kicker="Completion + Focus">
            <WeeklyChart />
          </NeonPanel>
          <NeonPanel title="Habit Completion Heatmap" kicker="Daily Signal">
            <ConsistencyHeatmap />
          </NeonPanel>
        </div>
        <div className="grid min-w-0 gap-5 xl:grid-cols-2">
          <NeonPanel title="Monthly XP Trend" kicker="Progression">
            <TrendChart />
          </NeonPanel>
          <NeonPanel title="Discipline Curve" kicker="Streak History">
            <DisciplineLineChart />
          </NeonPanel>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-3">
          <NeonPanel title="Most Successful Habits" kicker="Top Systems">
            <div className="space-y-4">
              {[
                ["Deep Work Block", 94, Brain],
                ["Morning Mobility", 78, Activity],
                ["Read 12 Pages", 82, Target]
              ].map(([name, value, Icon]) => {
                const HabitIcon = Icon as typeof Brain;
                return (
                  <div key={name as string}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-white">
                        <HabitIcon className="h-4 w-4 text-cyan" />
                        {name as string}
                      </span>
                      <span className="text-cyan">{value as number}%</span>
                    </div>
                    <Progress value={value as number} />
                  </div>
                );
              })}
            </div>
          </NeonPanel>
          <NeonPanel title="Focus Time Analytics" kicker="Sessions">
            <div className="space-y-3">
              {focusHistory.map((session) => (
                <div key={session.label} className="flex items-center justify-between rounded border border-white/10 bg-black/25 p-3">
                  <div>
                    <p className="font-display text-sm font-black text-white">{session.label}</p>
                    <p className="text-xs text-slate-400">{session.sessions} sessions</p>
                  </div>
                  <p className="font-display text-lg font-black text-cyan">{session.minutes}m</p>
                </div>
              ))}
            </div>
          </NeonPanel>
          <NeonPanel title="Category Scores" kicker="Balance">
            <div className="space-y-3">
              {categoryScores.map((category) => (
                <div key={category.name}>
                  <div className="mb-2 flex justify-between text-xs uppercase text-slate-300">
                    <span>{category.name}</span>
                    <span>{category.score}%</span>
                  </div>
                  <Progress value={category.score} />
                </div>
              ))}
            </div>
          </NeonPanel>
        </div>
        <NeonPanel title="Calendar Integration Preview" kicker="Mock UI">
          <div className="grid gap-3 md:grid-cols-7">
            {Array.from({ length: 14 }, (_, index) => (
              <div key={index} className="rounded border border-pulse/25 bg-black/25 p-3 text-center">
                <CalendarDays className="mx-auto h-4 w-4 text-pulse" />
                <p className="mt-2 text-xs text-slate-300">Day {index + 1}</p>
              </div>
            ))}
          </div>
        </NeonPanel>
      </div>
    </AppShell>
  );
}
