"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfDay, subDays, format, isSameDay } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Profile,
  DbHabit,
  HabitCompletion,
  FocusSession,
  AchievementDefinition,
  UserAchievement,
  UserSettings,
  MoodEntry,
  Note
} from "@/types/database";
import type { Habit, Achievement } from "@/types";
import { resolveIcon } from "@/lib/icon-map";
import { toggleCompletion } from "@/lib/supabase/habits";

export type HydratedProfile = Profile & {
  weeklyConsistency: number;
  dailyProgress: number;
  focusMinutes: number;
};

export type HydratedAchievement = Achievement & {
  id: string;
};

export type WeeklyDataPoint = { day: string; completion: number; focus: number };
export type FocusHistoryPoint = { label: string; minutes: number; sessions: number };
export type CategoryScore = { name: string; score: number };

type AppState = {
  // Raw Data
  userId: string | null;
  rawProfile: Profile | null;
  rawHabits: DbHabit[];
  rawCompletions: HabitCompletion[];
  rawFocus: FocusSession[];
  rawAchievements: (UserAchievement & { achievement_definitions: AchievementDefinition })[];
  rawNotes: Note[];
  rawMoods: MoodEntry[];
  
  // Hydrated UI Data
  profile: HydratedProfile | null;
  habits: Habit[];
  weeklyData: WeeklyDataPoint[];
  heatmap: number[];
  achievements: HydratedAchievement[];
  focusHistory: FocusHistoryPoint[];
  categoryScores: CategoryScore[];
  
  // UI State
  selectedCategory: string;
  setCategory: (category: string) => void;

  // Actions
  initialize: (supabase: SupabaseClient<Database>, userId: string) => Promise<void>;
  setRawData: (
    profile: Profile,
    habits: DbHabit[],
    completions: HabitCompletion[],
    focusSessions: FocusSession[],
    achievements: (UserAchievement & { achievement_definitions: AchievementDefinition })[],
    notes: Note[],
    moods: MoodEntry[]
  ) => void;
  toggleHabit: (supabase: SupabaseClient<Database>, habitId: string) => Promise<void>;
  // ... more actions will be added later
};

/** Re-calculate all hydrated UI properties from raw data */
function computeHydratedState(
  rawProfile: Profile | null,
  rawHabits: DbHabit[],
  rawCompletions: HabitCompletion[],
  rawFocus: FocusSession[],
  rawAchievements: (UserAchievement & { achievement_definitions: AchievementDefinition })[]
) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayDate = new Date();

  // 1. Hydrate Habits
  const habits: Habit[] = rawHabits.map((dbHabit) => {
    const habitComps = rawCompletions.filter((c) => c.habit_id === dbHabit.id);
    const completedToday = habitComps.some((c) => c.completed_date === todayStr && c.completed);
    
    let streak = 0;
    let checkDate = startOfDay(new Date());
    if (!completedToday) {
      checkDate = subDays(checkDate, 1);
    }
    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd");
      const done = habitComps.some((c) => c.completed_date === dateStr && c.completed);
      if (done) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    const completionHistory = [];
    for (let i = 11; i >= 0; i--) {
      const dateStr = format(subDays(todayDate, i), "yyyy-MM-dd");
      completionHistory.push(habitComps.some((c) => c.completed_date === dateStr && c.completed));
    }

    return {
      id: dbHabit.id,
      title: dbHabit.title,
      icon: resolveIcon(dbHabit.icon_name),
      category: dbHabit.category,
      difficulty: dbHabit.difficulty,
      cadence: dbHabit.cadence,
      streak,
      xp: dbHabit.xp_reward,
      color: dbHabit.color,
      completed: completedToday,
      completionHistory,
      note: dbHabit.note
    };
  });

  // 2. Hydrate Profile
  let profile: HydratedProfile | null = null;
  if (rawProfile) {
    const totalHabitsToday = rawHabits.length; // Assuming all are daily for simplicity right now
    const completedHabitsToday = habits.filter(h => h.completed).length;
    const dailyProgress = totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;
    
    const todayFocus = rawFocus.filter(f => isSameDay(new Date(f.started_at), todayDate));
    const focusMinutes = todayFocus.reduce((acc, f) => acc + f.duration_minutes, 0);

    // Mock weekly consistency for now, will calculate later
    const weeklyConsistency = dailyProgress; // Fallback

    profile = {
      ...rawProfile,
      dailyProgress,
      focusMinutes,
      weeklyConsistency,
    };
  }

  // 3. Hydrate Weekly Data (last 7 days)
  const weeklyData: WeeklyDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(todayDate, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const dayLabel = format(d, "EEE");
    
    const compsThatDay = rawCompletions.filter(c => c.completed_date === dateStr && c.completed).length;
    const completionPct = rawHabits.length > 0 ? Math.round((compsThatDay / rawHabits.length) * 100) : 0;
    
    const focusThatDay = rawFocus.filter(f => isSameDay(new Date(f.started_at), d));
    const focusMins = focusThatDay.reduce((acc, f) => acc + f.duration_minutes, 0);
    
    weeklyData.push({ day: dayLabel, completion: completionPct, focus: focusMins });
  }

  // 4. Heatmap (last 42 days)
  const heatmap: number[] = [];
  for (let i = 41; i >= 0; i--) {
    const d = subDays(todayDate, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const compsThatDay = rawCompletions.filter(c => c.completed_date === dateStr && c.completed).length;
    const completionPct = rawHabits.length > 0 ? Math.round((compsThatDay / rawHabits.length) * 100) : 0;
    heatmap.push(completionPct);
  }

  // 5. Achievements
  const achievements: HydratedAchievement[] = rawAchievements.map(ra => ({
    id: ra.achievement_id,
    title: ra.achievement_definitions.title,
    description: ra.achievement_definitions.description,
    rarity: ra.achievement_definitions.rarity,
    unlocked: ra.unlocked,
    progress: ra.progress,
    icon: resolveIcon(ra.achievement_definitions.icon_name),
  }));

  // 6. Focus History
  const focusHistory: FocusHistoryPoint[] = [];
  for (let i = 0; i < 4; i++) {
    const d = subDays(todayDate, i);
    const label = i === 0 ? "Today" : format(d, "EEE");
    const focusThatDay = rawFocus.filter(f => isSameDay(new Date(f.started_at), d));
    focusHistory.push({
      label,
      minutes: focusThatDay.reduce((acc, f) => acc + f.duration_minutes, 0),
      sessions: focusThatDay.length
    });
  }

  // 7. Category Scores
  const categoryScores: CategoryScore[] = [
    "Mind", "Body", "Focus", "Craft", "Recovery"
  ].map(cat => {
    const catHabits = rawHabits.filter(h => h.category === cat);
    if (catHabits.length === 0) return { name: cat, score: 0 };
    
    // Average completion over last 7 days
    let totalScore = 0;
    for (let i = 0; i < 7; i++) {
      const dateStr = format(subDays(todayDate, i), "yyyy-MM-dd");
      const done = rawCompletions.filter(c => c.completed_date === dateStr && c.completed && catHabits.some(ch => ch.id === c.habit_id)).length;
      totalScore += (done / catHabits.length);
    }
    return { name: cat, score: Math.round((totalScore / 7) * 100) };
  });

  return { profile, habits, weeklyData, heatmap, achievements, focusHistory, categoryScores };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      rawProfile: null,
      rawHabits: [],
      rawCompletions: [],
      rawFocus: [],
      rawAchievements: [],
      rawNotes: [],
      rawMoods: [],

      profile: null,
      habits: [],
      weeklyData: [],
      heatmap: [],
      achievements: [],
      focusHistory: [],
      categoryScores: [],

      selectedCategory: "All",
      setCategory: (category) => set({ selectedCategory: category }),

      initialize: async (supabase, userId) => {
        set({ userId });
        // The actual data fetching will be done in DataProvider, and then we will call setRawData
      },

      setRawData: (
        profile: Profile,
        habits: DbHabit[],
        completions: HabitCompletion[],
        focusSessions: FocusSession[],
        achievements: (UserAchievement & { achievement_definitions: AchievementDefinition })[],
        notes: Note[],
        moods: MoodEntry[]
      ) => {
        set({
          rawProfile: profile,
          rawHabits: habits,
          rawCompletions: completions,
          rawFocus: focusSessions,
          rawAchievements: achievements,
          rawNotes: notes,
          rawMoods: moods,
          ...computeHydratedState(profile, habits, completions, focusSessions, achievements)
        });
      },

      toggleHabit: async (supabase, habitId) => {
        const { userId, rawHabits, rawCompletions, rawProfile, rawFocus, rawAchievements } = get();
        if (!userId) return;

        const todayStr = format(new Date(), "yyyy-MM-dd");
        
        // Optimistic toggle
        const existingCompIndex = rawCompletions.findIndex(c => c.habit_id === habitId && c.completed_date === todayStr);
        let newCompletedState = true;
        let newCompletions = [...rawCompletions];
        
        if (existingCompIndex >= 0) {
          newCompletedState = !rawCompletions[existingCompIndex].completed;
          newCompletions[existingCompIndex] = { ...rawCompletions[existingCompIndex], completed: newCompletedState };
        } else {
          newCompletions.push({
            id: `temp-${Date.now()}`,
            habit_id: habitId,
            user_id: userId,
            completed_date: todayStr,
            completed: true,
            created_at: new Date().toISOString()
          });
        }

        // Optimistic XP update
        const habit = rawHabits.find(h => h.id === habitId);
        let newProfile = rawProfile ? { ...rawProfile } : null;
        if (newProfile && habit) {
          const xpDelta = newCompletedState ? habit.xp_reward : -habit.xp_reward;
          newProfile.xp += xpDelta;
          
          // Level up logic
          if (newProfile.xp >= newProfile.next_level_xp) {
            newProfile.level += 1;
            newProfile.xp = newProfile.xp - newProfile.next_level_xp;
            newProfile.next_level_xp = Math.floor(newProfile.next_level_xp * 1.5);
          } else if (newProfile.xp < 0 && newProfile.level > 1) {
            newProfile.level -= 1;
            newProfile.next_level_xp = Math.floor(newProfile.next_level_xp / 1.5);
            newProfile.xp = newProfile.next_level_xp + newProfile.xp;
          }
        }

        // Apply optimistic state
        set({
          rawCompletions: newCompletions,
          rawProfile: newProfile,
          ...computeHydratedState(newProfile, rawHabits, newCompletions, rawFocus, rawAchievements)
        });

        // Backend Sync
        try {
          await toggleCompletion(supabase, habitId, userId, todayStr, newCompletedState);
          // XP sync
          if (newProfile) {
             const { updateProfile } = await import("@/lib/supabase/profile");
             await updateProfile(supabase, userId, { 
               xp: newProfile.xp, 
               level: newProfile.level, 
               next_level_xp: newProfile.next_level_xp 
             });
          }
        } catch (error) {
          console.error("Failed to toggle habit", error);
        }
      }
    }),
    {
      name: "habits-os-store",
    }
  )
);
