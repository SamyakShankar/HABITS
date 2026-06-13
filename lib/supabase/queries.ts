/**
 * Supabase service layer — reusable query functions.
 *
 * Each function accepts a Supabase client instance so it works
 * identically on the browser (via lib/supabase/client.ts) and
 * the server (via lib/supabase/server.ts).
 *
 * Phase 1: defines the full API surface.
 * Phase 3: these will replace mock-data imports in components.
 */

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
  Note,
  InsertTables,
  UpdateTables
} from "@/types/database";

type Client = SupabaseClient<Database>;

// ─── Auth helpers ────────────────────────────────────────────────

/** Get the currently authenticated user, or null. */
export async function getCurrentUser(supabase: Client) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── Profiles ────────────────────────────────────────────────────

/** Fetch the authenticated user's profile. */
export async function fetchProfile(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as Profile;
}

/** Update partial profile fields. */
export async function updateProfile(
  supabase: Client,
  userId: string,
  updates: UpdateTables<"profiles">
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

// ─── Habits ──────────────────────────────────────────────────────

/** Fetch all non-archived habits for a user, ordered by sort_order. */
export async function fetchHabits(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", false)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbHabit[];
}

/** Create a new habit. */
export async function createHabit(
  supabase: Client,
  habit: InsertTables<"habits">
) {
  const { data, error } = await supabase
    .from("habits")
    .insert(habit)
    .select()
    .single();
  if (error) throw error;
  return data as DbHabit;
}

/** Update a habit. */
export async function updateHabit(
  supabase: Client,
  habitId: string,
  updates: UpdateTables<"habits">
) {
  const { data, error } = await supabase
    .from("habits")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", habitId)
    .select()
    .single();
  if (error) throw error;
  return data as DbHabit;
}

/** Soft-delete a habit by archiving it. */
export async function archiveHabit(supabase: Client, habitId: string) {
  return updateHabit(supabase, habitId, { archived: true });
}

/** Hard-delete a habit and all its completions (via CASCADE). */
export async function deleteHabit(supabase: Client, habitId: string) {
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId);
  if (error) throw error;
}

// ─── Habit Completions ───────────────────────────────────────────

/** Toggle today's completion for a habit. Upserts a row. */
export async function toggleCompletion(
  supabase: Client,
  habitId: string,
  userId: string,
  date: string,
  completed: boolean
) {
  const { data, error } = await supabase
    .from("habit_completions")
    .upsert(
      {
        habit_id: habitId,
        user_id: userId,
        completed_date: date,
        completed
      },
      { onConflict: "habit_id,completed_date" }
    )
    .select()
    .single();
  if (error) throw error;
  return data as HabitCompletion;
}

/** Fetch completions for a user within a date range. */
export async function fetchCompletions(
  supabase: Client,
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", userId)
    .gte("completed_date", startDate)
    .lte("completed_date", endDate)
    .order("completed_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HabitCompletion[];
}

/** Fetch completions for a single habit (for completion history). */
export async function fetchHabitCompletions(
  supabase: Client,
  habitId: string,
  limit = 30
) {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .order("completed_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as HabitCompletion[];
}

// ─── Focus Sessions ──────────────────────────────────────────────

/** Save a completed focus session. */
export async function saveFocusSession(
  supabase: Client,
  session: InsertTables<"focus_sessions">
) {
  const { data, error } = await supabase
    .from("focus_sessions")
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data as FocusSession;
}

/** Fetch recent focus sessions for a user. */
export async function fetchFocusSessions(
  supabase: Client,
  userId: string,
  limit = 10
) {
  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}

// ─── Achievements ────────────────────────────────────────────────

/** Fetch all achievement definitions (global). */
export async function fetchAchievementDefinitions(supabase: Client) {
  const { data, error } = await supabase
    .from("achievement_definitions")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AchievementDefinition[];
}

/** Fetch a user's achievement progress (joined with definitions). */
export async function fetchUserAchievements(
  supabase: Client,
  userId: string
) {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievement_definitions(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as (UserAchievement & {
    achievement_definitions: AchievementDefinition;
  })[];
}

/** Update achievement progress for a user. */
export async function updateAchievementProgress(
  supabase: Client,
  userId: string,
  achievementId: string,
  progress: number,
  unlocked: boolean
) {
  const { data, error } = await supabase
    .from("user_achievements")
    .update({
      progress,
      unlocked,
      unlocked_at: unlocked ? new Date().toISOString() : null
    })
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)
    .select()
    .single();
  if (error) throw error;
  return data as UserAchievement;
}

// ─── User Settings ───────────────────────────────────────────────

/** Fetch the user's settings row. */
export async function fetchSettings(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data as UserSettings;
}

/** Update user settings. */
export async function updateSettings(
  supabase: Client,
  userId: string,
  updates: UpdateTables<"user_settings">
) {
  const { data, error } = await supabase
    .from("user_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as UserSettings;
}

// ─── Mood ────────────────────────────────────────────────────────

/** Save or update today's mood entry. */
export async function saveMoodEntry(
  supabase: Client,
  entry: InsertTables<"mood_entries">
) {
  const { data, error } = await supabase
    .from("mood_entries")
    .upsert(entry, { onConflict: "user_id,entry_date" })
    .select()
    .single();
  if (error) throw error;
  return data as MoodEntry;
}

/** Fetch mood entries for a date range. */
export async function fetchMoodEntries(
  supabase: Client,
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MoodEntry[];
}

// ─── Notes ───────────────────────────────────────────────────────

/** Create a note. */
export async function createNote(
  supabase: Client,
  note: InsertTables<"notes">
) {
  const { data, error } = await supabase
    .from("notes")
    .insert(note)
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

/** Fetch recent notes. */
export async function fetchNotes(
  supabase: Client,
  userId: string,
  limit = 20
) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Note[];
}

/** Delete a note. */
export async function deleteNote(supabase: Client, noteId: string) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);
  if (error) throw error;
}
