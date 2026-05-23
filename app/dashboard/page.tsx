"use client";

import { Activity, AlarmClock, CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { XpHero } from "@/components/xp-hero";
import { NeonPanel } from "@/components/neon-panel";
import { HabitBoard } from "@/components/habit-board";
import { ConsistencyHeatmap } from "@/components/heatmap";
import { WeeklyChart } from "@/components/charts";
import { StatCard } from "@/components/stat-card";
import { insightCards, quickActions, xpProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid min-w-0 gap-5">
        <XpHero />
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(240px,280px)_minmax(0,1fr)_minmax(260px,300px)]">
          <div className="min-w-0 space-y-5">
            <NeonPanel title="Goals" kicker="Left Rail">
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button key={action.label} variant="ghost" className="w-full justify-start">
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </NeonPanel>
            <NeonPanel title="Discipline Score" kicker="Today">
              <div className="grid place-items-center py-3">
                <div className="focus-ring grid h-36 w-36 place-items-center rounded-full border border-pulse/50">
                  <div className="text-center">
                    <p className="font-display text-4xl font-black text-white">{xpProfile.dailyProgress}%</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-cyan">Online</p>
                  </div>
                </div>
              </div>
              <Progress value={xpProfile.dailyProgress} />
            </NeonPanel>
            <NeonPanel title="Categories" kicker="Habits">
              <div className="space-y-3">
                {["Focus 94%", "Mind 82%", "Recovery 76%", "Body 71%"].map((item) => (
                  <div key={item} className="rounded border border-white/10 bg-black/25 p-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </NeonPanel>
          </div>

          <main className="min-w-0 space-y-5">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Daily Progress" value={`${xpProfile.dailyProgress}%`} icon={CheckCircle2} accent="text-mint" />
              <StatCard label="Streak" value={`${xpProfile.streak} days`} icon={Flame} accent="text-danger" />
              <StatCard label="Focus Time" value="145m" icon={AlarmClock} accent="text-cyan" />
              <StatCard label="Weekly Score" value="86%" icon={TrendingUp} accent="text-pulse" />
            </div>
            <NeonPanel title="Active Habits" kicker="Center Console">
              <HabitBoard />
            </NeonPanel>
            <div className="grid min-w-0 gap-5 lg:grid-cols-2">
              <NeonPanel title="Consistency Heatmap" kicker="42 Days">
                <ConsistencyHeatmap />
              </NeonPanel>
              <NeonPanel title="Productivity Analytics" kicker="Weekly">
                <WeeklyChart />
              </NeonPanel>
            </div>
          </main>

          <div className="min-w-0 space-y-5">
            <NeonPanel title="Achievements" kicker="Unlocked">
              <div className="space-y-3">
                {["7 Day Streak", "Deep Focus Master", "Early Bird"].map((achievement) => (
                  <div key={achievement} className="rounded-lg border border-pulse/30 bg-pulse/10 p-3">
                    <p className="font-display text-xs font-black uppercase text-white">{achievement}</p>
                    <p className="text-xs text-slate-400">Reward effect armed</p>
                  </div>
                ))}
              </div>
            </NeonPanel>
            <NeonPanel title="Mood Tracker" kicker="Journal">
              <div className="grid grid-cols-5 gap-2">
                {["Low", "Calm", "Sharp", "Lit", "Zen"].map((mood, index) => (
                  <button
                    key={mood}
                    className={`rounded-md border py-3 text-[10px] font-bold uppercase ${
                      index === 2 ? "border-cyan/70 bg-cyan/15 text-cyan shadow-cyan" : "border-pulse/25 bg-black/25 text-slate-400"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </NeonPanel>
            <NeonPanel title="Productivity Insights" kicker="Private">
              <div className="space-y-3">
                {insightCards.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <div key={insight.label} className="flex items-center gap-3 rounded border border-white/10 bg-black/25 p-3">
                      <Icon className="h-5 w-5 text-cyan" />
                      <div>
                        <p className="text-xs uppercase text-slate-400">{insight.label}</p>
                        <p className="font-display text-sm font-black text-white">{insight.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </NeonPanel>
            <NeonPanel title="Notes" kicker="Quick Capture">
              <p className="rounded border border-pulse/25 bg-black/25 p-3 text-sm text-slate-300">
                Protect the first two hours. Energy was highest before notifications.
              </p>
            </NeonPanel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
