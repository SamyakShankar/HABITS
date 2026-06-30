"use client";

import { useState } from "react";
import { Activity, AlarmClock, CheckCircle2, Flame, Target, TrendingUp, CalendarCheck, Gem, BatteryCharging, Brain, Sparkles, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { XpHero } from "@/components/xp-hero";
import { NeonPanel } from "@/components/neon-panel";
import { HabitBoard } from "@/components/habit-board";
import { ConsistencyHeatmap } from "@/components/heatmap";
import { WeeklyChart } from "@/components/charts";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/app-store";
import { createClient } from "@/lib/supabase/client";

type MoodValue = "Low" | "Calm" | "Sharp" | "Lit" | "Zen";

const MOODS: MoodValue[] = ["Low", "Calm", "Sharp", "Lit", "Zen"];

const moodStyles: Record<MoodValue, string> = {
  Low: "border-danger/40 bg-danger/10 text-danger",
  Calm: "border-cyan/50 bg-cyan/15 text-cyan",
  Sharp: "border-mint/50 bg-mint/15 text-mint",
  Lit: "border-warning/50 bg-warning/15 text-warning",
  Zen: "border-pulse/50 bg-pulse/15 text-pulse"
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const profile = useAppStore((state) => state.profile);
  const achievements = useAppStore((state) => state.achievements);
  const categoryScores = useAppStore((state) => state.categoryScores);
  const notes = useAppStore((state) => state.notes);
  const moods = useAppStore((state) => state.moods);
  const saveMood = useAppStore((state) => state.saveMood);
  const addNote = useAppStore((state) => state.addNote);

  const [noteInput, setNoteInput] = useState("");
  const [savingMood, setSavingMood] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const dailyProgress = profile?.dailyProgress ?? 0;
  const streak = profile?.streak ?? 0;
  const weeklyConsistency = profile?.weeklyConsistency ?? 0;
  const focusMinutes = profile?.focusMinutes ?? 0;

  // Today's mood
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMood = moods.find((m) => m.entry_date === todayStr)?.mood ?? null;

  const quickActions = [
    { label: "Create Habit", icon: Target, href: "/dashboard" },
    { label: "Start Focus", icon: AlarmClock, href: "/focus" },
    { label: "Daily Review", icon: CalendarCheck, href: "/analytics" },
    { label: "Claim XP", icon: Gem, href: "/profile" }
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked).slice(0, 3);

  const bestCategory = [...categoryScores].sort((a, b) => b.score - a.score)[0];

  const insightCards = [
    { label: "Peak Focus Window", value: "9:00 AM", icon: BatteryCharging },
    { label: "Best Category", value: bestCategory?.name || "None", icon: Brain },
    { label: "Today's Mood", value: todayMood ?? "Not set", icon: Sparkles },
    { label: "Consistency", value: `${weeklyConsistency}%`, icon: Activity }
  ];

  const handleMood = async (mood: MoodValue) => {
    setSavingMood(true);
    await saveMood(supabase, mood);
    setSavingMood(false);
  };

  const handleAddNote = async () => {
    if (!noteInput.trim()) return;
    setSavingNote(true);
    await addNote(supabase, noteInput.trim());
    setNoteInput("");
    setSavingNote(false);
  };

  return (
    <AppShell>
      <div className="grid min-w-0 gap-5">
        <XpHero />
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(240px,280px)_minmax(0,1fr)_minmax(260px,300px)]">
          {/* Left Rail */}
          <div className="min-w-0 space-y-5">
            <NeonPanel title="Quick Actions" kicker="Left Rail">
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push(action.href)}
                    >
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
                    <p className="font-display text-4xl font-black text-white">{dailyProgress}%</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-cyan">Online</p>
                  </div>
                </div>
              </div>
              <Progress value={dailyProgress} />
            </NeonPanel>
            <NeonPanel title="Categories" kicker="Habits">
              <div className="space-y-3">
                {categoryScores.length > 0 ? (
                  categoryScores.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex justify-between rounded border border-white/10 bg-black/25 p-3 text-sm text-slate-200"
                    >
                      <span>{cat.name}</span>
                      <span className="font-bold text-white">{cat.score}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Add habits to see category scores.</p>
                )}
              </div>
            </NeonPanel>
          </div>

          {/* Center */}
          <main className="min-w-0 space-y-5">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Daily Progress" value={`${dailyProgress}%`} icon={CheckCircle2} accent="text-mint" />
              <StatCard label="Streak" value={`${streak} days`} icon={Flame} accent="text-danger" />
              <StatCard label="Focus Time" value={`${focusMinutes}m`} icon={AlarmClock} accent="text-cyan" />
              <StatCard label="Weekly Score" value={`${weeklyConsistency}%`} icon={TrendingUp} accent="text-pulse" />
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

          {/* Right Rail */}
          <div className="min-w-0 space-y-5">
            <NeonPanel title="Achievements" kicker="Unlocked">
              <div className="space-y-3">
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.map((achievement) => (
                    <div key={achievement.id} className="rounded-lg border border-pulse/30 bg-pulse/10 p-3">
                      <p className="font-display text-xs font-black uppercase text-white">{achievement.title}</p>
                      <p className="text-xs text-slate-400">{achievement.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Complete habits to unlock badges.</p>
                )}
              </div>
            </NeonPanel>

            {/* Mood Tracker — live */}
            <NeonPanel title="Mood Tracker" kicker="Today">
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((mood) => {
                  const isActive = todayMood === mood;
                  return (
                    <button
                      key={mood}
                      disabled={savingMood}
                      onClick={() => handleMood(mood)}
                      className={`rounded-md border py-3 text-[10px] font-bold uppercase transition-all duration-200 ${
                        isActive
                          ? moodStyles[mood]
                          : "border-pulse/25 bg-black/25 text-slate-400 hover:border-pulse/50 hover:text-white"
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
              {todayMood && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  Today&apos;s signal: <span className="font-bold text-white">{todayMood}</span>
                </p>
              )}
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

            {/* Notes — live */}
            <NeonPanel title="Notes" kicker="Quick Capture">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    placeholder="Capture a thought..."
                    className="flex-1 rounded border border-pulse/30 bg-black/25 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/20"
                  />
                  <Button size="icon" variant="cyan" onClick={handleAddNote} disabled={savingNote || !noteInput.trim()}>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-xs text-slate-500">No notes yet. Capture your thoughts.</p>
                  ) : (
                    notes.slice(0, 5).map((note) => (
                      <p key={note.id} className="rounded border border-pulse/25 bg-black/25 p-2.5 text-xs text-slate-300">
                        {note.content}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </NeonPanel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
