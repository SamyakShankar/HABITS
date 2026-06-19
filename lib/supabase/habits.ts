import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, DbHabit, HabitCompletion, InsertTables, UpdateTables } from "@/types/database";

type Client = SupabaseClient<Database>;

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

export async function createHabit(supabase: Client, habit: InsertTables<"habits">) {
  const { data, error } = await supabase
    .from("habits")
    .insert(habit)
    .select()
    .single();
  if (error) throw error;
  return data as DbHabit;
}

export async function updateHabit(supabase: Client, habitId: string, updates: UpdateTables<"habits">) {
  const { data, error } = await supabase
    .from("habits")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", habitId)
    .select()
    .single();
  if (error) throw error;
  return data as DbHabit;
}

export async function archiveHabit(supabase: Client, habitId: string) {
  return updateHabit(supabase, habitId, { archived: true });
}

export async function deleteHabit(supabase: Client, habitId: string) {
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId);
  if (error) throw error;
}

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

export async function fetchHabitCompletions(supabase: Client, habitId: string, limit = 30) {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .order("completed_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as HabitCompletion[];
}
